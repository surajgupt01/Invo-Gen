"use client";

import Image from "next/image";
import { sampleInvoiceData } from "./sampleInvoiceData";

/**
 * Vertical Accent Studio Template
 * Features a strong left-side anchor, refined studio layout, and print-optimized A4 sizing.
 */

function fmtNum(n: string | number, locale: string): string {
  return parseFloat(String(n || "0")).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function InvoicePreview5() {
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
    <div className="w-[210mm] min-h-[297mm] h-[297mm] bg-white mx-auto flex shadow-2xl print:shadow-none text-slate-800 font-sans relative overflow-hidden border border-slate-100 print:border-none print:h-auto select-none">
      
      {/* 1. VERTICAL ACCENT BAR */}
      <div className="w-[10mm] bg-teal-900 h-full absolute left-0 top-0 bottom-0 print:bg-teal-900 print:color-adjust-exact"></div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="ml-[10mm] w-full flex flex-col justify-between px-8 py-6">
        
        {/* TOP SECTION */}
        <div>
          {/* HEADER SECTION */}
          <header className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
            
            <div className="flex flex-col justify-between gap-4">
              {/* Brand / Logo Area */}
              <div className="flex items-center gap-3.5">
                {OwnerDetails.companyLogo && (
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center p-1 shrink-0">
                    <Image src={OwnerDetails.companyLogo} alt="Logo" width={44} height={44} className="object-contain" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-black text-teal-950 tracking-tight uppercase leading-none font-sans">
                    {OwnerDetails.CompanyName}
                  </h1>
                  <p className="text-[10px] text-teal-700 mt-1 tracking-wider font-bold uppercase font-mono">
                    Professional Services
                  </p>
                </div>
              </div>
              
              {/* Company Contact */}
              <div className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                <p className="font-bold text-slate-700 uppercase text-[9px] tracking-wider font-mono">Registered Office:</p>
                <p>{OwnerDetails.CompanyAddress}</p>
                <p className="mt-0.5">{OwnerDetails.CompanyMail} • {OwnerDetails.PhNo}</p>
                {OwnerDetails.TaxDetail && (
                  <p className="text-teal-800 font-bold font-mono text-[10px] uppercase mt-0.5">
                    GSTIN: {OwnerDetails.TaxDetail}
                  </p>
                )}
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="text-right">
              <div className="text-5xl font-black text-slate-100 select-none leading-none opacity-80 font-mono tracking-tighter">
                INV
              </div>
              <div className="relative -mt-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                  #{Details.InvoiceNo}
                </h2>
                <div className="flex flex-col items-end mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">Issue Date:</span>
                    <span className="text-[11px] font-bold bg-teal-50 text-teal-900 px-2.5 py-0.5 rounded border border-teal-100 font-mono">
                      {Details.IssueDate || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">Due Date:</span>
                    <span className="text-[11px] font-bold bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded border border-rose-100 font-mono">
                      {Details.DueDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* CLIENT DETAILS SECTION */}
          <section className="mb-6 grid grid-cols-2 gap-8 bg-slate-50/60 p-4 rounded-lg border border-slate-200/60">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 border-b-2 border-teal-800 w-6 pb-0.5 font-mono">
                To
              </p>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{Details.CustomerName}</h3>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed italic">
                {Details.CustomerAddress}
              </p>
            </div>
            
            <div className="flex flex-col justify-start">
              {Details.Subject && (
                <>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 border-b-2 border-teal-800 w-6 pb-0.5 font-mono">
                    Re
                  </p>
                  <p className="text-xs font-medium text-slate-700 leading-snug">
                    {Details.Subject}
                  </p>
                </>
              )}
            </div>
          </section>

          {/* TABLE SECTION */}
          <section className="border border-slate-200/80 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[9px] uppercase font-bold tracking-wider font-mono print:bg-slate-900 print:color-adjust-exact">
                  <th className="py-2.5 px-3">Description</th>
                  {mode === "india" && <th className="py-2.5 px-2 text-center">HSN/SAC</th>}
                  <th className="py-2.5 px-2 text-center w-16">Qty</th>
                  <th className="py-2.5 px-2 text-right w-24">Rate</th>
                  
                  {/* India Tax Columns */}
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
                      <p className="text-[9px] text-slate-400 mt-0.5 tracking-tight uppercase font-mono">{item.unit || "Services"}</p>
                    </td>
                    {mode === "india" && (
                      <td className="py-3 px-2 text-center text-slate-400 font-mono text-[11px]">
                        {item.hsn || "—"}
                      </td>
                    )}
                    <td className="py-3 px-2 text-center font-medium text-slate-700">
                      {item.qty}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-600 font-mono tabular-nums">
                      {sym}{fmt(item.rate)}
                    </td>

                    {/* Conditional Cells */}
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
                        {parseFloat(taxConfig.rate) > 0 ? `${sym}${fmt(item.taxAmt)}` : "—"}
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

        {/* BOTTOM SECTION: PAYMENT & TOTALS */}
        <div className="pt-4">
          <div className="flex justify-between items-start gap-8 pt-2">
            
            {/* Payment Details (Left) */}
            <div className="flex-1 max-w-sm">
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono">
                Payment Profile
              </h4>
              {OwnerDetails.paymentMethod === "Bank" ? (
                <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50/80 p-3.5 rounded-lg border border-slate-200/80 font-sans">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Payee:</span>
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
                    <Image src={OwnerDetails.QR} alt="QR Code" width={60} height={60} className="bg-white p-1 rounded border border-slate-200" />
                    <div className="text-[11px]">
                      <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5 font-mono">UPI Transfer</p>
                      <p className="text-teal-700 font-bold font-mono text-xs">{OwnerDetails.UPIID}</p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Total Summary Box (Right) */}
            <div className="w-72 bg-slate-900 text-white p-4 rounded-lg shadow-lg shadow-teal-950/10 print:bg-slate-900 print:color-adjust-exact">
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between text-slate-400">
                  <span>Net Amount</span>
                  <span className="font-mono tabular-nums text-white">{sym}{fmt(subTotal)}</span>
                </div>

                {/* Tax Breakdowns */}
                {mode === "india" && (
                  <div className="pt-1 border-t border-slate-800 space-y-1 text-[11px]">
                    {txnType === "intra" ? (
                      <>
                        <div className="flex justify-between text-teal-400">
                          <span>CGST</span>
                          <span className="font-mono tabular-nums">{sym}{fmt(totalCgst)}</span>
                        </div>
                        <div className="flex justify-between text-teal-400">
                          <span>SGST</span>
                          <span className="font-mono tabular-nums">{sym}{fmt(totalSgst)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between text-indigo-400">
                        <span>IGST</span>
                        <span className="font-mono tabular-nums">{sym}{fmt(totalIgst)}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {mode === "international" && (
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>{taxConfig.name || "Tax"} ({taxConfig.rate}%)</span>
                    <span className="font-mono tabular-nums">{sym}{fmt(totalTax)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">Total Due</span>
                  <span className="text-2xl font-black font-mono tracking-tight tabular-nums">
                    {sym}{fmt(Total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal / Terms Section */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-8 text-[10px] text-slate-500">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider block font-mono">Terms of Service</h4>
              <p className="leading-relaxed italic text-slate-400 whitespace-pre-wrap">
                {TermsConditions || "Payment is due upon receipt. Please include the invoice number in your transfer notes."}
              </p>
            </div>
            <div className="text-right space-y-1">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider block font-mono">Notice</h4>
              <p className="leading-relaxed text-slate-500">
                {AdditionalInfo || "Thank you for partnering with us for your creative solutions."}
              </p>
              <p className="pt-2 text-slate-300 uppercase tracking-wider font-mono text-[8px]">
                Generated via luen.in • Official Record
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}