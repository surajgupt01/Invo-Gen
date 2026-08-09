"use client";

import Image from "next/image";
import { sampleInvoiceData } from "./sampleInvoiceData";

/**
 * Modern Tech-Focused Invoice Template
 * Structured card layout, clean typography hierarchy, and print-optimized A4 sizing.
 */

function fmtNum(n: string | number, locale: string): string {
  return parseFloat(String(n || "0")).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function InvoicePreview4() {
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

  // Currency & Formatting Logic
  const sym = mode === "india" ? "₹" : currency.symbol;
  const locale = mode === "india" ? "en-IN" : currency.locale;
  const fmt = (n: string | number) => fmtNum(n, locale);

  return (
    // MAIN CONTAINER: Fixed A4 Dimensions
    <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white mx-auto flex flex-col justify-between text-slate-800 font-sans shadow-2xl print:shadow-none relative overflow-hidden border border-slate-100 print:border-none print:h-auto select-none">
      
      {/* 1. TOP ACCENT GRADIENT BAR */}
      <div className="h-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 w-full print:bg-indigo-600 print:color-adjust-exact"></div>

      <div className="px-10 py-8 flex flex-col justify-between flex-1">
        
        {/* TOP SECTION */}
        <div>
          {/* 2. HEADER */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
            {/* Company Identity */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg border border-slate-200/80 flex items-center justify-center overflow-hidden bg-slate-50 shadow-2xs shrink-0">
                {OwnerDetails.companyLogo ? (
                  <Image 
                    alt="Company Logo" 
                    src={OwnerDetails.companyLogo} 
                    width={40} 
                    height={40} 
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="text-xl">⚡</span>
                )}
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase font-sans">
                  {OwnerDetails.CompanyName}
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  {OwnerDetails.CompanyMail} • {OwnerDetails.PhNo}
                </p>
                {OwnerDetails.TaxDetail && (
                  <p className="text-[10px] font-bold font-mono text-indigo-600 uppercase mt-0.5">
                    GSTIN: {OwnerDetails.TaxDetail}
                  </p>
                )}
              </div>
            </div>

            {/* Document Title */}
            <div className="text-right">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                INVOICE
              </h2>
              <span className="inline-block mt-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/80 uppercase px-2 py-0.5 rounded font-mono tracking-wider">
                Tax Document
              </span>
            </div>
          </div>

          {/* 3. INFO CARDS (Billing & Meta Details) */}
          <div className="grid grid-cols-12 gap-5 mb-6">
            
            {/* Card: Billed To */}
            <div className="col-span-7 border border-slate-200/80 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Billed To
                  </h3>
                </div>
                <p className="font-bold text-sm text-slate-900 mb-1">{Details.CustomerName}</p>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed max-w-xs">
                  {Details.CustomerAddress}
                </p>
              </div>
            </div>

            {/* Card: Invoice Meta */}
            <div className="col-span-5 border border-slate-200/80 rounded-lg p-4 bg-white flex flex-col justify-center border-l-4 border-l-indigo-600 shadow-2xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Invoice No.</span>
                <span className="font-bold font-mono text-indigo-600">#{Details.InvoiceNo}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Date</span>
                <span className="font-semibold text-slate-700">{Details.IssueDate || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Due Date</span>
                <span className="font-bold text-slate-900 font-mono">{Details.DueDate}</span>
              </div>
            </div>
          </div>

          {/* 4. STRUCTURED DATA TABLE */}
          <div className="border border-slate-200/80 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 text-white text-[9px] uppercase font-bold tracking-wider font-mono print:bg-slate-900 print:color-adjust-exact">
                <tr>
                  <th className="py-3 px-4">Description</th>
                  {mode === "india" && <th className="py-3 px-2 text-center">HSN/SAC</th>}
                  <th className="py-3 px-2 text-center w-16">Qty</th>
                  <th className="py-3 px-2 text-right w-24">Rate</th>
                  
                  {/* Dynamic Tax Headers */}
                  {mode === "india" && txnType === "intra" && (
                    <>
                      <th className="py-3 px-2 text-right w-20">CGST</th>
                      <th className="py-3 px-2 text-right w-20">SGST</th>
                    </>
                  )}
                  {mode === "india" && txnType === "inter" && <th className="py-3 px-2 text-right w-24">IGST</th>}
                  {mode === "international" && <th className="py-3 px-2 text-right w-24">{taxConfig.name || "Tax"}</th>}

                  <th className="py-3 px-4 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {Items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{item.description}</p>
                      {Details.Subject && (
                        <p className="text-[10px] text-slate-400 tracking-tight mt-0.5">{Details.Subject}</p>
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
                    
                    {/* Dynamic Tax Cells */}
                    {mode === "india" && txnType === "intra" && (
                      <>
                        <td className="py-3 px-2 text-right font-mono text-teal-700 tabular-nums">{sym}{fmt(item.cgst)}</td>
                        <td className="py-3 px-2 text-right font-mono text-teal-700 tabular-nums">{sym}{fmt(item.sgst)}</td>
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

                    <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono tabular-nums">
                      {sym}{fmt(item.amt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SECTION: PAYMENT & TOTALS */}
        <div className="pt-4">
          
          <div className="flex justify-between items-start gap-8 pt-2">
            
            {/* Payment Details (Left) */}
            <div className="flex-1 max-w-sm">
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono">
                Payment Details
              </h4>
              {OwnerDetails.paymentMethod === "Bank" ? (
                <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/80 font-sans">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Beneficiary:</span>
                    <span className="font-semibold text-slate-800">{OwnerDetails.OwnerName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Account No:</span>
                    <span className="font-mono font-bold text-slate-900">{OwnerDetails.AccountNumber}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Bank / Code:</span>
                    <span className="font-medium text-slate-800">{OwnerDetails.BankName} ({OwnerDetails.BankCode})</span>
                  </p>
                </div>
              ) : (
                OwnerDetails.QR && (
                  <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-lg border border-slate-200/80">
                    <Image alt="QR Code" src={OwnerDetails.QR} width={60} height={60} className="border border-slate-200 p-1 rounded bg-white" />
                    <div className="text-[11px]">
                      <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5 font-mono">Scan UPI to Pay</p>
                      <p className="text-indigo-600 font-bold font-mono text-xs">{OwnerDetails.UPIID}</p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Total Calculation Block (Right) */}
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-xs text-slate-600 px-2">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">{sym}{fmt(subTotal)}</span>
              </div>
              
              {/* Dynamic Tax Breakdown */}
              {mode === "india" && (
                <div className="px-2 space-y-1 text-xs">
                  {txnType === "intra" ? (
                    <>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>CGST</span>
                        <span className="font-mono tabular-nums">{sym}{fmt(totalCgst)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>SGST</span>
                        <span className="font-mono tabular-nums">{sym}{fmt(totalSgst)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>IGST</span>
                      <span className="font-mono tabular-nums">{sym}{fmt(totalIgst)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Total Due Pill Banner */}
              <div className="flex justify-between items-center py-3.5 px-4 bg-indigo-600 text-white rounded-lg shadow-md shadow-indigo-100 print:bg-indigo-600 print:color-adjust-exact">
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Total Due</span>
                <span className="text-xl font-black font-mono tracking-tight tabular-nums">
                  {sym}{fmt(Total)}
                </span>
              </div>
            </div>
          </div>

          {/* Legal / Notes Section */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-500 grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 uppercase tracking-wider block font-mono">
                Terms & Conditions
              </span>
              <p className="leading-relaxed whitespace-pre-line italic text-slate-400">
                {TermsConditions || "1. Quotes are valid for 30 days.\n2. Overdue payments are subject to a 2% monthly fee."}
              </p>
            </div>
            <div className="text-right space-y-1">
              <span className="font-bold text-slate-900 uppercase tracking-wider block font-mono">
                Additional Info
              </span>
              <p className="leading-relaxed">
                {AdditionalInfo || "Thank you for your partnership!"}
              </p>
              <p className="pt-2 text-slate-300 uppercase tracking-wider font-mono text-[8px]">
                Generated via luen.in • {OwnerDetails.CompanyName}
              </p>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}