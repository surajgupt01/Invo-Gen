import Link from "next/link";
import Arrow from "../Icons/Arrow";
import Create from "../Icons/Create";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-10 pb-16 lg:mt-10">
      
      {/* Outer Paper/Canvas Card */}
      <div className="relative bg-white  rounded-md overflow-hidden">
        
        {/* Top Status & Brand Header Bar */}
        <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-mono text-gray-600 uppercase tracking-widest font-semibold">
              LIVE INVOICE GENERATOR
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
            <span>STATUS: <strong className="text-teal-700 font-semibold">READY TO ISSUE</strong></span>
            {/* <span className="hidden sm:inline text-gray-300">|</span>
            <span className="hidden sm:inline">NO ACCOUNT NEEDED</span> */}
          </div>
        </div>

        {/* Main Document Body */}
        <div className="p-6 sm:p-10 md:p-12">
          
          {/* Top Document Metadata Grid */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 pb-8 border-b border-gray-100">
            
            {/* Left side: Integrated Headline */}
            <div className="max-w-xl">
              <span className="text-xs font-mono text-teal-600 uppercase tracking-wider font-semibold">
                [ DOCUMENT TYPE: INVOICE ]
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 mt-2 leading-[1.15]">
                Client-ready invoices created in seconds.
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-4 leading-relaxed">
                Skip complex software. Input your items, customize taxes or logo, and export clean PDFs instantly.
              </p>
            </div>

            {/* Right side: Mock Invoice Details Box */}
            <div className="w-full md:w-auto bg-gray-50 p-4 rounded-sm border border-gray-200/80 text-xs font-mono space-y-2 min-w-[220px]">
              <div className="flex justify-between text-gray-500">
                <span>INVOICE #:</span>
                <span className="text-gray-900 font-semibold">LUEN-2026-01</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>CURRENCY:</span>
                <span className="text-gray-900 font-semibold">USD, EUR, INR</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>EST. TIME:</span>
                <span className="text-teal-600 font-bold">&lt; 1 MINUTE</span>
              </div>
            </div>

          </div>

          {/* Action Area & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-10">
            
            {/* Action CTA Button */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-950 hover:bg-black text-white text-sm font-medium rounded-sm border border-gray-950 shadow-md transition-all cursor-pointer">
                  <span>Start Creating Invoice</span>
                  <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
                    <div className="absolute transition-transform duration-300 group-hover:-translate-y-full">
                      <Create />
                    </div>
                    <div className="absolute translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                      <Arrow />
                    </div>
                  </div>
                </button>
              </Link>

              <a 
                href="#Features" 
                className="text-xs font-mono text-gray-500 hover:text-teal-600 underline underline-offset-4 px-2"
              >
                VIEW TEMPLATES ↓
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3">
              <Image
                alt="Users"
                src="/avatar.png"
                width={70}
                height={22}
                className="object-contain opacity-90"
              />
              <span className="text-xs text-gray-500">
                Used by <strong className="text-gray-900">1,000+</strong> freelancers
              </span>
            </div>

          </div>

          {/* Clean White Cards with Dark Border (Moved below buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-3  pt-8 border-t border-gray-200">
            <div className="p-4 bg-white  border-zinc-800 rounded-sm shadow-2xs">
              <span className="font-semibold text-zinc-900 block mb-1.5 text-xs sm:text-sm">
                ✓ Auto-Calculations
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Subtotals, GST/VAT, and custom discounts handled automatically.
              </p>
            </div>

            <div className="p-4 bg-white  border-zinc-800 rounded-sm shadow-2xs">
              <span className="font-semibold text-zinc-900 block mb-1.5 text-xs sm:text-sm">
                ✓ Brand Customization
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Upload logo, business details, and custom payment QR codes.
              </p>
            </div>

            <div className="p-4 bg-white  border-zinc-800 rounded-sm shadow-2xs">
              <span className="font-semibold text-zinc-900 block mb-1.5 text-xs sm:text-sm">
                ✓ Clean PDF Export
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Download crisp, pixel-perfect PDFs with zero watermarks.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}