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
        <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs text-zinc-400">
          Loading legal compliance documentation...
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
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-zinc-200">
          {/* Left: Title & Summary */}
          <div className="lg:col-span-8 space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium">
              Legal &amp; Merchant Compliance
            </p>

            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-950">
              {activeTab === "terms" ? "Terms of Service" : "Privacy Policy"}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
              Commercial terms, multi-currency subscription rules, recurring billing lifecycles, and data protection practices for Luen.
            </p>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 pt-2 font-mono text-xs">
              <Link
                href="/terms?tab=terms"
                className={`px-3.5 py-1.5 rounded-md transition-colors font-medium ${
                  activeTab === "terms"
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "bg-zinc-50 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200"
                }`}
              >
                Terms of Service
              </Link>

              <Link
                href="/terms?tab=privacy"
                className={`px-3.5 py-1.5 rounded-md transition-colors font-medium ${
                  activeTab === "privacy"
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "bg-zinc-50 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200"
                }`}
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Right: Metadata & Contact */}
          <div className="lg:col-span-4 flex flex-col justify-end text-xs font-mono text-zinc-400 space-y-1.5 lg:text-right">
            <div>
              <span className="text-zinc-600 font-medium uppercase">Effective Date:</span>{" "}
              <span>August 20, 2026</span>
            </div>
            <div>
              <span className="text-zinc-600 font-medium uppercase">Jurisdiction:</span>{" "}
              <span>Republic of India</span>
            </div>
            <div>
              <span className="text-zinc-600 font-medium uppercase">Direct Desk:</span>{" "}
              <a
                href="mailto:support@luen.in"
                className="text-teal-700 font-semibold underline underline-offset-4 hover:text-teal-800 transition-colors"
              >
                support@luen.in
              </a>
            </div>
          </div>
        </div>

        {/* Document Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 items-start">
          {/* Table of Contents Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-3 font-sans lg:sticky lg:top-20 bg-white p-5 rounded-xl border border-zinc-200 shadow-xs">
            <span className="text-[11px] text-zinc-400 font-mono font-medium uppercase tracking-wider block border-b border-zinc-100 pb-2">
              Document Index
            </span>

            {activeTab === "terms" ? (
              <nav className="space-y-1.5 font-mono text-xs">
                <a href="#acceptance" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  01. Acceptance of Terms
                </a>
                <a href="#plans-limits" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  02. Plans &amp; Usage Limits
                </a>
                <a href="#billing-auto-renew" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  03. Recurring Billing &amp; Currencies
                </a>
                <a href="#cancellation-refunds" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  04. Cancellation &amp; Refunds
                </a>
                <a href="#acceptable-use" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  05. Acceptable Conduct
                </a>
                <a href="#liability-jurisdiction" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  06. Liability &amp; Indian Law
                </a>
              </nav>
            ) : (
              <nav className="space-y-1.5 font-mono text-xs">
                <a href="#data-collected" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  01. Information Collected
                </a>
                <a href="#invoice-privacy" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  02. Invoice Confidentiality
                </a>
                <a href="#payment-processors" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  03. Payment Gateways (Razorpay)
                </a>
                <a href="#security-storage" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  04. Encryption &amp; Retention
                </a>
                <a href="#user-rights" className="block text-zinc-600 hover:text-zinc-950 py-1 transition-colors">
                  05. Data Erasure &amp; Rights
                </a>
              </nav>
            )}
          </aside>

          {/* Main Article */}
          <article className="lg:col-span-8 text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
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

