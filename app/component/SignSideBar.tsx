"use client";

import React from "react";
import Image from "next/image";

export default function SignSideBar() {
  return (
    <div className="relative hidden [@media(min-width:930px)]:flex flex-col justify-between w-full max-w-[420px] h-full min-h-screen bg-zinc-50 border-r border-zinc-200 p-12 select-none font-sans">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
          <Image
            src="/favicon.png"
            alt="Luen Logo"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
        <span className="font-bold text-base tracking-tight text-zinc-950">
          Lu<span className="text-teal-500">en</span>
        </span>
      </div>

      {/* Center Copy */}
      <div className="space-y-3 max-w-xs">
        <h2 className="text-2xl font-normal tracking-tight text-zinc-950 leading-snug">
          Simple, fast invoicing for your business.
        </h2>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Create, track, and export clean PDF invoices in seconds with automatic GST and currency support.
        </p>
      </div>

      {/* Footer */}
      <div className="text-[11px] font-mono text-zinc-400">
        © 2026 Luen
      </div>
    </div>
  );
}