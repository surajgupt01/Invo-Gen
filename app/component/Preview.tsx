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
import {
  Loader2,
  FileText,
  Monitor,
  AlertCircle,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

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
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

export default function Preview() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<"FREE" | "PRO">("FREE");
  const [downloadsUsed, setDownloadsUsed] = useState<number>(0);

  const isMobile = useIsMobile();

  const session = authClient.useSession();
  const userID = session.data?.user?.id;

  // Selected Template
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

  // Fetch plan & download quota telemetry
  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const res = await fetch("/api/settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const dbUser = data?.user || {};
          if (dbUser.plan) setUserPlan(dbUser.plan);
          if (typeof dbUser.downloads === "number") setDownloadsUsed(dbUser.downloads);
        }
      } catch (err) {
        console.error("Failed to load user quota telemetry:", err);
      }
    }
    fetchTelemetry();
  }, []);

  const isPro = userPlan === "PRO";
  const MONTHLY_LIMIT = 5;
  const downloadsRemaining = Math.max(0, MONTHLY_LIMIT - downloadsUsed);

  // Structured payload matching InvoicePdfData
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
    ]
  );

  const viewerPdfData = useDebouncedValue(pdfData, 600);

  const invoiceDocument = useMemo(
    () => (
      <InvoicePdfDocument data={pdfData} templateName={activeTemplateName} />
    ),
    [pdfData, activeTemplateName]
  );

  const viewerDocument = useMemo(
    () => (
      <InvoicePdfDocument
        data={viewerPdfData}
        templateName={activeTemplateName}
      />
    ),
    [viewerPdfData, activeTemplateName]
  );

  async function handleDownload() {
    setErrorMessage(null);

    if (!isPro && downloadsUsed >= MONTHLY_LIMIT) {
      setErrorMessage("Monthly download quota (5/month) reached. Upgrade to Pro for unlimited exports.");
      return;
    }

    try {
      setLoading(true);

      // 1. Generate client-side PDF Blob
      const blob = await pdf(invoiceDocument).toBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `Invoice-${Details.InvoiceNo || "Draft"}.pdf`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 300);

      // 2. Persist invoice record / increment downloads in DB
      let computedTax = 0;
      if (mode === "india") {
        if (txnType === "intra") computedTax = totalCgst + totalSgst;
        else if (txnType === "inter") computedTax = totalIgst;
      } else {
        computedTax = totalTax;
      }

      await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: Details.InvoiceNo ? `INV-${Details.InvoiceNo}` : `INV-${Date.now()}`,
          CustomerName: Details.CustomerName || null,
          CustomerEmail: Details.CustomerEmail || null,
          CustomerAddress: Details.CustomerAddress || null,
          Subject: Details.Subject || null,
          IssueDate: Details.IssueDate ? new Date(Details.IssueDate).toISOString() : new Date().toISOString(),
          DueDate: Details.DueDate ? new Date(Details.DueDate).toISOString() : new Date().toISOString(),
          Currency: currency?.code || "INR",
          subtotal: subTotal || 0,
          tax: computedTax || 0,
          discount: 0.0,
          total: Total || 0,
          paymentStatus: "PENDING",
          userId: userID,
        }),
      });

      if (!isPro) {
        setDownloadsUsed((prev) => prev + 1);
      }
    } catch (err: unknown) {
      console.error("[DOWNLOAD_FAILED]:", err);
      const message = err instanceof Error ? err.message : "Failed to download PDF";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full w-full bg-[#FAFAFA] flex flex-col items-center p-2.5 space-y-2.5 font-mono select-none">
      {/* Top Header Bar */}
      <div className="w-full bg-white border border-zinc-200/80 p-2.5 px-4 flex flex-wrap justify-between items-center rounded-xs shadow-xs font-sans gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full bg-teal-600 opacity-75 rounded-full" />
            <span className="relative inline-flex h-2 w-2 bg-teal-600 rounded-full" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
            {isMobile ? "Document Ready" : "Live PDF Preview"}
          </span>

          <span className="text-[9px] text-zinc-500 font-mono bg-zinc-100 px-2 py-0.5 border border-zinc-200 uppercase rounded-2xs">
            {activeTemplateName}
          </span>
        </div>

        {/* Quota Telemetry & Action Buttons */}
        <div className="flex items-center gap-2.5 font-mono">
          {isPro ? (
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded-2xs font-bold">
              <Zap className="w-3 h-3 text-teal-600" />
              <span>PRO UNLIMITED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] bg-zinc-100 border border-zinc-200 px-2 py-1 rounded-2xs text-zinc-600">
              <span>QUOTA:</span>
              <span className={`font-bold ${downloadsRemaining === 0 ? "text-red-600" : "text-zinc-900"}`}>
                {downloadsUsed}/{MONTHLY_LIMIT}
              </span>
              <Link href="/dashboard/pricing" className="text-teal-700 font-bold hover:underline ml-1 flex items-center">
                Upgrade <ArrowUpRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={loading || (!isPro && downloadsRemaining === 0)}
            className="px-3.5 py-1.5 bg-zinc-950 hover:bg-black text-white text-[10px] font-mono font-bold uppercase tracking-wider transition rounded-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-teal-400" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download  />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert Bar */}
      {errorMessage && (
        <div className="w-full bg-red-50 border border-red-200 p-2.5 px-3 rounded-2xs flex items-center justify-between text-xs text-red-700 font-sans">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
          <Link href="/dashboard/pricing" className="font-bold underline text-red-800 shrink-0 font-mono text-[11px]">
            Upgrade Now →
          </Link>
        </div>
      )}

      {/* VIEWPORT AREA */}
      <div className="relative w-full flex-1 min-h-[70dvh] bg-white border border-zinc-200/80 rounded-xs shadow-xs overflow-hidden">
        {isMobile ? (
          /* Mobile Banner View */
          <div className="h-full min-h-[70dvh] flex flex-col items-center justify-center p-6 text-center bg-zinc-50/70 space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-2xs">
              <Monitor className="w-6 h-6 text-zinc-600" />
            </div>

            <div className="max-w-xs space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
                Mobile Preview Optimized
              </h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Refer to a desktop or computer browser for live inline PDF rendering.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={loading || (!isPro && downloadsRemaining === 0)}
              className="px-4 py-2 bg-zinc-950 hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider rounded-2xs flex items-center gap-2 shadow-sm transition disabled:opacity-40 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download />
                  <span>Download PDF Document</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Desktop React-PDF Blob Viewer */
          <BlobProvider document={viewerDocument}>
            {({ url, loading: previewLoading, error }) => {
              if (previewLoading) {
                return (
                  <div className="h-full min-h-[70dvh] flex flex-col items-center justify-center gap-2 text-xs text-zinc-500 font-mono bg-zinc-50/50">
                    <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                    <span>Rendering PDF document...</span>
                  </div>
                );
              }

              if (error || !url) {
                return (
                  <div className="h-full min-h-[70dvh] flex flex-col items-center justify-center p-6 text-center text-xs text-zinc-500 font-mono bg-zinc-50/50">
                    <FileText className="w-8 h-8 text-zinc-300 mb-2" />
                    <span className="font-semibold text-zinc-800">
                      Failed to render PDF preview.
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-1">
                      Click &quot;Download PDF&quot; above to export the document directly.
                    </span>
                  </div>
                );
              }

              const previewUrl = `${url}#toolbar=0&navpanes=0&zoom=50`;

              return (
                <iframe
                  title="Invoice PDF Preview"
                  src={previewUrl}
                  className="h-full min-h-[70dvh] w-full border-0 bg-zinc-100"
                />
              );
            }}
          </BlobProvider>
        )}
      </div>
    </div>
  );
}