function TermsDocument() {
  return (
    <div className="space-y-6">
      <section id="acceptance" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">01.</span> Acceptance of Agreement
        </div>
        <p className="text-zinc-500 leading-relaxed">
          By creating an account, generating an invoice, or purchasing a subscription on <strong className="text-zinc-900 font-medium">Luen</strong> (&quot;the Platform&quot;, &quot;Service&quot;, &quot;we&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service. Luen provides browser-based SaaS software enabling freelancers, agencies, and small businesses to generate, configure, and issue professional PDF invoices.
        </p>
      </section>

      <section id="plans-limits" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">02.</span> Tiers &amp; Fair Usage Quotas
        </div>
        <p className="text-zinc-500 leading-relaxed">
          Luen operates on a tiered access model designed to balance fair access with infrastructure capacity:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-500">
          <li>
            <strong className="text-zinc-800">Starter Free Tier:</strong> Free accounts are restricted to <strong className="text-zinc-900">5 PDF downloads/exports per calendar month</strong> and automatically include the default &quot;Created with Luen&quot; brand watermark. Monthly download quotas reset on the 1st of every calendar month.
          </li>
          <li>
            <strong className="text-zinc-800">Pro Tier:</strong> Grants unlimited PDF exports, watermark suppression, custom company branding, custom digital signatures, and advanced tax configuration engines (GST, CGST, SGST, IGST, and International VAT).
          </li>
          <li>
            You agree not to deploy automated scrapers, headless browsers, or bots to circumvent download counters or watermark security controls.
          </li>
        </ul>
      </section>

      <section id="billing-auto-renew" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">03.</span> Multi-Currency Subscriptions &amp; Auto-Renewals
        </div>
        <p className="text-zinc-500 leading-relaxed">
          Paid Pro memberships are offered on Monthly and Yearly recurring billing cycles:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-500">
          <li>
            <strong className="text-zinc-800">Domestic Indian Customers:</strong> Billed in Indian Rupees (<span className="font-mono text-zinc-900">INR / ₹</span>) via Razorpay supporting UPI Autopay, Netbanking, and domestic debit/credit cards under RBI e-Mandate guidelines.
          </li>
          <li>
            <strong className="text-zinc-800">International Customers:</strong> Billed in US Dollars (<span className="font-mono text-zinc-900">USD / $</span>) via Razorpay supporting cross-border Visa, Mastercard, and American Express cards.
          </li>
          <li>
            <strong className="text-zinc-800">Continuous Authorization:</strong> By subscribing, you authorize Razorpay to automatically debit your designated payment method at the beginning of each billing interval until canceled.
          </li>
        </ul>
      </section>

      <section id="cancellation-refunds" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">04.</span> Cancellation &amp; Refund Policy
        </div>
        <p className="text-zinc-500 leading-relaxed">
          You have full control over your subscription renewal at all times:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-500">
          <li>
            <strong className="text-zinc-800">Self-Service Cancellation:</strong> You can cancel recurring auto-debit anytime in your account Settings by clicking &quot;Cancel Auto-Renewal&quot;.
          </li>
          <li>
            <strong className="text-zinc-800">Retention of Paid Benefits:</strong> When auto-renewal is canceled, your account retains uninterrupted Pro access through the conclusion of the prepaid billing period (<span className="font-mono text-zinc-900">subscriptionPeriodEnd</span>), after which it reverts to Free.
          </li>
          <li>
            <strong className="text-zinc-800">Non-Refundable Billing:</strong> Due to immediate server-side provisioning of computing resources and digital export quotas, all subscription fees are non-refundable once billed. We do not provide prorated refunds for partially used billing cycles.
          </li>
        </ul>
      </section>

      <section id="acceptable-use" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">05.</span> Acceptable Conduct &amp; Prohibited Uses
        </div>
        <p className="text-zinc-500 leading-relaxed">
          You agree not to use Luen to issue deceptive, fraudulent, or illegal financial instruments, or to misrepresent tax statuses. You retain full legal liability for the validity of invoices issued to your customers.
        </p>
      </section>

      <section id="liability-jurisdiction" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">06.</span> Limitation of Liability &amp; Governing Law
        </div>
        <p className="text-zinc-500 leading-relaxed">
          Luen provides document formatting software and does not offer chartered accountancy, legal, or formal tax advisory services. These Terms shall be governed by and construed in accordance with the laws of the <strong className="text-zinc-900 font-medium">Republic of India</strong>, and any disputes shall fall under the exclusive jurisdiction of the competent courts of India.
        </p>
      </section>
    </div>
  );
}

function PrivacyDocument() {
  return (
    <div className="space-y-6">
      <section id="data-collected" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">01.</span> Information We Collect
        </div>
        <p className="text-zinc-500 leading-relaxed">
          We only collect information strictly necessary to provide authentication, save your organization defaults, and process subscription payments:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-500">
          <li><strong className="text-zinc-800">Identity Data:</strong> Name and verified email address via our authentication provider.</li>
          <li><strong className="text-zinc-800">Organization Defaults:</strong> Company name, billing address, tax identifier (GSTIN/VAT), and optional payment channel details (bank wire details or UPI ID).</li>
          <li><strong className="text-zinc-800">Media Assets:</strong> Uploaded company logos and UPI QR codes, stored securely as base64 strings or dedicated media references.</li>
        </ul>
      </section>

      <section id="invoice-privacy" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">02.</span> Confidentiality of Invoicing Data
        </div>
        <p className="text-zinc-500 leading-relaxed">
          We treat your customer lists, hourly rates, and invoice line items as confidential. <strong className="text-zinc-900 font-semibold">We do not sell, rent, monetize, or disclose your client data, invoice totals, or billing records to any third-party advertising networks.</strong>
        </p>
      </section>

      <section id="payment-processors" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">03.</span> Payment Gateways &amp; Tokenization
        </div>
        <p className="text-zinc-500 leading-relaxed">
          Payment processing is managed by <strong className="text-zinc-900 font-medium">Razorpay Software Private Limited</strong>. Luen never stores raw card numbers, CVVs, or UPI MPINs on our servers. Payment information is tokenized directly under PCI-DSS Level 1 certified standards.
        </p>
      </section>

      <section id="security-storage" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">04.</span> Encryption &amp; Storage Protocols
        </div>
        <p className="text-zinc-500 leading-relaxed">
          All data in transit is protected using modern 256-bit TLS/SSL encryption. Stored records and database instances are restricted using secure environment keys and session-scoped access boundaries.
        </p>
      </section>

      <section id="user-rights" className="scroll-mt-24 bg-white border border-zinc-200 p-6 sm:p-7 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-950 uppercase tracking-wider pb-2 border-b border-zinc-100">
          <span className="text-teal-600">05.</span> Data Erasure &amp; User Rights
        </div>
        <p className="text-zinc-500 leading-relaxed">
          You reserve full rights to review, update, or permanently delete your account and stored invoice history. For assistance with data removal requests, contact our privacy desk directly at <a href="mailto:support@luen.in" className="text-teal-700 underline underline-offset-4 font-mono font-medium hover:text-teal-800">support@luen.in</a>.
        </p>
      </section>
    </div>
  );
}