"use client";

import React, { useState } from "react";
import { useCustomerStore } from "@/app/store/CustomerDetail";
import { useOptionalData } from "@/app/store/OptionalDataStore";
import { useOwner } from "@/app/store/OwnerDetail";
import { useItemsStore } from "@/app/store/InvoiceTabel";
import List from "@/app/Icons/List";
import OpenArrow from "@/app/Icons/OpenArrow";
import AddInfo from "@/app/Icons/AddInfo";
import Info from "@/app/Icons/Info";
import Preview from "@/app/component/Preview";
import QR from "@/app/Icons/QR";
import Image from "next/image";
import ImageAlt from "@/app/Icons/Img";
import SeePassword from "@/app/Icons/SeePassword";
import Docs from "@/app/Icons/Doc";
import Both from "@/app/Icons/Both";
import ItemsTable from "./Table";
import { Save, Send, CheckCircle2, AlertCircle, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function fileToBase64(file: globalThis.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject("Failed to convert file");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file as Blob);
  });
}

export const CURRENCY_OPTIONS = [
  { code: "INR", symbol: "₹", label: "INR (₹) - Indian Rupee" },
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound" },
  { code: "AED", symbol: "AED", label: "AED - UAE Dirham" },
];

export const INVOICE_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function CreateInvoice() {
  const [display, setDisplay] = useState("Form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED"
  >("PENDING");

  // Custom Toast Notification State
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error" = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 15000);
  };

  const session = authClient.useSession();
  const userID = session.data?.user?.id;

  const { Details } = useCustomerStore();
  const { mode, txnType, subTotal, totalCgst, totalSgst, totalIgst, totalTax, Total } =
    useItemsStore();

  const handleSubmit = async (overrideStatus?: "DRAFT" | "PENDING") => {
    if (!userID) {
      showToast("Authentication required. Please sign in to create an invoice.", "error");
      return;
    }

    setIsSubmitting(true);
    const finalStatus = overrideStatus || paymentStatus;

    let computedTax = 0;
    if (mode === "india") {
      if (txnType === "intra") computedTax = totalCgst + totalSgst;
      else if (txnType === "inter") computedTax = totalIgst;
    } else {
      computedTax = totalTax;
    }

    try {
      const payload = {
        invoiceNumber: Details.InvoiceNo || `INV-${Date.now()}`,
        CustomerName: Details.CustomerName || null,
        CustomerEmail: Details.CustomerEmail || null,
        CustomerAddress: Details.CustomerAddress || null,
        Subject: Details.Subject || null,
        IssueDate: Details.IssueDate ? new Date(Details.IssueDate).toISOString() : new Date().toISOString(),
        DueDate: Details.DueDate ? new Date(Details.DueDate).toISOString() : new Date().toISOString(),
        Currency: Details.Currency || "INR",

        subtotal: subTotal,
        tax: computedTax,
        discount: 0.0,
        total: Total,

        paymentStatus: finalStatus,
        userId: userID,
      };

      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to save invoice");
      }

      showToast(`Invoice successfully created with status: ${finalStatus}!`, "success");
    } catch (error: any) {
      console.error("Failed to submit invoice:", error);
      showToast(error.message || "Something went wrong while saving the invoice.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#FAFAFA] border-zinc-200 rounded-sm transition-all duration-500 ease-in-out font-mono relative">
      {/* Toast Notification Bar */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xs border shadow-lg transition-all duration-300 text-xs font-sans ${
            toast.type === "success"
              ? "bg-emerald-950 border-emerald-800 text-emerald-100"
              : "bg-rose-950 border-rose-800 text-rose-100"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-2 hover:opacity-75 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top View Switcher Header */}
      <div className="bg-white border-b border-zinc-200 inset-0 p-2 px-6 flex justify-between items-center shrink-0">
        <div className="text-xs font-bold uppercase text-zinc-800 tracking-wider">
          New Invoice
        </div>

        <div className="bg-zinc-100 lg:w-62 w-44 py-1 px-1 gap-1.5 flex justify-center items-center rounded-md border border-zinc-200/60">
          <button
            onClick={() => setDisplay("Form")}
            className={`text-zinc-500 text-xs flex hover:text-zinc-900 duration-200 ease-in-out cursor-pointer px-2.5 py-1 rounded-md ${
              display === "Form"
                ? "bg-white shadow-xs text-zinc-900 font-semibold border border-zinc-200/80"
                : ""
            } lg:flex justify-center items-center gap-1.5`}
          >
            <Docs />
            Form
          </button>
          <button
            onClick={() => setDisplay("Both")}
            className={`text-zinc-500 text-xs flex hover:text-zinc-900 duration-200 ease-in-out cursor-pointer px-2.5 py-1 rounded-md ${
              display === "Both"
                ? "bg-white shadow-xs text-zinc-900 font-semibold border border-zinc-200/80"
                : ""
            } hidden lg:flex justify-center items-center gap-1.5`}
          >
            <Both />
            Both
          </button>
          <button
            onClick={() => setDisplay("Preview")}
            className={`text-zinc-500 text-xs flex hover:text-zinc-900 duration-200 ease-in-out cursor-pointer px-2.5 py-1 rounded-md ${
              display === "Preview"
                ? "bg-white shadow-xs text-zinc-900 font-semibold border border-zinc-200/80"
                : ""
            } lg:flex justify-center items-center gap-1.5`}
          >
            <SeePassword />
            Preview
          </button>
        </div>
      </div>

      {/* Dynamic Body Views */}
      {display === "Both" && (
        <div className="lg:flex-row flex flex-col overflow-auto w-full relative gap-3 p-3 transition-all duration-500 ease-in-out flex-1 min-h-0">
          <div className="flex-1 min-w-0 overflow-auto custom-scrollbar duration-300 ease-in-out">
            <FormComponent
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
            />
          </div>

          <div className="flex-1 min-w-0 overflow-hidden duration-300 ease-in-out bg-white border border-zinc-200/80 rounded-sm">
            <Preview />
          </div>
        </div>
      )}

      {display === "Form" && (
        <div className="flex-1 min-w-0 overflow-auto custom-scrollbar duration-300 ease-in-out p-3">
          <FormComponent
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            paymentStatus={paymentStatus}
            setPaymentStatus={setPaymentStatus}
          />
        </div>
      )}

      {display === "Preview" && (
        <div className="flex-1 min-w-0 overflow-hidden duration-300 ease-in-out p-3">
          <div className="h-full bg-white border border-zinc-200/80 rounded-sm p-2">
            <Preview />
          </div>
        </div>
      )}
    </div>
  );
}

function FormComponent({
  onSubmit,
  isSubmitting,
  paymentStatus,
  setPaymentStatus,
}: {
  onSubmit: (status?: "DRAFT" | "PENDING") => void;
  isSubmitting: boolean;
  paymentStatus: "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  setPaymentStatus: (status: "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED") => void;
}) {
  const [expand, setExpand] = useState(true);

  const { DetailHandler, Details } = useCustomerStore();
  const { OwnerDetailHandler, OwnerDetails } = useOwner();

  interface Owner {
    CompanyName: string;
    CompanyAddress: string;
    TaxDetail: string;
    CompanyMail: string;
    OwnerName: string;
    PhNo: string;
    AccountNumber: string;
    BankName: string;
    BankCode: string;
    BankAddress: string;
  }

  interface OwnerField {
    label: string;
    name: keyof Owner;
    placeholder: string;
  }

  const OwnerFieldList: OwnerField[] = [
    { label: "Company Name", name: "CompanyName", placeholder: "Company name" },
    { label: "Company Address", name: "CompanyAddress", placeholder: "Company Address" },
    { label: "Tax Details", name: "TaxDetail", placeholder: "Tax Details (e.g., GSTIN / VAT)" },
    { label: "Company Mail", name: "CompanyMail", placeholder: "billing@company.com" },
  ];

  type CustomerDetails = {
    CustomerName: string;
    CustomerEmail: string;
    CustomerAddress: string;
    DueDate: string;
    IssueDate: string;
    InvoiceNo: string;
    Currency: string;
    Subject: string;
  };

  interface Field {
    label: string;
    name: keyof CustomerDetails;
    type?: string;
    placeholder?: string;
  }

  const customerFields: Field[] = [
    { label: "Customer Name", name: "CustomerName", placeholder: "Customer name or Organization" },
    { label: "Customer Email", name: "CustomerEmail", placeholder: "client@example.com", type: "email" },
    { label: "Customer Address", name: "CustomerAddress", placeholder: "Billing address" },
    { label: "Subject", name: "Subject", placeholder: "Invoice subject or Project", type: "text" },
    { label: "Invoice Serial #", name: "InvoiceNo", placeholder: "INV-2026-001", type: "text" },
    { label: "Issue Date", name: "IssueDate", type: "date" },
    { label: "Due Date", name: "DueDate", type: "date" },
  ];

  const [logo, setLogo] = useState("");

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    setLogo(base64);
    OwnerDetailHandler("companyLogo", base64);
  };

  return (
    <div className="w-full scroll-smooth pb-12">
      <form className="w-full space-y-3 px-1" onSubmit={(e) => e.preventDefault()}>
        {/* Organization's Detail Card */}
        <div className="p-5 rounded-xs bg-white border border-zinc-200/80 shadow-xs">
          <h1 className="text-xs font-semibold uppercase tracking-wider mb-3 text-zinc-800">
            {`Organization's Detail`}
          </h1>
          <div className="grid grid-cols-2 gap-3.5 w-full">
            <div className="col-span-2">
              <div className="w-full border border-dashed border-zinc-300 rounded-sm group px-4 py-6 cursor-pointer bg-zinc-50/50 hover:bg-zinc-100/50 transition flex flex-col gap-2 items-center justify-center">
                <input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                <label htmlFor="logo" className="cursor-pointer">
                  <div className="rounded-xs flex justify-center items-center">
                    {logo !== "" ? (
                      <Image alt="Company Logo" src={logo} width={120} height={120} className="object-contain" />
                    ) : (
                      <ImageAlt />
                    )}
                  </div>
                </label>
                <p className="text-zinc-500 whitespace-pre-line text-center text-xs">
                  {`Drag and drop your company logo here, or `}
                  <span className="text-teal-700 font-semibold">browse file</span>
                </p>
              </div>
            </div>

            {OwnerFieldList.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-zinc-600 tracking-wide text-xs">{f.label}</div>
                <input
                  className="border border-zinc-200 bg-white px-3 py-2 rounded-xs text-zinc-800 text-xs hover:border-zinc-400 focus:outline-teal-700 w-full transition"
                  name={f.name}
                  placeholder={f.placeholder}
                  value={OwnerDetails[f.name] || ""}
                  type="text"
                  onChange={(e) => OwnerDetailHandler(f.name, e.currentTarget.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Customer's Detail Card */}
        <div className="p-5 rounded-xs bg-white border border-zinc-200/80 shadow-xs">
          <h1 className="text-xs font-semibold uppercase tracking-wider mb-3 text-zinc-800">
            {`Customer's Detail`}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
            {customerFields.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-zinc-600 tracking-wide text-xs">{f.label}</div>
                <input
                  className="border border-zinc-200 bg-white px-3 py-2 rounded-xs w-full text-zinc-800 text-xs hover:border-zinc-400 focus:outline-teal-700 transition"
                  name={f.name}
                  placeholder={f.placeholder}
                  type={f.type || "text"}
                  value={Details[f.name] || ""}
                  onChange={(e) => DetailHandler(f.name, e.currentTarget.value)}
                />
              </div>
            ))}

            {/* Currency Select Dropdown */}
            <div className="flex flex-col gap-1 w-full">
              <div className="text-zinc-600 tracking-wide text-xs">Currency</div>
              <select
                className="border border-zinc-200 bg-white px-3 py-2 rounded-xs text-zinc-800 text-xs hover:border-zinc-400 focus:outline-teal-700 w-full transition cursor-pointer"
                value={Details.Currency || "INR"}
                onChange={(e) => DetailHandler("Currency", e.target.value)}
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment / Invoice Status Selector UI */}
            <div className="flex flex-col gap-1 w-full">
              <div className="text-zinc-600 tracking-wide text-xs">Invoice Status</div>
              <select
                className="border border-zinc-200 bg-white px-3 py-2 rounded-xs text-zinc-800 text-xs font-semibold hover:border-zinc-400 focus:outline-teal-700 w-full transition cursor-pointer"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
              >
                {INVOICE_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label} ({status.value})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Items Table Section */}
        <div
          className={`${
            expand ? "max-h-[800px] overflow-auto" : "max-h-12 overflow-hidden"
          } duration-500 ease-in-out custom-scrollbar border text-xs font-bold px-2 bg-white border-zinc-200/80 shadow-xs py-1 rounded-xs transition-all`}
        >
          <div
            className="flex items-center duration-300 ease-in-out justify-between group p-2.5 text-zinc-700 cursor-pointer"
            onClick={() => setExpand(!expand)}
          >
            <div className="flex items-center gap-2">
              <List />
              <span>Line Items Table</span>
            </div>
            <div
              className={`${
                expand ? "rotate-180" : ""
              } duration-500 ease-in-out transition-all text-zinc-500 group-hover:text-zinc-900`}
            >
              <OpenArrow />
            </div>
          </div>

          <div
            className={`rounded-lg py-3 transition-opacity duration-500 ease-in-out ${
              expand ? "translate-y-0" : "pointer-events-none opacity-0"
            }`}
          >
            <ItemsTable />
          </div>
        </div>

        {/* Payment Options Section */}
        <PaymentOptions />

        {/* Additional Info Section */}
        <InfoParent />

        {/* Bottom Submission Toolbar */}
        <div className="flex items-center justify-end gap-2 pt-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSubmit("DRAFT")}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xs shadow-2xs cursor-pointer transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-zinc-500" />
            {isSubmitting ? "Saving..." : "Save Draft"}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSubmit()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-zinc-950 text-white hover:bg-black rounded-xs shadow-2xs cursor-pointer transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? "Issuing..." : `Save as ${paymentStatus}`}
          </button>
        </div>
      </form>
    </div>
  );
}

