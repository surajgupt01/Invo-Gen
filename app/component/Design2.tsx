"use client";

import Image from "next/image";
import { sampleInvoiceData } from "./sampleInvoiceData";

/**
 * Professional Invoice Preview Component
 * Merges high-end styling with dynamic GST/International tax logic and A4 print safety.
 */

function fmtNum(n: string | number, locale: string): string {
  return parseFloat(String(n || "0")).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function InvoicePreview2() {
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

  // Formatting configuration
  const sym = mode === "india" ? "₹" : currency.symbol;
  const locale = mode === "india" ? "en-IN" : currency.locale;
  const fmt = (n: string | number) => fmtNum(n, locale);

  return (
    // MAIN CONTAINER: Fixed A4 Dimensions
    <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white mx-auto flex flex-col justify-between relative shadow-2xl print:shadow-none text-slate-800 font-sans overflow-hidden border border-slate-100 print:border-none print:h-auto select-none">
      
      {/* --- ACCENT BAR (Brand Decoration) --- */}
      <div className="absolute top-0 left-0 w-2.5 h-full bg-slate-900 print:bg-slate-900 print:color-adjust-exact"></div>

      {/* --- CONTENT AREA --- */}
      <div className="pl-[20mm] pr-[12mm] py-8 flex flex-col justify-between h-full w-full">
        
        {/* TOP SECTION */}
        <div>
          {/* 1. HEADER SECTION */}
          <header className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
            
            {/* Company Identity */}
            <div className="flex flex-col gap-3">
              <div className={`w-14 h-14 flex items-center justify-center rounded-lg overflow-hidden border border-slate-200/80 ${!OwnerDetails.companyLogo ? 'bg-slate-900 text-white font-bold text-xl' : 'bg-slate-50'}`}>
                {OwnerDetails.companyLogo ? (
                  <Image 
                    alt="Company Logo" 
                    src={OwnerDetails.companyLogo} 
                    width={52} 
                    height={52} 
                    className="object-contain p-1"
                  />
                ) : (
                  OwnerDetails.CompanyName?.charAt(0) || "C"
                )}
              </div>
              
              <div className="text-[11px] space-y-0.5 text-slate-500 font-sans">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">{OwnerDetails.CompanyName}</h2>
                <p className="max-w-xs">{OwnerDetails.CompanyAddress}</p>
                <p className="font-medium text-slate-700">{OwnerDetails.CompanyMail} • {OwnerDetails.PhNo}</p>
                {OwnerDetails.TaxDetail && (
                  <p className="font-bold text-slate-800 font-mono text-[10px] uppercase mt-0.5">
                    GSTIN: {OwnerDetails.TaxDetail}
                  </p>
                )}
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="text-right">
              <h1 className="text-4xl font-black text-slate-200 tracking-tighter leading-none mb-2 font-mono">
                INVOICE
              </h1>
              <div className="space-y-1 text-xs">
                <p className="text-base font-black font-mono text-slate-900">#{Details.InvoiceNo}</p>
                <p className="text-slate-500">
                  Date: <span className="font-semibold font-mono text-slate-800">{Details.IssueDate || "N/A"}</span>
                </p>
                <p className="text-slate-500">
                  Due: <span className="font-semibold font-mono text-slate-800">{Details.DueDate}</span>
                </p>
                <p className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider pt-1">
                  {mode === "india" ? "Domestic Transaction" : "International Transaction"}
                </p>
              </div>
            </div>
          </header>

          {/* 2. CLIENT INFO & SUBJECT */}
          <section className="mb-6 grid grid-cols-12 gap-6 bg-slate-50/60 p-4 rounded-lg border border-slate-200/60">
            <div className="col-span-7">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Billed To
              </h3>
              <div className="text-xs text-slate-900 leading-relaxed">
                <p className="font-bold text-sm mb-0.5 text-slate-900">{Details.CustomerName}</p>
                <p className="whitespace-pre-line text-slate-600">{Details.CustomerAddress}</p>
              </div>
            </div>
            
            {/* Subject / Context */}
            <div className="col-span-5 flex flex-col justify-start text-right">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Subject
              </h3>
              <p className="text-xs font-medium text-slate-800 leading-snug">
                {Details.Subject || "General Professional Services"}
              </p>
            </div>
          </section>

          {/* 3. ITEMS TABLE */}
          <section className="border border-slate-200/80 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[9px] uppercase font-bold tracking-wider font-mono print:bg-slate-900 print:color-adjust-exact">
                  <th className="py-2.5 px-3">Description</th>
                  {mode === "india" && <th className="py-2.5 px-2 text-center">HSN/SAC</th>}
                  <th className="py-2.5 px-2 text-center w-16">Qty</th>
                  <th className="py-2.5 px-2 text-right w-24">Rate</th>
                  
                  {/* Dynamic Tax Headers */}
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
                    <td className="py-3 px-3 font-semibold text-slate-800">{item.description}</td>
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

                    <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono tabular-nums">
                      {sym}{fmt(item.amt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* BOTTOM SECTION: TOTALS & FOOTER */}
        <div className="pt-4">
          <div className="flex justify-between items-start gap-8 pb-4">
            
            {/* Payment Info (Left) */}
            <div className="flex-1 max-w-sm">
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono">
                Payment Methods
              </h4>
              {OwnerDetails.paymentMethod === "Bank" ? (
                <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/80 font-sans">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Account Name:</span>
                    <span className="font-semibold text-slate-800">{OwnerDetails.OwnerName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Account No:</span>
                    <span className="font-mono font-bold text-slate-900">{OwnerDetails.AccountNumber}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Bank / IFSC:</span>
                    <span className="font-medium text-slate-800">{OwnerDetails.BankName} ({OwnerDetails.BankCode})</span>
                  </p>
                </div>
              ) : (
                OwnerDetails.QR && (
                  <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-lg border border-slate-200/80">
                    <Image alt="QR Code" src={OwnerDetails.QR} width={60} height={60} className="border border-slate-200 p-1 rounded bg-white" />
                    <div className="text-[11px]">
                      <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5 font-mono">Scan to Pay</p>
                      <p className="text-slate-900 font-bold font-mono text-xs">{OwnerDetails.UPIID}</p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Calculations (Right) */}
            <div className="w-72 bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-slate-800">{sym}{fmt(subTotal)}</span>
              </div>

              {/* GST Summary */}
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
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">Grand Total</span>
                <span className="text-xl font-black font-mono tracking-tight text-slate-900 tabular-nums">
                  {sym}{fmt(Total)}
                </span>
              </div>
            </div>
          </div>

          {/* Legal / Notes Footer */}
          <footer className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-4 text-[10px] text-slate-500">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider font-mono">Terms & Conditions</h4>
              <p className="whitespace-pre-wrap leading-relaxed italic text-slate-400">
                {TermsConditions || "1. Please pay within the due date to avoid late fees.\n2. Quote invoice number in all correspondence."}
              </p>
            </div>
            
            <div className="text-right space-y-1">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider font-mono">Notes / Additional Info</h4>
              <p className="whitespace-pre-wrap leading-relaxed text-slate-500">
                {AdditionalInfo || "Thank you for choosing our services!"}
              </p>
              <p className="pt-2 text-slate-300 uppercase tracking-wider font-mono text-[8px]">
                System ID: {Details.InvoiceNo} • Digital Record
              </p>
            </div>
          </footer>
        </div>

      </div>
    </div>
  );
}