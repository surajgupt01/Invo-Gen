"use client";

import { BlobProvider, PDFViewer, pdf } from "@react-pdf/renderer";
import { useEffect, useMemo, useState } from "react";
import Download from "../Icons/Download";
import Draft from "../Icons/Draft";
import { useCustomerStore } from "../store/CustomerDetail";
import { useInvoiceSelect } from "../store/InvoiceSelected";
import { useItemsStore } from "../store/InvoiceTabel";
import { useOptionalData } from "../store/OptionalDataStore";
import { useOwner } from "../store/OwnerDetail";
import InvoicePdfDocument, { type InvoicePdfData } from "./InvoicePdfDocument";
import { Loader2, FileText, ExternalLink } from "lucide-react";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

export default function Preview() {
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  // 🔑 FIXED: Safely destructure selectedTemplate (or fall back to 'name' or 'classic')
  const invoiceSelectStore = useInvoiceSelect() as {
    selectedTemplate?: string;
    name?: string;
  };
  const activeTemplateName =
    invoiceSelectStore.selectedTemplate || invoiceSelectStore.name || "classic";

  const {
    Items,
    Total,
    subTotal,
    totalCgst,
    totalSgst,
    totalIgst,
    totalTax,
    mode,
    txnType,
    taxConfig,
    currency,
  } = useItemsStore();

  const { Details } = useCustomerStore();
  const { AdditionalInfo, TermsConditions } = useOptionalData();
  const { OwnerDetails } = useOwner();

  const pdfData = useMemo<InvoicePdfData>(
    () => ({
      items: Items,
      total: Total,
      subTotal,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      mode,
      txnType,
      taxConfig,
      currency,
      details: Details,
      ownerDetails: OwnerDetails,
      additionalInfo: AdditionalInfo,
      termsConditions: TermsConditions,
    }),
    [
      Items,
      Total,
      subTotal,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      mode,
      txnType,
      taxConfig,
      currency,
      Details,
      OwnerDetails,
      AdditionalInfo,
      TermsConditions,
    ]
  );

  const viewerPdfData = useDebouncedValue(pdfData, 600);

  const invoiceDocument = useMemo(
    () => <InvoicePdfDocument data={pdfData} templateName={activeTemplateName} />,
    [pdfData, activeTemplateName]
  );

  const viewerDocument = useMemo(
    () => <InvoicePdfDocument data={viewerPdfData} templateName={activeTemplateName} />,
    [viewerPdfData, activeTemplateName]
  );

  async function handleDownload() {
    try {
      setLoading(true);

      const blob = await pdf(invoiceDocument).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${Details.InvoiceNo || "draft"}.pdf`;
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
    <div className="h-full w-full bg-[#090909] flex flex-col items-center p-2 space-y-2 font-mono select-none">
      
      {/* --- TOP CONTROL BAR --- */}
      <div className="w-full bg-[#121212] border border-neutral-800 p-2.5 px-4 flex justify-between items-center rounded-none font-sans">
        
        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#00D2B5] opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-[#00D2B5]" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-white">
            Live Telemetry Preview
          </span>
          <span className="text-[9px] text-neutral-400 font-mono bg-[#090909] px-2 py-0.5 border border-neutral-800 uppercase hidden sm:inline-block">
            LAYOUT: {activeTemplateName}
          </span>
        </div>

        {/* Download & Draft Actions */}
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-3 py-1.5 bg-[#00D2B5] text-[#090909] font-bold text-xs uppercase tracking-wider hover:bg-[#00b89f] transition rounded-none flex items-center gap-1.5 disabled:opacity-50 font-sans shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download />
                Download PDF
              </>
            )}
          </button>

          <button className="px-3 py-1.5 bg-[#181818] border border-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition rounded-none flex items-center gap-1.5 font-sans">
            <Draft />
            Save Draft
          </button>
        </div>
      </div>

      {/* --- PDF VIEWPORT --- */}
      <div className="relative w-full flex-1 min-h-[70dvh] bg-[#121212] border border-neutral-800 rounded-none overflow-hidden">
        {isMobile ? (
          <BlobProvider document={viewerDocument}>
            {({ url, loading: previewLoading, error }) => {
              if (previewLoading) {
                return (
                  <div className="h-full min-h-[70dvh] flex flex-col items-center justify-center gap-2 text-xs text-neutral-400 font-mono">
                    <Loader2 className="w-5 h-5 text-[#00D2B5] animate-spin" />
                    <span>Rendering mobile PDF document...</span>
                  </div>
                );
              }

              if (error || !url) {
                return (
                  <div className="h-full min-h-[70dvh] flex flex-col items-center justify-center p-6 text-center text-xs text-neutral-400 font-mono">
                    <FileText className="w-8 h-8 text-neutral-600 mb-2" />
                    <span>Inline PDF preview is limited on this mobile browser.</span>
                    <span className="text-[10px] text-neutral-500 mt-1">
                     {` Use the "Download PDF" button above to view your document.`}
                    </span>
                  </div>
                );
              }

              return (
                <div className="relative h-full min-h-[70dvh] bg-[#090909]">
                  <iframe
                    title="Invoice PDF preview"
                    src={url}
                    className="h-full min-h-[70dvh] w-full border-0 bg-white"
                  />
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 bg-[#00D2B5] text-[#090909] px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg font-sans"
                  >
                    Open PDF
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            }}
          </BlobProvider>
        ) : (
          <PDFViewer showToolbar className="w-full h-full border-0 rounded-none">
            {viewerDocument}
          </PDFViewer>
        )}
      </div>

    </div>
  );
}