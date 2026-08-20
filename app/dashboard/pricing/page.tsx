"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import type { RazorpayOptions, RazorpaySuccessResponse } from "@/types/next-auth";

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
    yearlyPerMonth: "₹416",
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

// --- Icons ---
function CheckIcon({ className = "w-2.5 h-2.5" }: { className?: string }) {
  return (
    <svg
      className={`${className} inline-block shrink-0`}
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function ZapIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

export default function DashboardPricing({
  userId: initialUserId = "",
  userEmail: initialUserEmail = "",
  currentPlan: initialCurrentPlan = "free",
  activeInterval: initialActiveInterval = null,
  invoicesUsed: initialDownloadsUsed = 0,
}: DashboardPricingProps) {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [country, setCountry] = useState<"IN" | "GLOBAL">("IN");
  const [loading, setLoading] = useState<boolean>(false);
  const [sdkReady, setSdkReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // User State Hydration from Database
  const [, setUserId] = useState<string>(initialUserId);
  const [userEmail, setUserEmail] = useState<string>(initialUserEmail);
  const [planStatus, setPlanStatus] = useState<"FREE" | "PRO">(
    initialCurrentPlan === "pro" ? "PRO" : "FREE"
  );
  const [activeCycle, setActiveCycle] = useState<"monthly" | "yearly" | null>(
    initialActiveInterval
  );
  const [downloadsUsed, setDownloadsUsed] = useState<number>(initialDownloadsUsed);

  const MONTHLY_LIMIT = 5;

  // Modal State
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [purchasedDetails, setPurchasedDetails] = useState<PurchasedDetails | null>(null);

  // Fetch user settings and auto-detect region
  useEffect(() => {
    async function fetchLatestUserSettings() {
      try {
        const res = await fetch("/api/settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const dbUser = data?.user || data || {};

          if (dbUser.id) setUserId(dbUser.id);
          if (dbUser.email) setUserEmail(dbUser.email);
          if (dbUser.plan) setPlanStatus(dbUser.plan);
          if (typeof dbUser.downloads === "number") setDownloadsUsed(dbUser.downloads);

          const cycle =
            dbUser.billingCycle?.toLowerCase() ||
            (dbUser.plan === "PRO" ? "monthly" : null);
          setActiveCycle(cycle);
        }
      } catch (err) {
        console.error("Failed to fetch user billing settings:", err);
      }
    }

    // Detect browser timezone / locale as initial client hint
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!tz.includes("Calcutta") && !tz.includes("Kolkata") && !tz.includes("Asia/Colombo")) {
        setCountry("GLOBAL");
      }
    } catch {
      // Default to IN
    }

    fetchLatestUserSettings();
  }, []);

  // Flags & Progress Computations
  const isPro = planStatus === "PRO";
  const isSelectedPlanActive = isPro && activeCycle === billingInterval;
  const isHighestTierActive = isPro && activeCycle === "yearly";
  const canUpgradeToYearly = isPro && activeCycle === "monthly" && billingInterval === "yearly";

  const currentPricing = PRICING[country];
  const quotaPercentage = isPro ? 100 : Math.min((downloadsUsed / MONTHLY_LIMIT) * 100, 100);
  const isQuotaExhausted = !isPro && downloadsUsed >= MONTHLY_LIMIT;

  const getProgressBarColor = () => {
    if (isPro) return "bg-teal-600";
    if (downloadsUsed >= 5) return "bg-red-500";
    if (downloadsUsed >= 4) return "bg-amber-500";
    return "bg-teal-600";
  };

  const handleSubscribe = async () => {
    if (isSelectedPlanActive || isHighestTierActive) return;

    setLoading(true);
    setError(null);

    try {
      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please refresh and check your connection.");
      }

      const targetInterval = billingInterval.toUpperCase() as "MONTHLY" | "YEARLY";

      // 1. Initialize Checkout Session with chosen country
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          interval: targetInterval,
          country, // Explicitly pass selected market
        }),
      });

      const data: SubscriptionApiResponse = await res.json();

      if (!res.ok || !data.success || !data.subscriptionId || !data.key) {
        throw new Error(data.message || "Failed to initialize checkout session.");
      }

      // 2. Open Razorpay Checkout Modal
      const options: RazorpayOptions = {
        key: data.key,
        subscription_id: data.subscriptionId,
        name: "Luen",
        description: `Pro Plan (${billingInterval === "yearly" ? "Yearly" : "Monthly"}) - ${currentPricing.currency}`,
        prefill: { email: userEmail },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            const subscriptionId = response.razorpay_subscription_id || data.subscriptionId;

            // 3. Verify Signature Server-Side
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
        theme: { color: "#0d9488" },
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
    if (loading) return "INITIALIZING...";
    if (isHighestTierActive) return "CURRENTLY ON HIGHEST TIER (YEARLY PRO)";
    if (isSelectedPlanActive) return `CURRENTLY ACTIVE (${billingInterval.toUpperCase()} PRO)`;
    if (canUpgradeToYearly) return "UPGRADE TO YEARLY PRO (-30%)";
    return `UPGRADE TO PRO (${billingInterval.toUpperCase()})`;
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none">
          <div className="bg-white border border-zinc-200/90 rounded-2xs p-5 max-w-sm w-full shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-teal-700">
              <div className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 text-xs font-bold shrink-0">
                ✓
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-900">
                PLAN PURCHASE CONFIRMED
              </h2>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed font-sans">
              Your subscription is active. PDF watermarks and the 5 downloads/month restriction have been removed.
            </p>

            <div className="bg-zinc-50 border border-zinc-200/80 p-3 rounded-2xs space-y-1.5 text-[10px] font-mono text-zinc-600">
              <div className="flex justify-between">
                <span className="text-zinc-400 uppercase">Payment ID:</span>
                <span className="font-bold text-zinc-900">{purchasedDetails?.paymentId}</span>
              </div>
              {purchasedDetails?.subscriptionId && (
                <div className="flex justify-between">
                  <span className="text-zinc-400 uppercase">Subscription ID:</span>
                  <span className="font-bold text-zinc-900">{purchasedDetails.subscriptionId}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-zinc-200/60">
                <span className="text-zinc-400 uppercase">Tax Invoice:</span>
                <span className="text-teal-700 font-bold">Sent to {userEmail || "your email"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-zinc-950 hover:bg-black text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded-2xs transition-colors cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      <main className="w-full max-w-5xl mx-auto p-4 sm:p-6 font-sans select-none space-y-5">
        {/* Header Telemetry & Currency Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200/80 pb-3 gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-teal-600 rounded-2xs" />
              <h1 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">
                BILLING & PLANS
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans pl-3.5">
              Manage your current subscription plan, download quota, and billing region.
            </p>
          </div>

          {/* Region / Currency Switcher */}
          {/* <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-2xs border border-zinc-200/60">
              <button
                type="button"
                onClick={() => setCountry("IN")}
                className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-2xs transition-colors cursor-pointer ${
                  country === "IN"
                    ? "bg-zinc-950 text-white shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                🇮🇳 INR (₹)
              </button>
              <button
                type="button"
                onClick={() => setCountry("GLOBAL")}
                className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-2xs transition-colors cursor-pointer ${
                  country === "GLOBAL"
                    ? "bg-zinc-950 text-white shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                🌐 GLOBAL ($)
              </button>
            </div>

            <div className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-1 rounded-2xs border border-zinc-200/60 whitespace-nowrap">
              TIER: {isPro ? `PRO (${(activeCycle || "ACTIVE").toUpperCase()})` : "FREE"}
            </div>
          </div> */}
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* PRO TIER CARD */}
          <div
            className={`bg-white border rounded-2xs p-4 space-y-4 shadow-2xs relative md:col-span-7 ${
              isPro ? "border-teal-600/50 ring-1 ring-teal-600/20 order-first" : "border-teal-600/30 md:col-span-7"
            }`}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div className="flex items-center gap-1.5 text-teal-700">
                <ZapIcon />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  {isPro ? "YOUR ACTIVE PLAN (PRO TIER)" : "PRO TIER UPGRADE"}
                </span>
              </div>

              {/* Monthly / Yearly Switcher */}
              <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-2xs border border-zinc-200/60">
                <button
                  type="button"
                  onClick={() => setBillingInterval("monthly")}
                  className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-2xs transition-colors cursor-pointer ${
                    billingInterval === "monthly"
                      ? "bg-zinc-950 text-white shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  MONTHLY
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval("yearly")}
                  className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-2xs transition-colors cursor-pointer ${
                    billingInterval === "yearly"
                      ? "bg-zinc-950 text-white shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  YEARLY (-30%)
                </button>
              </div>
            </div>

            {/* Dynamic Market Pricing Info */}
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-2xl font-bold text-zinc-900">
                    {billingInterval === "monthly" ? currentPricing.monthlyText : currentPricing.yearlyText}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {billingInterval === "yearly" ? "/year" : "/month"}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
                  {billingInterval === "yearly"
                    ? `Billed annually at ${currentPricing.yearlyText}/yr (~${currentPricing.yearlyPerMonth}/mo).`
                    : `Billed monthly in ${currentPricing.currency}. Cancel anytime.`}
                </p>
              </div>

              <div className="text-right space-y-1">
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-2xs uppercase block border ${
                    isSelectedPlanActive
                      ? "text-teal-800 bg-teal-100 border-teal-300 font-bold"
                      : "text-teal-700 bg-teal-50 border-teal-200/80"
                  }`}
                >
                  {isSelectedPlanActive ? "ACTIVE PLAN" : "RECOMMENDED"}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 block">
                  {currentPricing.badge}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-2xs font-sans">
                {error}
              </div>
            )}

            {/* CTA Action Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={
                  loading ||
                  !sdkReady ||
                  isHighestTierActive ||
                  isSelectedPlanActive
                }
                onClick={handleSubscribe}
                className="w-full py-2 px-3 text-[11px] font-mono font-bold uppercase tracking-wider text-white bg-zinc-950 hover:bg-black active:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xs transition-all cursor-pointer shadow-2xs"
              >
                {getButtonText()}
              </button>

              <p className="text-[10px] text-zinc-400 text-center leading-tight">
                {currentPricing.paymentNote}
              </p>
            </div>

            {/* Pro Specs */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-100">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Included in Pro:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-zinc-600">
                {[
                  "Unlimited PDF exports",
                  "Remove PDF watermark",
                  "Custom logo & signatures",
                  "Advanced GST engine",
                  "All premium templates",
                  country === "IN" ? "UPI QR & Indian bank rails" : "Multi-currency wire details",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckIcon className="text-teal-600 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FREE STARTER CARD */}
          <div
            className={`bg-white border rounded-2xs p-4 space-y-4 shadow-2xs md:col-span-5 ${
              !isPro ? "border-teal-600/40" : "border-zinc-200/80"
            }`}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <span className="text-[10px] font-mono font-bold text-zinc-900 uppercase tracking-wider">
                {!isPro ? "YOUR CURRENT PLAN" : "STARTER FREE TIER"}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-2xs border ${
                  !isPro
                    ? "text-teal-700 bg-teal-50 border-teal-200/80"
                    : "text-zinc-500 bg-zinc-100 border-zinc-200/60"
                }`}
              >
                {!isPro ? "ACTIVE PLAN" : "INACTIVE"}
              </span>
            </div>

            <div>
              <div className="text-base font-bold text-zinc-900 tracking-tight">
                Starter Free Tier
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Basic invoicing limited to 5 downloads/month (renews monthly).
              </p>
            </div>

            {/* DYNAMIC DB DOWNLOAD QUOTA PROGRESS BAR */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500 uppercase">Monthly Quota</span>
                <span
                  className={`font-bold ${
                    isPro
                      ? "text-teal-700"
                      : isQuotaExhausted
                      ? "text-red-600"
                      : "text-zinc-900"
                  }`}
                >
                  {isPro
                    ? "UNLIMITED"
                    : `${downloadsUsed} / ${MONTHLY_LIMIT} DOWNLOADS`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                <div
                  className={`h-full transition-all duration-500 ${getProgressBarColor()}`}
                  style={{ width: `${quotaPercentage}%` }}
                />
              </div>
              {!isPro && (
                <div className="flex justify-between items-center text-[9px] text-zinc-400 font-mono pt-0.5">
                  <span>
                    {MONTHLY_LIMIT - downloadsUsed > 0
                      ? `${MONTHLY_LIMIT - downloadsUsed} left this month`
                      : "Quota exhausted"}
                  </span>
                  <span>Resets 1st of next month</span>
                </div>
              )}
            </div>

            {/* Free Features */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Free Features:
              </span>
              <ul className="space-y-1.5 text-[11px] text-zinc-600">
                {[
                  "Standard invoice generator",
                  "5 PDF downloads per month",
                  "Multi-currency support (USD, EUR, INR)",
                  "Contains Luen watermark",
                  "No custom branding",
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckIcon className="text-teal-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Policy */}
        <div className="px-3 py-2 bg-zinc-50 border border-zinc-200/60 rounded-2xs text-[10px] text-zinc-400 font-mono flex items-center justify-between">
          <span>Subscriptions auto-renew. Cancel anytime in billing settings.</span>
          <span className="text-zinc-500 font-bold">NON-REFUNDABLE</span>
        </div>
      </main>
    </>
  );
}