interface AddInfoProps {
  Title: string;
  Message: string;
  Placeholder: string;
}

function InfoParent() {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-xs text-xs font-bold px-3 py-4 shadow-xs duration-500 ease-in-out transition-all">
      <div className="flex items-center gap-1.5 pb-2 text-zinc-800 border-b border-zinc-100">
        <AddInfo />
        <span className="tracking-wide text-xs font-semibold uppercase">Additional Information</span>
      </div>

      <AddInfoComponent
        Title="Additional Information"
        Placeholder="Note - Add a message or special instructions for your customer"
        Message="Additional notes for the invoice"
      />
      <AddInfoComponent
        Title="Terms"
        Placeholder="Terms & Conditions - Enter payment terms, late fees, or other conditions"
        Message="Terms & Conditions for the invoice"
      />
    </div>
  );
}

function AddInfoComponent({ Title, Message, Placeholder }: AddInfoProps) {
  const { HandleInfo, HandleTerms } = useOptionalData();

  return (
    <div className="px-1 py-1 font-normal mt-2.5">
      <div className="flex items-center gap-2">
        <span className="text-zinc-600 font-medium text-xs">{Title}</span>
        <span className="bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-xs px-1.5 py-0.5 text-[8px] uppercase tracking-wide">
          Optional
        </span>
      </div>
      <textarea
        name="note"
        className="bg-white text-zinc-800 focus:outline-teal-700 border border-zinc-200 w-full h-24 resize-none p-2.5 mt-1.5 rounded-xs text-xs transition"
        placeholder={Placeholder}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (Title === "Terms") HandleTerms(e.currentTarget.value);
          else HandleInfo(e.currentTarget.value);
        }}
      />
      <div className="flex items-center text-xs gap-1 mt-1 text-zinc-400">
        <Info />
        <span className="text-zinc-500 text-[10px]">{Message}</span>
      </div>
    </div>
  );
}

