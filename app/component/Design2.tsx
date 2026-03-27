"use client";

import { useItemsStore } from "../store/InvoiceTabel";
import { useCustomerStore } from "../store/CustomerDetail";
import { useOptionalData } from "../store/OptionalDataStore";
import { useOwner } from "../store/OwnerDetail";
import Image from "next/image";

/**
 * Professional Invoice Preview Component
 * Merges high-end styling with dynamic GST/International logic.
 */

function fmtNum(n: string | number, locale: string): string {
  return parseFloat(String(n || "0")).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function InvoicePreview() {
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

  // Formatting configuration
  const sym = mode === "india" ? "₹" : currency.symbol;
  const locale = mode === "india" ? "en-IN" : currency.locale;
  const fmt = (n: string | number) => fmtNum(n, locale);

  return (
    // MAIN CONTAINER: Professional A4 Size
    <div className="w-[210mm] min-h-[297mm] bg-white mx-auto flex flex-col relative shadow-2xl print:shadow-none text-slate-800 font-sans overflow-hidden">
      
      {/* --- ACCENT BAR (Brand Decoration) --- */}
      <div className="absolute top-0 left-0 w-2 h-full bg-slate-900 print:bg-slate-900"></div>

      {/* --- CONTENT PADDING --- */}
      <div className="p-[15mm] pl-[25mm] flex flex-col h-full grow">
        
        {/* 1. HEADER SECTION */}
        <header className="flex justify-between items-start mb-12">
          
          {/* Company Identity */}
          <div className="flex flex-col gap-4">
            {/* Logo Logic */}
            <div className={`w-20 h-20 flex items-center justify-center rounded-br-2xl overflow-hidden ${!OwnerDetails.companyLogo ? 'bg-slate-900 text-white font-bold text-2xl' : ''}`}>
              {OwnerDetails.companyLogo ? (
                <Image 
                   alt="logo" 
                   src={OwnerDetails.companyLogo} 
                   width={80} 
                   height={80} 
                   className="object-contain"
                />
              ) : (
                OwnerDetails.CompanyName?.charAt(0) || "C"
              )}
            </div>
            
            <div className="text-[11px] space-y-1 text-slate-500">
               <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{OwnerDetails.CompanyName}</h2>
               <p className="max-w-xs">{OwnerDetails.CompanyAddress}</p>
               <p className="font-medium text-slate-700">Email: {OwnerDetails.CompanyMail}</p>
               {OwnerDetails.TaxDetail && <p className="font-medium text-slate-700 uppercase">GSTIN: {OwnerDetails.TaxDetail}</p>}
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="text-right">
            <h1 className="text-6xl font-extralight text-slate-200 tracking-tighter leading-none mb-4">
              INVOICE
            </h1>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-900"># {Details.InvoiceNo}</p>
              <p className="text-sm text-slate-500 font-medium">Date: <span className="text-slate-900">{Details.IssueDate || new Date().toLocaleDateString()}</span></p>
              <p className="text-sm text-slate-500">Due: <span className="text-slate-900 font-medium">{Details.DueDate}</span></p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest pt-2">
                {mode === "india" ? "Domestic Transaction" : "International Transaction"}
              </p>
            </div>
          </div>
        </header>

        {/* 2. CLIENT INFO & SUBJECT */}
        <section className="mb-12 grid grid-cols-2 gap-10">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Billed To
            </h3>
            <div className="text-sm text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-r-lg border-l-2 border-slate-200">
              <p className="font-bold text-base mb-1">{Details.CustomerName}</p>
              <p className="whitespace-pre-line text-slate-600">{Details.CustomerAddress}</p>
            </div>
          </div>
          
          {/* Subject / Context */}
          <div className="flex flex-col justify-end text-right">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Subject
            </h3>
            <p className="text-sm font-medium text-slate-800 leading-snug">
              {Details.Subject || "General Professional Services"}
            </p>
          </div>
        </section>

        {/* 3. ITEMS TABLE */}
        <section className="mb-10 grow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest">Description</th>
                {mode === "india" && <th className="py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest text-center">HSN</th>}
                <th className="py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest text-center">Qty</th>
                <th className="py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest text-right">Rate</th>
                
                {/* Dynamic Tax Headers */}
                {mode === "india" && txnType === "intra" && (
                  <>
                    <th className="py-4 text-[10px] font-bold text-teal-700 uppercase tracking-widest text-right">CGST</th>
                    <th className="py-4 text-[10px] font-bold text-teal-700 uppercase tracking-widest text-right">SGST</th>
                  </>
                )}
                {mode === "india" && txnType === "inter" && <th className="py-4 text-[10px] font-bold text-blue-700 uppercase tracking-widest text-right">IGST</th>}
                
                <th className="py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-[11px] text-slate-600">
              {Items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td className="py-4 pr-4 font-medium text-slate-800">{item.description}</td>
                  {mode === "india" && <td className="py-4 px-2 text-center text-slate-400">{item.hsn || "—"}</td>}
                  <td className="py-4 px-2 text-center">{item.qty} {item.unit}</td>
                  <td className="py-4 px-2 text-right">{sym}{fmt(item.rate)}</td>
                  
                  {/* Dynamic Tax Cells */}
                  {mode === "india" && txnType === "intra" && (
                    <>
                      <td className="py-4 px-2 text-right text-teal-600">{sym}{fmt(item.cgst)}</td>
                      <td className="py-4 px-2 text-right text-teal-600">{sym}{fmt(item.sgst)}</td>
                    </>
                  )}
                  {mode === "india" && txnType === "inter" && (
                    <td className="py-4 px-2 text-right text-blue-600">{sym}{fmt(item.igst)}</td>
                  )}

                  <td className="py-4 pl-4 text-right font-bold text-slate-900">{sym}{fmt(item.amt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 4. TOTALS & PAYMENT */}
        <div className="flex flex-col mt-auto break-inside-avoid">
          <div className="flex justify-between items-start mb-12 border-t-2 border-slate-900 pt-8">
            
            {/* Payment Info (Left) */}
            <div className="max-w-sm">
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4">Payment Methods</h4>
              {OwnerDetails.paymentMethod === "Bank" ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                   <span className="font-semibold text-slate-700">Account Name:</span> <span>{OwnerDetails.OwnerName}</span>
                   <span className="font-semibold text-slate-700">Account No:</span> <span className="text-slate-900 font-medium">{OwnerDetails.AccountNumber}</span>
                   <span className="font-semibold text-slate-700">Bank:</span> <span>{OwnerDetails.BankName}</span>
                   <span className="font-semibold text-slate-700">IFSC/Code:</span> <span>{OwnerDetails.BankCode}</span>
                </div>
              ) : (
                OwnerDetails.QR && (
                  <div className="flex items-center gap-4">
                    <Image alt="QR" src={OwnerDetails.QR} width={80} height={80} className="border p-1 rounded bg-white" />
                    <div className="text-[10px]">
                      <p className="text-slate-400 uppercase font-bold tracking-tighter">Scan to Pay</p>
                      <p className="text-slate-900 font-bold">{OwnerDetails.UPIID}</p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Calculations (Right) */}
            <div className="w-full max-w-[250px] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">{sym}{fmt(subTotal)}</span>
              </div>

              {/* GST Summary */}
              {mode === "india" && (
                <div className="space-y-1 border-y border-slate-50 py-2">
                  {txnType === "intra" ? (
                    <>
                      <div className="flex justify-between text-[10px] text-teal-600">
                        <span>CGST</span>
                        <span>{sym}{fmt(totalCgst)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-teal-600">
                        <span>SGST</span>
                        <span>{sym}{fmt(totalSgst)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-[10px] text-blue-600">
                      <span>IGST</span>
                      <span>{sym}{fmt(totalIgst)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center py-4 border-t border-slate-200">
                <span className="text-base font-bold text-slate-900">Grand Total</span>
                <span className="text-2xl font-black text-slate-900 tracking-tighter">{sym}{fmt(Total)}</span>
              </div>
            </div>
          </div>

          {/* Legal / Notes Footer */}
          <footer className="grid grid-cols-2 gap-12 border-t border-slate-100 pt-8">
            <div className="text-[10px] text-slate-500 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase">Terms & Conditions</h4>
              <p className="whitespace-pre-wrap leading-relaxed italic">
                {TermsConditions || "1. Please pay within the due date to avoid late fees. \n2. Quote invoice number in all correspondence."}
              </p>
            </div>
            
            <div className="text-[10px] text-slate-500 space-y-2">
               <h4 className="font-bold text-slate-900 uppercase">Notes / Additional Info</h4>
               <p className="whitespace-pre-wrap leading-relaxed">
                 {AdditionalInfo || "Thank you for choosing our services!"}
               </p>
               <div className="mt-6 pt-4 text-[9px] text-slate-300 border-t border-slate-50 flex justify-between">
                 <span>System ID: {Details.InvoiceNo}-{new Date().getFullYear()}</span>
                 <span>Digital Signature Not Required</span>
               </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}