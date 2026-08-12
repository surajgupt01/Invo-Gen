"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Layout,
  CheckCircle2,
  Copy,
  Check,
  FileText,
} from "lucide-react";

export default function FeatureHighlightBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopyMock = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full bg-[#FAF9F6] text-zinc-900 font-sans py-24 px-4 md:px-12 border-b border-zinc-200/80 overflow-hidden select-none">
      {/* 🌟 Modern Atmospheric Glass Glow Orbs */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Dot Matrix Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-12">
        {/* TOP HERO CALLOUT */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          {/* Frosted Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/80 backdrop-blur-xl border border-zinc-200/80 text-zinc-700 text-xs font-mono rounded-full shadow-xs hover:border-teal-500/40 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            <span className="font-medium">luen.in Billing Engine v2.0</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-900 leading-[1.1]">
            Invoice like a <span className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 bg-clip-text text-transparent">Pro Studio</span>, not a spreadsheet.
          </h2>

          <p className="text-xs sm:text-sm text-zinc-500 max-w-lg leading-relaxed font-sans">
            Draft, split GST/VAT taxes, attach UPI payment QR codes, and export pixel-perfect PDFs in seconds.
          </p>
        </div>

        {/* 🚀 GLASS BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: HERO GLASS CARD WITH LIVE INTERACTIVE MOCK (Span 7) */}
          <div className="lg:col-span-7 bg-white/60 backdrop-blur-2xl border border-white/80 ring-1 ring-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-8 relative overflow-hidden group">
            {/* Ambient Interior Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/40 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-white border border-zinc-200/80 text-teal-700 rounded-xl shadow-xs">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200/60">
                  Instant PDF Render
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight font-sans">
                  Sub-second PDF Generation
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed font-sans">
                  Type line items and watch your client-ready invoice update live in browser memory with zero server lag.
                </p>
              </div>

              {/* LIVE FROSTED INVOICE PREVIEW SNIPPET */}
              <div className="bg-white/80 backdrop-blur-md border border-zinc-200/80 rounded-xl p-4 space-y-3 font-mono text-xs shadow-2xs">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-2 text-[10px] text-zinc-400 uppercase">
                  <span className="flex items-center gap-1.5 font-bold text-zinc-700">
                    <FileText className="w-3.5 h-3.5 text-teal-600" /> INV-2026-089
                  </span>
                  <button
                    onClick={handleCopyMock}
                    className="flex items-center gap-1 text-teal-700 hover:text-teal-800 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Share URL"}</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-zinc-600 text-xs">
                    <span>Full-Stack Web Engineering</span>
                    <span className="font-semibold text-zinc-900">₹45,000.00</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-teal-700 font-medium">
                    <span>GST (18% Intrastate Split)</span>
                    <span>₹8,100.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-zinc-100 font-bold text-xs text-zinc-900">
                  <span>Total Amount Due</span>
                  <span className="text-sm bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md text-teal-800">
                    ₹53,100.00
                  </span>
                </div>
              </div>
            </div>

            {/* Micro Features Row */}
            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs text-zinc-600 relative z-10">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md p-2.5 rounded-lg border border-zinc-200/60 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-[11px]">Zero setup required</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md p-2.5 rounded-lg border border-zinc-200/60 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-[11px]">Print UPI QR codes</span>
              </div>
            </div>
          </div>

          {/* RIGHT: TWO STACKED GLASS CARDS (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* CARD 1: TAX LOGIC */}
            <div className="flex-1 bg-white/60 backdrop-blur-2xl border border-white/80 ring-1 ring-zinc-200/80 rounded-2xl p-6 shadow-sm hover:ring-teal-500/30 transition-all duration-300 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-white border border-zinc-200/80 text-teal-700 rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full border border-zinc-200">
                    Automated Rules
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 tracking-tight font-sans">
                    Compliant Tax Engine
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed font-sans">
                    Auto-splits CGST, SGST, IGST for Indian transactions or custom VAT rates for global client billing.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-3 border-t border-zinc-100 uppercase">
                <span>GSTIN Split</span>
                <span>•</span>
                <span>International VAT</span>
                <span>•</span>
                <span>Tax Exempt</span>
              </div>
            </div>

            {/* CARD 2: TEMPLATES & CTA */}
            <div className="flex-1 bg-white/60 backdrop-blur-2xl border border-white/80 ring-1 ring-zinc-200/80 rounded-2xl p-6 shadow-sm hover:ring-teal-500/30 transition-all duration-300 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-white border border-zinc-200/80 text-teal-700 rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                    <Layout className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full border border-zinc-200">
                    6 Layout Styles
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 tracking-tight font-sans">
                    Designer Templates
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed font-sans">
                    Switch between minimal, modern, and high-density layouts instantly without re-typing data.
                  </p>
                </div>
              </div>

              <Link href="/dashboard/createInvoice">
                <button className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs uppercase tracking-wider transition rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer font-sans">
                  <span>Start Billing Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}