"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import {
  Scale,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  FileCheck,
  AlertTriangle,
  Lock,
  Globe,
} from "lucide-react";

export default function LegalPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-xs text-zinc-400">
          Loading legal telemetry...
        </div>
      }
    >
      <LegalPageContent />
    </Suspense>
  );
}

function LegalPageContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "privacy" ? "privacy" : "terms";

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-zinc-800 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
      <Nav />

      <main className="w-[92%] max-w-5xl mx-auto pt-10 md:pt-14 pb-16">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-zinc-200/80">
          {/* Left: Title & Summary */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-2xs uppercase tracking-widest font-bold">
              <Scale className="w-3 h-3 text-teal-600" />
              <span>LEGAL &amp; MERCHANT COMPLIANCE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-sans">
              {activeTab === "terms" ? "Terms of Service" : "Privacy Policy"}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl leading-relaxed">
              Read our commercial terms, multi-currency subscription rules, automated recurring billing protocols, and data protection practices.
            </p>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 pt-1 font-mono text-xs">
              <Link
                href="/terms?tab=terms"
                className={`px-3.5 py-1.5 rounded-2xs transition-all font-semibold uppercase tracking-wider ${
                  activeTab === "terms"
                    ? "bg-zinc-950 text-white shadow-2xs"
                    : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-zinc-200"
                }`}
              >
                Terms of Service
              </Link>

              <Link
                href="/terms?tab=privacy"
                className={`px-3.5 py-1.5 rounded-2xs transition-all font-semibold uppercase tracking-wider ${
                  activeTab === "privacy"
                    ? "bg-zinc-950 text-white shadow-2xs"
                    : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-zinc-200"
                }`}
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Right: Telemetry & Contact */}
          <div className="lg:col-span-5 flex flex-col justify-end text-xs font-mono text-zinc-500 space-y-1.5 lg:text-right">
            <div>
              <span className="text-zinc-800 font-bold uppercase">Effective Date:</span>{" "}
              <span>August 20, 2026</span>
            </div>
            <div>
              <span className="text-zinc-800 font-bold uppercase">Jurisdiction:</span>{" "}
              <span>Republic of India</span>
            </div>
            <div>
              <span className="text-zinc-800 font-bold uppercase">Direct Desk:</span>{" "}
              <a
                href="mailto:support@luen.in"
                className="text-teal-700 font-bold underline hover:text-teal-800 transition"
              >
                support@luen.in
              </a>
            </div>
          </div>
        </div>

        {/* Document Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          {/* Table of Contents Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-3 text-xs font-sans lg:sticky lg:top-8 bg-white p-4 rounded-2xs border border-zinc-200/80 shadow-2xs">
            <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block border-b border-zinc-100 pb-2">
              Document Index
            </span>

            {activeTab === "terms" ? (
              <nav className="space-y-2 font-mono text-[11px]">
                <a href="#acceptance" className="block text-zinc-600 hover:text-teal-700 transition">
                  01. Acceptance of Terms
                </a>
                <a href="#plans-limits" className="block text-zinc-600 hover:text-teal-700 transition">
                  02. Plans &amp; Usage Limits
                </a>
                <a href="#billing-auto-renew" className="block text-zinc-600 hover:text-teal-700 transition">
                  03. Recurring Billing &amp; Currencies
                </a>
                <a href="#cancellation-refunds" className="block text-zinc-600 hover:text-teal-700 transition">
                  04. Cancellation &amp; Refunds
                </a>
                <a href="#acceptable-use" className="block text-zinc-600 hover:text-teal-700 transition">
                  05. Acceptable Conduct
                </a>
                <a href="#liability-jurisdiction" className="block text-zinc-600 hover:text-teal-700 transition">
                  06. Liability &amp; Indian Law
                </a>
              </nav>
            ) : (
              <nav className="space-y-2 font-mono text-[11px]">
                <a href="#data-collected" className="block text-zinc-600 hover:text-teal-700 transition">
                  01. Information Collected
                </a>
                <a href="#invoice-privacy" className="block text-zinc-600 hover:text-teal-700 transition">
                  02. Invoice Data Confidentiality
                </a>
                <a href="#payment-processors" className="block text-zinc-600 hover:text-teal-700 transition">
                  03. Payment Gateways (Razorpay)
                </a>
                <a href="#security-storage" className="block text-zinc-600 hover:text-teal-700 transition">
                  04. Encryption &amp; Retention
                </a>
                <a href="#user-rights" className="block text-zinc-600 hover:text-teal-700 transition">
                  05. Data Erasure &amp; Rights
                </a>
              </nav>
            )}
          </aside>

          {/* Main Article */}
          <article className="lg:col-span-8 text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed">
            <div className={activeTab === "terms" ? "block" : "hidden"}>
              <TermsDocument />
            </div>

            <div className={activeTab === "privacy" ? "block" : "hidden"}>
              <PrivacyDocument />
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

