"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import {
  FileText,
  Database,
  Calculator,
  CreditCard,
  Layers,
  Sparkles,
  Search,
  Copy,
  Check,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Terminal,
  Clock,
} from "lucide-react";

interface DocSectionItem {
  id: string;
  label: string;
  badge?: string;
}

const DOC_SECTIONS: DocSectionItem[] = [
  { id: "quickstart", label: "1. Quickstart Guide", badge: "CORE" },
  { id: "data-persistence", label: "2. Metadata Persistence Model", badge: "DATA" },
  { id: "invoice-config", label: "3. Form Fields & Itemization" },
  { id: "payments-status", label: "4. Payments & Status Lifecycle" },
  { id: "tax-compliance", label: "5. GST & Cross-Border LUT", badge: "TAX" },
  { id: "subscriptions-quotas", label: "6. Multi-Currency Subscriptions" },
  { id: "export-troubleshooting", label: "7. PDF Vector Compilation & Troubleshooting" },
];

export default function DocsClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs text-zinc-400">
          Loading technical documentation...
        </div>
      }
    >
      <DocsPageContent />
    </Suspense>
  );
}

function DocsPageContent() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPrisma, setCopiedPrisma] = useState(false);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return DOC_SECTIONS;
    return DOC_SECTIONS.filter((s) =>
      s.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const prismaSchemaCode = `model Invoice {
  InvoiceId       String        @id @default(cuid())
  invoiceNumber   String        @unique // Format: "INV-YYYY-XXXX"
  
  // Recipient Client Data
  CustomerName    String?
  CustomerEmail   String?
  CustomerAddress String?
  Subject         String?
  
  // Date Fields
  IssueDate       DateTime
  DueDate         DateTime
  
  // Financial Totals
  Currency        String        @default("INR") // 'INR', 'USD', 'EUR', etc.
  subtotal        Decimal       @default(0.0)
  tax             Decimal       @default(0.0)
  discount        Decimal?      @default(0.0)
  total           Decimal       @default(0.0)
  
  // Lifecycle Status Marker
  paymentStatus   InvoiceStatus @default(PENDING)
  
  // User Relationship
  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Audit Timestamps
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@map("invoice")
}`;

  const handleCopyPrisma = () => {
    navigator.clipboard.writeText(prismaSchemaCode);
    setCopiedPrisma(true);
    setTimeout(() => setCopiedPrisma(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10 border-b border-zinc-200">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium">
              Knowledge Base &amp; Technical Architecture
            </p>

            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-950">
              Technical Documentation
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
              Comprehensive architectural guides covering metadata persistence, vector canvas PDF compilation, multi-currency subscription lifecycles, and Indian GST rules.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end text-xs font-mono text-zinc-400 space-y-1 lg:text-right">
            <div>
              <span className="text-zinc-600 font-medium uppercase">Engine:</span>{" "}
              <span>v2.1 (Vector Canvas &amp; SSR Buffer)</span>
            </div>
            <div>
              <span className="text-zinc-600 font-medium uppercase">Persistence:</span>{" "}
              <span>Metadata-Only Model</span>
            </div>
            <div>
              <span className="text-zinc-600 font-medium uppercase">Support Desk:</span>{" "}
              <a
                href="mailto:support@luen.in"
                className="text-teal-700 font-semibold underline underline-offset-4 hover:text-teal-800 transition-colors"
              >
                support@luen.in
              </a>
            </div>
          </div>
        </div>

        {/* Documentation Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 items-start">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-4 font-sans lg:sticky lg:top-20 bg-white p-5 rounded-xl border border-zinc-200 shadow-xs">
            {/* Search Filter Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-950 text-xs font-mono pl-9 pr-3 py-2 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono font-medium uppercase tracking-wider border-b border-zinc-100 pb-2 pt-1">
              <span>Table of Contents</span>
              <span>{filteredSections.length} Articles</span>
            </div>

            <nav className="space-y-1">
              {filteredSections.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors text-xs font-medium ${
                    activeSection === item.id
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-sm ml-2 uppercase ${
                        activeSection === item.id
                          ? "bg-zinc-800 text-teal-300"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </nav>

            {/* Quick Links Card */}
            <div className="pt-3 border-t border-zinc-100 text-xs font-mono text-zinc-500 space-y-1.5">
              <div className="flex justify-between items-center">
                <span>Compliance:</span>
                <Link href="/terms" className="text-teal-700 hover:underline font-semibold">
                  Terms &amp; Privacy →
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <span>Direct Support:</span>
                <Link href="/support" className="text-teal-700 hover:underline font-semibold">
                  Help Desk →
                </Link>
              </div>
            </div>
          </aside>

          {/* Documentation Content Articles */}
          <article className="lg:col-span-8 text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed space-y-8">
            {/* SECTION 1: QUICKSTART */}
            <section id="quickstart" className="scroll-mt-24 space-y-4 bg-white border border-zinc-200 p-6 sm:p-8 rounded-xl shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>01. Quickstart Guide</span>
                </h2>
                <span className="text-[10px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-sm uppercase font-semibold">
                  Getting Started
                </span>
              </div>

              <p className="text-zinc-500">
                Luen allows independent software engineers, consultants, and digital agencies to generate compliant, vector-sharp PDF invoices without spreadsheets or ERP software overhead.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-lg space-y-1.5">
                  <div className="font-semibold text-zinc-950 text-xs flex items-center gap-2">
                    <span className="text-teal-600 font-mono">01</span> Organization &amp; Client
                  </div>
                  <p className="text-xs text-zinc-500">
                    Input business details, billing address, tax ID (GSTIN/VAT), and client details. Use Settings to save defaults for instant 1-click prefill.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-lg space-y-1.5">
                  <div className="font-semibold text-zinc-950 text-xs flex items-center gap-2">
                    <span className="text-teal-600 font-mono">02</span> Itemize Deliverables
                  </div>
                  <p className="text-xs text-zinc-500">
                    Add milestone line items, hourly rates, quantities, and optional HSN/SAC codes with automated subtotal math.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-lg space-y-1.5">
                  <div className="font-semibold text-zinc-950 text-xs flex items-center gap-2">
                    <span className="text-teal-600 font-mono">03</span> Select Tax Engine
                  </div>
                  <p className="text-xs text-zinc-500">
                    Configure intra-state GST (CGST + SGST), inter-state IGST, or toggle Cross-Border Export Under LUT with automatic statutory declarations.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-lg space-y-1.5">
                  <div className="font-semibold text-zinc-950 text-xs flex items-center gap-2">
                    <span className="text-teal-600 font-mono">04</span> Export Vector PDF
                  </div>
                  <p className="text-xs text-zinc-500">
                    Download crisp, pixel-perfect PDF documents directly to your device with automated download quota telemetry.
                  </p>
                </div>
              </div>

              {/* Terminal-like Preview Card */}
              <div className="mt-4 border border-zinc-800 rounded-lg bg-zinc-950 p-4 space-y-2.5 text-zinc-100 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="text-[11px] text-zinc-400 pl-2">Luen Invoicing Editor — Active State</span>
                  </div>
                  <span className="text-[9px] text-teal-400 bg-teal-950 border border-teal-800 px-1.5 py-0.5 rounded-sm uppercase">
                    Auto-Prefill ON
                  </span>
                </div>
                <div className="p-3 bg-zinc-900 rounded-md text-[11px] space-y-1.5 text-zinc-300">
                  <p className="text-zinc-400">{`> Invoice Serial #   : INV-2026-042`}</p>
                  <p className="text-zinc-400">{`> Currency & TaxMode : INR (₹) • Intra-State CGST(9%) + SGST(9%)`}</p>
                  <p className="text-teal-400">{`> Line Items Loaded  : 3 Deliverables • Subtotal: ₹85,000.00 • Total: ₹100,300.00`}</p>
                  <p className="text-emerald-400">{`> Compilation Status : Clean vector graph parsed in 184ms`}</p>
                </div>
              </div>
            </section>

            {/* SECTION 2: ARCHITECTURE & DATABASE */}
            <section id="data-persistence" className="scroll-mt-24 space-y-4 bg-white border border-zinc-200 p-6 sm:p-8 rounded-xl shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-600" />
                  <span>02. Metadata Persistence Architecture</span>
                </h2>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm uppercase font-semibold">
                  Database Spec
                </span>
              </div>

              <p className="text-zinc-500">
                To maintain sub-second rendering performance and eliminate database bloat, Luen implements a <strong className="text-zinc-900 font-semibold">metadata-only persistence architecture</strong>. We do not store pre-compiled binary PDF blobs or gigabytes of repetitive file streams in our database.
              </p>

              {/* Code Snippet Toolbar */}
              <div className="bg-zinc-950 text-zinc-100 rounded-lg border border-zinc-800 overflow-hidden font-mono text-xs shadow-xs">
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                  <span className="text-teal-400 text-xs font-semibold flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-teal-400" />
                    schema.prisma (Invoice Model)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPrisma}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md cursor-pointer"
                  >
                    {copiedPrisma ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-teal-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-[11px] text-zinc-300 leading-relaxed font-mono">
                  {prismaSchemaCode}
                </pre>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg text-xs text-zinc-600 space-y-2">
                <span className="font-semibold text-zinc-950 font-mono uppercase text-[11px] block">
                  Key Architectural Advantages:
                </span>
                <ul className="list-disc pl-4 space-y-1.5 text-zinc-500">
                  <li>
                    <strong className="text-zinc-800">Microsecond Query Latency:</strong> Invoice records remain under 1KB per row, allowing instantaneous dashboard retrieval and status filtering.
                  </li>
                  <li>
                    <strong className="text-zinc-800">Deterministic Vector Compilation:</strong> The exact PDF vector tree is re-compiled on-demand using stored metadata, guaranteeing zero document degradation.
                  </li>
                  <li>
                    <strong className="text-zinc-800">Strict Audit Verification:</strong> Financial audit values (`subtotal`, `tax`, `total`, `Currency`) remain structured as SQL Decimals for analytics and tax filing.
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 3: FORM FIELDS & ITEMIZATION */}
            <section id="invoice-config" className="scroll-mt-24 space-y-4 bg-white border border-zinc-200 p-6 sm:p-8 rounded-xl shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>03. Form Fields &amp; Deliverable Itemization</span>
                </h2>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm uppercase font-semibold">
                  Data Dictionary
                </span>
              </div>

              <p className="text-zinc-500">
                To avoid client accounts payable disputes, ensure invoice form fields adhere to standard corporate accounting conventions:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <span className="font-mono font-semibold text-zinc-950 text-xs">
                    • Consecutive Serial Numbering
                  </span>
                  <p className="text-zinc-500">
                    Always use sequential alphanumeric series without gaps (e.g., <code className="font-mono bg-zinc-200/80 px-1 py-0.5 rounded text-[11px]">INV-2026-001</code>). Duplicate serial numbers create audit friction with corporate procurement systems.
                  </p>
                </div>

                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <span className="font-mono font-semibold text-zinc-950 text-xs">
                    • Clear Payment Due Date Terms
                  </span>
                  <p className="text-zinc-500">
                    Define clear payment windows using standard payment horizons: Net 15, Net 30, or Upon Receipt.
                  </p>
                </div>

                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <span className="font-mono font-semibold text-zinc-950 text-xs">
                    • HSN/SAC Classification Codes
                  </span>
                  <p className="text-zinc-500">
                    For Indian GST invoices, apply statutory SAC codes (e.g., <code className="font-mono bg-zinc-200/80 px-1 py-0.5 rounded text-[11px]">998314</code> for Information Technology / Custom Software Development).
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 4: PAYMENTS & STATUS LIFECYCLE */}
            <section id="payments-status" className="scroll-mt-24 space-y-4 bg-white border border-zinc-200 p-6 sm:p-8 rounded-xl shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  <span>04. Payment Processing &amp; Status Lifecycles</span>
                </h2>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm uppercase font-semibold">
                  Lifecycle
                </span>
              </div>

              <p className="text-zinc-500">
                Every invoice tracked in Luen transitions through structured status markers represented by the <code className="font-mono text-xs bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">InvoiceStatus</code> enum:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="bg-white border border-zinc-200 p-4 rounded-lg space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded-sm uppercase">
                      PENDING
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">DEFAULT</span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    The invoice is active and delivered to the client, but payment verification is awaiting bank settlement.
                  </p>
                </div>

                <div className="bg-white border border-zinc-200 p-4 rounded-lg space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 border border-teal-200 rounded-sm uppercase">
                      PAID
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">SETTLED</span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Funds have been received and verified via UPI, direct bank wire transfer, or cross-border payment gateway.
                  </p>
                </div>

                <div className="bg-white border border-zinc-200 p-4 rounded-lg space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 border border-rose-200 rounded-sm uppercase">
                      OVERDUE
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">ACTION REQ</span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Current date has exceeded the configured <code className="font-mono text-[10px]">DueDate</code> without confirmed payment.
                  </p>
                </div>

                <div className="bg-white border border-zinc-200 p-4 rounded-lg space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 border border-zinc-200 rounded-sm uppercase">
                      CANCELLED
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">VOID</span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    The document was voided due to revised project scope, contract adjustments, or mutual agreement.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 5: GST & TAX COMPLIANCE */}
            <section id="tax-compliance" className="scroll-mt-24 space-y-4 bg-white border border-zinc-200 p-6 sm:p-8 rounded-xl shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-teal-600" />
                  <span>05. GST &amp; International Tax Engine</span>
                </h2>
                <span className="text-[10px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-sm uppercase font-semibold">
                  Tax Rules
                </span>
              </div>

              <p className="text-zinc-500">
                Luen incorporates deterministic calculation models for Indian Goods and Services Tax (GST) as well as zero-rated international export declarations:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1.5">
                  <span className="font-mono font-semibold text-zinc-950 text-xs block">
                    1. Intra-State Supply (Buyer &amp; Seller in Same State)
                  </span>
                  <p className="text-zinc-500">
                    Applicable tax rate is split evenly between Central GST (CGST) and State GST (SGST). For an 18% standard rate: CGST = 9%, SGST = 9%.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1.5">
                  <span className="font-mono font-semibold text-zinc-950 text-xs block">
                    2. Inter-State Supply (Buyer &amp; Seller in Different States)
                  </span>
                  <p className="text-zinc-500">
                    Applicable tax rate is compiled as Integrated GST (IGST). For an 18% standard rate: IGST = 18.00%.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
                  <span className="font-mono font-semibold text-zinc-950 text-xs block">
                    3. Zero-Rated Export of Services (Under LUT)
                  </span>
                  <p className="text-zinc-500">
                    For foreign cross-border invoices, toggling LUT suppresses tax calculation and automatically embeds the mandatory statutory declaration on the PDF canvas:
                  </p>
                  <blockquote className="border-l-2 border-teal-600 pl-3 py-1.5 bg-white text-[11px] font-mono text-zinc-800 rounded-r">
                    &quot;Supply Meant for Export Under Letter of Undertaking (LUT) Without Payment of Integrated Tax&quot;
                  </blockquote>
                </div>
              </div>
            </section>

            {/* SECTION 6: SUBSCRIPTIONS & QUOTAS */}
            <section id="subscriptions-quotas" className="scroll-mt-24 space-y-4 bg-white border border-zinc-200 p-6 sm:p-8 rounded-xl shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-600" />
                  <span>06. Multi-Currency Subscriptions &amp; Quota Rules</span>
                </h2>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm uppercase font-semibold">
                  Billing &amp; Plans
                </span>
              </div>

              <p className="text-zinc-500">
                Luen features localized multi-market subscription routing via Razorpay:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1.5">
                  <span className="font-mono font-semibold text-zinc-950 text-xs flex items-center gap-1.5">
                    🇮🇳 Domestic India (INR / ₹)
                  </span>
                  <p className="text-zinc-500">
                    Billed in INR via UPI Autopay, Indian Netbanking, and domestic debit/credit cards under RBI e-Mandate compliance.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1.5">
                  <span className="font-mono font-semibold text-zinc-950 text-xs flex items-center gap-1.5">
                    🌐 Global Market (USD / $)
                  </span>
                  <p className="text-zinc-500">
                    Billed in USD via cross-border international Visa, Mastercard, and American Express cards with automated recurring renewal.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 space-y-1">
                <span className="font-semibold font-mono text-[11px] uppercase block text-teal-950">
                  Fair Usage &amp; Quota Guard:
                </span>
                <p className="text-teal-800">
                  Starter Free accounts receive <strong className="text-teal-950">5 PDF downloads/month</strong>. Quotas reset automatically on the 1st of every calendar month. Pro subscribers enjoy unlimited downloads, watermark removal, and custom branding.
                </p>
              </div>
            </section>

            {/* SECTION 7: EXPORT & TROUBLESHOOTING */}
            <section id="export-troubleshooting" className="scroll-mt-24 space-y-4 bg-white border border-zinc-200 p-6 sm:p-8 rounded-xl shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="text-base sm:text-lg font-medium text-zinc-950 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>07. PDF Vector Compilation &amp; Troubleshooting</span>
                </h2>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm uppercase font-semibold">
                  Troubleshooting
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <span className="font-mono font-semibold text-zinc-950 text-xs">
                    • Multi-Page Table Splits
                  </span>
                  <p className="text-zinc-500">
                    Luen embeds automatic row pagination with <code className="font-mono text-[11px] bg-zinc-200 px-1 py-0.5 rounded">break-inside: avoid</code> to prevent individual line item descriptions from being clipped across printed page boundaries.
                  </p>
                </div>

                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <span className="font-mono font-semibold text-zinc-950 text-xs">
                    • Logo &amp; Signature Image Quality
                  </span>
                  <p className="text-zinc-500">
                    Upload PNG or SVG logo files under 2MB. Logos are embedded as Base64 vector streams to ensure 300+ DPI print clarity on high-resolution office printers.
                  </p>
                </div>

                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                  <span className="font-mono font-semibold text-zinc-950 text-xs">
                    • Mobile Browser Export
                  </span>
                  <p className="text-zinc-500">
                    On mobile devices, PDF rendering is processed securely through server-side buffer streaming to eliminate mobile iframe canvas crashes and popup blocker restrictions.
                  </p>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}