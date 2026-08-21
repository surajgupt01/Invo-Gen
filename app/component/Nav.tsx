"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, Calculator, FileText, Globe, Zap } from "lucide-react";

interface NavProp {
  textColor?: string;
}

export function NavLogo({ textColor = "text-zinc-950" }: NavProp) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 select-none group">
      <div className="relative w-5 h-5 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
        <Image
          src="/favicon.png"
          alt="Luen Logo"
          width={20}
          height={20}
          className="object-contain"
          priority
        />
      </div>
      <span className={`font-sans font-bold text-base tracking-tight ${textColor}`}>
        Lu<span className="text-teal-500">en</span>
      </span>
    </Link>
  );
}

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 font-sans select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Left Side: Logo & Desktop Links */}
        <div className="flex items-center gap-8">
          <NavLogo />

          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-600 font-medium">
            {/* Features Dropdown */}
            <div className="relative group cursor-pointer h-14 flex items-center">
              <div className="flex items-center gap-1 hover:text-zinc-950 transition-colors">
                <span>Features</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 transition-transform duration-200 group-hover:-rotate-180" />
              </div>

              {/* Dropdown Card */}
              <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 w-64">
                <div className="bg-white border border-zinc-200 rounded-xl shadow-xl p-2 flex flex-col gap-1">
                  <Link href="/#features" className="flex items-start gap-3 p-2.5 hover:bg-zinc-50 rounded-lg transition-colors group/item">
                    <div className="p-1.5 bg-teal-50 text-teal-600 rounded-md shrink-0">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-zinc-950 font-semibold text-xs group-hover/item:text-teal-700 transition-colors">GST Tax Engine</div>
                      <div className="text-[10px] text-zinc-500 font-sans mt-0.5 leading-tight">Automated IGST/CGST calculations</div>
                    </div>
                  </Link>
                  <Link href="/#features" className="flex items-start gap-3 p-2.5 hover:bg-zinc-50 rounded-lg transition-colors group/item">
                    <div className="p-1.5 bg-zinc-100 text-zinc-600 rounded-md shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-zinc-950 font-semibold text-xs group-hover/item:text-zinc-950 transition-colors">Vector PDFs</div>
                      <div className="text-[10px] text-zinc-500 font-sans mt-0.5 leading-tight">Pixel-perfect client exports</div>
                    </div>
                  </Link>
                  <Link href="/#features" className="flex items-start gap-3 p-2.5 hover:bg-zinc-50 rounded-lg transition-colors group/item">
                    <div className="p-1.5 bg-zinc-100 text-zinc-600 rounded-md shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-zinc-950 font-semibold text-xs group-hover/item:text-zinc-950 transition-colors">Cross-Border LUT</div>
                      <div className="text-[10px] text-zinc-500 font-sans mt-0.5 leading-tight">Zero-rated international invoicing</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/dashboard/templates" className="hover:text-zinc-950 transition-colors flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-zinc-400" />
              <span>Templates</span>
            </Link>
            <Link href="/#PriceSection" className="hover:text-zinc-950 transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="hover:text-zinc-950 transition-colors">
              Docs
            </Link>
            <Link href="/blog" className="hover:text-zinc-950 transition-colors">
              Blog
            </Link>
          </nav>
        </div>

        {/* Right Side: Auth / CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Log in
          </Link>

          <Link
            href="/dashboard"
            className="hidden sm:inline-flex px-4 py-2 text-xs font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-md transition-colors shadow-xs"
          >
            Get Started
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-zinc-600 hover:text-zinc-950 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-200 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          mobileMenuOpen ? "scale-y-100 opacity-100 visible" : "scale-y-0 opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-zinc-600">
            <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="p-3 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100">
              Features &amp; Tech
            </Link>
            <Link href="/dashboard/templates" onClick={() => setMobileMenuOpen(false)} className="p-3 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100">
              Template Gallery
            </Link>
            <Link href="/#PriceSection" onClick={() => setMobileMenuOpen(false)} className="p-3 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100">
              Pricing Plans
            </Link>
            <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="p-3 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100">
              Documentation
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="p-3 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100">
              Blog &amp; Insights
            </Link>
          </nav>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-100">
            <Link
              href="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 text-xs font-medium text-center text-zinc-700 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 rounded-md transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 text-xs font-medium text-center text-white bg-zinc-950 hover:bg-zinc-800 rounded-md transition-colors shadow-xs"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}