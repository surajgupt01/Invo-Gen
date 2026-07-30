"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  QrCode,
  Palette,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function FeatureSection() {
  // Interactive mini calculator state for the live preview box
  const [qty, setQty] = useState<number>(2);
  const [rate, setRate] = useState<number>(1500);
  const [gstRate, setGstRate] = useState<number>(18);

  const subtotal = qty * rate;
  const tax = (subtotal * gstRate) / 100;
  const total = subtotal + tax;

  return (
    <section
      id="Features"
      className="relative w-full max-w-5xl bg-[#FAFAFA] text-zinc-800 font-sans py-16 md:py-24 overflow-hidden border-b border-zinc-200/80 select-none"
    >
      <div className="w-[90%] max-w-[85vw] mx-auto space-y-16">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-zinc-200/80">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono text-teal-600 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>POWERFUL FEATURE SUITE</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-snug">
              Everything you need to bill clients with total confidence.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
              Forget complex accounting suites. Create, format, and issue client-ready PDF invoices without spreadsheets or hassle.
            </p>
          </div>

          <Link href="/dashboard/createInvoice">
            <button className="px-5 py-2.5 bg-zinc-950 hover:bg-black text-white text-xs font-medium rounded-xs shadow-2xs transition-colors flex items-center gap-2 cursor-pointer font-sans whitespace-nowrap">
              <span>Create Invoice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* FEATURE HIGHLIGHT 1: INTERACTIVE CALCULATOR ENGINE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-12 border-b border-zinc-200/80">
          
          {/* Left Text Explanation */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono text-teal-600 uppercase tracking-wider font-semibold block">
              AUTOMATED CALCULATION ENGINE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Zero manual math. Zero formula errors.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Input your line items and quantities—Luen automatically computes subtotals, applies GST/VAT breakdowns, and updates totals in real time.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-zinc-600">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Supports Indian GST (CGST, SGST, IGST)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Multi-currency support ($ USD, € EUR, ₹ INR, £ GBP)</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Calculation Sandbox */}
          <div className="lg:col-span-7 bg-white border border-zinc-200/80 p-6 rounded-xs space-y-4 font-mono shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 text-[10px] text-zinc-400 uppercase tracking-widest">
              <span>INTERACTIVE PREVIEW</span>
              <span className="text-teal-600 font-bold">LIVE ENGINE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">
                  Qty / Hours
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-zinc-50 border border-zinc-200 text-xs px-3 py-2 rounded-xs text-zinc-800 font-mono focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">
                  Rate (₹)
                </label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-zinc-50 border border-zinc-200 text-xs px-3 py-2 rounded-xs text-zinc-800 font-mono focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">
                  GST Rate
                </label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 text-xs px-3 py-2 rounded-xs text-zinc-800 font-mono focus:outline-teal-600 cursor-pointer"
                >
                  <option value={0}>0% (Exempt)</option>
                  <option value={5}>5% GST</option>
                  <option value={12}>12% GST</option>
                  <option value={18}>18% GST</option>
                  <option value={28}>28% GST</option>
                </select>
              </div>
            </div>

            {/* Live Calculations Breakdown */}
            <div className="bg-zinc-50/80 border border-zinc-200/80 p-3.5 rounded-xs space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-teal-600 font-semibold">
                <span>Tax ({gstRate}%)</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-bold text-zinc-900 border-t border-zinc-200 pt-2 text-sm">
                <span>Total Amount Due</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3-COLUMN FEATURE CARDS (UNBOXED) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          {/* Feature 1 */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">
              01. PAYOUTS
            </span>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
              Instant UPI & Bank Details
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Print custom UPI QR codes (GPay, PhonePe, Paytm) or bank transfer details directly onto your PDF for faster client settlements.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">
              02. DESIGN
            </span>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
              Designer PDF Templates
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Switch effortlessly between modern, minimal, and high-density invoice layouts tailored to elevate your professional brand.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">
              03. PRIVACY
            </span>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
              Private & Local Storage
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Your billing data stays yours. Draft invoices locally inside browser memory or sync with your profile for instant client autofill.
            </p>
          </div>

        </div>

      </div>

      {/* Large Bottom Faded Brand Watermark */}

    </section>
  );
}