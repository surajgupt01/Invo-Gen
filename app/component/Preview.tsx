"use client";

import { BlobProvider, pdf } from "@react-pdf/renderer";
import { useEffect, useMemo, useState } from "react";
import Download from "../Icons/Download";
import { useCustomerStore } from "../store/CustomerDetail";
import { useInvoiceSelect } from "../store/InvoiceSelected";
import { useItemsStore } from "../store/InvoiceTabel";
import { useOptionalData } from "../store/OptionalDataStore";
import { useOwner } from "../store/OwnerDetail";
import InvoicePdfDocument, { type InvoicePdfData } from "./InvoicePdfDocument";
import { Loader2, FileText, ExternalLink } from "lucide-react";
import { authClient } from "@/lib/auth-client";

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

  // Safely destructure selectedTemplate (or fall back to 'name' or 'classic')
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

  // Matched to the exact nested shape required by InvoicePdfData
  const pdfData = useMemo<InvoicePdfData>(
    () => ({
      owner: OwnerDetails,
      customer: Details,
      optional: {
        additionalInfo: AdditionalInfo,
        termsConditions: TermsConditions,
      },
      items: Items,
      config: {
        mode,
        txnType,
        currency,
        taxConfig,
      },
      totals: {
        subTotal,
        totalCgst,
        totalSgst,
        totalIgst,
        totalTax,
        Total,
      },
    }),
    [
      OwnerDetails,
      Details,
      AdditionalInfo,
      TermsConditions,
      Items,
      mode,
      txnType,
      currency,
      taxConfig,
      subTotal,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      Total,
    ],
  );

  const userID = authClient.useSession().data?.user.id;

  const viewerPdfData = useDebouncedValue(pdfData, 600);

  const invoiceDocument = useMemo(
    () => (
      <InvoicePdfDocument data={pdfData} templateName={activeTemplateName} />
    ),
    [pdfData, activeTemplateName],
  );

  const viewerDocument = useMemo(
    () => (
      <InvoicePdfDocument
        data={viewerPdfData}
        templateName={activeTemplateName}
      />
    ),
    [viewerPdfData, activeTemplateName],
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

      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CustomerName: Details.CustomerName,
          CustomerAddress: Details.CustomerAddress,
          DueDate: Details.DueDate,
          IssueDate: Details.IssueDate,
          Currency: currency,

          subtotal: subTotal,
          tax: totalTax,
          total: pdfData.totals.Total,

          paymentStatus: false,
          Subject: Details.Subject,

          userId: userID,
        }),
      });

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
    }  finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full w-full bg-[#FAFAFA] flex flex-col items-center p-2.5 space-y-2.5 font-mono select-none">
      {/* --- TOP CONTROL BAR --- */}
      <div className="w-full bg-white border border-zinc-200/80 p-2.5 px-4 flex justify-between items-center rounded-xs shadow-xs font-sans">
        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full bg-teal-600 opacity-75 rounded-full" />
            <span className="relative inline-flex h-2 w-2 bg-teal-600 rounded-full" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
            Live Preview
          </span>
          <span className="text-[9px] text-zinc-500 font-mono bg-zinc-100 px-2 py-0.5 border border-zinc-200 uppercase hidden sm:inline-block rounded-2xs">
            LAYOUT: {activeTemplateName}
          </span>
        </div>

        {/* Download & Draft Actions */}
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-3.5 py-1.5 bg-zinc-900 text-white text-[9px] font-semibold uppercase tracking-wider hover:bg-zinc-700 active:scale-95 transition rounded-sm flex items-center gap-1.5 disabled:opacity-50 font-sans shadow-xs cursor-pointer"
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
        </div>
      </div>

      {/* --- PDF VIEWPORT --- */}
      <div className="relative w-full flex-1 min-h-[70dvh] bg-white border border-zinc-200/80 rounded-xs shadow-xs overflow-hidden">
        <BlobProvider document={viewerDocument}>
          {({ url, loading: previewLoading, error }) => {
            if (previewLoading) {
              return (
                <div className="h-full min-h-[70dvh] flex flex-col items-center justify-center gap-2 text-xs text-zinc-500 font-mono bg-zinc-50/50">
                  <Loader2 className="w-5 h-5 text-teal-700 animate-spin" />
                  <span>
                    {isMobile
                      ? "Rendering mobile PDF document..."
                      : "Rendering PDF preview..."}
                  </span>
                </div>
              );
            }

            if (error || !url) {
              return (
                <div className="h-full min-h-[70dvh] flex flex-col items-center justify-center p-6 text-center text-xs text-zinc-500 font-mono bg-zinc-50/50">
                  <FileText className="w-8 h-8 text-zinc-300 mb-2" />
                  <span className="font-semibold text-zinc-800">
                    Inline PDF preview is limited on mobile browsers.
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-1">
                    {`Use the "Download PDF" button above to view your document.`}
                  </span>
                </div>
              );
            }

            // Append parameters to suppress browser toolbar and force 47% default zoom
            const previewUrl = `${url}#toolbar=0&navpanes=0&zoom=50`;

            return (
              <div className="relative h-full min-h-[70dvh] bg-zinc-100">
                <iframe
                  title="Invoice PDF preview"
                  src={previewUrl}
                  className="h-full min-h-[70dvh] w-full border-0 bg-zinc-100"
                />
                {isMobile && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 bg-zinc-900 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md font-sans rounded-xs"
                  >
                    Open PDF
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            );
          }}
        </BlobProvider>
      </div>
    </div>
  );
}