"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PaymentOptionsProps {
  userId?: string;
}

type BillingInterval = "month" | "year";

function CheckIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export default function PaymentOptions({ userId = "" }: PaymentOptionsProps) {
  const router = useRouter();
  const [billingOption, setOption] = useState<BillingInterval>("month");

  const handleSubscribeClick = () => {
    if (!userId) {
      const returnUrl = encodeURIComponent(`/pricing?billing=${billingOption}`);
      router.push(`/signin?redirect=${returnUrl}`);
    } else {
      router.push("/dashboard/pricing");
    }
  };

  return (
    <section
      id="PriceSection"
      className="w-full bg-white text-zinc-900 font-sans select-none py-10 sm:py-14 border-t border-zinc-200"
    >
      {/* Constrained container width */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-zinc-200">
          <div className="max-w-md">
            <p className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-zinc-400 uppercase mb-1.5">
              Simple & Transparent Pricing
            </p>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-950 leading-tight">
              Predictable plans for freelancers{" "}
              <span className="text-zinc-400">and growing agencies.</span>
            </h2>
          </div>

          {/* Billing Switch */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-md border border-zinc-200/70 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setOption("month")}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-all cursor-pointer ${
                billingOption === "month"
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/50"
                  : "text-zinc-500 hover:text-zinc-950"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setOption("year")}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-all cursor-pointer flex items-center gap-1 ${
                billingOption === "year"
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/50"
                  : "text-zinc-500 hover:text-zinc-950"
              }`}
            >
              <span>Yearly</span>
              <span className="text-[9px] font-mono font-semibold text-teal-600">
                (SAVE 30%)
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8  items-stretch max-w-4xl mx-auto">
          {/* FREE TIER CARD */}
          <div className="flex flex-col justify-between p-5 max-w-xl sm:p-6 rounded-lg bg-white border border-zinc-200 transition-all hover:border-zinc-300 shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-zinc-950">
                    Starter
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Free forever for individuals & side projects.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  $0 / MO
                </span>
              </div>

              <div className="py-4 border-b border-zinc-100">
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl sm:text-4xl font-bold text-zinc-950">
                    $0
                  </span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">
                    {billingOption === "year" ? "/ year" : "/ month"}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  What&apos;s Included
                </p>
                <ul className="space-y-2 text-xs text-zinc-600">
                  {[
                    "Create up to 5 invoices per month",
                    "Download clean PDF document",
                    "Auto-calculate subtotals, tax & total",
                    "Multi-currency support (USD, EUR, GBP, INR)",
                    "Standard invoice template",
                    "Local in-browser session storage",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-zinc-400 shrink-0">
                        <CheckIcon />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href={userId ? "/dashboard" : "/signin"}
                className="block w-full"
              >
                <button
                  type="button"
                  className="w-full py-2 px-3 text-xs font-medium text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors cursor-pointer"
                >
                  {userId ? "Go to Dashboard" : "Get Started Free"}
                </button>
              </Link>
            </div>
          </div>

          {/* PRO TIER CARD */}
          <div className="flex flex-col max-w-xl  justify-between p-5 sm:p-6 rounded-lg bg-zinc-950 text-white relative shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-white">
                    Pro
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    For professionals who need custom invoices.
                  </p>
                </div>
                <span className="text-[9px] font-mono font-semibold tracking-wider text-teal-400 bg-teal-950/80 border border-teal-500/30 px-2 py-0.5 rounded-sm uppercase">
                  Popular
                </span>
              </div>

              <div className="py-4 border-b border-zinc-800">
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {billingOption === "month" ? "$12" : "$99"}
                  </span>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">
                    {billingOption === "year" ? "/ year" : "/ month"}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                  {billingOption === "year"
                    ? "Billed annually ($8.25/mo equivalent)"
                    : "Billed monthly. Cancel anytime."}
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Everything in Starter, plus:
                </p>
                <ul className="space-y-2 text-xs text-zinc-300">
                  {[
                    "Unlimited invoice creation & exports",
                    "Zero watermarks on all PDFs",
                    "Custom logo, branding & signatures",
                    "All premium & minimalist templates",
                    "Advanced GST, VAT & tax rules",
                    "Embed UPI QR codes & wire details",
                    "Cloud sync & complete telemetry",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-teal-400 shrink-0">
                        <CheckIcon />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={handleSubscribeClick}
                className="w-full py-2 px-3 text-xs font-medium text-zinc-950 bg-white hover:bg-zinc-100 rounded-md transition-colors cursor-pointer shadow-xs"
              >
                {userId ? "Upgrade to Pro" : "Get Started with Pro"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
