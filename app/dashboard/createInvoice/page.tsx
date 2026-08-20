"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCustomerStore } from "@/app/store/CustomerDetail";
import { useOptionalData } from "@/app/store/OptionalDataStore";
import { useOwner } from "@/app/store/OwnerDetail";
import { useItemsStore, CURRENCIES, type Currency } from "@/app/store/InvoiceTabel";
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
import { Save, Send, CheckCircle2, AlertCircle, X, Sparkles, RotateCcw, Zap, ArrowUpRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function fileToBase64(file: globalThis.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to convert file"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file as Blob);
  });
}

function sanitizeString(value: unknown): string | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export type InvoicePaymentStatus = "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

const INVOICE_STATUS_OPTIONS: { value: InvoicePaymentStatus; label: string }[] = [
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
  const [display, setDisplay] = useState<string>("Form");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<InvoicePaymentStatus>("PENDING");

  // User Plan & Downloads Telemetry State
  const [userPlan, setUserPlan] = useState<"FREE" | "PRO">("FREE");
  const [downloadsUsed, setDownloadsUsed] = useState<number>(0);
  const MONTHLY_LIMIT = 5;

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message: string, type: "success" | "error" = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  const session = authClient.useSession();
  const userID = session.data?.user?.id;

  const { Details } = useCustomerStore();
  const { mode, txnType, subTotal, totalCgst, totalSgst, totalIgst, totalTax, Total, Items } =
    useItemsStore();

  // Fetch initial telemetry for current user plan and quota
  useEffect(() => {
    async function fetchUserTelemetry() {
      try {
        const res = await fetch("/api/settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const dbUser = data?.user || {};
          if (dbUser.plan) setUserPlan(dbUser.plan);
          if (typeof dbUser.downloads === "number") setDownloadsUsed(dbUser.downloads);
        }
      } catch (err) {
        console.error("Failed to load user quota telemetry:", err);
      }
    }
    fetchUserTelemetry();
  }, []);

  const isPro = userPlan === "PRO";
  const downloadsRemaining = Math.max(0, MONTHLY_LIMIT - downloadsUsed);

  const handleSubmit = async (overrideStatus?: "DRAFT" | "PENDING") => {
    if (!userID) {
      showToast("Authentication required. Please sign in to create an invoice.", "error");
      return;
    }

    const finalStatus = overrideStatus || paymentStatus;

    if (finalStatus !== "DRAFT" && (!Items || Items.length === 0)) {
      showToast("Please add at least one line item before issuing an invoice.", "error");
      return;
    }

    const cleanCustomerName = sanitizeString(Details.CustomerName);
    if (finalStatus !== "DRAFT" && !cleanCustomerName) {
      showToast("Customer Name is required to issue an invoice.", "error");
      return;
    }

    if (!Details.IssueDate || !Details.DueDate) {
      showToast("Please provide valid Issue and Due dates.", "error");
      return;
    }

    setIsSubmitting(true);

    let computedTax = 0;
    if (mode === "india") {
      if (txnType === "intra") computedTax = totalCgst + totalSgst;
      else if (txnType === "inter") computedTax = totalIgst;
    } else {
      computedTax = totalTax;
    }

    try {
      const payload = {
        invoiceNumber: sanitizeString(`INV-${Details.InvoiceNo}`) || `INV-${Date.now()}`,
        CustomerName: cleanCustomerName,
        CustomerEmail: sanitizeString(Details.CustomerEmail),
        CustomerAddress: sanitizeString(Details.CustomerAddress),
        Subject: sanitizeString(Details.Subject),
        IssueDate: new Date(Details.IssueDate).toISOString(),
        DueDate: new Date(Details.DueDate).toISOString(),
        Currency: sanitizeString(Details.Currency) || "INR",

        subtotal: subTotal || 0,
        tax: computedTax || 0,
        discount: 0.0,
        total: Total || 0,

        paymentStatus: finalStatus,
        userId: userID,
      };

      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to save invoice");
      }

      showToast(`Invoice successfully created with status: ${finalStatus}!`, "success");
    } catch (error: unknown) {
      console.error("Failed to submit invoice:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong while saving the invoice.";
      showToast(errorMessage, "error");
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
            type="button"
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-2 hover:opacity-75 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Telemetry & View Switcher Header */}
      <div className="bg-white border-b border-zinc-200 inset-0 p-2 px-4 sm:px-6 flex flex-wrap justify-between items-center shrink-0 gap-2">
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold uppercase text-zinc-800 tracking-wider">
            New Invoice
          </div>

          {/* Download Quota Badge */}
          {isPro ? (
            <div className="flex items-center gap-1 text-[10px] font-mono text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-2xs font-bold">
              <Zap className="w-3 h-3 text-teal-600" />
              <span>PRO UNLIMITED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-mono bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-2xs text-zinc-600">
              <span>QUOTA:</span>
              <span className={`font-bold ${downloadsRemaining === 0 ? "text-red-600" : "text-zinc-900"}`}>
                {downloadsUsed}/{MONTHLY_LIMIT}
              </span>
              <span className="text-zinc-400 font-sans">({downloadsRemaining} left)</span>
              <Link href="/dashboard/pricing" className="text-teal-700 hover:underline font-bold ml-1 flex items-center">
                Upgrade <ArrowUpRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          )}
        </div>

        <div className="bg-zinc-100 lg:w-62 w-44 py-1 px-1 gap-1.5 flex justify-center items-center rounded-md border border-zinc-200/60">
          <button
            type="button"
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
            type="button"
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
            type="button"
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
              showToast={showToast}
              onTelemetryUpdate={(plan, downloads) => {
                setUserPlan(plan);
                setDownloadsUsed(downloads);
              }}
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
            showToast={showToast}
            onTelemetryUpdate={(plan, downloads) => {
              setUserPlan(plan);
              setDownloadsUsed(downloads);
            }}
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
  showToast,
  onTelemetryUpdate,
}: {
  onSubmit: (status?: "DRAFT" | "PENDING") => void;
  isSubmitting: boolean;
  paymentStatus: InvoicePaymentStatus;
  setPaymentStatus: (status: InvoicePaymentStatus) => void;
  showToast: (message: string, type?: "success" | "error") => void;
  onTelemetryUpdate: (plan: "FREE" | "PRO", downloads: number) => void;
}) {
  const [expand, setExpand] = useState<boolean>(true);
  const [autoPrefill, setAutoPrefill] = useState<boolean>(true);
  const [isPrefilling, setIsPrefilling] = useState<boolean>(false);

  const { DetailHandler, Details } = useCustomerStore();
  const { OwnerDetailHandler, OwnerDetails } = useOwner();
  const { HandleInfo, HandleTerms, AdditionalInfo, TermsConditions } = useOptionalData();
  const { setCurrency, setMode, currency } = useItemsStore();

  const [logo, setLogo] = useState<string>("");

  const loadProfileDefaults = useCallback(async () => {
    setIsPrefilling(true);
    try {
      const res = await fetch("/api/settings", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const dbUser = data?.user || {};
        const p = data?.payoutProfile || dbUser?.payoutProfile || {};

        if (dbUser.plan) {
          onTelemetryUpdate(dbUser.plan, dbUser.downloads ?? 0);
        }

        // 1. Organization & Owner Defaults
        if (dbUser.companyName) OwnerDetailHandler("CompanyName", dbUser.companyName);
        if (dbUser.taxDetails) OwnerDetailHandler("TaxDetail", dbUser.taxDetails);
        if (dbUser.companyMail) OwnerDetailHandler("CompanyMail", dbUser.companyMail);
        if (dbUser.companyAddress) OwnerDetailHandler("CompanyAddress", dbUser.companyAddress);

        if (p.companyLogoUrl) {
          setLogo(p.companyLogoUrl);
          OwnerDetailHandler("companyLogo", p.companyLogoUrl);
        }

        if (p.ownerName) OwnerDetailHandler("OwnerName", p.ownerName);
        if (p.phoneNumber) OwnerDetailHandler("PhNo", p.phoneNumber);
        if (p.bankName) OwnerDetailHandler("BankName", p.bankName);
        if (p.accountNumber) OwnerDetailHandler("AccountNumber", p.accountNumber);
        if (p.bankAddress) OwnerDetailHandler("BankAddress", p.bankAddress);
        if (p.bankCode) OwnerDetailHandler("BankCode", p.bankCode);
        if (p.upiId) OwnerDetailHandler("UPIID", p.upiId);
        if (p.upiQrImageUrl) OwnerDetailHandler("QR", p.upiQrImageUrl);

        // 2. Additional Info & Terms Defaults
        if (dbUser.additionalInfo) HandleInfo(dbUser.additionalInfo);
        if (dbUser.termsAndConditions) HandleTerms(dbUser.termsAndConditions);

        showToast("Profile defaults pre-filled successfully!", "success");
      }
    } catch (err) {
      console.error("Failed to load prefill settings:", err);
      showToast("Failed to fetch settings defaults.", "error");
    } finally {
      setIsPrefilling(false);
    }
  }, [OwnerDetailHandler, HandleInfo, HandleTerms, showToast, onTelemetryUpdate]);

  const clearProfileDefaults = useCallback(() => {
    OwnerDetailHandler("CompanyName", "");
    OwnerDetailHandler("TaxDetail", "");
    OwnerDetailHandler("companyLogo", "");
    OwnerDetailHandler("CompanyMail", "");
    OwnerDetailHandler("CompanyAddress", "");
    setLogo("");

    OwnerDetailHandler("OwnerName", "");
    OwnerDetailHandler("PhNo", "");
    OwnerDetailHandler("BankName", "");
    OwnerDetailHandler("AccountNumber", "");
    OwnerDetailHandler("BankAddress", "");
    OwnerDetailHandler("BankCode", "");
    OwnerDetailHandler("UPIID", "");
    OwnerDetailHandler("QR", "");

    HandleInfo("");
    HandleTerms("");

    showToast("Cleared profile defaults from form.", "success");
  }, [OwnerDetailHandler, HandleInfo, HandleTerms, showToast]);

  useEffect(() => {
    if (autoPrefill) {
      loadProfileDefaults();
    }
  }, []);

  const handleTogglePrefill = (checked: boolean) => {
    setAutoPrefill(checked);
    if (checked) {
      loadProfileDefaults();
    } else {
      clearProfileDefaults();
    }
  };

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
    { label: "Company Mail", name: "CompanyMail", placeholder: "billing@company.com" },
    { label: "Company Address", name: "CompanyAddress", placeholder: "Company Address" },
    { label: "Tax Details", name: "TaxDetail", placeholder: "Tax Details (e.g., GSTIN / VAT)" },
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
    { label: "Invoice Serial #", name: "InvoiceNo", placeholder: "2026-001", type: "text" },
    { label: "Issue Date", name: "IssueDate", type: "date" },
    { label: "Due Date", name: "DueDate", type: "date" },
  ];

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setLogo(base64);
      OwnerDetailHandler("companyLogo", base64);
    } catch (err) {
      console.error("Failed to load logo image:", err);
    }
  };

  const handleCurrencyChange = (code: string) => {
    DetailHandler("Currency", code);
    const selectedCurrency = CURRENCIES.find((c: Currency) => c.code === code);
    if (selectedCurrency) {
      setCurrency(selectedCurrency);
      if (code === "INR") {
        setMode("india");
      } else {
        setMode("international");
      }
    }
  };

  return (
    <div className="w-full scroll-smooth pb-12">
      <form className="w-full space-y-3 px-1" onSubmit={(e) => e.preventDefault()}>
        {/* PREFILL TOGGLE & QUICK SYNC BAR */}
        <div className="p-3 rounded-xs bg-white border border-teal-600/30 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase text-zinc-900 tracking-wider flex items-center gap-1.5 font-mono">
                Prefill Profile Defaults
              </span>
              <span className="text-[10px] text-zinc-400 font-sans block">
                Automatically loads organization, notes, terms, and payout defaults saved in Settings.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isPrefilling}
              onClick={loadProfileDefaults}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-teal-800 rounded-2xs transition cursor-pointer disabled:opacity-50"
              title="Refetch profile defaults"
            >
              <RotateCcw className={`w-3 h-3 ${isPrefilling ? "animate-spin" : ""}`} />
              <span>{isPrefilling ? "Syncing..." : "Sync Settings"}</span>
            </button>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPrefill}
                onChange={(e) => handleTogglePrefill(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-7 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>

        {/* Organization's Detail Card */}
        <div className="p-5 rounded-xs bg-white border border-zinc-200/80 shadow-xs">
          <h1 className="text-xs font-semibold uppercase tracking-wider mb-3 text-zinc-800">
            Organization&apos;s Detail
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
                  Drag and drop your company logo here, or{" "}
                  <span className="text-teal-700 font-semibold">browse file</span>
                </p>
              </div>
            </div>

            {OwnerFieldList.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-zinc-600 tracking-wide text-xs">{f.label}</div>
                <input
                  className="border border-zinc-200 bg-white px-3 py-2 rounded-xs text-zinc-800 text-xs hover:border-zinc-400 focus:outline-teal-700 w-full transition font-mono"
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
            Customer&apos;s Detail
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
            {customerFields.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-zinc-600 tracking-wide text-xs">{f.label}</div>
                <input
                  className="border border-zinc-200 bg-white px-3 py-2 rounded-xs w-full text-zinc-800 text-xs hover:border-zinc-400 focus:outline-teal-700 transition font-mono"
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
                className="border border-zinc-200 bg-white px-3 py-2 rounded-xs text-zinc-800 text-xs hover:border-zinc-400 focus:outline-teal-700 w-full transition cursor-pointer font-mono"
                value={currency?.code || Details.Currency || "INR"}
                onChange={(e) => handleCurrencyChange(e.target.value)}
              >
                {CURRENCIES.map((c: Currency) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) - {c.locale}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment / Invoice Status Selector */}
            <div className="flex flex-col gap-1 w-full">
              <div className="text-zinc-600 tracking-wide text-xs">Invoice Status</div>
              <select
                className="border border-zinc-200 bg-white px-3 py-2 rounded-xs text-zinc-800 text-xs font-semibold hover:border-zinc-400 focus:outline-teal-700 w-full transition cursor-pointer font-mono"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as InvoicePaymentStatus)}
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
        <InfoParent info={AdditionalInfo} terms={TermsConditions} HandleInfo={HandleInfo} HandleTerms={HandleTerms} />

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

function InfoParent({
  info,
  terms,
  HandleInfo,
  HandleTerms,
}: {
  info: string;
  terms: string;
  HandleInfo: (val: string) => void;
  HandleTerms: (val: string) => void;
}) {
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
        value={info}
        onChange={HandleInfo}
      />
      <AddInfoComponent
        Title="Terms"
        Placeholder="Terms & Conditions - Enter payment terms, late fees, or other conditions"
        Message="Terms & Conditions for the invoice"
        value={terms}
        onChange={HandleTerms}
      />
    </div>
  );
}

interface AddInfoProps {
  Title: string;
  Message: string;
  Placeholder: string;
  value: string;
  onChange: (val: string) => void;
}

function AddInfoComponent({ Title, Message, Placeholder, value, onChange }: AddInfoProps) {
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
        value={value || ""}
        className="bg-white text-zinc-800 focus:outline-teal-700 border border-zinc-200 w-full h-24 resize-none p-2.5 mt-1.5 rounded-xs text-xs transition font-mono leading-relaxed"
        placeholder={Placeholder}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.currentTarget.value)}
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

  const [option, setOption] = useState<string>("UPI");
  const [url, setUrl] = useState<string>("");
  const { OwnerDetailHandler, OwnerDetails } = useOwner();

  useEffect(() => {
    if (OwnerDetails.QR) {
      setUrl(OwnerDetails.QR);
    } else {
      setUrl("");
    }
  }, [OwnerDetails.QR]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setUrl(base64);
      OwnerDetailHandler("QR", base64);
    } catch (err) {
      console.error("Failed to convert QR code file:", err);
    }
  };

  return (
    <div className="bg-white border border-zinc-200/80 text-xs font-bold px-3 py-4 shadow-xs rounded-xs duration-500 ease-in-out transition-all">
      <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-100">
        <span className="text-zinc-800 tracking-wide font-semibold text-xs uppercase">Payment Options</span>
      </div>

      <div className="h-full w-full mt-2">
        <div className="p-1 w-full h-auto flex justify-between items-center gap-2 bg-zinc-100 border border-zinc-200/60 rounded-xs font-mono">
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
              Drag and drop your saved QR image here, or{" "}
              <span className="text-teal-700 font-semibold">browse file</span>
            </p>
            <input
              className="border border-zinc-200 rounded-xs px-3 py-2 w-64 text-zinc-800 font-normal tracking-wide bg-white outline-none focus:border-teal-700 text-xs transition mt-1 font-mono"
              placeholder="UPI-ID (e.g. name@upi or VPA)"
              value={OwnerDetails.UPIID || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => OwnerDetailHandler("UPIID", e.currentTarget.value)}
            />
          </div>
        </div>
      )}

      {option === "Bank" && (
        <div className="bg-white w-full h-full min-h-60 p-2 mt-2 duration-300 ease-in-out flex justify-center items-center">
          <div className="grid grid-cols-2 gap-3.5 w-full font-mono">
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