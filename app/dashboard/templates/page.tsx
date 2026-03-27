"use client";

import { useState } from "react";
import TempDesign from "@/app/component/ModernTemp";
import InvoicePreview from "@/app/component/InvoicePreview";
import InvoicePreview2 from "@/app/component/Design2";
import InvoicePreview3 from "@/app/component/Design3";
import InvoicePreview4 from "@/app/component/Design4";
import InvoicePreview5 from "@/app/component/Design5";
import { useInvoiceSelect } from "@/app/store/InvoiceSelected";

export default function Templates() {
  const TemplateDesigns = {
    classic: InvoicePreview,
    modern: TempDesign,
    regular: InvoicePreview2,
    trendy: InvoicePreview3,
    sassy: InvoicePreview4,
    free: InvoicePreview5,
  };

  type TempTypes = keyof typeof TemplateDesigns;
  const [ActiveComponent, setActiveComponent] = useState<TempTypes>("classic");
  const TempFinal = TemplateDesigns[ActiveComponent];

  const {handler}  = useInvoiceSelect()

  return (
    // Changed flex-row to flex-col on mobile, flex-row on md+
    <div className="flex flex-col md:flex-row gap-1 h-full w-full bg-black text-zinc-400 p-2 overflow-hidden">
      
      {/* --- SIDEBAR / TOPBAR: TIGHT BOXED LAYOUTS --- */}
      {/* Mobile: Horizontal scroll | Desktop: Vertical scroll */}
      <aside className="w-full md:w-72 flex flex-col border border-zinc-800 bg-[#0a0a0b] shadow-2xl shrink-0 max-h-[30vh] md:max-h-full">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#111112]">
          <h2 className="font-bold text-zinc-100 text-[10px] md:text-xs uppercase tracking-[0.2em]">Layouts</h2>
          <span className="text-[9px] text-zinc-500 font-mono bg-black px-2 py-0.5 border border-zinc-800">
            0{Object.keys(TemplateDesigns).length}
          </span>
        </div>

        {/* Scrollable container: flex-row on small, flex-col on large */}
        <div className="flex-1 overflow-x-auto md:overflow-y-auto p-3 flex flex-row md:flex-col gap-2 custom-scrollbar">
          {(Object.keys(TemplateDesigns) as Array<TempTypes>).map((Id) => {
            const MiniPreview = TemplateDesigns[Id];
            const isActive = ActiveComponent === Id;
            
            return (
              <button
                key={Id}
                onClick={() =>{ 
                  
                  setActiveComponent(Id)
                  handler(Id)

                }}
                // Fixed width on mobile (w-32) to ensure horizontal scroll works
                className={`relative h-28 md:h-40 w-32 md:w-full shrink-0 border transition-all duration-200 text-left group overflow-hidden ${
                  isActive
                    ? "border-emerald-500 bg-emerald-500/5 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)]"
                    : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/10"
                }`}
              >
                {/* Thumbnail Preview: Highly scaled for mobile button */}
                <div className={`absolute inset-0 origin-top-left scale-[0.08] md:scale-[0.16] w-[210mm] h-[297mm] transition-all duration-300 ${
                  isActive ? "opacity-100 translate-x-1" : "opacity-30 group-hover:opacity-60"
                }`}>
                  <MiniPreview />
                </div>

                {/* Sharp Label Bar */}
                <div className={`absolute bottom-0 left-0 right-0 py-1 md:py-2 px-3 border-t transition-colors ${
                  isActive ? "bg-emerald-500 border-emerald-400 text-black" : "bg-[#0a0a0b] border-zinc-800 text-zinc-500"
                }`}>
                  <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] truncate">
                    {Id}
                  </p>
                </div>

                {/* Active Corner Notch */}
                {isActive && (
                  <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 [clip-path:polygon(100%_0,0_0,100%_100%)]" />
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* --- CANVAS: GRID-SYSTEM PREVIEW --- */}
      <main className="flex-1 border border-zinc-800 bg-[#0a0a0b] flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Rigid Control Bar */}
        <div className="flex items-center justify-between px-3 md:px-5 py-3 bg-[#111112] border-b border-zinc-800">
          <div className="flex items-center gap-2 md:gap-4">
             <div className="h-4 w-[1px] bg-zinc-800 hidden md:block" />
             <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] flex items-center">
               <span className="text-zinc-600 hidden xs:inline">Active View:</span> 
               <span className="text-emerald-500 xs:ml-3 px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/5">
                 {ActiveComponent}
               </span>
             </div>
          </div>
        </div>

        {/* The Drafting Floor */}
        <div className="flex-1 overflow-auto p-4 md:p-12 flex justify-center bg-[linear-gradient(to_right,#161618_1px,transparent_1px),linear-gradient(to_bottom,#161618_1px,transparent_1px)] [background-size:16px_16px] md:background-size:32px_32px] custom-scrollbar">
          {/* Responsive Scaling: 
            Mobile: scale-[0.4] | Tablet: scale-[0.6] | Desktop: scale-[0.85] 
          */}
          <div className="origin-top transform scale-[0.35] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.85] transition-transform duration-300 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[20px_20px_0px_0px_rgba(0,0,0,0.3)] border border-zinc-800 bg-white">
             <TempFinal />
          </div>
        </div>
      </main>
      
    </div>
  );
}