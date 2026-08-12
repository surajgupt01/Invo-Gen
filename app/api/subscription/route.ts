import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Razorpay from "razorpay";
import crypto from "crypto";
import { auth } from "@/lib/auth"; // Adjust to your Better Auth instance path
import { prisma } from "@/prisma/prisma"; // Ensure Prisma Client is imported

// --- Request Body & Response Interfaces ---
interface CreateSubscriptionBody {
  action: "create";
  interval: "monthly" | "yearly";
}

interface VerifySubscriptionBody {
  action: "verify";
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

type SubscriptionRequestBody = CreateSubscriptionBody | VerifySubscriptionBody;

interface ApiSuccessResponse<T = Record<string, unknown>> {
  success: true;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

type ApiResponse<T = Record<string, unknown>> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

// --- Helper: Lazy Initialization for Razorpay SDK ---
function getRazorpayInstance(): Razorpay {
  const keyId =
    process.env.NEXT_PUBLIC_RAZORPAY_SECRET_KEY_ID 
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials missing. Ensure NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in .env.local"
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// --- Plan IDs Getter ---
function getPlanId(interval: "monthly" | "yearly"): string {
  const planId =
    interval === "yearly"
      ? process.env.RAZORPAY_PLAN_ID_YEARLY
      : process.env.RAZORPAY_PLAN_ID_MONTHLY;

  if (!planId) {
    throw new Error(`Missing Razorpay Plan ID for interval: ${interval}`);
  }

  return planId;
}

/**
 * POST Handler
 * Handles Subscription Creation & HMAC SHA256 Signature Verification
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. Validate Better Auth Session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const body: SubscriptionRequestBody = await req.json();
    const razorpay = getRazorpayInstance();

    // --- ACTION 1: CREATE SUBSCRIPTION ---
    if (body.action === "create") {
      const planId = getPlanId(body.interval);

      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: body.interval === "yearly" ? 5 : 12,
        notes: {
          userId,
          userEmail,
        },
      });

      const key =
        process.env.NEXT_PUBLIC_RAZORPAY_SECRET_KEY_ID 

      if (!key) {
        throw new Error("Razorpay Key ID is not configured on the server.");
      }

      return NextResponse.json({
        success: true,
        subscriptionId: subscription.id,
        key,
      });
    }

    // --- ACTION 2: VERIFY SUBSCRIPTION ---
    if (body.action === "verify") {
      const {
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
      } = body;

      if (
        !razorpay_payment_id ||
        !razorpay_subscription_id ||
        !razorpay_signature
      ) {
        return NextResponse.json(
          { success: false, message: "Missing required payment parameters." },
          { status: 400 }
        );
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        throw new Error("RAZORPAY_KEY_SECRET is not configured.");
      }

      const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(payload)
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        // --- PERSIST PRO SUBSCRIPTION TO PRISMA DB ---
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "PRO",
            subscriptionStatus: "ACTIVE",
            razorpaySubscriptionId: razorpay_subscription_id,
            subscriptionPeriodEnd: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ), // Sets period end 30 days from now
          },
        });

        return NextResponse.json({
          success: true,
          message: "Payment verified successfully. Account upgraded to PRO.",
        });
      }

      return NextResponse.json(
        { success: false, message: "Invalid payment signature." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid action specified." },
      { status: 400 }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal Server Error";
    console.error("Razorpay POST Error:", errorMessage);

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET Handler
 * Fetches status details of an existing subscription.
 */
export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const subscriptionId = searchParams.get("subscriptionId");

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: "subscriptionId parameter is required." },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayInstance();
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch subscription.";
    console.error("Razorpay GET Error:", errorMessage);

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE Handler
 * Cancels an active subscription immediately or at cycle end.
 */
export async function DELETE(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const subscriptionId = searchParams.get("subscriptionId");
    const cancelAtCycleEnd = searchParams.get("cancelAtCycleEnd") === "true";

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: "subscriptionId parameter is required." },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayInstance();
    const cancelledSubscription = await razorpay.subscriptions.cancel(
      subscriptionId,
      cancelAtCycleEnd
    );

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully.",
      subscription: cancelledSubscription,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to cancel subscription.";
    console.error("Razorpay DELETE Error:", errorMessage);

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}