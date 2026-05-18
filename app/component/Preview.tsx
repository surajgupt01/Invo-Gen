"use client";

import Download from "../Icons/Download";
import Draft from "../Icons/Draft";
import Minus from "../Icons/Minus";
import Plus from "../Icons/Plus";
import { useInvoiceSelect } from "../store/InvoiceSelected";
import InvoicePreview from "./InvoicePreview";
import { useState } from "react";
import TempDesign from "@/app/component/ModernTemp";
import InvoicePreview2 from "@/app/component/Design2";
import InvoicePreview3 from "@/app/component/Design3";
import InvoicePreview4 from "@/app/component/Design4";
import InvoicePreview5 from "@/app/component/Design5";

export default function Preview() {
  const [loading, setLoading] = useState(false);

  const [scaler, setScale] = useState(0.7);

  const TemplateDesigns: Record<string, React.ComponentType> = {
    classic: InvoicePreview,
    modern: TempDesign,
    regular: InvoicePreview2,
    trendy: InvoicePreview3,
    sassy: InvoicePreview4,
    free: InvoicePreview5,
  };

  const { name } = useInvoiceSelect();

  const FinalDesign = TemplateDesigns[name] || TemplateDesigns.classic;

  async function handleDownload() {
    try {
      setLoading(true);

      const invoiceEl = document.getElementById("invoice");

      if (!invoiceEl) {
        alert("Invoice not found");
        return;
      }

      // ✅ Get computed styles and inline them
      const allStyles = Array.from(document.styleSheets)
        .flatMap((sheet) => {
          try {
            return Array.from(sheet.cssRules).map((rule) => rule.cssText);
          } catch {
            return [];
          }
        })
        .join("\n");

      const invoiceHTML = invoiceEl.outerHTML;

      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: invoiceHTML, styles: allStyles }), // ✅ send styles too
      });

      if (!res.ok) {
        const errText = await res.text();

        console.error("SERVER ERROR:", errText);

        alert(errText || "Failed to generate PDF");

        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice1.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" h-full  bg-neutral-950 flex flex-col items-center py-2 ">
      {/* <div className=" font-semibold w-full  border-gray-900 text-gray-500 tracking-wider p-4">Preview</div> */}

      <div className="w-full text-xs flex justify-between gap-2 p-4">
        <div className="bg-green-800 flex justify-center items-center gap-0.5 text-green-500 px-3 py-1 text-sm rounded-md">
          <div className="w-1 h-1 rounded-full bg-green-500"></div>
          {"Live"}
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-2 py-1 bg-teal-600 rounded-md  hover:bg-teal-700 flex items-center gap-1 disabled:opacity-60 text-neutral-200 cursor-pointer"
          >
            <Download />
            {loading ? "Generating..." : "Download"}
          </button>

          <button className="px-2 bg-gray-300 py-1 border border-gray-900 rounded-md hover:bg-gray-200 flex items-center gap-1">
            <Draft />
            Save as Draft
          </button>
        </div>
      </div>
      <div className="relative lg:bg-zinc-900 w-[95%] flex-1  rounded-sm border border-neutral-900 lg:overflow-auto flex justify-center custom-scrollbar">
        {/* centering wrapper */}
        <div className="flex  lg:items-start min-h-full lg:py-5   lg:overflow-auto custom-scrollbar">
          {/* scale wrapper */}
          <div
            style={{
              transform: window.innerWidth >= 800 ? `scale(${scaler})` : ``,
              transformOrigin: "top center",
            }}
            className="transition-transform duration-200 scale-48"
          >
            {/* real invoice size */}
            <div
              id="invoice"
              className="w-[794px] h-[1123px] bg-white shadow-lg"
            >
              {/* <InvoicePreview /> */}

              <FinalDesign />
            </div>
          </div>
        </div>

        {/* zoom controls */}
        <div className="flex flex-col bg-gray-200 justify-center items-center w-10 py-2 rounded-sm gap-4 fixed bottom-15 right-8  ">
          <button
            onClick={() => setScale((e) => (e >= 1.5 ? e : e + 0.1))}
            className="active:scale-80 hover:text-gray-700"
          >
            <Plus />
          </button>

          <button
            onClick={() => setScale((e) => (e <= 0.3 ? e : e - 0.1))}
            className="active:scale-80 hover:text-gray-700"
          >
            <Minus />
          </button>
        </div>
      </div>
    </div>
  );
}
