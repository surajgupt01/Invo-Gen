import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // Adjust to your Better Auth instance path
import { prisma } from "@/prisma/prisma";
import { Plan } from "@prisma/client";

// Type definitions for Payout Profile payload
interface PayoutProfileInput {
  companyLogoUrl?: string | null;
  upiQrImageUrl?: string | null;
  ownerName?: string | null;
  phoneNumber?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  bankAddress?: string | null;
  bankCode?: string | null;
  upiId?: string | null;
  upiName?: string | null;
}

// Type definitions for Update Settings request payload
interface UpdateSettingsPayload {
  companyName?: string | null;
  taxDetails?: string | null;
  additionalInfo?: string | null;
  termsAndConditions?: string | null;
  payoutProfile?: PayoutProfileInput;
  companyMail?: string | null;
  companyAddress?: string | null;
}

/**
 * GET /api/settings
 * Fetches user profile, plan telemetry, download limits, organization defaults, and payout profile.
 */
export async function GET(req: NextRequest) {
  try {
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

    // Fetch user details including downloads and relations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        payoutProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User profile not found." },
        { status: 404 }
      );
    }

    // Auto-reset monthly download quota on the 1st of a new month for FREE users
    const now = new Date();
    const lastUpdate = new Date(user.updatedAt);
    const isNewMonth =
      now.getMonth() !== lastUpdate.getMonth() ||
      now.getFullYear() !== lastUpdate.getFullYear();

    let currentDownloads = user.downloads ?? 0;

    if (isNewMonth && user.plan === Plan.FREE && currentDownloads > 0) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { downloads: 0 },
      });
      currentDownloads = updatedUser.downloads;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: user.companyName ?? "",
        taxDetails: user.taxDetails ?? "",
        additionalInfo: user.additionalInfo ?? "",
        termsAndConditions: user.termsAndConditions ?? "",
        plan: user.plan,
        billingCycle: user.billingCycle,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPeriodEnd: user.subscriptionPeriodEnd,
        razorpaySubscriptionId: user.razorpaySubscriptionId ?? null, // <-- ADDED
        companyMail: user.companyMail,
        companyAddress: user.companyAddress,
        downloads: currentDownloads,
      },
      payoutProfile: user.payoutProfile,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    console.error("[SETTINGS_GET_ERROR]:", errorMessage);

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings
 * Updates organization metadata, text prefill defaults, and upserts payout profile details.
 */
export async function PUT(req: NextRequest) {
  try {
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
    const body = (await req.json()) as UpdateSettingsPayload;
    const {
      companyName,
      taxDetails,
      additionalInfo,
      termsAndConditions,
      payoutProfile,
      companyMail,
      companyAddress,
    } = body;

    // 1. Update User Organization Metadata & Prefill Text Defaults
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        companyName: companyName?.trim() || null,
        taxDetails: taxDetails?.trim() || null,
        additionalInfo: additionalInfo?.trim() || null,
        termsAndConditions: termsAndConditions?.trim() || null,
        companyMail: companyMail?.trim() || null,
        companyAddress: companyAddress?.trim() || null,
      },
    });

    // 2. Upsert Payout Profile
    let savedPayoutProfile = null;
    if (payoutProfile) {
      savedPayoutProfile = await prisma.payoutProfile.upsert({
        where: { userId: userId },
        update: {
          companyLogoUrl: payoutProfile.companyLogoUrl || null,
          upiQrImageUrl: payoutProfile.upiQrImageUrl || null,
          ownerName: payoutProfile.ownerName || null,
          phoneNumber: payoutProfile.phoneNumber || null,
          bankName: payoutProfile.bankName || null,
          accountNumber: payoutProfile.accountNumber || null,
          bankAddress: payoutProfile.bankAddress || null,
          bankCode: payoutProfile.bankCode || null,
          upiId: payoutProfile.upiId || null,
          ...(payoutProfile.upiName !== undefined && {
            upiName: payoutProfile.upiName || null,
          }),
        },
        create: {
          userId: userId,
          companyLogoUrl: payoutProfile.companyLogoUrl || null,
          upiQrImageUrl: payoutProfile.upiQrImageUrl || null,
          ownerName: payoutProfile.ownerName || null,
          phoneNumber: payoutProfile.phoneNumber || null,
          bankName: payoutProfile.bankName || null,
          accountNumber: payoutProfile.accountNumber || null,
          bankAddress: payoutProfile.bankAddress || null,
          bankCode: payoutProfile.bankCode || null,
          upiId: payoutProfile.upiId || null,
          ...(payoutProfile.upiName !== undefined && {
            upiName: payoutProfile.upiName || null,
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        companyName: updatedUser.companyName ?? "",
        taxDetails: updatedUser.taxDetails ?? "",
        additionalInfo: updatedUser.additionalInfo ?? "",
        termsAndConditions: updatedUser.termsAndConditions ?? "",
        plan: updatedUser.plan,
        billingCycle: updatedUser.billingCycle,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionPeriodEnd: updatedUser.subscriptionPeriodEnd,
        razorpaySubscriptionId: updatedUser.razorpaySubscriptionId ?? null, // <-- ADDED
        companyMail: updatedUser.companyMail,
        companyAddress: updatedUser.companyAddress,
        downloads: updatedUser.downloads ?? 0,
      },
      payoutProfile: savedPayoutProfile,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    console.error("[SETTINGS_PUT_ERROR]:", errorMessage);

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}