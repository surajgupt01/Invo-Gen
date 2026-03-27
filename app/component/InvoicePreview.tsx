// "use client";

// // import { NavLogo } from "./Nav";
// import { useItemsStore } from "../store/InvoiceTabel";
// import { useCustomerStore } from "../store/CustomerDetail";
// import { useOptionalData } from "../store/OptionalDataStore";
// import { useOwner } from "../store/OwnerDetail";
// import Image from "next/image";



// export default function InvoicePreview() {
//   const { Items, Total, subTotal } = useItemsStore();
//   const { Details } = useCustomerStore();
//   // const currency = "₹";
//   const { AdditionalInfo, TermsConditions } = useOptionalData();

//   const { OwnerDetails } = useOwner();

//   return (
//     <div className=" p-4 rounded-xs w-[210mm] min-h-[297mm]    flex flex-col  bg-white">
//       {/* Header */}
//       <div className="w-full">
//         <div className=" ">
//           <div className="flex justify-between items-start border-b border-gray-300 p-1 h-auto">
//             <div className="flex justify-start items-start gap-2">
//               <div className={` ${OwnerDetails.companyLogo=='' ? 'border' : ''} border-gray-400 w-24 h-24`}>
//                {OwnerDetails.companyLogo !='' &&  <Image alt="logo" src={OwnerDetails.companyLogo} width={80} height={70}></Image>}
//               </div>
//               <div className="flex flex-col text-[10px] text-gray-500 pl-1">
//                 <h1 className="text-lg font-semibold text-gray-600">
//                   {OwnerDetails.CompanyName}
//                 </h1>
//                 <span>Address : {OwnerDetails.CompanyAddress}</span>
//                 <span>Tax : {OwnerDetails.TaxDetail}</span>
//                 <span>email : {OwnerDetails.CompanyMail}</span>
//               </div>
//             </div>
//             <h1 className="text-sm font-normal text-teal-600">
//               Invoice{" "}
//               <span className="text-black">INV-{Details.InvoiceNo}</span>
//             </h1>
//           </div>
//         </div>

//         {/* <div className="flex justify-between items-start mt-2">

//         </div> */}

//         {/* Bill Info */}
//         <div className="flex flex-col ">
//           <div className="grid grid-cols-2 gap-2 w-full   text-[10px] mt-4">
//             <div className="bg-gray-50 p-2 rounded-lg">
//               <h3 className="font-semibold mb-1">Billed To</h3>
//               <p className=" font-medium">{Details.CustomerName}</p>
//               <p className=" text-gray-600">{Details.CustomerAddress}</p>
//             </div>

//             <div className="text-[10px] font-sans text-gray-600 space-y-1 text-right">
//               <div>
//                 <span className="font-medium">Invoice Date:</span>{" "}
//                 {Details.IssueDate}
//                 {/* {Details.InvoiceNo} */}
//               </div>
//               <div>
//                 <span className="font-medium">Due Date:</span> {Details.DueDate}
//               </div>
//               <div>
//                 <span className="font-medium">Currency:</span>{" "}
//                 {Details.Currency.split(" ")[0]}
//               </div>
//             </div>
//           </div>

//           <div className="p-2">
//             <p className="font-normal text-[10px]">
//               <span className="font-medium">{"Subject - "}</span>
//               {Details.Subject}
//             </p>
//           </div>

//           {/* Items Table */}
//           <div className="mt-8 overflow-hidden  border">
//             <table className="w-full text-sm">
//               <thead className="">
//                 <tr className="text-[10px] ">
//                   <th className="text-left px-4 py-2 font-semibold">Item</th>
//                   <th className="text-center px-4 py-2 font-semibold">Qty</th>
//                   <th className="text-center px-4 py-2 font-semibold">Tax</th>
//                   <th className="text-right px-4 py-2 font-semibold">Price</th>
//                   <th className="text-right px-4 py-2 font-semibold">Total</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {Items.map((i, idx) => (
//                   <tr
//                     key={idx}
//                     className="border-b last:border-none text-[8px]"
//                   >
//                     <td className="px-4 py-2">{i.description}</td>
//                     <td className="px-4 py-2 text-center">{i.qty}</td>
//                     <td className="px-4 py-2 text-center">{i.discount}%</td>
//                     <td className="px-4 py-2 text-right">
//                       {Details.Currency.split(" ")[1]} {i.rate}
//                     </td>
//                     <td className="px-4 py-2 text-right">
//                       {Details.Currency.split(" ")[1]} {i.amt}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Total */}

