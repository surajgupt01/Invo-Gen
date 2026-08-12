import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // Adjust to your Better Auth instance path
import { prisma } from "@/prisma/prisma";

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
}

/**
 * GET /api/settings
 * Fetches user profile, plan telemetry, organization defaults, and payout profile directly from DB.
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

    // Fetch user details including additionalInfo and termsAndConditions directly from `user` table
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
 * Updates organization metadata, text prefill defaults (additionalInfo, termsAndConditions), and upserts payout profile details.
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
    const { companyName, taxDetails, additionalInfo, termsAndConditions, payoutProfile } = body;

    // 1. Update User Organization Metadata & Prefill Text Defaults in `user` table
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        companyName: companyName?.trim() || null,
        taxDetails: taxDetails?.trim() || null,
        additionalInfo: additionalInfo?.trim() || null,
        termsAndConditions: termsAndConditions?.trim() || null,
      },
    });

    // 2. Upsert Payout Profile (Bank Transfer / UPI / UPI Name / QR / Logo)
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
          ...(payoutProfile.upiName !== undefined && { upiName: payoutProfile.upiName || null }),
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
          ...(payoutProfile.upiName !== undefined && { upiName: payoutProfile.upiName || null }),
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