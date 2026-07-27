"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
} from "lucide-react";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export default function Settings() {
  const { status } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- FORM STATE ---
  // Organization Details
  const [companyName, setCompanyName] = useState("");
  const [taxDetails, setTaxDetails] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "upi">("bank");
  const [paymentDetails, setPaymentDetails] = useState({
    ownerName: "",
    phoneNumber: "",
    bankName: "",
    accountNumber: "",
    bankAddress: "",
    bankCode: "", // IFSC / SWIFT
    upiId: "",
  });

  // UPI QR Image State
  const [upiQrUrl, setUpiQrUrl] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchUser() {
      try {
        const res = await fetch("/api/authenticate", {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);

        // Pre-fill form if data exists in backend response
        if (data?.companyName) setCompanyName(data.companyName);
        if (data?.taxDetails) setTaxDetails(data.taxDetails);
        if (data?.logoUrl) setLogoUrl(data.logoUrl);
        if (data?.upiQrUrl) setUpiQrUrl(data.upiQrUrl);
        if (data?.paymentMethod) setPaymentMethod(data.paymentMethod);
        if (data?.paymentDetails) {
          setPaymentDetails((prev) => ({ ...prev, ...data.paymentDetails }));
        }
      } catch (err) {
        console.error("Failed to fetch user settings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [status]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  // Handle UPI QR Code Upload
  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUpiQrUrl(url);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  // Save Settings Trigger
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const payload = {
      companyName,
      taxDetails,
      logoUrl,
      upiQrUrl,
      paymentMethod,
      paymentDetails,
    };

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for Logo Fallback Initial
  const companyInitial = companyName.trim()
    ? companyName.trim().charAt(0).toUpperCase()
    : user?.name?.trim()
    ? user.name.trim().charAt(0).toUpperCase()
    : "C";

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen bg-[#090909] text-neutral-400 p-6 flex flex-col items-center justify-center font-mono">
        <div className="flex items-center gap-3 bg-[#121212] p-4 border border-neutral-800 rounded-none">
          <Loader2 className="w-4 h-4 text-[#00D2B5] animate-spin" />
          <span className="text-xs uppercase tracking-widest text-neutral-300">
            Fetching Session Telemetry...
          </span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#090909] text-neutral-400 p-6 flex flex-col items-center justify-center font-mono">
        <div className="bg-[#121212] p-6 border border-neutral-800 rounded-none text-center max-w-sm w-full space-y-4">
          <div className="p-2 bg-neutral-900 border border-neutral-800 w-fit mx-auto text-rose-400">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase text-white font-sans tracking-wider">
              Access Restricted
            </h3>
            <p className="text-[11px] text-neutral-500 mt-1">
              Please authenticate to access account settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] text-neutral-300 p-4 space-y-4 font-mono select-none">
      
      {/* Top Header Bar */}
      <form onSubmit={handleSaveSettings} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-neutral-800">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-widest text-white font-sans">
              Account & Business Settings
            </h1>
            <p className="text-[11px] text-neutral-500 font-sans mt-0.5">
              Manage default organization profiles, tax details, and payout channels.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-[#00D2B5] text-[#090909] font-bold text-xs font-sans uppercase tracking-wider hover:bg-[#00b89f] transition rounded-none shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                SAVING...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                UPDATED
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                SAVE CHANGES
              </>
            )}
          </button>
        </div>

        {/* MAIN SETTINGS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* LEFT COLUMN: IDENTITY & SESSION TELEMETRY */}
          <div className="space-y-4">
            
            {/* User Account Card */}
            <div className="bg-[#121212] border border-neutral-800 p-4 space-y-3 rounded-none">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-widest text-white font-sans">
                  Account Identity
                </span>
                <span className="text-[9px] text-[#00D2B5] bg-[#00D2B5]/10 px-1.5 py-0.5 border border-[#00D2B5]/30">
                  AUTH
                </span>
              </div>

              <div className="space-y-3 pt-1 font-sans">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2 bg-[#090909] border border-neutral-800 px-3 py-2">
                    <User className="w-3.5 h-3.5 text-[#00D2B5]" />
                    <span className="text-xs font-mono text-white">
                      {user?.name || "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 bg-[#090909] border border-neutral-800 px-3 py-2">
                    <Mail className="w-3.5 h-3.5 text-[#00D2B5]" />
                    <span className="text-xs font-mono text-white truncate">
                      {user?.email || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex justify-between text-xs font-mono">
                  <span className="text-neutral-500 text-[10px] uppercase">
                    Role
                  </span>
                  <span className="text-[#00D2B5] font-bold uppercase text-[10px]">
                    {user?.role || "Standard Biller"}
                  </span>
                </div>
              </div>
            </div>

            {/* Data Persistence Info */}
            <div className="bg-[#121212] border border-neutral-800 p-4 space-y-2 rounded-none font-sans">
              <div className="flex items-center gap-2 text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-[#00D2B5]" />
                <span className="text-xs font-bold uppercase text-white tracking-wider">
                  Data Persistence
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-mono">
                Saved organization and payout details will automatically pre-fill when generating new invoices.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: ORGANIZATION & PAYMENT FORMS */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* SECTION 1: ORGANIZATION'S DETAIL & LOGO */}
            <div className="bg-[#121212] border border-neutral-800 p-4 space-y-4 rounded-none">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#00D2B5]" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-white font-sans">
                    Organization Details
                  </h2>
                </div>
                <span className="text-[9px] text-neutral-500 font-mono uppercase bg-[#090909] px-2 py-0.5 border border-neutral-800">
                  DEFAULTS
                </span>
              </div>

              {/* Logo Upload Dropzone */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-24 h-24 shrink-0 bg-[#090909] border border-neutral-800 flex items-center justify-center group overflow-hidden">
                  {logoUrl ? (
                    <>
                      <img
                        src={logoUrl}
                        alt="Company Logo"
                        className="w-full h-full object-contain p-2"
                      />
                      <button
                        type="button"
                        onClick={() => setLogoUrl(null)}
                        className="absolute top-1 right-1 bg-[#181818] text-neutral-400 hover:text-white p-1 border border-neutral-700 transition opacity-0 group-hover:opacity-100"
                        title="Remove Logo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-[#00D2B5] font-sans">
                        {companyInitial}
                      </span>
                      <span className="text-[8px] text-neutral-500 mt-0.5 uppercase tracking-tighter">
                        INITIAL
                      </span>
                    </div>
                  )}
                </div>

                <label className="flex-1 w-full h-24 border border-dashed border-neutral-800 hover:border-[#00D2B5]/50 bg-[#0E0E0E] hover:bg-[#141414] transition cursor-pointer flex flex-col items-center justify-center p-3 text-center group">
                  <Upload className="w-5 h-5 text-neutral-500 group-hover:text-[#00D2B5] transition mb-1" />
                  <p className="text-[11px] text-neutral-300 font-sans font-medium">
                    Upload organization logo, or{" "}
                    <span className="text-[#00D2B5] underline underline-offset-2">
                      browse file
                    </span>
                  </p>
                  <p className="text-[9px] text-neutral-500 font-mono mt-0.5">
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

              {/* Company Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-sans">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Company / Agency Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#090909] border border-neutral-800 text-white text-xs px-3 py-2 rounded-none focus:outline-none focus:border-[#00D2B5] transition placeholder:text-neutral-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Tax Details / GSTIN
                  </label>
                  <input
                    type="text"
                    placeholder="GSTIN / VAT / Tax ID"
                    value={taxDetails}
                    onChange={(e) => setTaxDetails(e.target.value)}
                    className="w-full bg-[#090909] border border-neutral-800 text-white text-xs px-3 py-2 rounded-none focus:outline-none focus:border-[#00D2B5] transition placeholder:text-neutral-600 font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: PAYMENT OPTIONS & UPI QR */}
            <div className="bg-[#121212] border border-neutral-800 p-4 space-y-4 rounded-none">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#00D2B5]" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-white font-sans">
                    Payout Channel
                  </h2>
                </div>
                <span className="text-[9px] text-neutral-500 font-mono uppercase bg-[#090909] px-2 py-0.5 border border-neutral-800">
                  DEFAULTS
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#090909] border border-neutral-800 rounded-none font-sans">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    paymentMethod === "bank"
                      ? "bg-[#1C1C1C] text-[#00D2B5] border border-neutral-700 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  Bank Transfer
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    paymentMethod === "upi"
                      ? "bg-[#1C1C1C] text-[#00D2B5] border border-neutral-700 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  UPI / VPA
                </button>
              </div>

              {/* Dynamic Inputs */}
              {paymentMethod === "bank" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      placeholder="Account Owner Name"
                      value={paymentDetails.ownerName}
                      onChange={(e) => handleInputChange("ownerName", e.target.value)}
                      className="w-full bg-[#090909] border border-neutral-800 text-white text-xs px-3 py-2 rounded-none focus:outline-none focus:border-[#00D2B5] transition placeholder:text-neutral-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 00000 00000"
                      value={paymentDetails.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="w-full bg-[#090909] border border-neutral-800 text-white text-xs px-3 py-2 rounded-none focus:outline-none focus:border-[#00D2B5] transition placeholder:text-neutral-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC / Chase Bank"
                      value={paymentDetails.bankName}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      className="w-full bg-[#090909] border border-neutral-800 text-white text-xs px-3 py-2 rounded-none focus:outline-none focus:border-[#00D2B5] transition placeholder:text-neutral-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={paymentDetails.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      className="w-full bg-[#090909] border border-neutral-800 text-white text-xs px-3 py-2 rounded-none focus:outline-none focus:border-[#00D2B5] transition placeholder:text-neutral-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Bank Address
                    </label>
                    <input
                      type="text"
                      placeholder="Branch / City Address"
                      value={paymentDetails.bankAddress}
                      onChange={(e) => handleInputChange("bankAddress", e.target.value)}
                      className="w-full bg-[#090909] border border-neutral-800 text-white text-xs px-3 py-2 rounded-none focus:outline-none focus:border-[#00D2B5] transition placeholder:text-neutral-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Bank Code (IFSC / SWIFT)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234"
                      value={paymentDetails.bankCode}
                      onChange={(e) => handleInputChange("bankCode", e.target.value)}
                      className="w-full bg-[#090909] border border-neutral-800 text-white text-xs px-3 py-2 rounded-none focus:outline-none focus:border-[#00D2B5] transition placeholder:text-neutral-600 font-mono uppercase"
                    />
                  </div>
                </div>
              ) : (
                /* UPI Payment Section + QR Code Upload Box */
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                        UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        placeholder="username@upi / username@okaxis"
                        value={paymentDetails.upiId}
                        onChange={(e) => handleInputChange("upiId", e.target.value)}
                        className="w-full bg-[#090909] border border-neutral-800 text-white text-xs px-3 py-2 rounded-none focus:outline-none focus:border-[#00D2B5] transition placeholder:text-neutral-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                        Payee / Owner Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name linked to UPI"
                        value={paymentDetails.ownerName}
                        onChange={(e) => handleInputChange("ownerName", e.target.value)}
                        className="w-full bg-[#090909] border border-neutral-800 text-white text-xs px-3 py-2 rounded-none focus:outline-none focus:border-[#00D2B5] transition placeholder:text-neutral-600 font-mono"
                      />
                    </div>
                  </div>

                  {/* UPI QR CODE UPLOAD AREA */}
                  <div className="pt-2 border-t border-neutral-800/80">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 font-sans">
                      Upload UPI QR Code (Optional)
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      {/* QR Preview Box */}
                      <div className="relative w-28 h-28 shrink-0 bg-[#090909] border border-neutral-800 flex items-center justify-center group overflow-hidden">
                        {upiQrUrl ? (
                          <>
                            <img
                              src={upiQrUrl}
                              alt="UPI QR Code"
                              className="w-full h-full object-contain p-2"
                            />
                            <button
                              type="button"
                              onClick={() => setUpiQrUrl(null)}
                              className="absolute top-1 right-1 bg-[#181818] text-neutral-400 hover:text-white p-1 border border-neutral-700 transition opacity-0 group-hover:opacity-100"
                              title="Remove QR Code"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-neutral-600">
                            <QrCode className="w-8 h-8 text-neutral-600 mb-1" />
                            <span className="text-[8px] font-mono uppercase tracking-tighter text-neutral-500">
                              NO QR ATTACHED
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Dropzone Container */}
                      <label className="flex-1 w-full h-28 border border-dashed border-neutral-800 hover:border-[#00D2B5]/50 bg-[#0E0E0E] hover:bg-[#141414] transition cursor-pointer flex flex-col items-center justify-center p-3 text-center group">
                        <ImageIcon className="w-5 h-5 text-neutral-500 group-hover:text-[#00D2B5] transition mb-1" />
                        <p className="text-[11px] text-neutral-300 font-sans font-medium">
                          Upload GPay / PhonePe / Paytm QR image, or{" "}
                          <span className="text-[#00D2B5] underline underline-offset-2">
                            browse
                          </span>
                        </p>
                        <p className="text-[9px] text-neutral-500 font-mono mt-0.5">
                          PNG, JPG UP TO 2MB (PRINTED DIRECTLY ON PDF)
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
        </div>
      </form>

      {/* Raw Payload Debugger */}
      <details className="bg-[#121212] border border-neutral-800 p-3 rounded-none group font-mono text-xs">
        <summary className="cursor-pointer font-sans text-[11px] font-bold uppercase text-neutral-400 hover:text-white transition flex items-center justify-between">
          <span>Raw Session Payload Inspector</span>
          <span className="text-[9px] text-[#00D2B5] border border-[#00D2B5]/30 px-1.5 py-0.5">
            JSON DATA
          </span>
        </summary>
        <div className="mt-3 p-3 bg-[#090909] border border-neutral-800 overflow-x-auto text-[11px] text-neutral-400">
          <pre>{JSON.stringify({ user, companyName, taxDetails, upiQrUrl, paymentMethod, paymentDetails }, null, 2)}</pre>
        </div>
      </details>

    </div>
  );
}