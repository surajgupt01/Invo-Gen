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
  ZoomIn,
  ZoomOut,
  RotateCcw,
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

  // Active preview state (defaults to selected stored template or 'classic')
  const [ActiveComponent, setActiveComponent] = useState<TempTypes>(
    (selectedTemplate as TempTypes) || "classic"
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(0.82);

  const TempFinal = TemplateDesigns[ActiveComponent];

  // Filtered template keys
  const templateKeys = useMemo(() => {
    return (Object.keys(TemplateDesigns) as Array<TempTypes>).filter((key) =>
      key.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // UX Improvement: Keyboard Arrow Navigation (Left/Right arrow to switch templates)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // Don't trigger when searching

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
    <div className="flex flex-col md:flex-row gap-2 h-full w-full bg-[#090909] text-neutral-300 p-2 overflow-hidden font-mono select-none">
      
      {/* --- SIDEBAR: TEMPLATES CATALOG & FILTER --- */}
      <aside className="w-full md:w-80 flex flex-col border border-neutral-800 bg-[#121212] shrink-0 max-h-[40vh] md:max-h-full rounded-none">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3 border-b border-neutral-800 bg-[#181818]">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5 text-[#00D2B5]" />
            <h2 className="font-bold text-white text-[11px] uppercase tracking-widest font-sans">
              Layout Engine
            </h2>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono bg-[#090909] px-2 py-0.5 border border-neutral-800 rounded-none">
            0{templateKeys.length} / 0{Object.keys(TemplateDesigns).length}
          </span>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-neutral-800 bg-[#0E0E0E]">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="FILTER LAYOUTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] border border-neutral-800 text-neutral-200 text-[10px] pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#00D2B5] transition uppercase rounded-none placeholder:text-neutral-600 font-mono"
            />
          </div>
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-x-auto md:overflow-y-auto p-2 flex flex-row md:flex-col gap-2 custom-scrollbar">
          {templateKeys.length === 0 ? (
            <div className="p-4 text-center text-neutral-600 text-[10px] font-sans uppercase">
             {` No templates match "{searchQuery}"`}
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
                  className={`relative h-28 md:h-36 w-36 md:w-full shrink-0 border cursor-pointer transition-all duration-150 text-left group overflow-hidden rounded-none ${
                    isActive
                      ? "border-[#00D2B5] bg-[#00D2B5]/5"
                      : "border-neutral-800 hover:border-neutral-700 bg-[#090909]"
                  }`}
                >
                  {/* Thumbnail Scaled View */}
                  <div
                    className={`absolute inset-0 origin-top-left scale-[0.08] md:scale-[0.15] w-[210mm] h-[297mm] transition-all duration-200 pointer-events-none ${
                      isActive ? "opacity-100" : "opacity-30 group-hover:opacity-60"
                    }`}
                  >
                    <MiniPreview />
                  </div>

                  {/* Top Badge Indicators */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 flex justify-between items-center pointer-events-none">
                    {isSaved ? (
                      <span className="px-1.5 py-0.5 bg-[#00D2B5] text-[#090909] text-[8px] font-black uppercase tracking-tighter">
                        ACTIVE INVOICE
                      </span>
                    ) : (
                      <span />
                    )}

                    {isActive && !isSaved && (
                      <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700 text-[8px] font-bold uppercase">
                        PREVIEW
                      </span>
                    )}
                  </div>

                  {/* Bottom Control Bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 py-1.5 px-2.5 border-t flex items-center justify-between transition-colors ${
                      isActive
                        ? "bg-[#00D2B5] border-[#00D2B5] text-[#090909]"
                        : "bg-[#181818] border-neutral-800 text-neutral-400"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider truncate font-sans">
                      {Id}
                    </span>

                    {isActive && (
                      <Sparkles className="w-3 h-3 text-[#090909] animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard Helper Footer */}
        <div className="hidden md:flex items-center justify-between p-2 border-t border-neutral-800 bg-[#0E0E0E] text-[9px] text-neutral-500 font-mono">
          <span>NAVIGATE:</span>
          <span className="bg-[#181818] px-1.5 py-0.5 border border-neutral-800 text-neutral-400">
            ↑ ↓ ← → ARROWS
          </span>
        </div>
      </aside>

      {/* --- CANVAS PREVIEW & DRAFTING AREA --- */}
      <main className="flex-1 border border-neutral-800 bg-[#121212] flex flex-col relative overflow-hidden rounded-none">
        
        {/* Control Header Bar */}
        <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-[#181818] border-b border-neutral-800 gap-2 flex-wrap">
          
          {/* Active View Label */}
          <div className="flex items-center gap-2 text-xs">
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-500 font-sans text-[11px] uppercase tracking-wider hidden sm:inline">
              PREVIEWING:
            </span>
            <span className="text-[#00D2B5] font-bold uppercase tracking-widest px-2 py-0.5 border border-[#00D2B5]/30 bg-[#00D2B5]/5">
              {ActiveComponent}
            </span>
          </div>

          {/* Canvas Controls & Apply Button */}
          <div className="flex items-center gap-2 ml-auto">
            
            {/* Zoom Controls */}
            <div className="flex items-center border border-neutral-800 bg-[#090909] text-neutral-400">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.35, z - 0.1))}
                className="p-1.5 hover:text-white transition border-r border-neutral-800"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[10px] font-mono text-neutral-300">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.1))}
                className="p-1.5 hover:text-white transition border-r border-neutral-800"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(0.82)}
                className="p-1.5 hover:text-white transition"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Lock In / Apply Template Action */}
            <button
              onClick={() => handleSelectTemplate(ActiveComponent)}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition rounded-none font-sans ${
                selectedTemplate === ActiveComponent
                  ? "bg-neutral-800 text-[#00D2B5] border border-neutral-700 cursor-default"
                  : "bg-[#00D2B5] text-[#090909] hover:bg-[#00b89f] shadow-sm"
              }`}
            >
              {selectedTemplate === ActiveComponent ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Template Active
                </>
              ) : (
                <>
                  Apply Layout
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Blueprint Floor (Canvas Viewport) */}
        <div className="flex-1 overflow-auto p-4 md:p-10 flex justify-center items-start bg-[linear-gradient(to_right,#1b1b1b_1px,transparent_1px),linear-gradient(to_bottom,#1b1b1b_1px,transparent_1px)] [background-size:24px_24px] custom-scrollbar">
          <div
            style={{ transform: `scale(${zoomLevel})` }}
            className="origin-top transition-transform duration-150 border border-neutral-800 bg-white shadow-2xl rounded-none"
          >
            <TempFinal />
          </div>
        </div>
      </main>

    </div>
  );
}