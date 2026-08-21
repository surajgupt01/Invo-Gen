"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Building2,
  CreditCard,
  Upload,
  X,
  Save,
  Building,
  QrCode,
  Loader2,
  Check,
  ShieldCheck,
  LogOut,
  Image as ImageIcon,
  Zap,
  Calendar,
  Clock,
  FileText,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  AlertTriangle,
} from "lucide-react";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  plan?: "FREE" | "PRO";
  billingCycle?: "monthly" | "yearly" | null;
  subscriptionStatus?: "ACTIVE" | "INACTIVE" | "CANCELLED" | "PAST_DUE";
  subscriptionPeriodEnd?: string | null;
  razorpaySubscriptionId?: string | null;
  additionalInfo?: string | null;
  termsAndConditions?: string | null;
  [key: string]: unknown;
}

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function Settings() {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cancellation Modal States
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "error") => {
      setToast({ show: true, message, type });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 5000);
    },
    [],
  );

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [companyMail, setCompanyMail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [taxDetails, setTaxDetails] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"bank" | "upi">("bank");
  const [paymentDetails, setPaymentDetails] = useState({
    ownerName: "",
    phoneNumber: "",
    bankName: "",
    accountNumber: "",
    bankAddress: "",
    bankCode: "",
    upiId: "",
    upiName: "",
  });

  const [upiQrUrl, setUpiQrUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isPending || !session) return;

    setUser({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    });

    async function fetchUserSettings() {
      try {
        const res = await fetch("/api/settings", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const dbUser = data?.user || data || {};
          const p = data?.payoutProfile || dbUser?.payoutProfile || {};

          setUser((prev) => ({
            ...prev,
            ...dbUser,
            plan: dbUser.plan || "FREE",
            billingCycle:
              dbUser.billingCycle || (dbUser.plan === "PRO" ? "monthly" : null),
            subscriptionStatus: dbUser.subscriptionStatus || "INACTIVE",
            subscriptionPeriodEnd: dbUser.subscriptionPeriodEnd || null,
            razorpaySubscriptionId: dbUser.razorpaySubscriptionId || null,
            additionalInfo: dbUser.additionalInfo || "",
            termsAndConditions: dbUser.termsAndConditions || "",
          }));

          setCompanyName(dbUser.companyName || "");
          setCompanyMail(dbUser.companyMail || "");
          setCompanyAddress(dbUser.companyAddress || "");
          setTaxDetails(dbUser.taxDetails || "");
          setAdditionalInfo(dbUser.additionalInfo || "");
          setTermsAndConditions(dbUser.termsAndConditions || "");

          setLogoUrl(p.companyLogoUrl || null);
          setUpiQrUrl(p.upiQrImageUrl || null);

          setPaymentDetails({
            ownerName: p.ownerName || "",
            phoneNumber: p.phoneNumber || "",
            bankName: p.bankName || "",
            accountNumber: p.accountNumber || "",
            bankAddress: p.bankAddress || "",
            bankCode: p.bankCode || "",
            upiId: p.upiId || "",
            upiName: p.upiName || p.ownerName || "",
          });

          if (p.upiId || p.upiName || p.upiQrImageUrl) {
            setPaymentMethod("upi");
          } else {
            setPaymentMethod("bank");
          }
        } else {
          showToast("Failed to fetch settings from server.", "error");
        }
      } catch (err) {
        console.error("Failed to fetch user settings:", err);
        showToast("Network error while loading settings.", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchUserSettings();
  }, [isPending, session, showToast]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Logo image size exceeds 2MB limit.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        showToast("Logo attached. Click 'Save Changes' to apply.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("QR Code image size exceeds 2MB limit.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpiQrUrl(reader.result as string);
        showToast("UPI QR Code attached. Click 'Save Changes' to apply.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const payload = {
      companyName,
      companyMail,
      companyAddress,
      taxDetails,
      additionalInfo,
      termsAndConditions,
      payoutProfile: {
        companyLogoUrl: logoUrl,
        upiQrImageUrl: upiQrUrl,
        ownerName: paymentDetails.ownerName,
        phoneNumber: paymentDetails.phoneNumber,
        bankName: paymentDetails.bankName,
        accountNumber: paymentDetails.accountNumber,
        bankAddress: paymentDetails.bankAddress,
        bankCode: paymentDetails.bankCode,
        upiId: paymentDetails.upiId,
        upiName: paymentDetails.upiName || paymentDetails.ownerName,
      },
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));

      if (res.ok && responseData.success !== false) {
        setSaveSuccess(true);
        showToast("Account settings updated successfully!", "success");
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        showToast(
          responseData.message || "Failed to update settings.",
          "error",
        );
      }
    } catch (err) {
      console.error("Failed to update settings:", err);
      showToast("An unexpected error occurred while saving.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user?.razorpaySubscriptionId) {
      showToast("No active subscription reference found to cancel.", "error");
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch(
        `/api/subscription?subscriptionId=${user.razorpaySubscriptionId}&cancelAtCycleEnd=true`,
        { method: "DELETE" }
      );

      const result = await res.json();
      if (res.ok && result.success) {
        setUser((prev) => ({
          ...prev,
          subscriptionStatus: "CANCELLED",
        }));
        setShowCancelModal(false);
        showToast(
          "Auto-renewal cancelled. You will retain PRO features until the current billing cycle finishes.",
          "success"
        );
      } else {
        showToast(result.message || "Failed to cancel auto-renewal.", "error");
      }
    } catch (err) {
      console.error("Cancellation request error:", err);
      showToast("Network error while cancelling subscription.", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  const companyInitial = companyName.trim()
    ? companyName.trim().charAt(0).toUpperCase()
    : user?.name?.trim()
      ? user.name.trim().charAt(0).toUpperCase()
      : "C";

  if (isPending || (session && loading)) {
    return (
      <div className="w-full min-h-screen bg-white text-zinc-950 p-6 flex flex-col items-center justify-center font-mono select-none">
        <div className="flex items-center gap-3 border border-zinc-200 bg-white px-5 py-3 rounded-lg shadow-xs">
          <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-600">
            Fetching Account Telemetry...
          </span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full min-h-screen bg-white text-zinc-950 p-6 flex flex-col items-center justify-center font-mono select-none">
        <div className="bg-white p-8 border border-zinc-200 rounded-xl text-center max-w-sm w-full space-y-4 shadow-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 w-fit mx-auto text-rose-600 rounded-lg">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase text-zinc-900 font-mono tracking-wider">
              Access Restricted
            </h3>
            <p className="text-xs text-zinc-500 font-sans mt-1">
              Please sign in to access account settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isPro = user?.plan === "PRO";
  const isCancelled = user?.subscriptionStatus === "CANCELLED";

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans select-none pb-16 relative">
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

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-zinc-900">
                Cancel Subscription Renewal?
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
              Your subscription will remain active with full PRO benefits until{" "}
              <span className="font-semibold text-zinc-950">
                {user?.subscriptionPeriodEnd
                  ? new Date(user.subscriptionPeriodEnd).toLocaleDateString()
                  : "the end of the current billing cycle"}
              </span>
              . After that date, your account will downgrade to the Free Starter plan.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="w-1/2 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="w-1/2 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Confirm Cancel</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium mb-1">
                Account & Workspace Setup
              </p>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-950">
                Settings
              </h1>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white font-medium text-xs rounded-md shadow-xs hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: IDENTITY & PLAN */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Subscription Plan Card */}
            <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-teal-600" />
                  Plan & Subscription
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 font-mono font-semibold uppercase rounded-sm border ${
                    isPro
                      ? isCancelled
                        ? "text-amber-800 bg-amber-50 border-amber-200"
                        : "text-teal-800 bg-teal-50 border-teal-200"
                      : "text-zinc-600 bg-zinc-100 border-zinc-200"
                  }`}
                >
                  {isCancelled ? "PRO (EXPIRING)" : `${user?.plan || "FREE"} TIER`}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-[11px] uppercase tracking-wider">
                    Status
                  </span>
                  <span
                    className={`font-semibold uppercase ${
                      isCancelled ? "text-amber-600" : "text-zinc-950"
                    }`}
                  >
                    {user?.subscriptionStatus || "INACTIVE"}
                  </span>
                </div>

                {isPro && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      Interval
                    </span>
                    <span className="text-zinc-900 font-semibold uppercase">
                      {user?.billingCycle || "MONTHLY"}
                    </span>
                  </div>
                )}

                {user?.subscriptionPeriodEnd && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {isCancelled ? "Expires On" : "Renews"}
                    </span>
                    <span className="text-zinc-900 font-medium">
                      {new Date(user.subscriptionPeriodEnd).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-100">
                {!isPro ? (
                  <Link href="/dashboard/pricing" className="block">
                    <button
                      type="button"
                      className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium rounded-md transition-colors cursor-pointer shadow-xs"
                    >
                      Upgrade to Pro
                    </button>
                  </Link>
                ) : user?.billingCycle === "monthly" && !isCancelled ? (
                  <div className="space-y-2">
                    <Link href="/dashboard/pricing" className="block">
                      <button
                        type="button"
                        className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium rounded-md transition-colors cursor-pointer shadow-xs"
                      >
                        Switch to Yearly (Save 30%)
                      </button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-1.5 bg-white hover:bg-rose-50 text-zinc-500 hover:text-rose-700 text-xs font-medium rounded-md transition-colors cursor-pointer border border-zinc-200 hover:border-rose-200"
                    >
                      Cancel Auto-Renewal
                    </button>
                  </div>
                ) : !isCancelled ? (
                  <div className="space-y-2">
                    <div className="text-[11px] text-teal-800 font-mono text-center bg-teal-50 border border-teal-200 p-2 rounded-md">
                      ✓ Highest Tier Active (Yearly Pro)
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-1.5 bg-white hover:bg-rose-50 text-zinc-500 hover:text-rose-700 text-xs font-medium rounded-md transition-colors cursor-pointer border border-zinc-200 hover:border-rose-200"
                    >
                      Cancel Auto-Renewal
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-800 font-mono text-center bg-amber-50 border border-amber-200 p-2 rounded-md">
                    Subscription auto-renewal disabled.
                  </div>
                )}
              </div>
            </div>

            {/* User Account Card */}
            <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950">
                  Account Identity
                </span>
                <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 border border-teal-200 font-mono font-semibold rounded-sm">
                  Active
                </span>
              </div>

              <div className="space-y-3 font-sans">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 font-medium mb-1">
                    Name
                  </label>
                  <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-md">
                    <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="text-xs font-mono text-zinc-950 font-medium">
                      {user?.name || "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 font-medium mb-1">
                    Email
                  </label>
                  <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-md">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="text-xs font-mono text-zinc-950 font-medium truncate">
                      {user?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sync Notice */}
            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl space-y-2 shadow-2xs font-sans">
              <div className="flex items-center gap-2 text-zinc-950">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-xs font-semibold uppercase font-mono tracking-wider">
                  Automated Autofill
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Saved organization details, defaults, and payout profiles automatically synchronize inside the invoice generator.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: BUSINESS, DEFAULTS & PAYOUTS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SECTION 1: ORGANIZATION DETAILS */}
            <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-zinc-950" />
                  <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
                    Organization Details
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Defaults
                </span>
              </div>

              {/* Logo Upload Dropzone */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-24 h-24 shrink-0 bg-zinc-50 border border-zinc-200 flex items-center justify-center group overflow-hidden rounded-lg shadow-2xs">
                  {logoUrl ? (
                    <>
                      <img
                        src={logoUrl}
                        alt="Company Logo"
                        className="w-full h-full object-contain p-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoUrl(null);
                          showToast("Logo removed.", "success");
                        }}
                        className="absolute top-1.5 right-1.5 bg-white text-zinc-500 hover:text-zinc-950 p-1 border border-zinc-200 transition-opacity opacity-0 group-hover:opacity-100 shadow-xs cursor-pointer rounded-md"
                        title="Remove Logo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-zinc-950 font-sans">
                        {companyInitial}
                      </span>
                      <span className="text-[8px] text-zinc-400 mt-0.5 uppercase tracking-wider font-mono">
                        INITIAL
                      </span>
                    </div>
                  )}
                </div>

                <label className="flex-1 w-full h-24 border border-dashed border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer flex flex-col items-center justify-center p-3 text-center group rounded-lg">
                  <Upload className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 transition-colors mb-1" />
                  <p className="text-xs text-zinc-600 font-sans">
                    Upload organization logo, or{" "}
                    <span className="text-zinc-950 font-medium underline underline-offset-2">
                      browse file
                    </span>
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase">
                    PNG, JPG, SVG UP TO 2MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-sans">
                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Studio LLC"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                    Company Email
                  </label>
                  <input
                    type="email"
                    placeholder="billing@acmestudio.com"
                    value={companyMail}
                    onChange={(e) => setCompanyMail(e.target.value)}
                    className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    Company Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Street address, City, State, ZIP, Country"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs p-3 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono leading-relaxed resize-y"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                    Tax Details / GSTIN / VAT ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 29AAAAA0000A1Z5"
                    value={taxDetails}
                    onChange={(e) => setTaxDetails(e.target.value)}
                    className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: INVOICE PREFILL DEFAULTS */}
            <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-950" />
                  <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
                    Invoice Notes & Terms
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Defaults
                </span>
              </div>

              <div className="space-y-4 font-sans">
                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                    Payment Notes / Wire Instructions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Payment due within 14 days of invoice issue. Please include invoice number in wire memo."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs p-3 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono leading-relaxed resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-zinc-400" />
                    Standard Terms & Conditions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 1. Ownership of deliverables transfers upon full payment. 2. Late payments incur a 1.5% monthly charge."
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs p-3 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono leading-relaxed resize-y"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: PAYOUT PROFILES & UPI QR */}
            <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-zinc-950" />
                  <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
                    Payout Channels
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Defaults
                </span>
              </div>

              {/* Payment Method Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 rounded-lg border border-zinc-200/70 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex items-center justify-center gap-2 py-2 font-medium rounded-md transition-all cursor-pointer ${
                    paymentMethod === "bank"
                      ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/50"
                      : "text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Bank Wire Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex items-center justify-center gap-2 py-2 font-medium rounded-md transition-all cursor-pointer ${
                    paymentMethod === "upi"
                      ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/50"
                      : "text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI / QR Payment</span>
                </button>
              </div>

              {/* Bank Transfer Inputs */}
              {paymentMethod === "bank" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans pt-1">
                  <div>
                    <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                      Account Beneficiary Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe / Acme Corp"
                      value={paymentDetails.ownerName}
                      onChange={(e) =>
                        handleInputChange("ownerName", e.target.value)
                      }
                      className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={paymentDetails.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chase / HDFC Bank"
                      value={paymentDetails.bankName}
                      onChange={(e) =>
                        handleInputChange("bankName", e.target.value)
                      }
                      className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                      Account / IBAN Number
                    </label>
                    <input
                      type="text"
                      placeholder="Account or IBAN"
                      value={paymentDetails.accountNumber}
                      onChange={(e) =>
                        handleInputChange("accountNumber", e.target.value)
                      }
                      className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                      Branch Address
                    </label>
                    <input
                      type="text"
                      placeholder="Branch city, state"
                      value={paymentDetails.bankAddress}
                      onChange={(e) =>
                        handleInputChange("bankAddress", e.target.value)
                      }
                      className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                      Bank Routing Code (IFSC / SWIFT / BIC)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234 / CHASUS33"
                      value={paymentDetails.bankCode}
                      onChange={(e) =>
                        handleInputChange("bankCode", e.target.value)
                      }
                      className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono uppercase"
                    />
                  </div>
                </div>
              ) : (
                /* UPI Inputs */
                <div className="space-y-5 pt-1 font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                        UPI ID / Virtual Payment Address
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. name@okhdfcbank"
                        value={paymentDetails.upiId}
                        onChange={(e) =>
                          handleInputChange("upiId", e.target.value)
                        }
                        className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-1">
                        Payee Name Linked to UPI
                      </label>
                      <input
                        type="text"
                        placeholder="Registered UPI Name"
                        value={
                          paymentDetails.upiName || paymentDetails.ownerName
                        }
                        onChange={(e) => {
                          handleInputChange("upiName", e.target.value);
                          handleInputChange("ownerName", e.target.value);
                        }}
                        className="w-full bg-white border border-zinc-200 text-zinc-950 text-xs px-3.5 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs font-mono"
                      />
                    </div>
                  </div>

                  {/* QR Upload */}
                  <div className="pt-4 border-t border-zinc-100">
                    <label className="block text-[11px] font-mono font-medium text-zinc-400 uppercase mb-2">
                      Upload UPI QR Code (Embeds directly on PDF invoices)
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="relative w-24 h-24 shrink-0 bg-zinc-50 border border-zinc-200 flex items-center justify-center group overflow-hidden rounded-lg shadow-2xs">
                        {upiQrUrl ? (
                          <>
                            <img
                              src={upiQrUrl}
                              alt="UPI QR Code"
                              className="w-full h-full object-contain p-2"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setUpiQrUrl(null);
                                showToast("UPI QR code removed.", "success");
                              }}
                              className="absolute top-1.5 right-1.5 bg-white text-zinc-500 hover:text-zinc-950 p-1 border border-zinc-200 transition-opacity opacity-0 group-hover:opacity-100 shadow-xs cursor-pointer rounded-md"
                              title="Remove QR Code"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-zinc-400">
                            <QrCode className="w-6 h-6 text-zinc-300 mb-1" />
                            <span className="text-[8px] font-mono uppercase tracking-tight text-zinc-400">
                              NO QR ATTACHED
                            </span>
                          </div>
                        )}
                      </div>

                      <label className="flex-1 w-full h-24 border border-dashed border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer flex flex-col items-center justify-center p-3 text-center group rounded-lg">
                        <ImageIcon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 transition-colors mb-1" />
                        <p className="text-xs text-zinc-600 font-sans">
                          Upload GPay / PhonePe / Paytm QR image, or{" "}
                          <span className="text-zinc-950 font-medium underline underline-offset-2">
                            browse
                          </span>
                        </p>
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase">
                          PNG, JPG UP TO 2MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}