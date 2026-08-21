"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCustomerStore } from "@/app/store/CustomerDetail";
import { useOptionalData } from "@/app/store/OptionalDataStore";
import { useOwner } from "@/app/store/OwnerDetail";
import { useItemsStore, CURRENCIES, type Currency } from "@/app/store/InvoiceTabel";
import List from "@/app/Icons/List";
import OpenArrow from "@/app/Icons/OpenArrow";
import Preview from "@/app/component/Preview";
import QR from "@/app/Icons/QR";
import Image from "next/image";
import ImageAlt from "@/app/Icons/Img";
import SeePassword from "@/app/Icons/SeePassword";
import Docs from "@/app/Icons/Doc";
import Both from "@/app/Icons/Both";
import ItemsTable from "./Table";
import {
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  RotateCcw,
  Zap,
  ArrowUpRight,
  Building2,
  Users,
  CreditCard,
  FileText,
  Upload,
  Info,
} from "lucide-react";
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
    <div className="flex flex-col h-full w-full bg-white text-zinc-950 font-sans select-none relative">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl transition-all duration-300 text-xs font-sans ${
            toast.type === "success"
              ? "bg-zinc-950 border-zinc-800 text-white"
              : "bg-rose-950 border-rose-800 text-rose-100"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
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

      {/* Top Header & View Switcher Bar */}
      <div className="bg-white border-b border-zinc-200 px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center shrink-0 gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-medium">
              Generator
            </p>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-950">
              New Invoice
            </h1>
          </div>

          {/* Quota Telemetry Badge */}
          {isPro ? (
            <div className="flex items-center gap-1 text-[10px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-sm font-semibold">
              <Zap className="w-3 h-3 text-teal-600" />
              <span>PRO UNLIMITED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-mono bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-md text-zinc-600">
              <span className="text-[10px] uppercase text-zinc-400">Quota:</span>
              <span className={`font-semibold ${downloadsRemaining === 0 ? "text-rose-600" : "text-zinc-950"}`}>
                {downloadsUsed}/{MONTHLY_LIMIT}
              </span>
              <span className="text-zinc-400">({downloadsRemaining} left)</span>
              <Link href="/dashboard/pricing" className="text-teal-700 hover:underline font-semibold ml-1 inline-flex items-center">
                Upgrade <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="bg-zinc-100 p-1 flex items-center rounded-lg border border-zinc-200/70 gap-1 text-xs">
          <button
            type="button"
            onClick={() => setDisplay("Form")}
            className={`px-3 py-1 font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              display === "Form"
                ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/50"
                : "text-zinc-500 hover:text-zinc-950"
            }`}
          >
            <Docs />
            <span>Form</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplay("Both")}
            className={`px-3 py-1 font-medium rounded-md transition-all cursor-pointer hidden lg:flex items-center gap-1.5 ${
              display === "Both"
                ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/50"
                : "text-zinc-500 hover:text-zinc-950"
            }`}
          >
            <Both />
            <span>Split View</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplay("Preview")}
            className={`px-3 py-1 font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              display === "Preview"
                ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/50"
                : "text-zinc-500 hover:text-zinc-950"
            }`}
          >
            <SeePassword />
            <span>Live PDF</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content Views */}
      {display === "Both" && (
        <div className="lg:flex-row flex flex-col overflow-auto w-full relative gap-6 p-4 sm:p-6 transition-all duration-300 flex-1 min-h-0 bg-zinc-50/50">
          <div className="flex-1 min-w-0 overflow-y-auto">
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

          <div className="flex-1 min-w-0 overflow-hidden bg-white border border-zinc-200 rounded-xl shadow-xs p-4 flex items-center justify-center">
            <Preview />
          </div>
        </div>
      )}

      {display === "Form" && (
        <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 bg-zinc-50/50">
          <div className="max-w-4xl mx-auto">
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
        </div>
      )}

      {display === "Preview" && (
        <div className="flex-1 min-w-0 overflow-hidden p-4 sm:p-6 bg-zinc-50/50 flex items-center justify-center">
          <div className="w-full max-w-4xl h-full bg-white border border-zinc-200 rounded-xl shadow-xs p-4 flex items-center justify-center">
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
    { label: "Company Name", name: "CompanyName", placeholder: "e.g. Acme Studio LLC" },
    { label: "Company Email", name: "CompanyMail", placeholder: "billing@acmestudio.com" },
    { label: "Company Address", name: "CompanyAddress", placeholder: "Street, City, State, ZIP, Country" },
    { label: "Tax Details / GSTIN", name: "TaxDetail", placeholder: "GSTIN / VAT / Tax ID" },
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
    { label: "Customer Name", name: "CustomerName", placeholder: "Client or organization name" },
    { label: "Customer Email", name: "CustomerEmail", placeholder: "client@example.com", type: "email" },
    { label: "Customer Address", name: "CustomerAddress", placeholder: "Client billing address" },
    { label: "Subject / Reference", name: "Subject", placeholder: "Project or service reference", type: "text" },
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
    <div className="w-full scroll-smooth pb-12 font-sans">
      <form className="w-full space-y-5" onSubmit={(e) => e.preventDefault()}>
        
        {/* PREFILL TOGGLE & QUICK SYNC BANNER */}
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-950 block">
                Prefill Settings Defaults
              </span>
              <span className="text-xs text-zinc-500 block mt-0.5">
                Automatically synchronize company details, bank wire, and terms from your account.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <button
              type="button"
              disabled={isPrefilling}
              onClick={loadProfileDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              title="Refetch profile defaults"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isPrefilling ? "animate-spin" : ""}`} />
              <span>{isPrefilling ? "Syncing..." : "Sync Settings"}</span>
            </button>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPrefill}
                onChange={(e) => handleTogglePrefill(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-950"></div>
            </label>
          </div>
        </div>

        {/* SECTION 1: ORGANIZATION DETAILS */}
        <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-zinc-950" />
              <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
                Organization Details
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Sender
            </span>
          </div>

          {/* Logo Dropzone */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-24 h-24 shrink-0 bg-zinc-50 border border-zinc-200 flex items-center justify-center group overflow-hidden rounded-lg shadow-2xs">
              {logo ? (
                <>
                  <Image
                    alt="Company Logo"
                    src={logo}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogo("");
                      OwnerDetailHandler("companyLogo", "");
                    }}
                    className="absolute top-1.5 right-1.5 bg-white text-zinc-500 hover:text-zinc-950 p-1 border border-zinc-200 transition-opacity opacity-0 group-hover:opacity-100 shadow-xs cursor-pointer rounded-md"
                    title="Remove Logo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-400">
                  <ImageAlt />
                  <span className="text-[8px] font-mono mt-1 uppercase tracking-wider">
                    NO LOGO
                  </span>
                </div>
              )}
            </div>

            <label className="flex-1 w-full h-24 border border-dashed border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer flex flex-col items-center justify-center p-3 text-center group rounded-lg">
              <input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              <Upload className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 transition-colors mb-1" />
              <p className="text-xs text-zinc-600">
                Drag and drop your company logo, or{" "}
                <span className="text-zinc-950 font-medium underline underline-offset-2">
                  browse file
                </span>
              </p>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase">
                PNG, JPG, SVG UP TO 2MB
              </p>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {OwnerFieldList.map((f, index) => (
              <div key={index} className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase">
                  {f.label}
                </label>
                <input
                  className="border border-zinc-200 bg-white px-3.5 py-2 rounded-md text-zinc-950 text-xs focus:outline-none focus:border-zinc-950 w-full transition shadow-2xs font-mono placeholder:text-zinc-400"
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

        {/* SECTION 2: CUSTOMER'S DETAIL */}
        <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-950" />
              <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
                Customer Details
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Recipient
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {customerFields.map((f, index) => (
              <div key={index} className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase">
                  {f.label}
                </label>
                <input
                  className="border border-zinc-200 bg-white px-3.5 py-2 rounded-md w-full text-zinc-950 text-xs focus:outline-none focus:border-zinc-950 transition shadow-2xs font-mono placeholder:text-zinc-400"
                  name={f.name}
                  placeholder={f.placeholder}
                  type={f.type || "text"}
                  value={Details[f.name] || ""}
                  onChange={(e) => DetailHandler(f.name, e.currentTarget.value)}
                />
              </div>
            ))}

            {/* Currency Select Dropdown */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase">
                Currency
              </label>
              <select
                className="border border-zinc-200 bg-white px-3.5 py-2 rounded-md text-zinc-950 text-xs focus:outline-none focus:border-zinc-950 w-full transition cursor-pointer shadow-2xs font-mono"
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
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase">
                Invoice Status
              </label>
              <select
                className="border border-zinc-200 bg-white px-3.5 py-2 rounded-md text-zinc-950 text-xs font-semibold focus:outline-none focus:border-zinc-950 w-full transition cursor-pointer shadow-2xs font-mono"
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

        {/* SECTION 3: LINE ITEMS TABLE */}
        <div
          className={`${
            expand ? "max-h-[1000px]" : "max-h-14 overflow-hidden"
          } transition-all duration-300 ease-in-out border bg-white border-zinc-200 shadow-xs rounded-xl overflow-hidden`}
        >
          <div
            className="flex items-center justify-between p-4 px-6 text-zinc-950 cursor-pointer border-b border-zinc-100 hover:bg-zinc-50/60 transition-colors"
            onClick={() => setExpand(!expand)}
          >
            <div className="flex items-center gap-2.5">
              <List />
              <h3 className="text-sm font-medium text-zinc-950 tracking-tight">
                Line Items & Tax Engine
              </h3>
            </div>
            <div
              className={`${
                expand ? "rotate-180" : ""
              } transition-transform duration-300 text-zinc-400 hover:text-zinc-950`}
            >
              <OpenArrow />
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white">
            <ItemsTable />
          </div>
        </div>

        {/* SECTION 4: PAYMENT OPTIONS */}
        <PaymentOptions />

        {/* SECTION 5: ADDITIONAL INFO & TERMS */}
        <InfoParent
          info={AdditionalInfo}
          terms={TermsConditions}
          HandleInfo={HandleInfo}
          HandleTerms={HandleTerms}
        />

        {/* Bottom Submission Toolbar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSubmit("DRAFT")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 rounded-md shadow-xs cursor-pointer transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-zinc-500" />
            <span>{isSubmitting ? "Saving..." : "Save as Draft"}</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSubmit()}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium bg-zinc-950 text-white hover:bg-zinc-800 rounded-md shadow-xs cursor-pointer transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Issuing..." : `Issue as ${paymentStatus}`}</span>
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
    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-950" />
          <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
            Additional Information & Notes
          </h2>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          Optional
        </span>
      </div>

      <div className="space-y-4">
        <AddInfoComponent
          Title="Payment Notes"
          Placeholder="e.g. Payment due within 14 days of invoice issue. Please include invoice number in wire memo."
          Message="Custom instructions for settlement"
          value={info}
          onChange={HandleInfo}
        />
        <AddInfoComponent
          Title="Terms & Conditions"
          Placeholder="e.g. 1. Ownership of deliverables transfers upon full payment. 2. Late payments incur a 1.5% monthly charge."
          Message="Legal conditions printed on PDF"
          value={terms}
          onChange={HandleTerms}
        />
      </div>
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase">
          {Title}
        </label>
        <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
          <Info className="w-3 h-3" />
          {Message}
        </span>
      </div>
      <textarea
        name="note"
        rows={3}
        value={value || ""}
        className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs p-3 rounded-md focus:outline-none focus:border-zinc-950 transition shadow-2xs font-mono leading-relaxed resize-y placeholder:text-zinc-400"
        placeholder={Placeholder}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.currentTarget.value)}
      />
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
    { label: "Account Holder Name", name: "OwnerName", placeholder: "e.g. Acme Studio LLC" },
    { label: "Contact Phone", name: "PhNo", placeholder: "+1 (555) 000-0000" },
    { label: "Bank Name", name: "BankName", placeholder: "e.g. Chase / HDFC Bank" },
    { label: "Account / IBAN Number", name: "AccountNumber", placeholder: "Account or IBAN number" },
    { label: "Branch Address", name: "BankAddress", placeholder: "City, State or branch location" },
    { label: "Routing Code (IFSC / SWIFT / BIC)", name: "BankCode", placeholder: "e.g. HDFC0001234 or SWIFT code" },
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
    <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-zinc-950" />
          <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
            Payout Channels & Payment Methods
          </h2>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          Settlement
        </span>
      </div>

      {/* Switcher */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 rounded-lg border border-zinc-200/70 text-xs">
        <button
          type="button"
          className={`w-full flex justify-center items-center gap-1.5 py-2 font-medium rounded-md transition-all cursor-pointer ${
            option === "Bank"
              ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/50"
              : "text-zinc-500 hover:text-zinc-950"
          }`}
          onClick={() => {
            setOption("Bank");
            OwnerDetailHandler("paymentMethod", "Bank");
          }}
        >
          <span>Bank Wire Transfer</span>
        </button>
        <button
          type="button"
          className={`w-full flex justify-center items-center gap-1.5 py-2 font-medium rounded-md transition-all cursor-pointer ${
            option === "UPI"
              ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/50"
              : "text-zinc-500 hover:text-zinc-950"
          }`}
          onClick={() => {
            setOption("UPI");
            OwnerDetailHandler("paymentMethod", "UPI");
          }}
        >
          <span>UPI / QR Code</span>
        </button>
      </div>

      {option === "UPI" && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase">
              UPI ID / VPA
            </label>
            <input
              className="border border-zinc-200 rounded-md px-3.5 py-2 text-zinc-950 bg-white focus:outline-none focus:border-zinc-950 text-xs transition shadow-2xs font-mono placeholder:text-zinc-400"
              placeholder="e.g. username@okhdfcbank"
              value={OwnerDetails.UPIID || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                OwnerDetailHandler("UPIID", e.currentTarget.value)
              }
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center pt-2">
            <div className="relative w-24 h-24 shrink-0 bg-zinc-50 border border-zinc-200 flex items-center justify-center group overflow-hidden rounded-lg shadow-2xs">
              {url ? (
                <>
                  <Image
                    alt="QR Code"
                    src={url}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUrl("");
                      OwnerDetailHandler("QR", "");
                    }}
                    className="absolute top-1.5 right-1.5 bg-white text-zinc-500 hover:text-zinc-950 p-1 border border-zinc-200 transition-opacity opacity-0 group-hover:opacity-100 shadow-xs cursor-pointer rounded-md"
                    title="Remove QR Code"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-400">
                  <QR />
                  <span className="text-[8px] font-mono mt-1 uppercase tracking-wider">
                    NO QR
                  </span>
                </div>
              )}
            </div>

            <label className="flex-1 w-full h-24 border border-dashed border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer flex flex-col items-center justify-center p-3 text-center group rounded-lg">
              <input id="QR" type="file" accept="image/*" className="hidden" onChange={handleChange} />
              <Upload className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 transition-colors mb-1" />
              <p className="text-xs text-zinc-600">
                Upload UPI payment QR code, or{" "}
                <span className="text-zinc-950 font-medium underline underline-offset-2">
                  browse file
                </span>
              </p>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase">
                PNG, JPG UP TO 2MB (PRINTED ON PDF)
              </p>
            </label>
          </div>
        </div>
      )}

      {option === "Bank" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans pt-1">
          {bankFields.map((f, index) => (
            <div key={index} className="flex flex-col gap-1.5 w-full">
              <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase">
                {f.label}
              </label>
              <input
                className="border border-zinc-200 bg-white px-3.5 py-2 rounded-md text-zinc-950 text-xs focus:outline-none focus:border-zinc-950 w-full transition shadow-2xs font-mono placeholder:text-zinc-400"
                name={f.name}
                placeholder={f.placeholder}
                value={OwnerDetails[f.name] || ""}
                type="text"
                onChange={(e) => OwnerDetailHandler(f.name, e.currentTarget.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}