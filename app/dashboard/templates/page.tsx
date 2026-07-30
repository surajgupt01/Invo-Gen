"use client";

import { useState, useEffect, useMemo } from "react";
import TempDesign from "@/app/component/ModernTemp";
import InvoicePreview from "@/app/component/InvoicePreview";
import InvoicePreview2 from "@/app/component/Design2";
import InvoicePreview3 from "@/app/component/Design3";
import InvoicePreview4 from "@/app/component/Design4";
import InvoicePreview5 from "@/app/component/Design5";
import { useInvoiceSelect } from "@/app/store/InvoiceSelected";
import {
  Check,
  LayoutGrid,
  Eye,
  ArrowRight,
  Search,
  Sparkles,
} from "lucide-react";

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

  const { handler, selectedTemplate } = useInvoiceSelect();

  const [ActiveComponent, setActiveComponent] = useState<TempTypes>(
    (selectedTemplate as TempTypes) || "classic"
  );

  const [searchQuery, setSearchQuery] = useState("");

  const TempFinal = TemplateDesigns[ActiveComponent];

  const templateKeys = useMemo(() => {
    return (Object.keys(TemplateDesigns) as Array<TempTypes>).filter((key) =>
      key.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Keyboard Navigation: Left/Right or Up/Down arrows to switch active template
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      const allKeys = Object.keys(TemplateDesigns) as Array<TempTypes>;
      const currentIndex = allKeys.indexOf(ActiveComponent);

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        const nextIndex = (currentIndex + 1) % allKeys.length;
        setActiveComponent(allKeys[nextIndex]);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        const prevIndex = (currentIndex - 1 + allKeys.length) % allKeys.length;
        setActiveComponent(allKeys[prevIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ActiveComponent]);

  const handleSelectTemplate = (templateKey: TempTypes) => {
    setActiveComponent(templateKey);
    handler(templateKey);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 h-full w-full bg-[#FAFAFA] text-zinc-800 p-3 sm:p-4 overflow-hidden font-sans select-none">
      
      {/* --- SIDEBAR: TEMPLATES CATALOG & FILTER --- */}
      <aside className="w-full md:w-80 flex flex-col border border-zinc-200/80 bg-white shrink-0 max-h-[35vh] md:max-h-full rounded-xs shadow-2xs font-mono">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5 text-teal-600" />
            <h2 className="font-bold text-zinc-900 text-xs uppercase tracking-wider font-sans">
              Layout Catalog
            </h2>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono bg-zinc-50 px-2 py-0.5 border border-zinc-200/80 rounded-2xs">
            0{templateKeys.length} / 0{Object.keys(TemplateDesigns).length}
          </span>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-zinc-100 bg-zinc-50/50">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="FILTER LAYOUTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-[10px] pl-8 pr-3 py-1.5 focus:outline-none focus:border-teal-600 transition-colors uppercase rounded-2xs placeholder:text-zinc-400 font-mono"
            />
          </div>
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-x-auto md:overflow-y-auto p-2 flex flex-row md:flex-col gap-2 bg-zinc-50/30">
          {templateKeys.length === 0 ? (
            <div className="p-4 text-center text-zinc-400 text-[10px] font-sans uppercase">
              {`No templates match "${searchQuery}"`}
            </div>
          ) : (
            templateKeys.map((Id) => {
              const MiniPreview = TemplateDesigns[Id];
              const isActive = ActiveComponent === Id;
              const isSaved = selectedTemplate === Id;

              return (
                <div
                  key={Id}
                  onClick={() => setActiveComponent(Id)}
                  className={`relative h-28 md:h-36 w-36 md:w-full shrink-0 border cursor-pointer transition-all duration-150 text-left group overflow-hidden rounded-2xs ${
                    isActive
                      ? "border-teal-600 bg-teal-50/30 shadow-2xs"
                      : "border-zinc-200/80 hover:border-zinc-300 bg-white"
                  }`}
                >
                  {/* Thumbnail Scaled View */}
                  <div
                    className={`absolute inset-0 origin-top-left scale-[0.08] md:scale-[0.15] w-[210mm] h-[297mm] transition-opacity duration-150 pointer-events-none ${
                      isActive ? "opacity-100" : "opacity-40 group-hover:opacity-75"
                    }`}
                  >
                    <MiniPreview />
                  </div>

                  {/* Top Badge Indicators */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 flex justify-between items-center pointer-events-none">
                    {isSaved ? (
                      <span className="px-1.5 py-0.5 bg-teal-700 text-white text-[8px] font-bold uppercase tracking-wider rounded-2xs font-mono shadow-2xs">
                        ACTIVE INVOICE
                      </span>
                    ) : (
                      <span />
                    )}

                    {isActive && !isSaved && (
                      <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200 text-[8px] font-medium uppercase rounded-2xs font-mono">
                        PREVIEWING
                      </span>
                    )}
                  </div>

                  {/* Bottom Control Bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 py-1.5 px-2.5 border-t flex items-center justify-between transition-colors ${
                      isActive
                        ? "bg-zinc-950 border-zinc-950 text-white"
                        : "bg-zinc-50 border-zinc-100 text-zinc-600"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider truncate font-mono">
                      {Id}
                    </span>

                    {isActive && (
                      <Sparkles className="w-3 h-3 text-teal-400 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard Helper Footer */}
        <div className="hidden md:flex items-center justify-between p-2 border-t border-zinc-100 bg-zinc-50 text-[9px] text-zinc-400 font-mono">
          <span>NAVIGATE:</span>
          <span className="bg-white px-1.5 py-0.5 border border-zinc-200 text-zinc-600 rounded-2xs">
            ↑ ↓ ← → ARROWS
          </span>
        </div>
      </aside>

      {/* --- CANVAS PREVIEW AREA --- */}
      <main className="flex-1 border border-zinc-200/80 bg-white flex flex-col relative overflow-hidden rounded-xs shadow-2xs font-sans">
        
        {/* Control Header Bar */}
        <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-white border-b border-zinc-200/80 gap-2">
          
          {/* Active View Label */}
          <div className="flex items-center gap-2 text-xs">
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider hidden sm:inline">
              LAYOUT:
            </span>
            <span className="text-teal-800 font-bold uppercase tracking-wider px-2 py-0.5 border border-teal-200/80 bg-teal-50 text-[10px] font-mono">
              {ActiveComponent}
            </span>
          </div>

          {/* Apply Template Action */}
          <button
            type="button"
            onClick={() => handleSelectTemplate(ActiveComponent)}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors rounded-xs cursor-pointer ${
              selectedTemplate === ActiveComponent
                ? "bg-zinc-100 text-teal-800 border border-teal-200/80 cursor-default"
                : "bg-zinc-950 text-white hover:bg-black shadow-2xs"
            }`}
          >
            {selectedTemplate === ActiveComponent ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-600" />
                <span>Layout Active</span>
              </>
            ) : (
              <>
                <span>Apply Layout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Dark Canvas Floor */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start bg-zinc-950">
          <div className="max-w-[210mm] w-full bg-white shadow-2xl rounded-2xs border border-zinc-800 overflow-hidden transform-gpu">
            <TempFinal />
          </div>
        </div>
      </main>

    </div>
  );
}