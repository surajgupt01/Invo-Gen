"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import type { RazorpayOptions, RazorpaySuccessResponse } from "@/types/next-auth";
import {
  Zap,
  Check,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";

// --- Types ---
interface SubscriptionApiResponse {
  success: boolean;
  message?: string;
  subscriptionId?: string;
  key?: string;
  country?: string;
}

interface PurchasedDetails {
  paymentId: string;
  subscriptionId?: string;
}

interface DashboardPricingProps {
  userId?: string;
  userEmail?: string;
  currentPlan?: "free" | "pro";
  activeInterval?: "monthly" | "yearly" | null;
  invoicesUsed?: number;
}

// Pricing Matrix
const PRICING = {
  IN: {
    symbol: "₹",
    currency: "INR",
    monthly: 399,
    yearly: 2999,
    monthlyText: "₹399",
    yearlyText: "₹2,999",
    yearlyPerMonth: "₹250",
    paymentNote: "UPI Autopay, Netbanking & Domestic Indian Cards accepted.",
    badge: "INDIA (INR)",
  },
  GLOBAL: {
    symbol: "$",
    currency: "USD",
    monthly: 12,
    yearly: 99,
    monthlyText: "$12",
    yearlyText: "$99",
    yearlyPerMonth: "$8.25",
    paymentNote: "International Visa, Mastercard & Amex accepted globally.",
    badge: "GLOBAL (USD)",
  },
};

export default function DashboardPricing({
  userId: initialUserId = "",
  userEmail: initialUserEmail = "",
  currentPlan: initialCurrentPlan = "free",
  activeInterval: initialActiveInterval = null,
  invoicesUsed: initialDownloadsUsed = 0,
}: DashboardPricingProps) {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">(
    initialActiveInterval === "yearly" ? "yearly" : "monthly"
  );
  
  // Country is locked based on auto-detection (no manual switcher)
  const [country, setCountry] = useState<"IN" | "GLOBAL">("IN");
  const [loading, setLoading] = useState<boolean>(false);
  const [sdkReady, setSdkReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // User State Hydration
  const [, setUserId] = useState<string>(initialUserId);
  const [userEmail, setUserEmail] = useState<string>(initialUserEmail);
  const [planStatus, setPlanStatus] = useState<"FREE" | "PRO">(
    initialCurrentPlan?.toLowerCase() === "pro" ? "PRO" : "FREE"
  );
  const [activeCycle, setActiveCycle] = useState<"monthly" | "yearly" | null>(
    initialActiveInterval
  );
  const [downloadsUsed, setDownloadsUsed] = useState<number>(initialDownloadsUsed);

  const MONTHLY_LIMIT = 5;

  // Modal State
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [purchasedDetails, setPurchasedDetails] = useState<PurchasedDetails | null>(null);

  useEffect(() => {
    // 1. Auto-detect country based on browser timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isIndianSubcontinent =
        tz.includes("Calcutta") || tz.includes("Kolkata") || tz.includes("Asia/Colombo");
      setCountry(isIndianSubcontinent ? "IN" : "GLOBAL");
    } catch {
      setCountry("IN");
    }

    // 2. Fetch latest user settings
    async function fetchLatestUserSettings() {
      try {
        const res = await fetch("/api/settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const dbUser = data?.user || data || {};

          if (dbUser.id) setUserId(dbUser.id);
          if (dbUser.email) setUserEmail(dbUser.email);
          if (dbUser.plan) setPlanStatus(dbUser.plan.toUpperCase());
          if (typeof dbUser.downloads === "number") setDownloadsUsed(dbUser.downloads);

          const cycle =
            dbUser.billingCycle?.toLowerCase() ||
            (dbUser.plan?.toUpperCase() === "PRO" ? "monthly" : null);
          setActiveCycle(cycle);
          if (cycle === "yearly" || cycle === "monthly") {
            setBillingInterval(cycle);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user billing settings:", err);
      }
    }

    fetchLatestUserSettings();
  }, []);

  const isPro = planStatus === "PRO";
  const isSelectedPlanActive = isPro && activeCycle === billingInterval;
  const isHighestTierActive = isPro && activeCycle === "yearly";
  const canUpgradeToYearly = isPro && activeCycle === "monthly" && billingInterval === "yearly";

  const currentPricing = PRICING[country];
  const quotaPercentage = isPro ? 100 : Math.min((downloadsUsed / MONTHLY_LIMIT) * 100, 100);
  const isQuotaExhausted = !isPro && downloadsUsed >= MONTHLY_LIMIT;

  const handleSubscribe = async () => {
    if (isSelectedPlanActive || (isHighestTierActive && billingInterval === "yearly")) return;

    setLoading(true);
    setError(null);

    try {
      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please refresh and check your connection.");
      }

      const targetInterval = billingInterval.toUpperCase() as "MONTHLY" | "YEARLY";

      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          interval: targetInterval,
          country,
        }),
      });

      const data: SubscriptionApiResponse = await res.json();

      if (!res.ok || !data.success || !data.subscriptionId || !data.key) {
        throw new Error(data.message || "Failed to initialize checkout session.");
      }

      const options: RazorpayOptions = {
        key: data.key,
        subscription_id: data.subscriptionId,
        name: "Luen",
        description: `Pro Plan (${billingInterval === "yearly" ? "Yearly" : "Monthly"}) - ${currentPricing.currency}`,
        prefill: { email: userEmail },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            const subscriptionId = response.razorpay_subscription_id || data.subscriptionId;

            const verifyRes = await fetch("/api/subscription", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "verify",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: subscriptionId,
                razorpay_signature: response.razorpay_signature,
                interval: targetInterval,
              }),
            });

            const result: SubscriptionApiResponse = await verifyRes.json();
            if (result.success) {
              setPlanStatus("PRO");
              setActiveCycle(billingInterval);
              setPurchasedDetails({
                paymentId: response.razorpay_payment_id,
                subscriptionId: subscriptionId,
              });
              setShowSuccessModal(true);
            } else {
              setError(result.message || "Payment verification failed.");
            }
          } catch (err: unknown) {
            const errorMessage =
              err instanceof Error ? err.message : "Verification request failed.";
            setError(errorMessage);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: "#09090b" },
      };

      const RazorpayConstructor = window.Razorpay;
      const paymentObject = new RazorpayConstructor(options);
      paymentObject.open();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "Initializing...";
    if (isHighestTierActive) return "Current Plan: Yearly Pro";
    if (isSelectedPlanActive) return `Current Plan: ${billingInterval.toUpperCase()} PRO`;
    if (canUpgradeToYearly) return "Upgrade to Yearly Pro (-30%)";
    return `Upgrade to Pro (${billingInterval.toUpperCase()})`;
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />

      {/* SUCCESS CONFIRMATION MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950">
                  Plan Confirmed
                </h2>
                <p className="text-[10px] text-zinc-400 font-mono">Invoice #{purchasedDetails?.paymentId?.slice(-6)}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Your Pro subscription is now active. Watermarks have been removed and your unlimited export quota is live.
            </p>

            <div className="bg-zinc-50 border border-zinc-200/80 p-3 rounded-lg space-y-1.5 text-[11px] font-mono text-zinc-600">
              <div className="flex justify-between">
                <span className="text-zinc-400">Payment ID:</span>
                <span className="font-medium text-zinc-950 truncate max-w-[170px]">{purchasedDetails?.paymentId}</span>
              </div>
              {purchasedDetails?.subscriptionId && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subscription:</span>
                  <span className="font-medium text-zinc-950 truncate max-w-[170px]">{purchasedDetails.subscriptionId}</span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-zinc-200/60">
                <span className="text-zinc-400">Tax Invoice:</span>
                <span className="text-teal-700 font-medium truncate max-w-[170px]">
                  {userEmail || "Sent to your email"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}

      <main className="w-full   max-w-5xl mx-auto p-4 sm:p-6 font-sans select-none space-y-6">
        {/* Header Telemetry */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-4 gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-medium">
              Subscription & Entitlements
            </p>
            <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-zinc-950">
              Billing & Plans
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="text-[11px] font-mono text-zinc-600 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-md shadow-2xs">
              TIER:{" "}
              <span className="font-semibold text-zinc-950">
                {isPro ? `PRO (${(activeCycle || "ACTIVE").toUpperCase()})` : "FREE"}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-14  gap-5 items-start">
          {/* PRO TIER CARD */}
          <div
            className={`bg-white border rounded-xl p-5 sm:p-6 space-y-5 shadow-xs md:col-span-7 ${
              isPro
                ? "border-zinc-950 ring-1 ring-zinc-950/10"
                : "border-zinc-200"
            }`}
          >
            {/* Header & Interval Switcher */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-1.5 text-zinc-950">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                  {isPro ? "Your Active Plan" : "Pro Tier"}
                </span>
              </div>

              {/* Monthly / Yearly Switcher */}
              <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/80">
                <button
                  type="button"
                  onClick={() => setBillingInterval("monthly")}
                  className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-md transition-all cursor-pointer ${
                    billingInterval === "monthly"
                      ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  MONTHLY
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval("yearly")}
                  className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    billingInterval === "yearly"
                      ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <span>YEARLY</span>
                  <span className="text-[9px] text-teal-700 bg-teal-50 border border-teal-200 px-1 rounded-sm font-sans">
                    -30%
                  </span>
                </button>
              </div>
            </div>

            {/* Dynamic Market Pricing Info */}
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-3xl font-semibold tracking-tight text-zinc-950">
                    {billingInterval === "monthly" ? currentPricing.monthlyText : currentPricing.yearlyText}
                  </span>
                  <span className="text-xs text-zinc-400 font-normal">
                    {billingInterval === "yearly" ? "/year" : "/month"}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {billingInterval === "yearly"
                    ? `Billed annually at ${currentPricing.yearlyText}/yr (~${currentPricing.yearlyPerMonth}/mo).`
                    : `Billed monthly in ${currentPricing.currency}. Cancel anytime.`}
                </p>
              </div>

              <div className="text-right space-y-1">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase border font-medium inline-block ${
                    isSelectedPlanActive
                      ? "text-teal-800 bg-teal-50 border-teal-200"
                      : "text-zinc-700 bg-zinc-50 border-zinc-200"
                  }`}
                >
                  {isSelectedPlanActive ? "ACTIVE" : "RECOMMENDED"}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  {currentPricing.badge}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Pro Specs */}
            <div className="space-y-2.5 pt-3 border-t border-zinc-100">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Included in Pro:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
                {[
                  "Unlimited PDF exports",
                  "Remove PDF watermark",
                  "Custom logo & signatures",
                  "Advanced GST calculation engine",
                  "Access to all layout templates",
                  country === "IN" ? "UPI QR & Indian bank rails" : "Multi-currency wire layouts",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Action Button */}
            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <button
                type="button"
                disabled={
                  loading ||
                  !sdkReady ||
                  isHighestTierActive ||
                  isSelectedPlanActive
                }
                onClick={handleSubscribe}
                className="w-full py-2.5 px-4 text-xs font-medium text-white bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{getButtonText()}</span>
                {!loading && !isSelectedPlanActive && !isHighestTierActive && (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>

              <p className="text-[11px] text-zinc-400 text-center leading-tight">
                {currentPricing.paymentNote}
              </p>
            </div>
          </div>

          {/* FREE STARTER CARD */}
          <div
            className={`bg-white border rounded-xl p-5 sm:p-6 space-y-5 shadow-xs md:col-span-5 ${
              !isPro ? "border-zinc-300 ring-1 ring-zinc-200" : "border-zinc-200"
            }`}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <span className="text-xs font-mono font-medium text-zinc-950 uppercase tracking-wider">
                {!isPro ? "Current Tier" : "Starter Tier"}
              </span>
              <span
                className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border ${
                  !isPro
                    ? "text-zinc-800 bg-zinc-100 border-zinc-200"
                    : "text-zinc-400 bg-zinc-50 border-zinc-200/60"
                }`}
              >
                {!isPro ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <div>
              <div className="text-lg font-semibold text-zinc-950 tracking-tight">
                Free Starter
              </div>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Standard generator restricted to 5 downloads per monthly cycle.
              </p>
            </div>

            {/* Download Quota Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 uppercase text-[10px]">Monthly Quota</span>
                <span
                  className={`font-semibold text-xs ${
                    isPro
                      ? "text-teal-700"
                      : isQuotaExhausted
                      ? "text-rose-600"
                      : "text-zinc-900"
                  }`}
                >
                  {isPro ? "UNLIMITED" : `${downloadsUsed} / ${MONTHLY_LIMIT} DOWNLOADS`}
                </span>
              </div>

              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                <div
                  className={`h-full transition-all duration-500 ${
                    isPro
                      ? "bg-teal-600"
                      : downloadsUsed >= 5
                      ? "bg-rose-500"
                      : downloadsUsed >= 4
                      ? "bg-amber-500"
                      : "bg-zinc-900"
                  }`}
                  style={{ width: `${quotaPercentage}%` }}
                />
              </div>

              {!isPro && (
                <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono pt-0.5">
                  <span>
                    {MONTHLY_LIMIT - downloadsUsed > 0
                      ? `${MONTHLY_LIMIT - downloadsUsed} left this month`
                      : "Quota exhausted"}
                  </span>
                  <span>Resets 1st of month</span>
                </div>
              )}
            </div>

            {/* Free Features List */}
            <div className="space-y-2.5 pt-3 border-t border-zinc-100">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Free Plan Limits:
              </span>
              <ul className="space-y-2 text-xs text-zinc-600">
                {[
                  "Standard invoice generator",
                  "5 PDF downloads per month",
                  "Multi-currency support (USD, EUR, INR)",
                  "Includes platform watermark",
                  "Standard templates only",
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-zinc-100 text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>Usage resets on the 1st of every month</span>
            </div>
          </div>
        </div>

        {/* Footer Policy Bar */}
        <div className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] text-zinc-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-1 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>Subscriptions renew automatically. Cancel anytime via account settings.</span>
          </div>
          <span className="text-zinc-700 font-semibold uppercase text-[10px]">Non-refundable</span>
        </div>
      </main>
    </>
  );
}