function PaymentOptions() {
  interface Owner {
    CompanyName: string;
    CompanyAddress: string;
    TaxDetail: string;
    CompanyMail: string;
    OwnerName: string;
    PhNo: string;
    AccountNumber: string;
    BankName: string;
    BankCode: string;
    BankAddress: string;
  }

  interface OwnerField {
    label: string;
    name: keyof Owner;
    placeholder: string;
  }

  const bankFields: OwnerField[] = [
    { label: "Account Holder Name", name: "OwnerName", placeholder: "Account Holder Name" },
    { label: "Phone Number", name: "PhNo", placeholder: "Contact phone number" },
    { label: "Bank Name", name: "BankName", placeholder: "Bank Name" },
    { label: "Account Number", name: "AccountNumber", placeholder: "Account Number" },
    { label: "Bank Address", name: "BankAddress", placeholder: "Branch address" },
    { label: "Bank Code / IFSC / SWIFT", name: "BankCode", placeholder: "e.g., SBIN0001234 or SWIFT code" },
  ];

  const [option, setOption] = useState("UPI");
  const [url, setUrl] = useState("");
  const { OwnerDetailHandler, OwnerDetails } = useOwner();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setUrl(base64);
    OwnerDetailHandler("QR", base64);
  };

  return (
    <div className="bg-white border border-zinc-200/80 text-xs font-bold px-3 py-4 shadow-xs rounded-xs duration-500 ease-in-out transition-all">
      <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-100">
        <span className="text-zinc-800 tracking-wide font-semibold text-xs uppercase">Payment Options</span>
      </div>

      <div className="h-full w-full mt-2">
        <div className="p-1 w-full h-auto flex justify-between items-center gap-2 bg-zinc-100 border border-zinc-200/60 rounded-xs">
          <button
            type="button"
            className={`w-full flex justify-center cursor-pointer p-1.5 duration-200 ease-in-out text-xs font-medium rounded-xs ${
              option === "Bank"
                ? "bg-white text-zinc-900 shadow-2xs border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
            onClick={() => {
              setOption("Bank");
              OwnerDetailHandler("paymentMethod", "Bank");
            }}
          >
            Bank Transfer
          </button>
          <button
            type="button"
            className={`w-full flex justify-center cursor-pointer p-1.5 duration-200 ease-in-out text-xs font-medium rounded-xs ${
              option === "UPI"
                ? "bg-white text-zinc-900 shadow-2xs border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
            onClick={() => {
              setOption("UPI");
              OwnerDetailHandler("paymentMethod", "UPI");
            }}
          >
            UPI / QR Code
          </button>
        </div>
      </div>

      {option === "UPI" && (
        <div className="mt-3">
          <div className="w-full min-h-60 group border border-dashed border-zinc-300 rounded-sm p-4 flex-1 cursor-pointer bg-zinc-50/50 hover:bg-zinc-100/50 transition flex flex-col gap-2 items-center justify-center">
            <input id="QR" type="file" accept="image/*" className="hidden" onChange={handleChange} />
            <label htmlFor="QR" className="cursor-pointer">
              <div className="rounded-xs flex justify-center items-center">
                {url !== "" ? (
                  <Image alt="QR Code" src={url} width={120} height={120} className="object-contain" />
                ) : (
                  <QR />
                )}
              </div>
            </label>
            <p className="text-zinc-500 whitespace-pre-line text-center text-xs font-normal">
              {`Drag and drop your saved QR image here, or `}
              <span className="text-teal-700 font-semibold">browse file</span>
            </p>
            <input
              className="border border-zinc-200 rounded-xs px-3 py-2 w-64 text-zinc-800 font-normal tracking-wide bg-white outline-none focus:border-teal-700 text-xs transition mt-1"
              placeholder="UPI-ID (e.g. name@upi or VPA)"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => OwnerDetailHandler("UPIID", e.currentTarget.value)}
            />
          </div>
        </div>
      )}

      {option === "Bank" && (
        <div className="bg-white w-full h-full min-h-60 p-2 mt-2 duration-300 ease-in-out flex justify-center items-center">
          <div className="grid grid-cols-2 gap-3.5 w-full">
            {bankFields.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-zinc-600 tracking-wide text-xs font-normal">{f.label}</div>
                <input
                  className="border border-zinc-200 bg-white px-3 py-2 rounded-xs text-zinc-800 font-normal text-xs hover:border-zinc-400 focus:outline-teal-700 w-full transition"
                  name={f.name}
                  placeholder={f.placeholder}
                  value={OwnerDetails[f.name] || ""}
                  type="text"
                  onChange={(e) => OwnerDetailHandler(f.name, e.currentTarget.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}