"use client";

import Image from "next/image";
import { sampleInvoiceData } from "./sampleInvoiceData";

/**
 * Modern Executive Invoice Template
 * Refined layout, ultra-clean typography, and A4 print-optimized design.
 */

function fmtNum(n: string | number, locale: string): string {
  return parseFloat(String(n || "0")).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function InvoicePreview3() {
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
    <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white mx-auto flex flex-col justify-between shadow-2xl print:shadow-none text-slate-800 font-sans overflow-hidden border border-slate-100 print:border-none print:h-auto select-none">
      
      {/* HEADER SECTION */}
      <div>
        {/* 1. DARK HEADER BANNER */}
        <div className="bg-slate-900 text-white px-10 py-8 flex justify-between items-center print:bg-slate-900 print:text-white print:color-adjust-exact">
          
          {/* Company Identity */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-white/15">
              {OwnerDetails.companyLogo ? (
                <Image 
                  alt="Company Logo" 
                  src={OwnerDetails.companyLogo} 
                  width={52} 
                  height={52} 
                  className="object-contain p-1"
                />
              ) : (
                <span className="text-xl font-black tracking-wider text-indigo-400">
                  {OwnerDetails.CompanyName?.charAt(0) || "I"}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white uppercase font-sans">
                {OwnerDetails.CompanyName}
              </h2>
              <div className="text-[11px] text-slate-300 space-y-0.5 mt-0.5 font-normal leading-tight">
                <p className="max-w-[280px] truncate">{OwnerDetails.CompanyAddress}</p>
                <p className="text-slate-400">{OwnerDetails.CompanyMail} • {OwnerDetails.PhNo}</p>
                {OwnerDetails.TaxDetail && (
                  <p className="text-indigo-300 font-mono text-[10px] tracking-wide mt-1">
                    GSTIN: {OwnerDetails.TaxDetail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Identity */}
          <div className="text-right flex flex-col items-end">
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-widest mb-1">
              Tax Invoice
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white font-mono">
              #{Details.InvoiceNo}
            </h1>
          </div>
        </div>

        {/* 2. INFO GRID (Billing & Dates) */}
        <div className="px-10 py-6 grid grid-cols-12 gap-6 bg-slate-50/50 border-b border-slate-200/60">
          
          {/* Client Info (Col 7) */}
          <div className="col-span-7 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                Billed To
              </span>
              <div className="mt-2.5">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {Details.CustomerName}
                </h3>
                <p className="text-xs text-slate-600 whitespace-pre-wrap mt-1 leading-relaxed max-w-sm">
                  {Details.CustomerAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Key Meta Details (Col 5) */}
          <div className="col-span-5 flex flex-col justify-center gap-2 border-l border-slate-200/60 pl-6">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Issue Date:</span>
              <span className="font-semibold font-mono text-slate-700">{Details.IssueDate || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Date:</span>
              <span className="font-semibold font-mono text-indigo-600 bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-100/60">
                {Details.DueDate}
              </span>
            </div>
            {Details.Subject && (
              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject:</span>
                <span className="font-medium text-slate-700 truncate pl-3 max-w-[140px] text-right" title={Details.Subject}>
                  {Details.Subject}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3. ITEMS TABLE SECTION */}
        <div className="px-10 py-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[9px] uppercase tracking-wider font-mono print:bg-slate-900 print:color-adjust-exact">
                <th className="py-2.5 px-3 text-left rounded-l font-bold">Description</th>
                {mode === "india" && <th className="py-2.5 px-2 text-center font-bold">HSN/SAC</th>}
                <th className="py-2.5 px-2 text-center font-bold">Qty</th>
                <th className="py-2.5 px-2 text-right font-bold">Rate</th>
                
                {/* Conditional Tax Headers */}
                {mode === "india" && txnType === "intra" && (
                  <>
                    <th className="py-2.5 px-2 text-right font-bold">CGST</th>
                    <th className="py-2.5 px-2 text-right font-bold">SGST</th>
                  </>
                )}
                {mode === "india" && txnType === "inter" && (
                  <th className="py-2.5 px-2 text-right font-bold">IGST</th>
                )}
                {mode === "international" && (
                  <th className="py-2.5 px-2 text-right font-bold">{taxConfig.name || "Tax"}</th>
                )}

                <th className="py-2.5 px-3 text-right rounded-r font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {Items.map((item, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {item.description}
                  </td>
                  {mode === "india" && (
                    <td className="py-3.5 px-2 text-center text-slate-400 font-mono text-[11px]">
                      {item.hsn || "—"}
                    </td>
                  )}
                  <td className="py-3.5 px-2 text-center font-medium text-slate-700">
                    {item.qty} <span className="text-[9px] text-slate-400 uppercase font-mono">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono text-slate-600 tabular-nums">
                    {sym}{fmt(item.rate)}
                  </td>
                  
                  {/* Conditional Tax Cells */}
                  {mode === "india" && txnType === "intra" && (
                    <>
                      <td className="py-3.5 px-2 text-right font-mono text-teal-700 tabular-nums">{sym}{fmt(item.cgst)}</td>
                      <td className="py-3.5 px-2 text-right font-mono text-teal-700 tabular-nums">{sym}{fmt(item.sgst)}</td>
                    </>
                  )}
                  {mode === "india" && txnType === "inter" && (
                    <td className="py-3.5 px-2 text-right font-mono text-indigo-700 tabular-nums">{sym}{fmt(item.igst)}</td>
                  )}
                  {mode === "international" && (
                    <td className="py-3.5 px-2 text-right font-mono text-slate-600 tabular-nums">
                      {parseFloat(taxConfig.rate) > 0 ? `${sym}${fmt(item.taxAmt)}` : "0.00"}
                    </td>
                  )}

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {sym}{fmt(item.amt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER & TOTALS BLOCK */}
      <div className="px-10 pb-8">
        
        {/* 4. PAYMENT & SUMMARY GRID */}
        <div className="pt-4 border-t border-slate-200/80 flex justify-between items-start gap-8">
          
          {/* Payment Instructions (Left) */}
          <div className="flex-1 max-w-sm">
            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono">
              Payment Information
            </h4>
            {OwnerDetails.paymentMethod === "Bank" ? (
              <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-3.5 rounded-md border border-slate-200/60 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Account Name:</span>
                  <span className="font-semibold text-slate-800">{OwnerDetails.OwnerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Account Number:</span>
                  <span className="font-mono font-bold text-slate-900">{OwnerDetails.AccountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Bank / IFSC:</span>
                  <span className="font-medium text-slate-800">{OwnerDetails.BankName} ({OwnerDetails.BankCode})</span>
                </div>
              </div>
            ) : (
              OwnerDetails.QR && (
                <div className="flex items-center gap-3.5 bg-slate-50 p-3 rounded-md border border-slate-200/60">
                  <Image alt="UPI QR Code" src={OwnerDetails.QR} width={64} height={64} className="bg-white p-1 rounded border border-slate-200" />
                  <div className="text-[11px]">
                    <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5 font-mono">Scan to Pay via UPI</p>
                    <p className="text-slate-900 font-mono font-bold text-xs">{OwnerDetails.UPIID}</p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Total Summary Breakdown (Right) */}
          <div className="w-full max-w-[260px] bg-slate-50/60 p-3.5 rounded-md border border-slate-200/60">
            <div className="space-y-1.5 text-xs font-sans">
              
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-slate-800">{sym}{fmt(subTotal)}</span>
              </div>

              {/* Conditional GST Breakdown */}
              {mode === "india" && txnType === "intra" && (
                <>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>CGST Total</span>
                    <span className="font-mono tabular-nums">{sym}{fmt(totalCgst)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>SGST Total</span>
                    <span className="font-mono tabular-nums">{sym}{fmt(totalSgst)}</span>
                  </div>
                </>
              )}
              {mode === "india" && txnType === "inter" && (
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>IGST Total</span>
                  <span className="font-mono tabular-nums">{sym}{fmt(totalIgst)}</span>
                </div>
              )}
              {mode === "international" && (
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>{taxConfig.name || "Tax"} ({taxConfig.rate}%)</span>
                  <span className="font-mono tabular-nums">{sym}{fmt(totalTax)}</span>
                </div>
              )}

              {/* Total Due Row */}
              <div className="pt-2 mt-2 border-t border-slate-300 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Total Due
                </span>
                <span className="text-xl font-black font-mono text-indigo-600 tracking-tight tabular-nums">
                  {sym}{fmt(Total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. TERMS & NOTES */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-8 text-[10px]">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1 font-mono">
              Terms & Conditions
            </h4>
            <p className="text-slate-500 leading-relaxed italic">
              {TermsConditions || "Goods once sold will not be taken back. Interest @18% p.a. will be charged if payment is not settled within the due date."}
            </p>
          </div>
          <div className="text-right">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1 font-mono">
              Additional Notes
            </h4>
            <p className="text-slate-500 leading-relaxed">
              {AdditionalInfo || "Thank you for doing business with us!"}
            </p>
          </div>
        </div>

        {/* System Watermark / Branding */}
        <div className="mt-6 text-center">
          <p className="text-[9px] text-slate-300 font-mono uppercase tracking-[0.2em]">
            Computer Generated Invoice • Powered by VokaPay
          </p>
        </div>

      </div>
    </div>
  );
}