{/* TERMS OF SERVICE COMPONENT */}
function TermsDocument() {
  return (
    <div className="space-y-6">
      <section id="acceptance" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">01.</span> Acceptance of Agreement
        </div>
        <p>
          By creating an account, generating an invoice, or purchasing a subscription on <strong>Luen</strong> (&quot;the Platform&quot;, &quot;Service&quot;, &quot;we&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service. Luen provides browser-based SaaS software enabling freelancers, agencies, and small businesses to generate, configure, and issue professional PDF invoices.
        </p>
      </section>

      <section id="plans-limits" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">02.</span> Tiers &amp; Fair Usage Quotas
        </div>
        <p>
          Luen operates on a tiered access model designed to balance fair access with infrastructure capacity:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-zinc-500 font-sans">
          <li>
            <strong>Starter Free Tier:</strong> Free accounts are restricted to <strong>5 PDF downloads/exports per calendar month</strong> and automatically include the default &quot;Created with Luen&quot; brand watermark. Monthly download quotas reset on the 1st of every calendar month.
          </li>
          <li>
            <strong>Pro Tier:</strong> Grants unlimited PDF exports, watermark suppression, custom company branding, custom digital signatures, and advanced tax configuration engines (GST, CGST, SGST, IGST, and International VAT).
          </li>
          <li>
            You agree not to deploy automated scrapers, headless browsers, or bots to circumvent download counters or watermark security controls.
          </li>
        </ul>
      </section>

      <section id="billing-auto-renew" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">03.</span> Multi-Currency Subscriptions &amp; Auto-Renewals
        </div>
        <p>
          Paid Pro memberships are offered on Monthly and Yearly recurring billing cycles:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-zinc-500 font-sans">
          <li>
            <strong>Domestic Indian Customers:</strong> Billed in Indian Rupees (<span className="font-mono">INR / ₹</span>) via Razorpay supporting UPI Autopay, Netbanking, and domestic debit/credit cards under RBI e-Mandate guidelines.
          </li>
          <li>
            <strong>International Customers:</strong> Billed in US Dollars (<span className="font-mono">USD / $</span>) via Razorpay supporting cross-border Visa, Mastercard, and American Express cards.
          </li>
          <li>
            <strong>Continuous Authorization:</strong> By subscribing, you authorize Razorpay to automatically debit your designated payment method at the beginning of each billing interval until canceled.
          </li>
        </ul>
      </section>

      <section id="cancellation-refunds" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">04.</span> Cancellation &amp; Refund Policy
        </div>
        <p>
          You have full control over your subscription renewal at all times:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-zinc-500 font-sans">
          <li>
            <strong>Self-Service Cancellation:</strong> You can cancel recurring auto-debit anytime in your account Settings by clicking &quot;Cancel Auto-Renewal&quot;.
          </li>
          <li>
            <strong>Retention of Paid Benefits:</strong> When auto-renewal is canceled, your account retains uninterrupted Pro access through the conclusion of the prepaid billing period (<span className="font-mono">subscriptionPeriodEnd</span>), after which it reverts to Free.
          </li>
          <li>
            <strong>Non-Refundable Billing:</strong> Due to immediate server-side provisioning of computing resources and digital export quotas, all subscription fees are non-refundable once billed. We do not provide prorated refunds for partially used billing cycles.
          </li>
        </ul>
      </section>

      <section id="acceptable-use" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">05.</span> Acceptable Conduct &amp; Prohibited Uses
        </div>
        <p>
          You agree not to use Luen to issue deceptive, fraudulent, or illegal financial instruments, or to misrepresent tax statuses. You retain full legal liability for the validity of invoices issued to your customers.
        </p>
      </section>

      <section id="liability-jurisdiction" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">06.</span> Limitation of Liability &amp; Governing Law
        </div>
        <p>
          Luen provides document formatting software and does not offer chartered accountancy, legal, or formal tax advisory services. These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of India</strong>, and any disputes shall fall under the exclusive jurisdiction of the competent courts of India.
        </p>
      </section>
    </div>
  );
}

{/* PRIVACY POLICY COMPONENT */}
function PrivacyDocument() {
  return (
    <div className="space-y-6">
      <section id="data-collected" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">01.</span> Information We Collect
        </div>
        <p>
          We only collect information strictly necessary to provide authentication, save your organization defaults, and process subscription payments:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-zinc-500 font-sans">
          <li><strong>Identity Data:</strong> Name and verified email address via our authentication provider.</li>
          <li><strong>Organization Defaults:</strong> Company name, billing address, tax identifier (GSTIN/VAT), and optional payment channel details (bank wire details or UPI ID).</li>
          <li><strong>Images:</strong> Uploaded company logos and UPI QR codes, stored securely as base64 strings or dedicated media references.</li>
        </ul>
      </section>

      <section id="invoice-privacy" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">02.</span> Confidentiality of Invoicing Data
        </div>
        <p>
          We treat your customer lists, hourly rates, and invoice line items as confidential. <strong>We do not sell, rent, monetize, or disclose your client data, invoice totals, or billing records to any third-party advertising networks.</strong>
        </p>
      </section>

      <section id="payment-processors" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">03.</span> Payment Gateways &amp; Tokenization
        </div>
        <p>
          Payment processing is managed by <strong>Razorpay Software Private Limited</strong>. Luen never stores raw card numbers, CVVs, or UPI MPINs on our servers. Payment information is tokenized directly under PCI-DSS Level 1 certified standards.
        </p>
      </section>

      <section id="security-storage" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">04.</span> Encryption &amp; Storage Protocols
        </div>
        <p>
          All data in transit is protected using modern 256-bit TLS/SSL encryption. Stored records and database instances are restricted using secure environment keys and session-scoped access boundaries to prevent IDOR risks.
        </p>
      </section>

      <section id="user-rights" className="scroll-mt-8 bg-white border border-zinc-200/80 p-4 sm:p-5 rounded-2xs space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100">
          <span className="text-teal-600">05.</span> Data Erasure &amp; User Rights
        </div>
        <p>
          You reserve full rights to review, update, or permanently delete your account and stored invoice history. For assistance with data removal requests, contact our privacy desk directly at <a href="mailto:support@luen.in" className="text-teal-700 underline font-mono font-bold">support@luen.in</a>.
        </p>
      </section>
    </div>
  );
}