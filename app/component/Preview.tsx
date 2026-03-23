"use client";

// import axios from "axios";
// import Create from "../Icons/Create";
import Download from "../Icons/Download";
import Draft from "../Icons/Draft";
import Minus from "../Icons/Minus";
import Plus from "../Icons/Plus";
import InvoicePreview from "./InvoicePreview";
import { useState } from "react";
// import { Session } from "next-auth";
// import { useOwner } from "../store/OwnerDetail";
// import { useCustomerStore } from "../store/CustomerDetail";
// import { ItemsStore } from "../store/InvoiceTabel";
// import { useOptionalData } from "../store/OptionalDataStore";
// import { useSession } from "next-auth/react";


// type ItemsDetail = {
//   description: string;
//   qty: string;
//   rate: string;
//   discount: string;
//   amt: string;
// };

// interface InvoiceDetails {
//   OwnerName: string;
//   PhNo: string;
//   AccountNumber: string;
//   BankName: string;
//   BankCode: string;
//   BankAddress: string;
//   CustomerName: string;
//   CustomerAddress: string;
//   DueDate: string;
//   InvoiceNo: string;
//   Currency: string;
//   Subject: string;
//   InvoiceId: string;
//   IssueDate: string;
//   AdditionalInfo: string;
//   Terms: string;
//   ItemsTable: ItemsDetail[];
//   subtotal: string;
//   tax: string;
//   discount?: string;
//   total: string;
//   BrandLogo: string;
//   Signature?: string;
//   userId: string;
// }

export default function Preview() {
  const [loading, setLoading] = useState(false);

  const [scaler, setScale] = useState(0.7);
  // const { data: session, status } = useSession();

  // const { OwnerDetails } = useOwner();
  // const { Details } = useCustomerStore();
  // const { AdditionalInfo, TermsConditions } = useOptionalData();
  // const {  Items } = ItemsStore();



  async function handleDownload() {
    try {
      setLoading(true);

     const invoiceHTML =  document.getElementById("invoice")?.innerHTML;
      


      if (!invoiceHTML) {
        alert("Invoice not found");
        return;
      }

      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: invoiceHTML }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice1.pdf";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
    } finally {
      setLoading(false);
    }

    // const InvDetails: InvoiceDetails = {
    //   ...OwnerDetails,
    //   ItemsTable: Items,
    //   ...Details,
    //   AdditionalInfo: AdditionalInfo,
    //   Terms: TermsConditions,
    //   subtotal: "0",
    //   tax: "0",
    //   userId : '',
    //   BrandLogo: "aaa",
    //   Signature: "aaa",
    //   InvoiceId: "hhh",
    //   IssueDate: "aaaa",
    //   total: "aaa",
    // };

    // const uploadInv = await axios.post(
    //   "/api/CreateInvoice",
    //   //  header : {"Content-Type" : "application/json"},
    //   InvDetails,
    // );
    // console.log(uploadInv.data);
  }

  return (
    <div className=" h-full  bg-neutral-950 flex flex-col items-center py-2 ">
      {/* <div className=" font-semibold w-full  border-gray-900 text-gray-500 tracking-wider p-4">Preview</div> */}

      <div className="w-full text-xs flex justify-end gap-2 p-4">
        <button
          onClick={handleDownload}
          disabled={loading}
          className="px-2 py-1 bg-teal-600 rounded-md  hover:bg-teal-700 flex items-center gap-1 disabled:opacity-60"
        >
          <Download />
          {loading ? "Generating..." : "Download"}
        </button>

        <button className="px-2 bg-gray-300 py-1 border border-gray-900 rounded-md hover:bg-gray-200 flex items-center gap-1">
          <Draft />
          Save as Draft
        </button>
      </div>
<div className="relative bg-zinc-900 w-[95%] flex-1 rounded-sm border border-neutral-900 overflow-auto flex justify-center custom-scrollbar">

  {/* centering wrapper */}
  <div className="flex  items-start min-h-full py-5  overflow-auto custom-scrollbar">

    {/* scale wrapper */}
    <div
      style={{
        transform: `scale(${scaler})`,
        transformOrigin: "top center",
      }}
      className="transition-transform duration-200"
    >
      {/* real invoice size */}
      <div id="invoice" className="w-[794px] h-[1123px] bg-white shadow-lg">
        <InvoicePreview />
      </div>
    </div>

  </div>

  {/* zoom controls */}
  <div className="flex flex-col bg-gray-200 justify-center items-center w-10 py-2 rounded-sm gap-4 fixed bottom-15 right-8">
    <button
      onClick={() => setScale((e) => (e >= 1.5 ? e : e + 0.1))}
      className="active:scale-80 hover:text-gray-700"
    >
      <Plus />
    </button>

    <button
      onClick={() => setScale((e) => (e <= 0.5 ? e : e - 0.1))}
      className="active:scale-80 hover:text-gray-700"
    >
      <Minus />
    </button>
  </div>

</div>
    </div>
  );
}
