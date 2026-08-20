import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Razorpay from "razorpay";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { BillingCycle, Plan, SubscriptionStatus } from "@prisma/client";
import type { Subscriptions } from "razorpay/dist/types/subscriptions";

// --- Request Body & Response Interfaces ---
interface CreateSubscriptionBody {
  action: "create";
  interval: "MONTHLY" | "YEARLY";
  country?: string;
}

interface VerifySubscriptionBody {
  action: "verify";
  interval: "MONTHLY" | "YEARLY";
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

interface CancelSubscriptionBody {
  subscriptionId?: string;
  cancelAtCycleEnd?: boolean;
}

type SubscriptionRequestBody = CreateSubscriptionBody | VerifySubscriptionBody;

interface ApiSuccessResponse<T = Record<string, unknown>> {
  success: true;
  message?: string;
  data?: T;
  subscriptionId?: string;
  key?: string;
  country?: string;
  subscription?: Subscriptions.RazorpaySubscription;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

type ApiResponse<T = Record<string, unknown>> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

// --- Strictly Typed Razorpay Error Structure ---
interface RazorpayErrorPayload {
  description?: string;
  code?: string;
  field?: string;
  source?: string;
  step?: string;
  reason?: string;
}

interface RazorpaySdkException {
  error?: RazorpayErrorPayload;
  message?: string;
  code?: string;
  statusCode?: number;
}

// Interface ensuring cancel method signature compatibility
interface RazorpaySubscriptionMethods {
  cancel: (
    subscriptionId: string,
    cancelAtCycleEnd?: boolean | number
  ) => Promise<Subscriptions.RazorpaySubscription>;
  fetch: (subscriptionId: string) => Promise<Subscriptions.RazorpaySubscription>;
  create: (
    params: Subscriptions.RazorpaySubscriptionCreateRequestBody
  ) => Promise<Subscriptions.RazorpaySubscription>;
}

// --- Helper: Format Razorpay Error Without `any` ---
function extractRazorpayError(err: unknown): { message: string; code?: string; details?: unknown } {
  if (err && typeof err === "object") {
    const errorObj = err as RazorpaySdkException;
    const rzpError = errorObj.error;

    if (rzpError && typeof rzpError === "object") {
      return {
        message: rzpError.description || errorObj.message || "Razorpay API error",
        code: rzpError.code || (errorObj.statusCode ? String(errorObj.statusCode) : undefined),
        details: rzpError,
      };
    }

    if (errorObj.message) {
      return { message: errorObj.message, code: errorObj.code, details: err };
    }
  }

  return { message: err instanceof Error ? err.message : "Internal Server Error" };
}

// --- Helper: Singleton-safe SDK Initialization ---
function getRazorpayInstance(): {
  razorpay: Razorpay;
  subscriptions: RazorpaySubscriptionMethods;
  keyId: string;
} {
  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_SECRET_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_SECRET_KEY_ID;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials missing. Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are defined in your environment."
    );
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return {
    razorpay,
    subscriptions: razorpay.subscriptions as unknown as RazorpaySubscriptionMethods,
    keyId,
  };
}

// --- Multi-Country Plan ID Getter ---
function getPlanId(interval: "MONTHLY" | "YEARLY", country: string): string {
  const isIndia = country.trim().toUpperCase() === "IN";

  if (isIndia) {
    const planId =
      interval === "YEARLY"
        ? process.env.RAZORPAY_PLAN_ID_IN_YEARLY || process.env.RAZORPAY_PLAN_ID_YEARLY
        : process.env.RAZORPAY_PLAN_ID_IN_MONTHLY || process.env.RAZORPAY_PLAN_ID_MONTHLY;

    if (!planId) {
      throw new Error(
        `Razorpay Indian Plan ID missing in .env for interval: ${interval} (expected RAZORPAY_PLAN_ID_IN_${interval})`
      );
    }
    return planId;
  }

  const planId =
    interval === "YEARLY"
      ? process.env.RAZORPAY_PLAN_ID_GLOBAL_YEARLY
      : process.env.RAZORPAY_PLAN_ID_GLOBAL_MONTHLY;

  if (!planId) {
    throw new Error(
      `Razorpay Global Plan ID missing in .env for interval: ${interval} (expected RAZORPAY_PLAN_ID_GLOBAL_${interval})`
    );
  }

  return planId;
}

/**
 * POST Handler
 * Subscription Creation & Signature Verification
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email ?? "";
    const body = (await req.json()) as SubscriptionRequestBody;
    const { subscriptions, keyId } = getRazorpayInstance();

    // --- ACTION 1: CREATE SUBSCRIPTION ---
    if (body.action === "create") {
      const intervalValue = "interval" in body ? body.interval : undefined;

      if (!intervalValue || !["MONTHLY", "YEARLY"].includes(intervalValue)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid interval provided: '${String(intervalValue)}'. Must be 'MONTHLY' or 'YEARLY'.`,
          },
          { status: 400 }
        );
      }

      const detectedCountry =
        body.country ||
        requestHeaders.get("x-vercel-ip-country") ||
        requestHeaders.get("cf-ipcountry") ||
        requestHeaders.get("cloudfront-viewer-country") ||
        "IN";

      const country = detectedCountry.trim().toUpperCase();
      const planId = getPlanId(body.interval, country);

      try {
        const subscription = await subscriptions.create({
          plan_id: planId,
          customer_notify: 1,
          total_count: body.interval === "YEARLY" ? 5 : 12,
          notes: {
            userId,
            userEmail,
            interval: body.interval,
            country,
          },
        });

        return NextResponse.json({
          success: true,
          subscriptionId: subscription.id,
          country,
          key: keyId,
        });
      } catch (sdkError: unknown) {
        const parsed = extractRazorpayError(sdkError);
        console.error("[RAZORPAY_SUBSCRIPTION_CREATE_ERROR]:", {
          userId,
          country,
          interval: body.interval,
          planId,
          ...parsed,
        });

        return NextResponse.json(
          {
            success: false,
            message: parsed.message || "Failed to create subscription with Razorpay.",
            code: parsed.code,
          },
          { status: 502 }
        );
      }
    }

    // --- ACTION 2: VERIFY SUBSCRIPTION ---
    if (body.action === "verify") {
      const {
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
        interval = "MONTHLY",
      } = body;

      if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
        return NextResponse.json(
          {
            success: false,
            message: "Missing payment verification parameters (payment_id, subscription_id, or signature).",
          },
          { status: 400 }
        );
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        throw new Error("RAZORPAY_KEY_SECRET is not configured on server.");
      }

      const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(payload)
        .digest("hex");

      const isSignatureValid =
        expectedSignature.length === razorpay_signature.length &&
        crypto.timingSafeEqual(
          Buffer.from(expectedSignature),
          Buffer.from(razorpay_signature)
        );

      if (!isSignatureValid) {
        console.error("[RAZORPAY_SIGNATURE_MISMATCH]:", {
          userId,
          paymentId: razorpay_payment_id,
          subscriptionId: razorpay_subscription_id,
        });

        return NextResponse.json(
          { success: false, message: "Invalid payment signature verification failed." },
          { status: 400 }
        );
      }

      const rzpSub = await subscriptions.fetch(razorpay_subscription_id);

      const periodEnd = rzpSub.current_end
        ? new Date(rzpSub.current_end * 1000)
        : new Date(Date.now() + (interval === "YEARLY" ? 365 : 30) * 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: Plan.PRO,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          billingCycle: interval === "YEARLY" ? BillingCycle.YEARLY : BillingCycle.MONTHLY,
          razorpaySubscriptionId: razorpay_subscription_id,
          razorpayCustomerId: rzpSub.customer_id ? String(rzpSub.customer_id) : null,
          subscriptionPeriodEnd: periodEnd,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully. Account upgraded to PRO.",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action specified." },
      { status: 400 }
    );
  } catch (err: unknown) {
    const parsed = extractRazorpayError(err);
    console.error("[SUBSCRIPTION_ROUTE_POST_FATAL]:", parsed);

    return NextResponse.json(
      { success: false, message: parsed.message },
      { status: 500 }
    );
  }
}

/**
 * GET Handler
 * Fetches status details of the authenticated user's active subscription.
 */
export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const subscriptionId = searchParams.get("subscriptionId");

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: "subscriptionId query parameter is required." },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { razorpaySubscriptionId: true },
    });

    if (dbUser?.razorpaySubscriptionId !== subscriptionId) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Access to subscription denied." },
        { status: 403 }
      );
    }

    const { subscriptions } = getRazorpayInstance();
    const subscription = await subscriptions.fetch(subscriptionId);

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (err: unknown) {
    const parsed = extractRazorpayError(err);
    console.error("[SUBSCRIPTION_ROUTE_GET_ERROR]:", parsed);

    return NextResponse.json(
      { success: false, message: parsed.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE Handler
 * Cancels recurring renewal or terminates subscription.
 */
export async function DELETE(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let subscriptionId = searchParams.get("subscriptionId");
    let cancelAtCycleEnd = searchParams.get("cancelAtCycleEnd") !== "false";

    if (!subscriptionId) {
      try {
        const body = (await req.json()) as CancelSubscriptionBody;
        if (body.subscriptionId) subscriptionId = body.subscriptionId;
        if (typeof body.cancelAtCycleEnd === "boolean") {
          cancelAtCycleEnd = body.cancelAtCycleEnd;
        }
      } catch {
        // Fall back to database lookup
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        subscriptionPeriodEnd: true,
        razorpaySubscriptionId: true,
        plan: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    const targetSubId = subscriptionId || user.razorpaySubscriptionId;

    if (!targetSubId) {
      return NextResponse.json(
        { success: false, message: "No active subscription reference found for this account." },
        { status: 400 }
      );
    }

    if (user.razorpaySubscriptionId && user.razorpaySubscriptionId !== targetSubId) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Access to subscription denied." },
        { status: 403 }
      );
    }

    const { subscriptions } = getRazorpayInstance();

    let cancelledSubscription: Subscriptions.RazorpaySubscription;
    try {
      cancelledSubscription = await subscriptions.cancel(
        targetSubId,
        cancelAtCycleEnd ? 1 : 0
      );
    } catch {
      cancelledSubscription = await subscriptions.cancel(
        targetSubId,
        cancelAtCycleEnd
      );
    }

    const finalPeriodEnd = cancelledSubscription.current_end
      ? new Date(cancelledSubscription.current_end * 1000)
      : user.subscriptionPeriodEnd || new Date();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionStatus: SubscriptionStatus.CANCELLED,
        subscriptionPeriodEnd: cancelAtCycleEnd ? finalPeriodEnd : null,
        ...(cancelAtCycleEnd ? {} : { plan: Plan.FREE, billingCycle: null, razorpaySubscriptionId: null }),
      },
    });

    return NextResponse.json({
      success: true,
      message: cancelAtCycleEnd
        ? "Auto-renewal cancelled. You will retain PRO access until the current billing cycle expires."
        : "Subscription cancelled immediately and account reverted to Free tier.",
      subscription: cancelledSubscription,
    });
  } catch (err: unknown) {
    const parsed = extractRazorpayError(err);
    console.error("[SUBSCRIPTION_ROUTE_DELETE_ERROR]:", parsed);

    return NextResponse.json(
      { success: false, message: parsed.message, code: parsed.code },
      { status: 500 }
    );
  }
}