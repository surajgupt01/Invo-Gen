"use client";

import { authClient } from "@/lib/auth-client";
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
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- FORM STATE ---
  const [companyName, setCompanyName] = useState("");
  const [taxDetails, setTaxDetails] = useState("");
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
  });

  const [upiQrUrl, setUpiQrUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isPending || !session) return;

    // Prefill basic profile info directly from Better Auth session
    setUser({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    });

    async function fetchUserSettings() {
      try {
        const res = await fetch("/api/user/settings", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser((prev) => ({ ...prev, ...data }));

          if (data?.companyName) setCompanyName(data.companyName);
          if (data?.taxDetails) setTaxDetails(data.taxDetails);
          if (data?.logoUrl) setLogoUrl(data.logoUrl);
          if (data?.upiQrUrl) setUpiQrUrl(data.upiQrUrl);
          if (data?.paymentMethod) setPaymentMethod(data.paymentMethod);
          if (data?.paymentDetails) {
            setPaymentDetails((prev) => ({ ...prev, ...data.paymentDetails }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch user settings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserSettings();
  }, [isPending, session]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

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

  const companyInitial = companyName.trim()
    ? companyName.trim().charAt(0).toUpperCase()
    : user?.name?.trim()
    ? user.name.trim().charAt(0).toUpperCase()
    : "C";

  if (isPending || (session && loading)) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] text-zinc-600 p-6 flex flex-col items-center justify-center font-mono select-none">
        <div className="flex items-center gap-2.5 border border-zinc-200/80 bg-white px-4 py-2.5 shadow-2xs rounded-xs">
          <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-800">
            Fetching Session Details...
          </span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] text-zinc-600 p-6 flex flex-col items-center justify-center font-mono select-none">
        <div className="bg-white p-6 border border-zinc-200/80 rounded-xs text-center max-w-sm w-full space-y-3 shadow-2xs">
          <div className="p-2 bg-rose-50 border border-rose-200/80 w-fit mx-auto text-rose-600 rounded-xs">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase text-zinc-900 font-mono tracking-wider">
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

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-zinc-800 p-4 sm:p-6 space-y-5 font-sans select-none">
      <form onSubmit={handleSaveSettings} className="space-y-5">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200/80">
          <div className="space-y-0.5">
            <h1 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2 font-mono">
              <span className="w-1.5 h-3 bg-teal-600 inline-block" />
              Account & Business Settings
            </h1>
            <p className="text-xs text-zinc-400 font-sans">
              Manage organization profiles, tax identifiers, and payout channels.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white font-medium text-xs font-sans uppercase tracking-wider hover:bg-black transition-colors rounded-xs shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-400" />
                <span>Updated</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {/* MAIN SETTINGS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT COLUMN: IDENTITY & SESSION TELEMETRY */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* User Account Card */}
            <div className="bg-white border border-zinc-200/80 p-4 space-y-3.5 rounded-xs shadow-2xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
                  Account Identity
                </span>
                <span className="text-[9px] text-teal-700 bg-teal-50 px-2 py-0.5 border border-teal-200/80 font-mono font-bold">
                  AUTHENTICATED
                </span>
              </div>

              <div className="space-y-3 font-sans">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200/80 px-3 py-2 rounded-2xs">
                    <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="text-xs font-mono text-zinc-900 font-medium">
                      {user?.name || "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200/80 px-3 py-2 rounded-2xs">
                    <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="text-xs font-mono text-zinc-900 font-medium truncate">
                      {user?.email || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex justify-between text-xs font-mono items-center">
                  <span className="text-zinc-400 text-[10px] uppercase">
                    User Role
                  </span>
                  <span className="text-zinc-800 font-bold uppercase text-[9px] bg-zinc-100 px-2 py-0.5 border border-zinc-200/80 rounded-2xs">
                    {user?.role || "Standard Biller"}
                  </span>
                </div>
              </div>
            </div>

            {/* Data Persistence Info */}
            <div className="bg-white border border-zinc-200/80 p-4 space-y-2 rounded-xs shadow-2xs font-sans">
              <div className="flex items-center gap-2 text-zinc-900">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  Automated Pre-fill
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Saved organization details and payout profiles will automatically populate inside the invoice generator.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: ORGANIZATION & PAYMENT FORMS */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* SECTION 1: ORGANIZATION'S DETAIL & LOGO */}
            <div className="bg-white border border-zinc-200/80 p-4 sm:p-5 space-y-4 rounded-xs shadow-2xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 font-mono">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Organization Details
                  </h2>
                </div>
                <span className="text-[9px] text-zinc-400 uppercase bg-zinc-50 px-2 py-0.5 border border-zinc-200/80">
                  DEFAULTS
                </span>
              </div>

              {/* Logo Upload Dropzone */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-24 h-24 shrink-0 bg-zinc-50 border border-zinc-200/80 flex items-center justify-center group overflow-hidden rounded-2xs">
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
                        className="absolute top-1 right-1 bg-white text-zinc-500 hover:text-zinc-900 p-1 border border-zinc-200/80 transition-opacity opacity-0 group-hover:opacity-100 shadow-2xs cursor-pointer rounded-2xs"
                        title="Remove Logo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-zinc-900 font-sans">
                        {companyInitial}
                      </span>
                      <span className="text-[8px] text-zinc-400 mt-0.5 uppercase tracking-wider font-mono">
                        INITIAL
                      </span>
                    </div>
                  )}
                </div>

                <label className="flex-1 w-full h-24 border border-dashed border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer flex flex-col items-center justify-center p-3 text-center group rounded-2xs">
                  <Upload className="w-4 h-4 text-zinc-400 group-hover:text-teal-600 transition-colors mb-1" />
                  <p className="text-xs text-zinc-600 font-sans">
                    Upload organization logo, or{" "}
                    <span className="text-teal-700 font-medium underline underline-offset-2">
                      browse file
                    </span>
                  </p>
                  <p className="text-[9px] text-zinc-400 font-mono mt-0.5 uppercase">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-sans">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Company / Agency Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-xs px-3 py-2 rounded-2xs focus:outline-none focus:border-teal-600 transition-colors placeholder:text-zinc-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Tax Details / GSTIN
                  </label>
                  <input
                    type="text"
                    placeholder="GSTIN / VAT / Tax ID"
                    value={taxDetails}
                    onChange={(e) => setTaxDetails(e.target.value)}
                    className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-xs px-3 py-2 rounded-2xs focus:outline-none focus:border-teal-600 transition-colors placeholder:text-zinc-400 font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: PAYMENT OPTIONS & UPI QR */}
            <div className="bg-white border border-zinc-200/80 p-4 sm:p-5 space-y-4 rounded-xs shadow-2xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 font-mono">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Payout Channel
                  </h2>
                </div>
                <span className="text-[9px] text-zinc-400 uppercase bg-zinc-50 px-2 py-0.5 border border-zinc-200/80">
                  DEFAULTS
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100/70 border border-zinc-200/80 rounded-2xs font-mono">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex items-center justify-center gap-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-2xs ${
                    paymentMethod === "bank"
                      ? "bg-white text-zinc-900 border border-zinc-200 shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex items-center justify-center gap-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-2xs ${
                    paymentMethod === "upi"
                      ? "bg-white text-zinc-900 border border-zinc-200 shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI / VPA</span>
                </button>
              </div>

              {/* Dynamic Inputs */}
              {paymentMethod === "bank" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans pt-1">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      placeholder="Account Owner Name"
                      value={paymentDetails.ownerName}
                      onChange={(e) => handleInputChange("ownerName", e.target.value)}
                      className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-xs px-3 py-2 rounded-2xs focus:outline-none focus:border-teal-600 transition-colors placeholder:text-zinc-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 00000 00000"
                      value={paymentDetails.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-xs px-3 py-2 rounded-2xs focus:outline-none focus:border-teal-600 transition-colors placeholder:text-zinc-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC / Chase Bank"
                      value={paymentDetails.bankName}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-xs px-3 py-2 rounded-2xs focus:outline-none focus:border-teal-600 transition-colors placeholder:text-zinc-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={paymentDetails.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-xs px-3 py-2 rounded-2xs focus:outline-none focus:border-teal-600 transition-colors placeholder:text-zinc-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                      Bank Address
                    </label>
                    <input
                      type="text"
                      placeholder="Branch / City Address"
                      value={paymentDetails.bankAddress}
                      onChange={(e) => handleInputChange("bankAddress", e.target.value)}
                      className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-xs px-3 py-2 rounded-2xs focus:outline-none focus:border-teal-600 transition-colors placeholder:text-zinc-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                      Bank Code (IFSC / SWIFT)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234"
                      value={paymentDetails.bankCode}
                      onChange={(e) => handleInputChange("bankCode", e.target.value)}
                      className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-xs px-3 py-2 rounded-2xs focus:outline-none focus:border-teal-600 transition-colors placeholder:text-zinc-400 font-mono uppercase"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        placeholder="username@upi / username@okaxis"
                        value={paymentDetails.upiId}
                        onChange={(e) => handleInputChange("upiId", e.target.value)}
                        className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-xs px-3 py-2 rounded-2xs focus:outline-none focus:border-teal-600 transition-colors placeholder:text-zinc-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Payee / Owner Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name linked to UPI"
                        value={paymentDetails.ownerName}
                        onChange={(e) => handleInputChange("ownerName", e.target.value)}
                        className="w-full bg-white border border-zinc-200/80 text-zinc-900 text-xs px-3 py-2 rounded-2xs focus:outline-none focus:border-teal-600 transition-colors placeholder:text-zinc-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* UPI QR CODE UPLOAD AREA */}
                  <div className="pt-3 border-t border-zinc-100">
                    <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-2 font-sans">
                      Upload UPI QR Code (Optional)
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="relative w-28 h-28 shrink-0 bg-zinc-50 border border-zinc-200/80 flex items-center justify-center group overflow-hidden rounded-2xs">
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
                              className="absolute top-1 right-1 bg-white text-zinc-500 hover:text-zinc-900 p-1 border border-zinc-200/80 transition-opacity opacity-0 group-hover:opacity-100 shadow-2xs cursor-pointer rounded-2xs"
                              title="Remove QR Code"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-zinc-400">
                            <QrCode className="w-7 h-7 text-zinc-300 mb-1" />
                            <span className="text-[8px] font-mono uppercase tracking-tight text-zinc-400">
                              NO QR ATTACHED
                            </span>
                          </div>
                        )}
                      </div>

                      <label className="flex-1 w-full h-28 border border-dashed border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer flex flex-col items-center justify-center p-3 text-center group rounded-2xs">
                        <ImageIcon className="w-4 h-4 text-zinc-400 group-hover:text-teal-600 transition-colors mb-1" />
                        <p className="text-xs text-zinc-600 font-sans">
                          Upload GPay / PhonePe / Paytm QR image, or{" "}
                          <span className="text-teal-700 font-medium underline underline-offset-2">
                            browse
                          </span>
                        </p>
                        <p className="text-[9px] text-zinc-400 font-mono mt-0.5 uppercase">
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
    </div>
  );
}