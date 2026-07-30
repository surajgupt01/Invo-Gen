"use client";

import { useState } from "react";
import Link from "next/link";

// Clean Minimal SVG Check Icon
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

export default function PaymentOptions() {
  const [billingOption, setOption] = useState<"month" | "year">("month");

  return (
    <section
      id="PriceSection"
      className="relative w-full max-w-5xl bg-[#FAFAFA] text-zinc-800 font-sans select-none py-16 md:py-24 overflow-hidden border-b border-zinc-200/80"
    >
      <div className="w-[90%] max-w-[85vw] mx-auto space-y-12">
        
        {/* Header Block matching Landing Page Typography */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-zinc-200/80">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono text-teal-600 uppercase tracking-widest font-semibold">
              TRANSPARENT PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
              Simple pricing that scales with your business.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
              Everything you need to create professional invoices, manage collections, and customize PDF templates.
            </p>
          </div>

          {/* Monthly / Yearly Sliding Pill Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOption("month")}
              className={`px-4 py-2 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                billingOption === "month"
                  ? "bg-zinc-950 text-white shadow-2xs"
                  : "bg-white text-zinc-800 hover:bg-zinc-50 border border-zinc-200"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setOption("year")}
              className={`px-4 py-2 text-xs font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                billingOption === "year"
                  ? "bg-zinc-950 text-white shadow-2xs"
                  : "bg-white text-zinc-800 hover:bg-zinc-50 border border-zinc-200"
              }`}
            >
              <span>Yearly</span>
              <span
                className={`text-[10px] font-mono font-bold uppercase ${
                  billingOption === "year" ? "text-teal-400" : "text-teal-600"
                }`}
              >
                (Save ~30%)
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 items-start">
          
          {/* FREE TIER */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-baseline justify-between pb-3 border-b border-zinc-200/80">
              <h3 className="text-xl font-bold tracking-tight text-zinc-900">
                Free Tier
              </h3>
              <span className="text-xs font-mono text-zinc-400 uppercase">
                STARTER
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-zinc-900 tracking-tight font-mono">
                  $0
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {billingOption === "year" ? "/year" : "/month"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Free forever, no credit card required.
              </p>
            </div>

            <Link href="/dashboard" className="block w-full">
              <button
                type="button"
                className="w-full py-2.5 px-4 text-xs font-medium text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-2xs rounded-xs transition-colors cursor-pointer"
              >
                Current Plan
              </button>
            </Link>

            {/* Feature List */}
            <div className="space-y-3 pt-4">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">
                Included Features:
              </span>
              <ul className="space-y-2.5 text-xs text-zinc-600">
                {[
                  "Create up to 5 invoices per month",
                  "Download clean PDF document",
                  "Auto-calculate subtotals, tax & total",
                  "Multi-currency support (USD, EUR, GBP, INR)",
                  "Standard template selection",
                  "Local in-browser session storage",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-teal-600 mt-0.5 shrink-0">
                      <CheckIcon />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PRO TIER */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-baseline justify-between pb-3 border-b border-zinc-200/80">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight text-zinc-900">
                  Pro Tier
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-2xs">
                  MOST POPULAR
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400 uppercase">
                PRO BILLING
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-zinc-900 tracking-tight font-mono">
                  {billingOption === "month" ? "$12" : "$99"}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {billingOption === "year" ? "/year" : "/month"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {billingOption === "year"
                  ? "Billed annually at $99/year."
                  : "Billed monthly. Cancel anytime."}
              </p>
            </div>

            <Link href="/dashboard" className="block w-full">
              <button
                type="button"
                className="w-full py-2.5 px-4 text-xs font-medium text-white bg-zinc-950 hover:bg-black shadow-2xs rounded-xs transition-colors cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </Link>

            {/* Feature List */}
            <div className="space-y-3 pt-4">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">
                Included Features:
              </span>
              <ul className="space-y-2.5 text-xs text-zinc-600">
                {[
                  "Everything in Free",
                  "Unlimited invoice generation",
                  "Remove watermarks from PDFs",
                  "Upload organization logo & signature",
                  "All premium invoice template designs",
                  "Advanced GST & International tax engine",
                  "Print UPI QR code & bank details",
                  "Full invoice activity telemetry",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-teal-600 mt-0.5 shrink-0">
                      <CheckIcon />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>

      {/* Large Bottom Faded Brand Watermark */}
   
    </section>
  );
}