//           <div className="flex justify-end mt-8">
//             <div className="w-64 space-y-2">
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>Subtotal</span>
//                 <span className="tabular-nums">
//                   {Details.Currency.split(" ")[1]} {subTotal.toFixed(2)}
//                 </span>
//               </div>

//               <div className="flex justify-between text-sm text-gray-600">
//                 {/* <span>Tax ({Tax}%)</span> */}
//                 <span className="tabular-nums">
//                   {Details.Currency.split(" ")[1]}{" "}
//                   {/* {((subTotal * Tax) / 100).toFixed(2)} */}
//                 </span>
//               </div>

//               <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-300">
//                 <span>Total</span>
//                 <span className="tabular-nums">
//                   {Details.Currency.split(" ")[1]} {Total.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="w-auto mt-8   border-t border-gray-100 py-4 px-2 ">
//         <h3 className="font-semibold text-[10px]">{"PAYMENT DETAILS"}</h3>
//         {OwnerDetails.paymentMethod == "Bank" ? (
//           <div className="flex flex-col items-start text-[10px] text-gray-600 p-1 my-2 font-light">
//             <span>
//               {" "}
//               <span className="text-gray-700">{"Owner Name : "}</span>
//               {OwnerDetails.OwnerName}
//             </span>
//             <span>
//               <span className="text-gray-900">{"Account Number : "}</span>
//               {OwnerDetails.AccountNumber}
//             </span>
//             <span>
//               <span className="text-gray-900">{"Bank Name : "}</span>
//               {OwnerDetails.BankName}
//             </span>
//             <span>
//               <span className="text-gray-900">{"Bank Address : "}</span>
//               {OwnerDetails.BankAddress}
//             </span>
//             <span>
//               <span className="text-gray-900">{"Bank Code : "}</span>
//               {OwnerDetails.BankCode}
//             </span>
//             <span>
//               <span className="text-gray-900">{"Ph : "}</span>
//               {OwnerDetails.PhNo}
//             </span>
//           </div>
//         ) : (
//           OwnerDetails.QR != "" && (
//             <div className="flex flex-col justify-center items-start gap-2">
//             <Image
//               alt="qr-image"
//               className="border border-neutral-400 rounded-xs p-1"
//               src={OwnerDetails.QR}
//               width={100}
//               height={100}
//             ></Image>
//             <span className="font-semibold text-xs tracking-wide text-neutral-800">{"UPI-ID : "} {OwnerDetails.UPIID}</span>
//             </div>
//           )
//         )}
//       </div>
//       <div className="mt-auto border-t border-gray-200 ">
//         <div className="">
//           <div className="p-1">
//             <p className="font-normal text-gray-500 text-[10px]">
//               <span className="font-medium text-gray-700">
//                 {"Additional Information"}
//               </span>
//               <br></br>
//               {AdditionalInfo}
//             </p>
//           </div>
//           <div className="p-1 mt-2">
//             <p className="font-normal text-gray-500 text-[10px]">
//               <span className="font-medium text-gray-700">
//                 {"Terms & Conditions"}
//               </span>
//               <br></br>
//               {TermsConditions}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useItemsStore } from "../store/InvoiceTabel";
import { useCustomerStore } from "../store/CustomerDetail";
import { useOptionalData } from "../store/OptionalDataStore";
import { useOwner } from "../store/OwnerDetail";
import Image from "next/image";

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

  const { Details }                        = useCustomerStore();
  const { AdditionalInfo, TermsConditions } = useOptionalData();
  const { OwnerDetails }                   = useOwner();

  // Use store currency in international mode, else fall back to CustomerStore currency
  const sym    = mode === "india" ? "₹" : currency.symbol;
  const locale = mode === "india" ? "en-IN" : currency.locale;
  const fmt    = (n: string | number) => fmtNum(n, locale);

  return (
    <div className="p-4 rounded-xs w-[210mm] min-h-[297mm] flex flex-col bg-white">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="w-full">
        <div className="flex justify-between items-start border-b border-gray-300 p-1 h-auto">
          <div className="flex justify-start items-start gap-2">
            <div className={`${OwnerDetails.companyLogo === "" ? "border" : ""} border-gray-400 w-24 h-24`}>
              {OwnerDetails.companyLogo !== "" && (
                <Image alt="logo" src={OwnerDetails.companyLogo} width={80} height={70} />
              )}
            </div>
            <div className="flex flex-col text-[10px] text-gray-500 pl-1">
              <h1 className="text-lg font-semibold text-gray-600">{OwnerDetails.CompanyName}</h1>
              <span>Address : {OwnerDetails.CompanyAddress}</span>
              <span>Tax : {OwnerDetails.TaxDetail}</span>
              <span>email : {OwnerDetails.CompanyMail}</span>
            </div>
          </div>
          <h1 className="text-sm font-normal text-teal-600">
            Invoice <span className="text-black">INV-{Details.InvoiceNo}</span>
          </h1>
        </div>

        {/* ── Bill Info ───────────────────────────────────────────────────── */}
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-2 w-full text-[10px] mt-4">
            <div className="bg-gray-50 p-2 rounded-lg">
              <h3 className="font-semibold mb-1">Billed To</h3>
              <p className="font-medium">{Details.CustomerName}</p>
              <p className="text-gray-600">{Details.CustomerAddress}</p>
            </div>
            <div className="text-[10px] font-sans text-gray-600 space-y-1 text-right">
              <div><span className="font-medium">Invoice Date:</span> {Details.IssueDate}</div>
              <div><span className="font-medium">Due Date:</span> {Details.DueDate}</div>
              <div>
                <span className="font-medium">Currency:</span>{" "}
                {mode === "india" ? "INR (₹)" : `${currency.code} (${currency.symbol})`}
              </div>
              {mode === "india" && (
                <div>
                  <span className="font-medium">Transaction:</span>{" "}
                  {txnType === "intra" ? "Intrastate" : txnType === "inter" ? "Interstate" : "Export / Exempt"}
                </div>
              )}
            </div>
          </div>

          <div className="p-2">
            <p className="font-normal text-[10px]">
              <span className="font-medium">{"Subject - "}</span>
              {Details.Subject}
            </p>
          </div>

          {/* ── Items Table ──────────────────────────────────────────────── */}
          <div className="mt-8 overflow-hidden border">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2 font-semibold">Item</th>

                  {/* India-only: HSN/SAC */}
                  {mode === "india" && (
                    <th className="text-center px-4 py-2 font-semibold">HSN/SAC</th>
                  )}

                  <th className="text-center px-4 py-2 font-semibold">Unit</th>
                  <th className="text-center px-4 py-2 font-semibold">Qty</th>
                  <th className="text-right px-4 py-2 font-semibold">Rate</th>
                  <th className="text-center px-4 py-2 font-semibold">Disc%</th>

                  {/* Tax columns — vary by mode + txnType */}
                  {mode === "india" && txnType === "intra" && (
                    <>
                      <th className="text-right px-2 py-2 font-semibold text-teal-700">CGST</th>
                      <th className="text-right px-2 py-2 font-semibold text-teal-700">SGST</th>
                    </>
                  )}
                  {mode === "india" && txnType === "inter" && (
                    <th className="text-right px-4 py-2 font-semibold text-blue-600" colSpan={2}>IGST</th>
                  )}
                  {mode === "india" && txnType === "export" && (
                    <th className="text-right px-4 py-2 font-semibold text-gray-400" colSpan={2}>Tax</th>
                  )}
                  {mode === "international" && (
                    <th className="text-right px-4 py-2 font-semibold text-amber-600">
                      {taxConfig.name || "Tax"} {parseFloat(taxConfig.rate) > 0 ? `(${taxConfig.rate}%)` : ""}
                    </th>
                  )}

                  <th className="text-right px-4 py-2 font-semibold">Amount</th>
                </tr>
              </thead>

              <tbody>
                {Items.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-none text-[8px]">
                    <td className="px-4 py-2">{item.description}</td>

                    {mode === "india" && (
                      <td className="px-4 py-2 text-center text-gray-500">{item.hsn || "—"}</td>
                    )}

                    <td className="px-4 py-2 text-center text-gray-500">{item.unit}</td>
                    <td className="px-4 py-2 text-center">{item.qty}</td>
                    <td className="px-4 py-2 text-right">{sym}{fmt(item.rate)}</td>
                    <td className="px-4 py-2 text-center text-gray-500">{item.discount}%</td>

                    {mode === "india" && txnType === "intra" && (
                      <>
                        <td className="px-2 py-2 text-right text-teal-600">{sym}{fmt(item.cgst)}</td>
                        <td className="px-2 py-2 text-right text-teal-600">{sym}{fmt(item.sgst)}</td>
                      </>
                    )}
                    {mode === "india" && txnType === "inter" && (
                      <td className="px-4 py-2 text-right text-blue-500" colSpan={2}>{sym}{fmt(item.igst)}</td>
                    )}
                    {mode === "india" && txnType === "export" && (
                      <td className="px-4 py-2 text-right text-gray-400" colSpan={2}>Exempt</td>
                    )}
                    {mode === "international" && (
                      <td className="px-4 py-2 text-right text-amber-600">
                        {parseFloat(taxConfig.rate) > 0 ? `${sym}${fmt(item.taxAmt)}` : "—"}
                      </td>
                    )}

                    <td className="px-4 py-2 text-right font-medium">{sym}{fmt(item.amt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Totals ───────────────────────────────────────────────────── */}
          <div className="flex justify-end mt-8">
            <div className="w-64 space-y-2">

              <div className="flex justify-between text-[10px] text-gray-600">
                <span>Subtotal</span>
                <span className="tabular-nums">{sym}{fmt(subTotal)}</span>
              </div>

              {/* India intrastate */}
              {mode === "india" && txnType === "intra" && (
                <>
                  <div className="flex justify-between text-[10px] text-teal-600">
                    <span>CGST</span>
                    <span className="tabular-nums">{sym}{fmt(totalCgst)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-teal-600">
                    <span>SGST</span>
                    <span className="tabular-nums">{sym}{fmt(totalSgst)}</span>
                  </div>
                </>
              )}

              {/* India interstate */}
              {mode === "india" && txnType === "inter" && (
                <div className="flex justify-between text-[10px] text-blue-500">
                  <span>IGST</span>
                  <span className="tabular-nums">{sym}{fmt(totalIgst)}</span>
                </div>
              )}

              {/* India export */}
              {mode === "india" && txnType === "export" && (
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Tax</span>
                  <span>Exempt / 0%</span>
                </div>
              )}

              {/* International */}
              {mode === "international" && parseFloat(taxConfig.rate) > 0 && (
                <div className="flex justify-between text-[10px] text-amber-600">
                  <span>{taxConfig.name || "Tax"} ({taxConfig.rate}%)</span>
                  <span className="tabular-nums">{sym}{fmt(totalTax)}</span>
                </div>
              )}
              {mode === "international" && parseFloat(taxConfig.rate) === 0 && (
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>{taxConfig.name || "Tax"}</span>
                  <span>Exempt / 0%</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-300">
                <span>Total</span>
                <span className="tabular-nums">{sym}{fmt(Total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment Details ─────────────────────────────────────────────────── */}
      <div className="w-auto mt-8 border-t border-gray-100 py-4 px-2">
        <h3 className="font-semibold text-[10px]">PAYMENT DETAILS</h3>
        {OwnerDetails.paymentMethod === "Bank" ? (
          <div className="flex flex-col items-start text-[10px] text-gray-600 p-1 my-2 font-light">
            <span><span className="text-gray-700">Owner Name : </span>{OwnerDetails.OwnerName}</span>
            <span><span className="text-gray-900">Account Number : </span>{OwnerDetails.AccountNumber}</span>
            <span><span className="text-gray-900">Bank Name : </span>{OwnerDetails.BankName}</span>
            <span><span className="text-gray-900">Bank Address : </span>{OwnerDetails.BankAddress}</span>
            <span><span className="text-gray-900">Bank Code : </span>{OwnerDetails.BankCode}</span>
            <span><span className="text-gray-900">Ph : </span>{OwnerDetails.PhNo}</span>
          </div>
        ) : (
          OwnerDetails.QR !== "" && (
            <div className="flex flex-col justify-center items-start gap-2">
              <Image
                alt="qr-image"
                className="border border-neutral-400 rounded-xs p-1"
                src={OwnerDetails.QR}
                width={100}
                height={100}
              />
              <span className="font-semibold text-xs tracking-wide text-neutral-800">
                UPI-ID : {OwnerDetails.UPIID}
              </span>
            </div>
          )
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="mt-auto border-t border-gray-200">
        <div className="p-1">
          <p className="font-normal text-gray-500 text-[10px]">
            <span className="font-medium text-gray-700">Additional Information</span>
            <br />
            {AdditionalInfo}
          </p>
        </div>
        <div className="p-1 mt-2">
          <p className="font-normal text-gray-500 text-[10px]">
            <span className="font-medium text-gray-700">Terms & Conditions</span>
            <br />
            {TermsConditions}
          </p>
        </div>
      </div>

    </div>
  );
}