"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Plus, Trash2 } from "lucide-react";

export default function FeatureSection() {
  const [items, setItems] = useState([
    { desc: "UI/UX Brand Design & Assets", qty: 1, rate: 2400 },
    { desc: "Next.js Frontend Architecture", qty: 35, rate: 85 },
  ]);
  const [taxPercent] = useState(18);

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const tax = (subtotal * taxPercent) / 100;
  const total = subtotal + tax;

  return (
    <section id="Features" className="w-full bg-white text-zinc-900 font-sans select-none py-16 sm:py-24 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-zinc-200">
          <div className="max-w-xl">
            <p className="text-[11px] sm:text-xs font-mono font-medium tracking-widest text-zinc-400 uppercase mb-3">
              Powerful Feature Suite
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-950 leading-tight">
              Everything you need to bill clients <span className="text-zinc-400">with total confidence.</span>
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

        {/* Feature Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-12 border-b border-zinc-200">
          
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Automated Calculation Engine
            </p>
            <h3 className="text-2xl sm:text-3xl font-normal text-zinc-950 tracking-tight leading-snug">
              Zero manual math. <br />
              <span className="text-zinc-400">Zero formula errors.</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Input your services and hourly rates—Luen computes sub-totals, applies international or local tax rules, and outputs balanced ledgers automatically.
            </p>

            <ul className="pt-2 space-y-2.5 text-xs text-zinc-600">
              <li className="flex items-center gap-2.5">
                <span className="text-teal-600 shrink-0"><Check className="w-4 h-4" /></span>
                <span>Automated GST (CGST/SGST/IGST), VAT & custom tax splits</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-teal-600 shrink-0"><Check className="w-4 h-4" /></span>
                <span>Multi-currency formatting with localized separators</span>
              </li>
            </ul>
          </div>

          {/* Micro Invoice Slate Preview */}
{/* Light Minimalist Invoice Preview Card */}
          <div className="lg:col-span-7 bg-zinc-50/70 text-zinc-900 rounded-xl p-6 sm:p-7 shadow-xs border border-zinc-200 font-mono">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 text-[11px]">
              <span className="text-zinc-500 font-medium">INVOICE PREVIEW / #INV-2026-08</span>
              <span className="text-teal-700 text-[10px] bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 font-semibold tracking-wide">
                LIVE SYNC
              </span>
            </div>

            {/* Compact Table */}
            <div className="py-4 divide-y divide-zinc-200/80 text-xs">
              <div className="grid grid-cols-12 pb-2.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                <span className="col-span-7">Item Description</span>
                <span className="col-span-2 text-right">Qty/Hrs</span>
                <span className="col-span-3 text-right">Amount</span>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 py-3 text-zinc-700 items-center">
                  <span className="col-span-7 truncate font-sans text-xs font-medium text-zinc-900">
                    {item.desc}
                  </span>
                  <span className="col-span-2 text-right text-zinc-500">{item.qty}</span>
                  <span className="col-span-3 text-right font-medium text-zinc-900">
                    ${(item.qty * item.rate).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Summary */}
            <div className="pt-4 border-t border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>Subtotal</span>
                <span className="text-zinc-800 font-medium">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-teal-700 text-[11px] font-medium">
                <span>Applied Tax (GST 18%)</span>
                <span>+${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-zinc-950 pt-2.5 border-t border-zinc-200">
                <span>Total Due</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">01. Payouts</span>
            <h4 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight">Instant UPI & Bank Details</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Embed custom UPI QR codes or wire instructions directly on the PDF for rapid settlements.</p>
          </div>
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">02. Design</span>
            <h4 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight">Minimalist PDF Templates</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Clean typography and balanced margins crafted to present your brand with extreme polish.</p>
          </div>
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">03. Privacy</span>
            <h4 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight">Private & Local-First</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Your client and billing data stays private. Generate invoices entirely inside your browser session.</p>
          </div>
        </div>

      </div>
    </section>
  );
}