"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  Maximize2,
} from "lucide-react";

export default function Templates() {
  const TemplateDesigns = {
    classic: InvoicePreview,
    modern: TempDesign,
    regular: InvoicePreview2,
    trendy: InvoicePreview3,
    sassy: InvoicePreview4,
    Slate: InvoicePreview5,
  };

  type TempTypes = keyof typeof TemplateDesigns;

  const { handler, selectedTemplate } = useInvoiceSelect();

  const [ActiveComponent, setActiveComponent] = useState<TempTypes>(
    (selectedTemplate as TempTypes) || "classic"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const TempFinal = TemplateDesigns[ActiveComponent];

  const templateKeys = useMemo(() => {
    return (Object.keys(TemplateDesigns) as Array<TempTypes>).filter((key) =>
      key.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // A4 Base dimensions
  const a4Width = 794;
  const a4Height = 1123;

  useEffect(() => {
    const updateScale = () => {
      if (!canvasRef.current) return;
      const isMobile = window.innerWidth < 768;
      const padding = isMobile ? 16 : 32;
      const containerWidth = canvasRef.current.clientWidth - padding;
      const containerHeight = canvasRef.current.clientHeight - padding;

      const scaleX = containerWidth / a4Width;
      const scaleY = containerHeight / a4Height;

      // On mobile, scale strictly by available width so the entire width is legible
      const fittedScale = isMobile ? scaleX : Math.min(scaleX, scaleY, 1);
      setScale(Math.max(fittedScale, 0.28));
    };

    const resizeObserver = new ResizeObserver(updateScale);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);

    updateScale();
    return () => resizeObserver.disconnect();
  }, []);

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
    <div className="flex flex-col md:flex-row gap-4 h-full w-full bg-white text-zinc-950 p-3 sm:p-5 font-sans select-none overflow-y-auto md:overflow-hidden">
      
      {/* --- SIDEBAR: CATALOG & MINI PREVIEWS --- */}
      <aside className="w-full md:w-80 flex flex-col border border-zinc-200 bg-white shrink-0 h-44 md:h-full rounded-xl shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-zinc-950" />
            <h2 className="font-medium text-zinc-950 text-xs tracking-tight">
              Layout Catalog
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {String(templateKeys.length).padStart(2, "0")} / {String(Object.keys(TemplateDesigns).length).padStart(2, "0")}
          </span>
        </div>

        {/* Search Bar */}
        <div className="p-2.5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search layouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 text-zinc-900 text-xs pl-9 pr-3 py-1.5 focus:outline-none focus:border-zinc-950 transition-colors rounded-md placeholder:text-zinc-400 font-sans shadow-2xs"
            />
          </div>
        </div>

        {/* Template Mini Preview List */}
        <div className="flex-1 overflow-x-auto md:overflow-y-auto p-2.5 flex flex-row md:flex-col gap-2.5 bg-zinc-50/30 scrollbar-none">
          {templateKeys.length === 0 ? (
            <div className="p-6 text-center text-zinc-400 text-xs font-mono w-full">
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
                  className={`relative h-28 md:h-36 w-36 md:w-full shrink-0 border cursor-pointer transition-all duration-150 group overflow-hidden rounded-lg ${
                    isActive
                      ? "border-zinc-950 ring-1 ring-zinc-950/20 shadow-xs bg-white"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  {/* Thumbnail Scaled View */}
                  <div
                    className={`absolute inset-0 origin-top-left scale-[0.08] md:scale-[0.14] w-[210mm] h-[297mm] transition-opacity duration-150 pointer-events-none ${
                      isActive ? "opacity-100" : "opacity-45 group-hover:opacity-75"
                    }`}
                  >
                    <MiniPreview />
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center pointer-events-none z-10">
                    {isSaved ? (
                      <span className="px-1.5 py-0.5 bg-teal-600 text-white text-[9px] font-mono font-medium uppercase tracking-wider rounded-sm shadow-xs">
                        Active
                      </span>
                    ) : (
                      <span />
                    )}

                    {isActive && !isSaved && (
                      <span className="px-1.5 py-0.5 bg-white/95 backdrop-blur-xs text-zinc-800 border border-zinc-200 text-[9px] font-mono font-medium uppercase rounded-sm shadow-2xs">
                        Previewing
                      </span>
                    )}
                  </div>

                  {/* Bottom Control Bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 py-1.5 px-3 border-t flex items-center justify-between transition-colors z-10 ${
                      isActive
                        ? "bg-zinc-950 border-zinc-950 text-white"
                        : "bg-white border-zinc-100 text-zinc-700 group-hover:text-zinc-950"
                    }`}
                  >
                    <span className="text-[11px] font-mono font-medium capitalize truncate">
                      {Id}
                    </span>

                    {isActive && (
                      <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard Helper Footer */}
        <div className="hidden md:flex items-center justify-between px-3 py-2 border-t border-zinc-100 bg-zinc-50/50 text-[10px] text-zinc-400 font-mono shrink-0">
          <span>NAVIGATE:</span>
          <span className="bg-white px-2 py-0.5 border border-zinc-200 text-zinc-600 rounded-sm">
            ↑ ↓ ← → ARROWS
          </span>
        </div>
      </aside>

      {/* --- CANVAS PREVIEW AREA --- */}
      <main className="flex-1 border border-zinc-200 bg-white flex flex-col relative rounded-xl shadow-xs min-h-0 overflow-hidden">
        
        {/* Control Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-200 bg-white gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <Eye className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider hidden sm:inline">
              Layout:
            </span>
            <span className="font-mono text-xs font-semibold text-zinc-950 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-md capitalize">
              {ActiveComponent}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
              {Math.round(scale * 100)}%
            </span>

            <button
              type="button"
              onClick={() => handleSelectTemplate(ActiveComponent)}
              className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer shadow-xs ${
                selectedTemplate === ActiveComponent
                  ? "bg-teal-50 text-teal-800 border border-teal-200 cursor-default"
                  : "bg-zinc-950 text-white hover:bg-zinc-800"
              }`}
            >
              {selectedTemplate === ActiveComponent ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-700" />
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
        </div>

        {/* Scrollable Canvas Area (Allows vertical scroll on mobile, perfect-fit centered on desktop) */}
        <div
          ref={canvasRef}
          className="flex-1 w-full h-full p-2 sm:p-6 flex justify-center items-start md:items-center bg-zinc-50/70 overflow-y-auto md:overflow-hidden select-text"
        >
          {/* Dimension wrapper matches exact scaled box size to prevent layout shifts/cropping */}
          <div
            className="relative shrink-0 my-auto"
            style={{
              width: `${a4Width * scale}px`,
              height: `${a4Height * scale}px`,
            }}
          >
            <div
              className="bg-white shadow-xl rounded-sm border border-zinc-200/80 overflow-hidden transform-gpu origin-top-left transition-transform duration-100 ease-out absolute top-0 left-0"
              style={{
                width: `${a4Width}px`,
                height: `${a4Height}px`,
                transform: `scale(${scale})`,
              }}
            >
              <TempFinal />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}