"use client";

import { useItemsStore } from "../store/InvoiceTabel";
import { useCustomerStore } from "../store/CustomerDetail";
import { useOptionalData } from "../store/OptionalDataStore";
import { useOwner } from "../store/OwnerDetail";
import Image from "next/image";

/**
 * Circle Design Studio Template
 * A minimalist, elegant design centered around clean typography and white space.
 */

function fmtNum(n: string | number, locale: string): string {
  return parseFloat(String(n || "0")).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function TempDesign() {
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

  // Currency & Locale Setup
  const sym = mode === "india" ? "₹" : currency.symbol;
  const locale = mode === "india" ? "en-IN" : currency.locale;
  const fmt = (n: string | number) => fmtNum(n, locale);

  return (
    // MAIN CONTAINER: A4 Size with minimalist padding
    <div className="w-[210mm] min-h-[297mm] bg-white mx-auto flex flex-col p-[20mm] shadow-2xl print:shadow-none text-slate-800 font-sans">
      
      {/* 1. THE CIRCLE BRANDING (Centered Header) */}
      <header className="text-center mb-16">
        <div className="inline-block border-t border-b border-slate-300 px-10 py-6">
          <p className="italic text-[10px] text-slate-400 mb-1 italic tracking-widest font-serif">the</p>
          <h1 className="tracking-[0.4em] font-black text-2xl text-slate-900 uppercase">
            {OwnerDetails.CompanyName || "Circle"}
          </h1>
          <p className="text-[9px] tracking-[0.5em] mt-2 text-slate-400 font-medium uppercase">
            Design Studio
          </p>
        </div>
        
        {/* Company Identity Sub-text */}
        <div className="mt-6 text-[10px] text-slate-400 flex justify-center gap-6 uppercase tracking-widest">
           <span>{OwnerDetails.CompanyMail}</span>
           <span>•</span>
           <span>{OwnerDetails.PhNo}</span>
           {OwnerDetails.TaxDetail && (
             <>
               <span>•</span>
               <span className="text-slate-600 font-bold">GSTIN: {OwnerDetails.TaxDetail}</span>
             </>
           )}
        </div>
      </header>

      {/* 2. INFO GRID (Issue To & Meta) */}
      <section className="flex justify-between items-start mb-12">
        <div className="max-w-xs">
          <h3 className="uppercase tracking-[0.2em] text-[9px] font-bold text-slate-400 mb-3">Issued To:</h3>
          <p className="font-bold text-sm text-slate-900">{Details.CustomerName}</p>
          <p className="text-xs text-slate-500 whitespace-pre-line mt-1 leading-relaxed">
            {Details.CustomerAddress}
          </p>
        </div>

        <div className="text-right">
          <h3 className="uppercase tracking-[0.2em] text-[9px] font-bold text-slate-400 mb-3">Invoice Details:</h3>
          <p className="text-sm font-black text-teal-600">INV-{Details.InvoiceNo}</p>
          <div className="text-[10px] text-slate-500 mt-2 space-y-1">
            <p>Date: <span className="font-medium text-slate-800">{Details.IssueDate || "N/A"}</span></p>
            <p>Due: <span className="font-medium text-slate-800">{Details.DueDate}</span></p>
            <p className="uppercase tracking-tighter">Currency: {mode === "india" ? "INR" : currency.code}</p>
          </div>
        </div>
      </section>

      {/* 3. TABLE SECTION */}
      <section className="flex-grow mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="uppercase tracking-[0.2em] text-[9px] font-black text-slate-900 border-b border-slate-200">
              <th className="pb-4">Description</th>
              {mode === "india" && <th className="pb-4 text-center">HSN</th>}
              <th className="pb-4 text-center w-20">Qty</th>
              <th className="pb-4 text-right w-28">Rate</th>
              
              {/* Conditional Tax Headers */}
              {mode === "india" && txnType === "intra" && (
                <>
                  <th className="pb-4 text-right w-24">CGST</th>
                  <th className="pb-4 text-right w-24">SGST</th>
                </>
              )}
              {mode === "india" && txnType === "inter" && <th className="pb-4 text-right w-24">IGST</th>}
              {mode === "international" && <th className="pb-4 text-right w-24">{taxConfig.name || "Tax"}</th>}

              <th className="pb-4 text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {Items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-50 group transition-colors">
                <td className="py-5 pr-4 align-top">
                  <p className="font-bold text-slate-800">{item.description}</p>
                </td>
                {mode === "india" && <td className="py-5 text-center text-slate-400 font-mono italic">{item.hsn || "—"}</td>}
                <td className="py-5 text-center text-slate-500 font-medium italic">{item.qty}</td>
                <td className="py-5 text-right text-slate-500 font-mono">{sym}{fmt(item.rate)}</td>

                {/* Conditional Tax Cells */}
                {mode === "india" && txnType === "intra" && (
                  <>
                    <td className="py-5 text-right text-teal-600/70 font-mono">{sym}{fmt(item.cgst)}</td>
                    <td className="py-5 text-right text-teal-600/70 font-mono">{sym}{fmt(item.sgst)}</td>
                  </>
                )}
                {mode === "india" && txnType === "inter" && (
                  <td className="py-5 text-right text-blue-600 font-mono">{sym}{fmt(item.igst)}</td>
                )}
                {mode === "international" && (
                  <td className="py-5 text-right text-amber-600 font-mono">
                    {sym}{fmt(item.taxAmt)}
                  </td>
                )}

                <td className="py-5 text-right font-black text-slate-900">{sym}{fmt(item.amt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 4. TOTALS & SIGN-OFF */}
      <footer className="mt-auto break-inside-avoid">
        <div className="flex justify-end mb-12">
           <div className="w-72 space-y-3">
              <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
                 <span>Subtotal</span>
                 <span className="font-mono">{sym}{fmt(subTotal)}</span>
              </div>
              
              {/* Dynamic Tax Breakdown */}
              {mode === "india" && (
                <div className="space-y-1">
                  {txnType === "intra" ? (
                    <>
                      <div className="flex justify-between text-[10px] text-teal-600/70 italic">
                        <span>CGST Output</span>
                        <span>{sym}{fmt(totalCgst)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-teal-600/70 italic">
                        <span>SGST Output</span>
                        <span>{sym}{fmt(totalSgst)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-[10px] text-blue-600/70 italic">
                      <span>IGST Output</span>
                      <span>{sym}{fmt(totalIgst)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center py-4 border-t-2 border-slate-900 mt-4">
                 <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Amount Due</span>
                 <span className="text-2xl font-black font-mono tracking-tighter text-slate-900">
                   {sym}{fmt(Total)}
                 </span>
              </div>
           </div>
        </div>

        <div className="flex justify-between items-end border-t border-slate-100 pt-10">
          <div className="text-[10px] text-slate-400 space-y-4 max-w-sm">
            <div>
              <p className="uppercase tracking-[0.2em] font-bold text-slate-900 mb-2 underline decoration-teal-500 decoration-2">
                Bank Details
              </p>
              {OwnerDetails.paymentMethod === "Bank" ? (
                <div className="leading-relaxed">
                  <p><span className="font-bold text-slate-700">Bank:</span> {OwnerDetails.BankName}</p>
                  <p><span className="font-bold text-slate-700">Account:</span> {OwnerDetails.OwnerName}</p>
                  <p><span className="font-bold text-slate-700">No:</span> {OwnerDetails.AccountNumber} • {OwnerDetails.BankCode}</p>
                </div>
              ) : (
                <div className="flex items-center gap-4 mt-2">
                   {OwnerDetails.QR && <Image src={OwnerDetails.QR} alt="QR" width={60} height={60} className="border p-1 rounded" />}
                   <p className="font-bold text-teal-600 font-mono tracking-tight">{OwnerDetails.UPIID}</p>
                </div>
              )}
            </div>
            
            <div className="pt-2 italic">
               <p className="font-bold text-slate-900 not-italic uppercase tracking-widest text-[8px] mb-1">Notes & Terms</p>
               <p>{TermsConditions || "Please ensure payment by the due date."}</p>
               <p>{AdditionalInfo}</p>
            </div>
          </div>

          <div className="text-5xl font-extralight italic text-slate-200 tracking-tighter">
            Thank You
          </div>
        </div>
        
        {/* Page Footer */}
        <div className="mt-12 text-center text-[8px] text-slate-300 font-mono uppercase tracking-[0.4em]">
           System Generated Record • {OwnerDetails.CompanyName} Studio
        </div>
      </footer>
    </div>
  );
}