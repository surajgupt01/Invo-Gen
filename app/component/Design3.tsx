"use client";

import { useItemsStore } from "../store/InvoiceTabel";
import { useCustomerStore } from "../store/CustomerDetail";
import { useOptionalData } from "../store/OptionalDataStore";
import { useOwner } from "../store/OwnerDetail";
import Image from "next/image";

/**
 * Modern Dark-Header Invoice Template
 * Optimized for professional A4 printing and complex tax logic.
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
  } = useItemsStore();

  const { Details } = useCustomerStore();
  const { AdditionalInfo, TermsConditions } = useOptionalData();
  const { OwnerDetails } = useOwner();

  // Currency & Locale Setup
  const sym = mode === "india" ? "₹" : currency.symbol;
  const locale = mode === "india" ? "en-IN" : currency.locale;
  const fmt = (n: string | number) => fmtNum(n, locale);

  return (
    // MAIN CONTAINER: A4 Size
    <div className="w-[210mm] min-h-[297mm] bg-white mx-auto flex flex-col shadow-2xl print:shadow-none text-slate-800 font-sans overflow-hidden">
      
      {/* 1. DARK HEADER BLOCK */}
      <div className="bg-slate-900 text-white p-[15mm] flex justify-between items-center print:bg-slate-900 print:text-white -webkit-print-color-adjust-exact">
        
        {/* Company Identity */}
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden border border-white/20">
            {OwnerDetails.companyLogo ? (
              <Image 
                alt="logo" 
                src={OwnerDetails.companyLogo} 
                width={60} 
                height={60} 
                className="object-contain p-1"
              />
            ) : (
              <span className="text-2xl font-bold text-indigo-400">
                {OwnerDetails.CompanyName?.charAt(0) || "I"}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">{OwnerDetails.CompanyName}</h2>
            <div className="text-[10px] text-slate-400 space-y-0.5 mt-1 font-medium">
              <p className="max-w-[250px] truncate">{OwnerDetails.CompanyAddress}</p>
              <p>{OwnerDetails.CompanyMail} • {OwnerDetails.PhNo}</p>
              {OwnerDetails.TaxDetail && <p className="text-indigo-400">GSTIN: {OwnerDetails.TaxDetail}</p>}
            </div>
          </div>
        </div>

        {/* Invoice Meta Data */}
        <div className="text-right">
          <h1 className="text-4xl font-black tracking-tighter text-indigo-500 mb-1">
            INVOICE
          </h1>
          <div className="inline-block bg-white/5 rounded px-3 py-1 border border-white/10">
            <p className="text-xs font-mono text-indigo-300 tracking-widest">INV-{Details.InvoiceNo}</p>
          </div>
        </div>
      </div>

      {/* 2. INFO GRID (Billing & Dates) */}
      <div className="px-[15mm] py-10 grid grid-cols-2 gap-12 border-b border-slate-50">
        {/* Client Info */}
        <div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">
            Bill To
          </span>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-slate-900">{Details.CustomerName}</h3>
            <p className="text-sm text-slate-500 whitespace-pre-wrap mt-2 leading-relaxed max-w-sm">
              {Details.CustomerAddress}
            </p>
          </div>
        </div>

        {/* Dates & Context */}
        <div className="flex flex-col gap-3 items-end justify-center">
           <div className="w-full max-w-[220px] flex justify-between items-center border-b border-slate-100 pb-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Issued Date</span>
              <span className="text-sm font-semibold font-mono">{Details.IssueDate || "N/A"}</span>
           </div>
           <div className="w-full max-w-[220px] flex justify-between items-center border-b border-slate-100 pb-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Due Date</span>
              <span className="text-sm font-semibold font-mono text-indigo-600">{Details.DueDate}</span>
           </div>
           {Details.Subject && (
             <div className="w-full max-w-[220px] flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Subject</span>
                <span className="text-xs font-medium text-right truncate pl-4">{Details.Subject}</span>
             </div>
           )}
        </div>
      </div>

      {/* 3. TABLE SECTION */}
      <div className="px-[15mm] py-8 flex-grow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[9px] uppercase tracking-widest print:bg-slate-900">
              <th className="py-3 px-4 text-left rounded-l-md">Description</th>
              {mode === "india" && <th className="py-3 px-2 text-center">HSN</th>}
              <th className="py-3 px-2 text-center">Qty</th>
              <th className="py-3 px-2 text-right">Rate</th>
              
              {/* Conditional Tax Headers */}
              {mode === "india" && txnType === "intra" && (
                <>
                  <th className="py-3 px-2 text-right">CGST</th>
                  <th className="py-3 px-2 text-right">SGST</th>
                </>
              )}
              {mode === "india" && txnType === "inter" && <th className="py-3 px-2 text-right">IGST</th>}
              {mode === "international" && <th className="py-3 px-2 text-right">{taxConfig.name || "Tax"}</th>}

              <th className="py-3 px-4 text-right rounded-r-md">Amount</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {Items.map((item, idx) => (
              <tr 
                key={idx} 
                className="border-b border-slate-50 last:border-none hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-5 px-4 font-bold text-slate-700">{item.description}</td>
                {mode === "india" && <td className="py-5 px-2 text-center text-slate-400 font-mono">{item.hsn || "—"}</td>}
                <td className="py-5 px-2 text-center font-medium">{item.qty} <span className="text-[9px] text-slate-400 uppercase">{item.unit}</span></td>
                <td className="py-5 px-2 text-right font-mono text-slate-500">{sym}{fmt(item.rate)}</td>
                
                {/* Conditional Tax Cells */}
                {mode === "india" && txnType === "intra" && (
                  <>
                    <td className="py-5 px-2 text-right font-mono text-teal-600">{sym}{fmt(item.cgst)}</td>
                    <td className="py-5 px-2 text-right font-mono text-teal-600">{sym}{fmt(item.sgst)}</td>
                  </>
                )}
                {mode === "india" && txnType === "inter" && (
                  <td className="py-5 px-2 text-right font-mono text-blue-600">{sym}{fmt(item.igst)}</td>
                )}
                {mode === "international" && (
                  <td className="py-5 px-2 text-right font-mono text-amber-600">
                    {parseFloat(taxConfig.rate) > 0 ? `${sym}${fmt(item.taxAmt)}` : "0.00"}
                  </td>
                )}

                <td className="py-5 px-4 text-right font-mono font-bold text-slate-900">
                  {sym}{fmt(item.amt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. PAYMENT, SUMMARY & FOOTER */}
      <div className="p-[15mm] pt-0 break-inside-avoid">
        
        <div className="flex justify-between items-start gap-10">
          {/* Payment Details (Left) */}
          <div className="flex-1">
            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3">Payment Instructions</h4>
            {OwnerDetails.paymentMethod === "Bank" ? (
              <div className="text-[10px] text-slate-500 space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p><span className="font-bold text-slate-700">Account:</span> {OwnerDetails.OwnerName}</p>
                <p><span className="font-bold text-slate-700">Number:</span> <span className="text-slate-900">{OwnerDetails.AccountNumber}</span></p>
                <p><span className="font-bold text-slate-700">Bank:</span> {OwnerDetails.BankName} ({OwnerDetails.BankCode})</p>
              </div>
            ) : (
              OwnerDetails.QR && (
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Image alt="QR" src={OwnerDetails.QR} width={70} height={70} className="bg-white p-1 rounded" />
                  <div className="text-[10px]">
                    <p className="font-bold text-slate-400 uppercase leading-none mb-1">UPI Transfer</p>
                    <p className="text-slate-900 font-mono font-bold">{OwnerDetails.UPIID}</p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Total Summary (Right) */}
          <div className="w-full max-w-[280px]">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono">{sym}{fmt(subTotal)}</span>
              </div>

              {/* GST Row Aggregates */}
              {mode === "india" && txnType === "intra" && (
                <>
                  <div className="flex justify-between text-teal-600/80">
                    <span>CGST Total</span>
                    <span className="font-mono">{sym}{fmt(totalCgst)}</span>
                  </div>
                  <div className="flex justify-between text-teal-600/80">
                    <span>SGST Total</span>
                    <span className="font-mono">{sym}{fmt(totalSgst)}</span>
                  </div>
                </>
              )}
              {mode === "india" && txnType === "inter" && (
                <div className="flex justify-between text-blue-600/80">
                  <span>IGST Total</span>
                  <span className="font-mono">{sym}{fmt(totalIgst)}</span>
                </div>
              )}
              {mode === "international" && (
                <div className="flex justify-between text-amber-600/80">
                  <span>{taxConfig.name || "Tax"} ({taxConfig.rate}%)</span>
                  <span className="font-mono">{sym}{fmt(totalTax)}</span>
                </div>
              )}

              <div className="pt-3 mt-1 border-t-2 border-slate-900 flex justify-between items-center">
                <span className="text-sm font-black text-slate-900 uppercase">Total Amount</span>
                <span className="text-2xl font-black font-mono text-indigo-600 tracking-tighter">
                  {sym}{fmt(Total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 gap-10">
          <div>
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
              {TermsConditions || "Goods once sold will not be taken back. Interest @18% will be charged if payment is not made within due date."}
            </p>
          </div>
          <div className="text-right">
             <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notes</h4>
             <p className="text-[10px] text-slate-500 leading-relaxed">
               {AdditionalInfo || "Thank you for your business!"}
             </p>
          </div>
        </div>

        <div className="mt-10 text-center">
           <p className="text-[9px] text-slate-300 font-mono uppercase tracking-[0.2em]">
             System Generated Invoice • Powered by VokaPay
           </p>
        </div>

      </div>
    </div>
  );
}