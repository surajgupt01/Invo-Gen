"use client";

import Image from "next/image";
import { sampleInvoiceData } from "./sampleInvoiceData";

/**
 * Circle Design Studio Template
 * Minimalist, high-editorial layout with refined typography, balanced margins, and A4 print precision.
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
    Details,
    AdditionalInfo,
    TermsConditions,
    OwnerDetails,
  } = sampleInvoiceData;

  // Currency & Locale Setup
  const sym = mode === "india" ? "₹" : currency.symbol;
  const locale = mode === "india" ? "en-IN" : currency.locale;
  const fmt = (n: string | number) => fmtNum(n, locale);

  return (
    // MAIN CONTAINER: Fixed A4 Dimensions
    <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white mx-auto flex flex-col justify-between px-10 py-8 shadow-2xl print:shadow-none text-slate-800 font-sans border border-slate-100 print:border-none print:h-auto select-none overflow-hidden">
      
      {/* TOP SECTION */}
      <div>
        {/* 1. CENTERED EDITORIAL HEADER */}
        <header className="text-center mb-8 pb-6 border-b border-slate-200/80">
          <div className="inline-block border-y border-slate-300/80 px-8 py-3.5 my-1">
            {/* <p className="italic text-[10px] text-slate-400 font-serif tracking-widest mb-0.5">the</p> */}
            <h1 className="tracking-[0.35em] font-black text-xl text-slate-900 uppercase font-sans">
              {OwnerDetails.CompanyName || "Circle"}
            </h1>
            {/* <p className="text-[8px] tracking-[0.45em] mt-1 text-slate-400 font-bold uppercase font-mono">
              Design Studio
            </p> */}
          </div>
          
          {/* Company Contact Sub-header */}
          <div className="mt-3 text-[10px] text-slate-400 flex justify-center items-center gap-4 uppercase font-mono tracking-wider">
            <span>{OwnerDetails.CompanyMail}</span>
            <span>•</span>
            <span>{OwnerDetails.PhNo}</span>
            {OwnerDetails.TaxDetail && (
              <>
                <span>•</span>
                <span className="text-slate-700 font-bold">GSTIN: {OwnerDetails.TaxDetail}</span>
              </>
            )}
          </div>
        </header>

        {/* 2. INFO GRID (Issued To & Invoice Details) */}
        <section className="grid grid-cols-12 gap-6 mb-6 pb-6 border-b border-slate-100">
          <div className="col-span-7">
            <h3 className="uppercase tracking-[0.2em] text-[9px] font-bold text-slate-400 mb-2 font-mono">
              Issued To:
            </h3>
            <p className="font-bold text-sm text-slate-900 leading-tight">{Details.CustomerName}</p>
            <p className="text-xs text-slate-500 whitespace-pre-line mt-1 leading-relaxed max-w-sm">
              {Details.CustomerAddress}
            </p>
          </div>

          <div className="col-span-5 text-right flex flex-col justify-start items-end">
            <h3 className="uppercase tracking-[0.2em] text-[9px] font-bold text-slate-400 mb-2 font-mono">
              Invoice Details:
            </h3>
            <p className="text-base font-black font-mono text-teal-800">#{Details.InvoiceNo}</p>
            <div className="text-[11px] text-slate-500 mt-1.5 space-y-0.5 font-sans">
              <p>Date: <span className="font-semibold text-slate-800 font-mono">{Details.IssueDate || "N/A"}</span></p>
              <p>Due: <span className="font-semibold text-slate-800 font-mono">{Details.DueDate}</span></p>
              <p className="uppercase text-[9px] text-slate-400 font-mono pt-0.5">
                Currency: {mode === "india" ? "INR" : currency.code}
              </p>
            </div>
          </div>
        </section>

        {/* 3. TABLE SECTION */}
        <section className="border border-slate-200/80 rounded-lg overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[9px] uppercase font-bold tracking-wider font-mono print:bg-slate-900 print:color-adjust-exact">
                <th className="py-2.5 px-3">Description</th>
                {mode === "india" && <th className="py-2.5 px-2 text-center">HSN/SAC</th>}
                <th className="py-2.5 px-2 text-center w-16">Qty</th>
                <th className="py-2.5 px-2 text-right w-24">Rate</th>
                
                {/* Conditional Tax Headers */}
                {mode === "india" && txnType === "intra" && (
                  <>
                    <th className="py-2.5 px-2 text-right w-20">CGST</th>
                    <th className="py-2.5 px-2 text-right w-20">SGST</th>
                  </>
                )}
                {mode === "india" && txnType === "inter" && <th className="py-2.5 px-2 text-right w-24">IGST</th>}
                {mode === "international" && <th className="py-2.5 px-2 text-right w-24">{taxConfig.name || "Tax"}</th>}

                <th className="py-2.5 px-3 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {Items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-800">{item.description}</p>
                    {Details.Subject && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{Details.Subject}</p>
                    )}
                  </td>
                  {mode === "india" && (
                    <td className="py-3 px-2 text-center text-slate-400 font-mono text-[11px]">
                      {item.hsn || "—"}
                    </td>
                  )}
                  <td className="py-3 px-2 text-center font-medium text-slate-700">
                    {item.qty} <span className="text-[9px] text-slate-400 uppercase font-mono">{item.unit}</span>
                  </td>
                  <td className="py-3 px-2 text-right text-slate-600 font-mono tabular-nums">
                    {sym}{fmt(item.rate)}
                  </td>

                  {/* Conditional Tax Cells */}
                  {mode === "india" && txnType === "intra" && (
                    <>
                      <td className="py-3 px-2 text-right font-mono text-teal-800 tabular-nums">{sym}{fmt(item.cgst)}</td>
                      <td className="py-3 px-2 text-right font-mono text-teal-800 tabular-nums">{sym}{fmt(item.sgst)}</td>
                    </>
                  )}
                  {mode === "india" && txnType === "inter" && (
                    <td className="py-3 px-2 text-right font-mono text-indigo-700 tabular-nums">{sym}{fmt(item.igst)}</td>
                  )}
                  {mode === "international" && (
                    <td className="py-3 px-2 text-right font-mono text-slate-600 tabular-nums">
                      {sym}{fmt(item.taxAmt)}
                    </td>
                  )}

                  <td className="py-3 px-3 text-right font-black text-slate-900 font-mono tabular-nums">
                    {sym}{fmt(item.amt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* BOTTOM SECTION: TOTALS & SIGN-OFF */}
      <footer className="pt-4">
        {/* TOTALS SUMMARY BLOCK */}
        <div className="flex justify-end mb-6 pb-4 border-b border-slate-100">
          <div className="w-72 bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-slate-800">{sym}{fmt(subTotal)}</span>
            </div>
            
            {/* Dynamic Tax Breakdown */}
            {mode === "india" && (
              <div className="space-y-1 text-[11px] pt-1 border-t border-slate-200/60">
                {txnType === "intra" ? (
                  <>
                    <div className="flex justify-between text-teal-800">
                      <span>CGST Total</span>
                      <span className="font-mono tabular-nums">{sym}{fmt(totalCgst)}</span>
                    </div>
                    <div className="flex justify-between text-teal-800">
                      <span>SGST Total</span>
                      <span className="font-mono tabular-nums">{sym}{fmt(totalSgst)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-indigo-700">
                    <span>IGST Total</span>
                    <span className="font-mono tabular-nums">{sym}{fmt(totalIgst)}</span>
                  </div>
                )}
              </div>
            )}

            {mode === "international" && (
              <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                <span>{taxConfig.name || "Tax"} ({taxConfig.rate}%)</span>
                <span className="font-mono tabular-nums">{sym}{fmt(totalTax)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2.5 mt-1 border-t-2 border-slate-900">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">Amount Due</span>
              <span className="text-xl font-black font-mono tracking-tight text-slate-900 tabular-nums">
                {sym}{fmt(Total)}
              </span>
            </div>
          </div>
        </div>

        {/* BANK & TERMS FOOTER GRID */}
        <div className="flex justify-between items-end gap-6 text-[10px] text-slate-500">
          <div className="space-y-3 max-w-sm">
            <div>
              <h4 className="uppercase tracking-wider font-bold text-slate-900 mb-1 font-mono text-[9px]">
                Payment Instructions
              </h4>
              {OwnerDetails.paymentMethod === "Bank" ? (
                <div className="leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200/60 font-sans">
                  <p><span className="font-semibold text-slate-700">Bank:</span> {OwnerDetails.BankName}</p>
                  <p><span className="font-semibold text-slate-700">Account:</span> {OwnerDetails.OwnerName}</p>
                  <p><span className="font-semibold text-slate-700">No:</span> {OwnerDetails.AccountNumber} ({OwnerDetails.BankCode})</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded border border-slate-200/60">
                  {OwnerDetails.QR && (
                    <Image src={OwnerDetails.QR} alt="QR Code" width={52} height={52} className="border p-0.5 rounded bg-white" />
                  )}
                  <p className="font-bold text-teal-700 font-mono text-xs">{OwnerDetails.UPIID}</p>
                </div>
              )}
            </div>
            
            <div className="italic text-slate-400">
              <p className="font-bold text-slate-800 not-italic uppercase tracking-wider text-[8px] mb-0.5 font-mono">
                Notes & Terms
              </p>
              <p>{TermsConditions || "Please settle payment within the due date."}</p>
              {AdditionalInfo && <p>{AdditionalInfo}</p>}
            </div>
          </div>

          <div className="text-4xl font-extralight italic text-slate-300 font-serif tracking-tight select-none">
            Thank You
          </div>
        </div>
        
        {/* PAGE SYSTEM FOOTER */}
        <div className="mt-6 text-center text-[8px] text-slate-300 font-mono uppercase tracking-[0.3em]">
          System Generated Record • {OwnerDetails.CompanyName || "Circle"} Studio
        </div>
      </footer>
    </div>
  );
}