"use client";

import { useItemsStore } from "../store/InvoiceTabel";
import { useCustomerStore } from "../store/CustomerDetail";
import { useOptionalData } from "../store/OptionalDataStore";
import { useOwner } from "../store/OwnerDetail";
import Image from "next/image";

/**
 * Modern Tech-Focused Invoice Template
 * Features a structured card layout and refined accent borders.
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
  } = useItemsStore();

  const { Details } = useCustomerStore();
  const { AdditionalInfo, TermsConditions } = useOptionalData();
  const { OwnerDetails } = useOwner();

  // Currency & Formatting Logic
  const sym = mode === "india" ? "₹" : currency.symbol;
  const locale = mode === "india" ? "en-IN" : currency.locale;
  const fmt = (n: string | number) => fmtNum(n, locale);

  return (
    // MAIN CONTAINER: A4 Size
    <div className="w-[210mm] min-h-[297mm] bg-white mx-auto flex flex-col text-slate-800 font-sans shadow-xl print:shadow-none relative overflow-hidden">
      
      {/* 1. TOP ACCENT BORDER (Gradient bar) */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-indigo-600 to-blue-500 print:bg-indigo-600"></div>

      <div className="p-[15mm] pt-[20mm] flex flex-col h-full grow">
        
        {/* 2. HEADER: Dynamic Identity */}
        <div className="flex justify-between items-end mb-10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl border-2 border-indigo-100 flex items-center justify-center overflow-hidden bg-white shadow-sm`}>
              {OwnerDetails.companyLogo ? (
                <Image 
                  alt="logo" 
                  src={OwnerDetails.companyLogo} 
                  width={45} 
                  height={45} 
                  className="object-contain"
                />
              ) : (
                <span className="text-2xl">⚡</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{OwnerDetails.CompanyName}</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{OwnerDetails.CompanyMail}</p>
              {OwnerDetails.TaxDetail && <p className="text-[10px] font-bold text-indigo-500 uppercase">GSTIN: {OwnerDetails.TaxDetail}</p>}
            </div>
          </div>
          <div className="text-right">
             <h2 className="text-5xl font-black text-slate-100 tracking-tighter leading-none mb-1">INVOICE</h2>
             <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Tax Document</p>
          </div>
        </div>

        {/* 3. INFO CARDS (Billing & Details) */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          
          {/* Card: Bill To */}
          <div className="col-span-7 border border-slate-100 rounded-2xl p-6 bg-slate-50/40 print:bg-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Billed To
            </h3>
            <p className="font-bold text-lg text-slate-800 mb-1">{Details.CustomerName}</p>
            <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed max-w-xs">
              {Details.CustomerAddress}
            </p>
          </div>

          {/* Card: Invoice Meta */}
          <div className="col-span-5 border border-slate-100 rounded-2xl p-6 flex flex-col justify-center bg-white shadow-sm border-b-4 border-b-indigo-500">
            <div className="flex justify-between items-center mb-3 border-b border-slate-50 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice No.</span>
              <span className="text-sm font-bold font-mono text-indigo-600">#{Details.InvoiceNo}</span>
            </div>
            <div className="flex justify-between items-center mb-3 border-b border-slate-50 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
              <span className="text-sm font-semibold">{Details.IssueDate || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due Date</span>
              <span className="text-sm font-bold text-slate-800">{Details.DueDate}</span>
            </div>
          </div>
        </div>

        {/* 4. STRUCTURED GRID TABLE */}
        <div className="mb-8 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-slate-300 text-[9px] uppercase font-bold tracking-widest">
              <tr>
                <th className="py-4 px-6">Description</th>
                {mode === "india" && <th className="py-4 px-2 text-center">HSN</th>}
                <th className="py-4 px-2 text-center w-20">Qty</th>
                <th className="py-4 px-2 text-right w-28">Rate</th>
                
                {/* Dynamic Tax headers based on mode/type */}
                {mode === "india" && txnType === "intra" && (
                  <>
                    <th className="py-4 px-2 text-right w-24">CGST</th>
                    <th className="py-4 px-2 text-right w-24">SGST</th>
                  </>
                )}
                {mode === "india" && txnType === "inter" && <th className="py-4 px-2 text-right w-24">IGST</th>}
                {mode === "international" && <th className="py-4 px-2 text-right w-24">{taxConfig.name || "Tax"}</th>}

                <th className="py-4 px-6 text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {Items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50 last:border-none group hover:bg-slate-50/50">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800">{item.description}</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-tighter mt-0.5">{Details.Subject || ""}</p>
                  </td>
                  {mode === "india" && <td className="py-4 px-2 text-center text-slate-400 font-mono">{item.hsn || "—"}</td>}
                  <td className="py-4 px-2 text-center font-medium">
                    {item.qty} <span className="text-[9px] text-slate-300">{item.unit}</span>
                  </td>
                  <td className="py-4 px-2 text-right text-slate-500 font-mono">{sym}{fmt(item.rate)}</td>
                  
                  {/* Dynamic Tax cells */}
                  {mode === "india" && txnType === "intra" && (
                    <>
                      <td className="py-4 px-2 text-right font-mono text-teal-600">{sym}{fmt(item.cgst)}</td>
                      <td className="py-4 px-2 text-right font-mono text-teal-600">{sym}{fmt(item.sgst)}</td>
                    </>
                  )}
                  {mode === "india" && txnType === "inter" && (
                    <td className="py-4 px-2 text-right font-mono text-blue-600">{sym}{fmt(item.igst)}</td>
                  )}
                  {mode === "international" && (
                    <td className="py-4 px-2 text-right font-mono text-amber-600">
                      {sym}{fmt(item.taxAmt)}
                    </td>
                  )}

                  <td className="py-4 px-6 text-right font-bold text-slate-900 font-mono">
                    {sym}{fmt(item.amt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. FOOTER & TOTALS */}
        <div className="flex flex-col mt-auto break-inside-avoid">
          
          <div className="flex justify-between items-start pt-4">
             
             {/* Payment Details (Left) */}
             <div className="max-w-xs space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2">Payment Details</h4>
                  {OwnerDetails.paymentMethod === "Bank" ? (
                    <div className="text-[10px] text-slate-500 leading-relaxed font-medium">
                      <p>Beneficiary: <span className="text-slate-800 uppercase">{OwnerDetails.OwnerName}</span></p>
                      <p>Account: <span className="text-slate-800">{OwnerDetails.AccountNumber}</span></p>
                      <p>Bank: {OwnerDetails.BankName} ({OwnerDetails.BankCode})</p>
                    </div>
                  ) : (
                    OwnerDetails.QR && (
                      <div className="flex items-center gap-3">
                        <Image alt="QR" src={OwnerDetails.QR} width={64} height={64} className="border p-1 rounded-lg bg-white" />
                        <div className="text-[10px]">
                          <p className="font-bold text-slate-400 uppercase tracking-tighter">Scan UPI</p>
                          <p className="text-indigo-600 font-bold font-mono">{OwnerDetails.UPIID}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
             </div>

             {/* Total Calculation Block */}
             <div className="w-72 space-y-2 border-t-2 border-slate-100 pt-4">
                <div className="flex justify-between text-[11px] text-slate-500 px-2">
                   <span>Subtotal</span>
                   <span className="font-mono">{sym}{fmt(subTotal)}</span>
                </div>
                
                {/* Dynamic Tax Summary */}
                {mode === "india" && (
                  <div className="px-2 space-y-1">
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

                {/* Final Highlighted Total */}
                <div className="flex justify-between items-center py-4 bg-indigo-600 rounded-xl px-4 mt-4 shadow-lg shadow-indigo-100">
                   <span className="text-xs font-bold uppercase tracking-widest text-white">Total Due</span>
                   <span className="text-2xl font-black font-mono text-white tracking-tighter">
                     {sym}{fmt(Total)}
                   </span>
                </div>
             </div>
          </div>

          {/* Legal / Notes Section */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-[10px] text-slate-400">
             <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                   <span className="font-bold text-slate-900 uppercase tracking-widest block">Terms & Conditions</span>
                   <p className="leading-relaxed whitespace-pre-line italic">
                    {TermsConditions || "1. Please quote Invoice No. in payment details.\n2. Overdue payments carry 2% interest per month."}
                   </p>
                </div>
                <div className="text-right space-y-2">
                   <span className="font-bold text-slate-900 uppercase tracking-widest block">Additional Info</span>
                   <p className="leading-relaxed">
                    {AdditionalInfo || "Thank you for being a valued partner."}
                   </p>
                   <p className="pt-4 text-slate-300 uppercase tracking-widest font-mono text-[8px]">
                     Generated via VokaPay • {OwnerDetails.CompanyName}
                   </p>
                </div>
             </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}