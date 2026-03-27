"use client";

import { useItemsStore } from "../store/InvoiceTabel";
import { useCustomerStore } from "../store/CustomerDetail";
import { useOptionalData } from "../store/OptionalDataStore";
import { useOwner } from "../store/OwnerDetail";
import Image from "next/image";

/**
 * Vertical Accent Studio Template
 * Features a strong left-side anchor and high-contrast typography.
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
  } = useItemsStore();

  const { Details } = useCustomerStore();
  const { AdditionalInfo, TermsConditions } = useOptionalData();
  const { OwnerDetails } = useOwner();

  // Currency & Locale Setup
  const sym = mode === "india" ? "₹" : currency.symbol;
  const locale = mode === "india" ? "en-IN" : currency.locale;
  const fmt = (n: string | number) => fmtNum(n, locale);

  return (
    // MAIN CONTAINER: A4 Size with Left Accent Bar
    <div className="w-[210mm] min-h-[297mm] bg-white mx-auto flex shadow-2xl print:shadow-none text-slate-800 font-sans relative overflow-hidden">
      
      {/* 1. THE VERTICAL ACCENT BAR */}
      <div className="w-[12mm] bg-teal-900 h-full absolute left-0 top-0 bottom-0 print:bg-teal-900"></div>

      {/* 2. MAIN CONTENT AREA (Offset to clear the bar) */}
      <div className="ml-[12mm] w-full flex flex-col p-[15mm]">
        
        {/* HEADER SECTION */}
        <header className="flex justify-between items-start mb-16 border-b border-gray-100 pb-8">
          
          <div className="flex flex-col justify-between h-36">
             {/* Brand / Logo Area */}
             <div className="flex items-start gap-4">
                {OwnerDetails.companyLogo && (
                  <div className="w-16 h-16 bg-white border rounded-lg overflow-hidden flex items-center justify-center p-1">
                     <Image src={OwnerDetails.companyLogo} alt="Logo" width={60} height={60} className="object-contain" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-black text-teal-900 tracking-tight uppercase leading-none">
                    {OwnerDetails.CompanyName}
                  </h1>
                  <p className="text-[10px] text-teal-600 mt-1 tracking-[0.2em] font-bold uppercase">
                    Professional Services
                  </p>
                </div>
             </div>
             
             {/* Company Contact */}
             <div className="text-[10px] text-slate-500 leading-relaxed max-w-xs">
                <p className="font-bold text-slate-700 uppercase tracking-tighter">Registered Office:</p>
                <p>{OwnerDetails.CompanyAddress}</p>
                <p className="mt-1">{OwnerDetails.CompanyMail} • {OwnerDetails.PhNo}</p>
                {OwnerDetails.TaxDetail && <p className="text-teal-700 font-bold uppercase mt-1">GSTIN: {OwnerDetails.TaxDetail}</p>}
             </div>
          </div>

          {/* Invoice Meta */}
          <div className="text-right">
             <div className="text-7xl font-black text-slate-50 -mr-6 select-none leading-none opacity-50">
               INV
             </div>
             <div className="relative -mt-10 pr-2">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tighter">#{Details.InvoiceNo}</h2>
                <div className="flex flex-col items-end mt-4 space-y-1.5">
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Issue Date</span>
                      <span className="text-xs font-bold bg-teal-50 text-teal-800 px-3 py-1 rounded-full border border-teal-100">
                        {Details.IssueDate || "N/A"}
                      </span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Due Date</span>
                      <span className="text-xs font-bold bg-red-50 text-red-800 px-3 py-1 rounded-full border border-red-100">
                        {Details.DueDate}
                      </span>
                   </div>
                </div>
             </div>
          </div>
        </header>


        {/* CLIENT DETAILS GRID */}
        <section className="mb-14 grid grid-cols-2 gap-12">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b-2 border-teal-800 w-8 pb-1">
                To
              </p>
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-none">{Details.CustomerName}</h3>
              <p className="text-sm text-slate-500 whitespace-pre-line leading-relaxed italic">
                 {Details.CustomerAddress}
              </p>
           </div>
           
           <div className="flex flex-col justify-end">
             {Details.Subject && (
               <>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b-2 border-teal-800 w-8 pb-1">
                  Re
                </p>
                <p className="text-sm font-semibold text-slate-700 leading-snug">
                  {Details.Subject}
                </p>
               </>
             )}
           </div>
        </section>


        {/* TABLE SECTION */}
        <section className="flex-grow">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="border-b-2 border-slate-900">
                    <th className="py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Description</th>
                    {mode === "india" && <th className="py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest text-center">HSN</th>}
                    <th className="py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest text-center">Qty</th>
                    <th className="py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest text-right">Rate</th>
                    
                    {/* India Tax Columns */}
                    {mode === "india" && txnType === "intra" && (
                      <>
                        <th className="py-4 text-[11px] font-black text-teal-700 uppercase tracking-widest text-right">CGST</th>
                        <th className="py-4 text-[11px] font-black text-teal-700 uppercase tracking-widest text-right">SGST</th>
                      </>
                    )}
                    {mode === "india" && txnType === "inter" && <th className="py-4 text-[11px] font-black text-blue-700 uppercase tracking-widest text-right">IGST</th>}
                    {mode === "international" && <th className="py-4 text-[11px] font-black text-slate-700 uppercase tracking-widest text-right">{taxConfig.name || "Tax"}</th>}

                    <th className="py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest text-right">Total</th>
                 </tr>
              </thead>
              <tbody className="text-[11px]">
                 {Items.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
                       <td className="py-5 pr-4 align-top">
                          <p className="font-bold text-slate-900 text-sm">{item.description}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5 tracking-tight uppercase">{item.unit || "Services"}</p>
                       </td>
                       {mode === "india" && (
                         <td className="py-5 text-center align-top text-slate-400 font-mono">
                           {item.hsn || "—"}
                         </td>
                       )}
                       <td className="py-5 text-center align-top text-slate-500 font-bold">
                          {item.qty}
                       </td>
                       <td className="py-5 text-right align-top text-slate-500 font-medium">
                          {sym}{fmt(item.rate)}
                       </td>

                       {/* Conditional Cells */}
                       {mode === "india" && txnType === "intra" && (
                        <>
                          <td className="py-5 text-right align-top text-teal-600 font-mono">{sym}{fmt(item.cgst)}</td>
                          <td className="py-5 text-right align-top text-teal-600 font-mono">{sym}{fmt(item.sgst)}</td>
                        </>
                       )}
                       {mode === "india" && txnType === "inter" && (
                         <td className="py-5 text-right align-top text-blue-600 font-mono">{sym}{fmt(item.igst)}</td>
                       )}
                       {mode === "international" && (
                         <td className="py-5 text-right align-top text-amber-600 font-mono">
                           {parseFloat(taxConfig.rate) > 0 ? `${sym}${fmt(item.taxAmt)}` : "—"}
                         </td>
                       )}

                       <td className="py-5 text-right align-top font-black text-slate-900 text-sm">
                          {sym}{fmt(item.amt)}
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </section>


        {/* FOOTER & TOTALS */}
        <section className="mt-16 break-inside-avoid">
           <div className="flex justify-between items-start">
              
              {/* Payment Details (Left) */}
              <div className="w-1/2">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 border-b border-slate-100 pb-1">
                  Payment Profile
                </h4>
                {OwnerDetails.paymentMethod === "Bank" ? (
                  <div className="text-[10px] text-slate-500 space-y-1 font-medium bg-slate-50 p-4 rounded-lg">
                    <p><span className="text-slate-400 uppercase tracking-tighter mr-2">Payee:</span> {OwnerDetails.OwnerName}</p>
                    <p><span className="text-slate-400 uppercase tracking-tighter mr-2">Account:</span> <span className="text-slate-900">{OwnerDetails.AccountNumber}</span></p>
                    <p><span className="text-slate-400 uppercase tracking-tighter mr-2">Bank:</span> {OwnerDetails.BankName} / {OwnerDetails.BankCode}</p>
                  </div>
                ) : (
                  OwnerDetails.QR && (
                    <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Image src={OwnerDetails.QR} alt="QR" width={70} height={70} className="bg-white p-1 rounded border" />
                      <div className="text-[10px]">
                        <p className="font-black text-slate-900 uppercase tracking-tighter mb-1">UPI Transfer</p>
                        <p className="text-teal-600 font-bold font-mono">{OwnerDetails.UPIID}</p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Summary (Right) */}
              <div className="w-[300px] bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-teal-900/10">
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-widest">
                       <span>Net Amount</span>
                       <span className="font-mono">{sym}{fmt(subTotal)}</span>
                    </div>

                    {/* Tax Breakdowns */}
                    {mode === "india" && (
                      <div className="pt-2 border-t border-slate-800 space-y-1">
                        {txnType === "intra" ? (
                          <>
                            <div className="flex justify-between text-[10px] text-teal-400">
                               <span>CGST</span>
                               <span>{sym}{fmt(totalCgst)}</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-teal-400">
                               <span>SGST</span>
                               <span>{sym}{fmt(totalSgst)}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between text-[10px] text-blue-400">
                             <span>IGST</span>
                             <span>{sym}{fmt(totalIgst)}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {mode === "international" && (
                      <div className="flex justify-between text-[10px] text-amber-400">
                         <span>{taxConfig.name || "Tax"} ({taxConfig.rate}%)</span>
                         <span>{sym}{fmt(totalTax)}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                       <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Total Due</span>
                       <span className="text-3xl font-black font-mono tracking-tighter">
                          {sym}{fmt(Total)}
                       </span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Final Terms */}
           <div className="mt-20 pt-8 border-t border-slate-100 grid grid-cols-2 gap-12">
              <div className="space-y-3">
                 <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Terms of Service</h4>
                 <p className="text-[9px] text-slate-400 leading-relaxed max-w-xs whitespace-pre-wrap">
                    {TermsConditions || "Payment is due upon receipt. Please include the invoice number in your transfer notes."}
                 </p>
              </div>
              <div className="text-right flex flex-col justify-between">
                 <div>
                    <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-2">Notice</h4>
                    <p className="text-[9px] text-slate-400 leading-relaxed italic">
                      {AdditionalInfo || "Thank you for partnering with us for your creative solutions."}
                    </p>
                 </div>
                 <div className="pt-10">
                    <p className="text-[8px] text-slate-300 font-mono tracking-[0.3em] uppercase">
                       Generated via VokaPay • Official Record
                    </p>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}