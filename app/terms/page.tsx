"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Nav from "../component/Nav";
import Footer from "../component/Footer";

export default function LegalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
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

      <main className="w-[90%] max-w-5xl mx-auto pt-12 md:pt-16 pb-16">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-zinc-200/80">
          
          {/* Left: Title & Intro */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-block text-xs font-mono text-teal-600 uppercase tracking-widest">
              LEGAL & COMPLIANCE
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
              {activeTab === "terms" ? "Terms of Service" : "Privacy Policy"}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl leading-relaxed">
              Read our terms of service, subscription policies, and data handling protocols. Built for freelancers and small businesses who want clean, compliant billing.
            </p>

            {/* Tab Switcher Buttons */}
            <div className="flex items-center gap-2.5 pt-2">
              <Link
                href="/terms?tab=terms"
                className={`px-4 py-2 text-xs font-medium rounded-xs transition-colors ${
                  activeTab === "terms"
                    ? "bg-zinc-950 text-white shadow-2xs"
                    : "bg-white text-zinc-800 hover:bg-zinc-50 border border-zinc-200"
                }`}
              >
                Terms of Service
              </Link>

              <Link
                href="/terms?tab=privacy"
                className={`px-4 py-2 text-xs font-medium rounded-xs transition-colors ${
                  activeTab === "privacy"
                    ? "bg-zinc-950 text-white shadow-2xs"
                    : "bg-white text-zinc-800 hover:bg-zinc-50 border border-zinc-200"
                }`}
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Right: Metadata Details */}
          <div className="lg:col-span-5 flex flex-col justify-end text-xs font-sans text-zinc-500 space-y-2 lg:text-right">
            <div>
              <span className="text-zinc-800 font-semibold">Effective Date:</span> July 30, 2026
            </div>
            <div>
              <span className="text-zinc-800 font-semibold">Version:</span> 2.1 (GST & Global Multi-Currency)
            </div>
            <div>
              <span className="text-zinc-800 font-semibold">Questions?</span> Contact{" "}
              <a href="mailto:support@luen.app" className="text-zinc-800 underline hover:text-teal-600 transition">
                support@luen.app
              </a>
            </div>
          </div>

        </div>

        {/* Document Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 items-start">
          
          {/* Table of Contents */}
          <aside className="lg:col-span-4 space-y-3 text-xs sm:text-sm font-sans lg:sticky lg:top-8 bg-white p-5 rounded-xs border border-zinc-200/80 shadow-2xs">
            <span className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider block mb-3 border-b border-zinc-100 pb-2">
              On this page
            </span>

            {activeTab === "terms" ? (
              <nav className="space-y-2.5">
                <a href="#acceptance" className="block text-zinc-600 hover:text-zinc-950 transition font-medium">
                  1. Acceptance of Terms
                </a>
                <a href="#features" className="block text-zinc-600 hover:text-zinc-950 transition font-medium">
                  2. Usage & Fair Limits
                </a>
                <a href="#pricing" className="block text-zinc-600 hover:text-zinc-950 transition font-medium">
                  3. Subscriptions & Billing
                </a>
                <a href="#liability" className="block text-zinc-600 hover:text-zinc-950 transition font-medium">
                  4. Limitation of Liability
                </a>
                <a href="#termination" className="block text-zinc-600 hover:text-zinc-950 transition font-medium">
                  5. Account Termination
                </a>
              </nav>
            ) : (
              <nav className="space-y-2.5">
                <a href="#collection" className="block text-zinc-600 hover:text-zinc-950 transition font-medium">
                  1. Information We Collect
                </a>
                <a href="#usage-data" className="block text-zinc-600 hover:text-zinc-950 transition font-medium">
                  2. Use of Invoicing Data
                </a>
                <a href="#storage" className="block text-zinc-600 hover:text-zinc-950 transition font-medium">
                  3. Security & Storage
                </a>
                <a href="#rights" className="block text-zinc-600 hover:text-zinc-950 transition font-medium">
                  4. Data Rights & Erasure
                </a>
              </nav>
            )}
          </aside>

          {/* Document Content Article */}
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

{/* TERMS DOCUMENT */}
function TermsDocument() {
  return (
    <div className="space-y-10">
      
      <section id="acceptance" className="scroll-mt-8 space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          1. Acceptance of Terms
        </h2>
        <p>
          By creating an account or using <strong>Luen</strong> {`("the Service"), you agree to be bound by these Terms of Service. Luen provides browser-based software to generate, customize, and issue professional PDF invoices without spreadsheets.`}
        </p>
      </section>

      <section id="features" className="scroll-mt-8 space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          2. Usage & Fair Limits
        </h2>
        <p>
          Free tier users can create up to 5 invoices per month. Upgrading to the Pro tier grants unlimited invoice generation, custom branding uploads, and watermark suppression. You agree not to use automated scrapers or bots to bypass monthly generation limits.
        </p>
      </section>

      <section id="pricing" className="scroll-mt-8 space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          3. Subscriptions & Billing
        </h2>
        <p>
          Pro memberships are billed monthly ($12/month) or annually ($99/year). You may cancel your subscription at any time via your account settings. Upon cancellation, your account retains Pro access until the end of the active billing period.
        </p>
      </section>

      <section id="liability" className="scroll-mt-8 space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          4. Limitation of Liability
        </h2>
        <p>
          {`Luen is provided "as is" without warranties of any kind. Luen is not a certified public accountancy firm. Users are solely responsible for ensuring that tax rates (GST, VAT) and bank payment details are accurate prior to issuing invoices to clients.`}
        </p>
      </section>

      <section id="termination" className="scroll-mt-8 space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          5. Account Termination
        </h2>
        <p>
          We reserve the right to suspend or close accounts that violate our acceptable use standards without prior notice.
        </p>
      </section>

    </div>
  );
}

{/* PRIVACY DOCUMENT */}
function PrivacyDocument() {
  return (
    <div className="space-y-10">
      
      <section id="collection" className="scroll-mt-8 space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          1. Information We Collect
        </h2>
        <p>
          On our Starter tier, invoice data remains stored locally in your browser’s <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-xs text-zinc-800">localStorage</code> and is not sent to external database servers. For Pro accounts, we collect account credentials (email address) and billing telemetry.
        </p>
      </section>

      <section id="usage-data" className="scroll-mt-8 space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          2. Use of Invoicing Data
        </h2>
        <p>
          Invoice information processed on Luen servers is utilized exclusively to compile vector PDF documents. We do not aggregate, sell, or disclose client contact lists, invoice amounts, or business revenue figures to third-party ad networks.
        </p>
      </section>

      <section id="storage" className="scroll-mt-8 space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          3. Security & Storage
        </h2>
        <p>
          Uploaded organization logos and signatures are processed in memory to embed directly into PDF files. All data in transit uses encrypted SSL/TLS channels, and Pro tier data at rest is secured using 256-bit AES encryption.
        </p>
      </section>

      <section id="rights" className="scroll-mt-8 space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          4. Data Rights & Erasure
        </h2>
        <p>
          Under standard privacy frameworks (GDPR / CCPA), you reserve the right to inspect, export, or permanently erase your profile and stored template configurations. Account deletion can be triggered anytime in your account settings.
        </p>
      </section>

    </div>
  );
}