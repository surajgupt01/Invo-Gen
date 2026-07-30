"use client";

import React from "react";

export default function SignSideBar() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 hidden flex-col justify-between p-8 sm:p-12 [@media(min-width:930px)]:flex overflow-hidden select-none  font-sans">
      
      {/* Top Tagline Badge */}
      <div className="relative z-10">
        <span className="text-[10px] font-mono font-bold text-teal-950 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-2xs border border-white/20 uppercase tracking-widest">
          INVOICING & TELEMETRY
        </span>
      </div>

      {/* Main Copy & Branding */}
      <div className="relative z-10 space-y-3 max-w-lg">
        <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-zinc-950">
          Luen
        </h1>
        <p className="text-sm lg:text-base text-teal-950 font-medium leading-relaxed max-w-md">
          Manage, track, and send invoices with ease. Stay on top of your business finances anytime, anywhere.
        </p>
      </div>

      {/* Bottom Footer Telemetry Label */}
      <div className="relative z-10 text-[10px] font-mono text-teal-950/80 uppercase tracking-wider">
        [ LUEN_ENGINE_v2026.2 ]
      </div>

      {/* Background Decorative Glass Orbs */}
      <div 
        aria-hidden="true" 
        className="absolute w-96 h-96 bg-white/15 rounded-full blur-2xl -bottom-20 -right-20 pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute w-64 h-64 bg-teal-300/20 rounded-full blur-xl top-10 -left-10 pointer-events-none" 
      />
    </div>
  );
}