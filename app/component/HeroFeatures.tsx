"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function FeatureSection() {
  // Interactive mini calculator state
  const [qty, setQty] = useState<number>(2);
  const [rate, setRate] = useState<number>(1500);
  const [gstRate, setGstRate] = useState<number>(18);

  const subtotal = qty * rate;
  const tax = (subtotal * gstRate) / 100;
  const total = subtotal + tax;

  return (
    <section
      id="Features"
      className="w-full bg-white text-zinc-900 font-sans select-none py-16 sm:py-24 border-t border-zinc-200"
    >
      {/* Constrained to max-w-6xl */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-zinc-200">
          <div className="max-w-xl">
            <p className="text-[11px] sm:text-xs font-mono font-medium tracking-widest text-zinc-400 uppercase mb-3">
              Powerful Feature Suite
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-950 leading-tight">
              Everything you need to bill clients{" "}
              <span className="text-zinc-400">with total confidence.</span>
            </h2>
          </div>

          <div className="shrink-0 mb-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-md transition-colors shadow-xs"
            >
              <span>Create Invoice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature Highlight: Interactive Calculation Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-12 border-b border-zinc-200">
          
          {/* Left Text Block */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Automated Calculation Engine
            </p>
            <h3 className="text-2xl sm:text-3xl font-normal text-zinc-950 tracking-tight leading-snug">
              Zero manual math. <br />
              <span className="text-zinc-400">Zero formula errors.</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Input your line items and quantities—Luen automatically computes subtotals, applies tax breakdowns, and generates totals in real time.
            </p>

            <ul className="pt-2 space-y-2.5 text-xs text-zinc-600">
              <li className="flex items-center gap-2.5">
                <span className="text-teal-600 shrink-0">
                  <Check className="w-4 h-4" />
                </span>
                <span>Supports Indian GST (CGST, SGST, IGST) & international VAT</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-teal-600 shrink-0">
                  <Check className="w-4 h-4" />
                </span>
                <span>Multi-currency formatting ($ USD, € EUR, ₹ INR, £ GBP)</span>
              </li>
            </ul>
          </div>

          {/* Right Interactive Preview Card */}
          <div className="lg:col-span-7 bg-zinc-50/50 border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-5 font-mono shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 text-[10px] text-zinc-400 uppercase tracking-widest">
              <span>Interactive Preview</span>
              <span className="text-teal-600 font-bold">● Live Math Sandbox</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1.5 font-medium">
                  Qty / Hours
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-zinc-200 text-xs px-3 py-2 rounded-md text-zinc-900 font-mono focus:outline-zinc-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1.5 font-medium">
                  Rate (₹)
                </label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-zinc-200 text-xs px-3 py-2 rounded-md text-zinc-900 font-mono focus:outline-zinc-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1.5 font-medium">
                  GST Rate
                </label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full bg-white border border-zinc-200 text-xs px-3 py-2 rounded-md text-zinc-900 font-mono focus:outline-zinc-900 cursor-pointer shadow-2xs"
                >
                  <option value={0}>0% (Exempt)</option>
                  <option value={5}>5% GST</option>
                  <option value={12}>12% GST</option>
                  <option value={18}>18% GST</option>
                  <option value={28}>28% GST</option>
                </select>
              </div>
            </div>

            {/* Calculated Output Summary */}
            <div className="bg-white border border-zinc-200/80 p-4 rounded-lg space-y-2.5 text-xs shadow-2xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-teal-600 font-medium">
                <span>Tax ({gstRate}%)</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-bold text-zinc-950 border-t border-zinc-100 pt-2.5 text-sm">
                <span>Total Amount Due</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3-Column Core Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">
              01. Payouts
            </span>
            <h4 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight">
              Instant UPI & Bank Details
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Embed custom UPI QR codes (GPay, PhonePe, Paytm) or bank wire instructions directly on the PDF for zero-friction settlements.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">
              02. Design
            </span>
            <h4 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight">
              Minimalist PDF Templates
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Clean typography and high-density layouts crafted to present your freelance or agency brand with extreme polish.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">
              03. Privacy
            </span>
            <h4 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight">
              Private & Local-First
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Your billing data stays private. Generate invoices instantly in your browser without mandatory accounts or tracking.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}