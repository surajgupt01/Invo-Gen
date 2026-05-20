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

  const { name } = useInvoiceSelect();
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
    () => <InvoicePdfDocument data={pdfData} templateName={name} />,
    [pdfData, name]
  );

  const viewerDocument = useMemo(
    () => <InvoicePdfDocument data={viewerPdfData} templateName={name} />,
    [viewerPdfData, name]
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
      <div className="relative lg:bg-zinc-900 w-[95%] flex-1 min-h-[70dvh] rounded-sm border border-neutral-900 overflow-hidden">
        {isMobile ? (
          <BlobProvider document={viewerDocument}>
            {({ url, loading: previewLoading, error }) => {
              if (previewLoading) {
                return (
                  <div className="h-full min-h-[70dvh] flex items-center justify-center text-sm text-neutral-400">
                    Generating preview...
                  </div>
                );
              }

              if (error || !url) {
                return (
                  <div className="h-full min-h-[70dvh] flex items-center justify-center p-4 text-center text-sm text-neutral-400">
                    PDF preview is not available on this device. Use Download to save it.
                  </div>
                );
              }

              return (
                <div className="relative h-full min-h-[70dvh] bg-neutral-900">
                  <iframe
                    title="Invoice PDF preview"
                    src={url}
                    className="h-full min-h-[70dvh] w-full border-0 bg-white"
                  />
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 rounded-md bg-teal-600 px-3 py-2 text-xs font-medium text-white shadow-lg"
                  >
                    Open PDF
                  </a>
                </div>
              );
            }}
          </BlobProvider>
        ) : (
          <PDFViewer showToolbar className="w-full h-full border-0">
            {viewerDocument}
          </PDFViewer>
        )}
      </div>
    </div>
  );
}
