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
  Eye,
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

function sanitizeFileName(name?: string | null): string {
  if (!name) return `INV-${Date.now()}`;
  return name.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 50);
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
      const safeNumber = sanitizeFileName(Details.InvoiceNo);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `Invoice-${safeNumber}.pdf`;
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
          invoiceNumber: Details.InvoiceNo ? `INV-${safeNumber}` : `INV-${Date.now()}`,
          CustomerName: Details.CustomerName?.trim() || null,
          CustomerEmail: Details.CustomerEmail?.trim() || null,
          CustomerAddress: Details.CustomerAddress?.trim() || null,
          Subject: Details.Subject?.trim() || null,
          IssueDate: Details.IssueDate ? new Date(Details.IssueDate).toISOString() : new Date().toISOString(),
          DueDate: Details.DueDate ? new Date(Details.DueDate).toISOString() : new Date().toISOString(),
          Currency: currency?.code || "INR",
          subtotal: Number(subTotal) || 0,
          tax: Number(computedTax) || 0,
          discount: 0.0,
          total: Number(Total) || 0,
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
    <div className="h-full w-full bg-white flex flex-col items-center p-3 sm:p-4 space-y-3 font-sans select-none overflow-hidden">
      
      {/* Top Header Card */}
      <div className="w-full bg-white border border-zinc-200 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between rounded-xl shadow-xs gap-3 shrink-0">
        
        {/* Status Indicator */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full bg-teal-500 opacity-75 rounded-full" />
              <span className="relative inline-flex h-2 w-2 bg-teal-600 rounded-full" />
            </span>
            <span className="text-xs font-semibold tracking-tight text-zinc-950 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span>Live PDF Preview</span>
            </span>
          </div>

          <span className="text-[10px] font-mono font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 border border-zinc-200 uppercase rounded-sm">
            {activeTemplateName}
          </span>
        </div>

        {/* Quota Telemetry & Action Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 font-mono w-full sm:w-auto">
          {isPro ? (
            <div className="flex items-center gap-1 text-[10px] text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md font-semibold">
              <Zap className="w-3 h-3 text-teal-600" />
              <span>PRO UNLIMITED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-md text-zinc-600">
              <span className="text-[9px] uppercase text-zinc-400">Quota:</span>
              <span className={`font-semibold ${downloadsRemaining === 0 ? "text-rose-600" : "text-zinc-950"}`}>
                {downloadsUsed}/{MONTHLY_LIMIT}
              </span>
              <span className="text-zinc-400 font-sans">({downloadsRemaining} left)</span>
              <Link href="/dashboard/pricing" className="text-teal-700 font-semibold hover:underline ml-1 inline-flex items-center">
                Upgrade <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={loading || (!isPro && downloadsRemaining === 0)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-sans font-medium transition-colors rounded-md flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-xs shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert Bar */}
      {errorMessage && (
        <div className="w-full bg-rose-50 border border-rose-200 p-3 px-4 rounded-xl flex items-center justify-between text-xs text-rose-800 font-sans shadow-2xs shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="line-clamp-1 sm:line-clamp-none">{errorMessage}</span>
          </div>
          <Link href="/dashboard/pricing" className="font-semibold underline text-rose-900 shrink-0 font-mono text-[11px]">
            Upgrade Now →
          </Link>
        </div>
      )}

      {/* VIEWPORT AREA */}
      <div className="relative w-full flex-1 min-h-[68dvh] bg-zinc-50 border border-zinc-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
        {isMobile ? (
          /* Mobile View */
          <div className="h-full min-h-[68dvh] flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-2xs">
              <Monitor className="w-6 h-6 text-zinc-700" />
            </div>

            <div className="max-w-xs space-y-1.5">
              <h3 className="text-sm font-semibold tracking-tight text-zinc-950">
                Mobile Preview Optimized
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Refer to a desktop browser for live interactive PDF page previews, or export your document directly below.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={loading || (!isPro && downloadsRemaining === 0)}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium rounded-md flex items-center gap-2 shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
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
          /* Desktop React-PDF Blob Viewer (Unsandboxed to prevent Chrome blocks) */
          <BlobProvider document={viewerDocument}>
            {({ url, loading: previewLoading, error }) => {
              if (previewLoading) {
                return (
                  <div className="h-full min-h-[68dvh] flex flex-col items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
                    <Loader2 className="w-5 h-5 text-zinc-950 animate-spin" />
                    <span>Rendering PDF document...</span>
                  </div>
                );
              }

              if (error || !url) {
                return (
                  <div className="h-full min-h-[68dvh] flex flex-col items-center justify-center p-6 text-center text-xs text-zinc-500 font-sans space-y-2">
                    <FileText className="w-8 h-8 text-zinc-300 mb-1 mx-auto" />
                    <span className="font-semibold text-zinc-950 block">
                      Failed to render PDF preview.
                    </span>
                    <span className="text-xs text-zinc-400">
                      Click &quot;Download PDF&quot; above to export the document directly.
                    </span>
                  </div>
                );
              }

              const previewUrl = `${url}#toolbar=0&navpanes=0&zoom=45`;

              return (
                <iframe
                  title="Invoice PDF Preview"
                  src={previewUrl}
                  className="h-full min-h-[68dvh] w-full border-0 bg-white"
                />
              );
            }}
          </BlobProvider>
        )}
      </div>

    </div>
  );
}