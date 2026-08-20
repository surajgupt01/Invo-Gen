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
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-xs text-zinc-400">
          Loading technical documentation telemetry...
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
    <div className="w-full min-h-screen bg-[#FAFAFA] text-zinc-800 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
      <Nav />

      <main className="w-[92%] max-w-5xl mx-auto pt-8 md:pt-12 pb-16">
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-zinc-200/80">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-2xs uppercase tracking-widest font-bold">
              <FileText className="w-3 h-3 text-teal-600" />
              <span>DOCUMENTATION &amp; KNOWLEDGE BASE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-sans">
              Luen Technical Documentation
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500 max-w-lg leading-relaxed font-sans">
              Comprehensive architectural guides covering metadata persistence, vector canvas PDF compilation, multi-currency subscription lifecycles, and Indian GST rules.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end text-xs font-mono text-zinc-500 space-y-1.5 lg:text-right">
            <div>
              <span className="text-zinc-800 font-bold uppercase">Engine:</span>{" "}
              <span>v2.1 (Vector Canvas &amp; SSR Buffer)</span>
            </div>
            <div>
              <span className="text-zinc-800 font-bold uppercase">Storage Model:</span>{" "}
              <span>Metadata-Only Persistence</span>
            </div>
            <div>
              <span className="text-zinc-800 font-bold uppercase">Support Desk:</span>{" "}
              <a
                href="mailto:support@luen.in"
                className="text-teal-700 font-bold underline hover:text-teal-800 transition"
              >
                support@luen.in
              </a>
            </div>
          </div>
        </div>

        {/* Documentation Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-3 font-sans lg:sticky lg:top-8 bg-white p-4 rounded-2xs border border-zinc-200/80 shadow-2xs">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-[11px] font-mono pl-8 pr-2.5 py-1.5 rounded-2xs focus:outline-none focus:border-teal-600 transition placeholder:text-zinc-400"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider border-b border-zinc-100 pb-1.5 pt-1">
              <span>TABLE OF CONTENTS</span>
              <span>{filteredSections.length} GUIDES</span>
            </div>

            <nav className="space-y-1">
              {filteredSections.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-2xs transition text-[11px] font-medium font-sans ${
                    activeSection === item.id
                      ? "bg-zinc-950 text-white font-semibold shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-2xs ml-1 ${
                        activeSection === item.id
                          ? "bg-zinc-800 text-teal-300"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </nav>

            {/* Quick Links Card */}
            <div className="pt-2 border-t border-zinc-100 text-[10px] font-mono text-zinc-500 space-y-1">
              <div className="flex justify-between items-center">
                <span>Compliance:</span>
                <Link href="/terms" className="text-teal-700 hover:underline font-bold">
                  Terms &amp; Privacy →
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <span>Direct Support:</span>
                <Link href="/support" className="text-teal-700 hover:underline font-bold">
                  Help Desk →
                </Link>
              </div>
            </div>
          </aside>

          {/* Documentation Content Articles */}
          <article className="lg:col-span-8 text-xs sm:text-[13px] text-zinc-600 font-sans leading-relaxed space-y-10">
            {/* SECTION 1: QUICKSTART */}
            <section id="quickstart" className="scroll-mt-8 space-y-3.5 bg-white border border-zinc-200/80 p-5 rounded-2xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 font-mono tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>01. Quickstart Guide (Invoice in 60 Seconds)</span>
                </h2>
                <span className="text-[9px] font-mono text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded-2xs uppercase font-bold">
                  GETTING STARTED
                </span>
              </div>

              <p>
                Luen allows independent software engineers, consultants, and digital agencies to generate compliant, vector-sharp PDF invoices without spreadsheets or ERP software overhead.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xs space-y-1">
                  <div className="font-bold text-zinc-900 font-mono text-xs flex items-center gap-1.5">
                    <span className="text-teal-600">01</span> Organization &amp; Client
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Input your business name, billing address, tax identifier (GSTIN/VAT), and client recipient details. Use Settings to save defaults for instant 1-click prefill.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xs space-y-1">
                  <div className="font-bold text-zinc-900 font-mono text-xs flex items-center gap-1.5">
                    <span className="text-teal-600">02</span> Itemize Deliverables
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Add milestone line items, hourly rate calculations, units, quantities, and optional HSN/SAC codes with automated subtotal computation.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xs space-y-1">
                  <div className="font-bold text-zinc-900 font-mono text-xs flex items-center gap-1.5">
                    <span className="text-teal-600">03</span> Select Tax Engine
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Select intra-state GST (CGST + SGST), inter-state IGST, or toggle Cross-Border Export Under LUT with automatic statutory declarations.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xs space-y-1">
                  <div className="font-bold text-zinc-900 font-mono text-xs flex items-center gap-1.5">
                    <span className="text-teal-600">04</span> Export Vector PDF
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Export high-resolution vector PDF documents directly to your device with automated download quota checks and instant delivery.
                  </p>
                </div>
              </div>

              {/* Interactive Mockup Preview */}
              <div className="mt-4 border border-zinc-200 rounded-2xs bg-zinc-900 p-3 space-y-2 text-zinc-100 font-mono text-[11px]">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-zinc-400 pl-2">Luen Invoicing Editor — Active State</span>
                  </div>
                  <span className="text-[9px] text-teal-400 bg-teal-950 border border-teal-800 px-1.5 py-0.5 rounded-2xs">
                    AUTO-PREFILL ON
                  </span>
                </div>
                <div className="p-2 bg-zinc-950/80 rounded-2xs text-[10px] space-y-1 text-zinc-300">
                  <p className="text-zinc-400">{`> Invoice Serial #   : INV-2026-042`}</p>
                  <p className="text-zinc-400">{`> Currency & TaxMode : INR (₹) • Intra-State CGST(9%) + SGST(9%)`}</p>
                  <p className="text-teal-400">{`> Line Items Loaded  : 3 Deliverables • Subtotal: ₹85,000.00 • Total: ₹100,300.00`}</p>
                  <p className="text-emerald-400">{`> Compilation Status : Clean vector graph parsed in 184ms`}</p>
                </div>
              </div>
            </section>

            {/* SECTION 2: ARCHITECTURE & DATABASE */}
            <section id="data-persistence" className="scroll-mt-8 space-y-3.5 bg-white border border-zinc-200/80 p-5 rounded-2xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 font-mono tracking-tight flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-600" />
                  <span>02. Metadata Persistence Architecture</span>
                </h2>
                <span className="text-[9px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded-2xs uppercase font-bold">
                  DATABASE SPEC
                </span>
              </div>

              <p>
                To maintain sub-second rendering performance and eliminate database bloat, Luen implements a <strong>metadata-only persistence architecture</strong>. We do not store pre-compiled binary PDF blobs or gigabytes of repetitive file streams in our database.
              </p>

              {/* Code Snippet Toolbar */}
              <div className="bg-zinc-950 text-zinc-100 rounded-2xs border border-zinc-800 overflow-hidden font-mono text-[11px]">
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800">
                  <span className="text-teal-400 text-[10px] font-semibold flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-teal-400" />
                    schema.prisma (Invoice Model)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPrisma}
                    className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition px-2 py-0.5 bg-zinc-800 rounded-2xs cursor-pointer"
                  >
                    {copiedPrisma ? (
                      <>
                        <Check className="w-3 h-3 text-teal-400" />
                        <span className="text-teal-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 overflow-x-auto text-[10px] text-zinc-300 leading-relaxed custom-scrollbar">
                  {prismaSchemaCode}
                </pre>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/80 p-3.5 rounded-2xs text-[11px] text-zinc-600 space-y-1.5 font-sans">
                <span className="font-bold text-zinc-900 font-mono uppercase text-[10px] block">
                  Key Architectural Advantages:
                </span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <strong>Microsecond Query Latency:</strong> Invoice records remain under 1KB per row, allowing instantaneous dashboard retrieval and status filtering.
                  </li>
                  <li>
                    <strong>Deterministic Vector Compilation:</strong> The exact PDF vector tree is re-compiled on-demand using stored metadata, guaranteeing zero document degradation.
                  </li>
                  <li>
                    <strong>Strict Audit Verification:</strong> Financial audit values (`subtotal`, `tax`, `total`, `Currency`) remain structured as SQL Decimals for analytics and tax filing.
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 3: FORM FIELDS & ITEMIZATION */}
            <section id="invoice-config" className="scroll-mt-8 space-y-3.5 bg-white border border-zinc-200/80 p-5 rounded-2xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 font-mono tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>03. Form Fields &amp; Deliverable Itemization</span>
                </h2>
                <span className="text-[9px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded-2xs uppercase font-bold">
                  DATA DICTIONARY
                </span>
              </div>

              <p>
                To avoid client accounts payable disputes, ensure invoice form fields adhere to standard corporate accounting conventions:
              </p>

              <div className="space-y-2 text-[11px] font-sans">
                <div className="p-2.5 bg-zinc-50 border border-zinc-200/70 rounded-2xs space-y-0.5">
                  <span className="font-mono font-bold text-zinc-900 text-[10px] uppercase">
                    • Consecutive Serial Numbering:
                  </span>
                  <p className="text-zinc-600">
                    Always use sequential alphanumeric series without gaps (e.g., <code className="font-mono bg-zinc-200/80 px-1 py-0.5 rounded text-[10px]">INV-2026-001</code>). Duplicate serial numbers create audit friction with corporate procurement systems.
                  </p>
                </div>

                <div className="p-2.5 bg-zinc-50 border border-zinc-200/70 rounded-2xs space-y-0.5">
                  <span className="font-mono font-bold text-zinc-900 text-[10px] uppercase">
                    • Clear Payment Due Date Terms:
                  </span>
                  <p className="text-zinc-600">
                    Define clear payment windows using standard payment horizons: Net 15, Net 30, or Upon Receipt.
                  </p>
                </div>

                <div className="p-2.5 bg-zinc-50 border border-zinc-200/70 rounded-2xs space-y-0.5">
                  <span className="font-mono font-bold text-zinc-900 text-[10px] uppercase">
                    • HSN/SAC Classification Codes:
                  </span>
                  <p className="text-zinc-600">
                    For Indian GST invoices, apply statutory SAC codes (e.g., <code className="font-mono bg-zinc-200/80 px-1 py-0.5 rounded text-[10px]">998314</code> for Information Technology / Custom Software Development).
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 4: PAYMENTS & STATUS LIFECYCLE */}
            <section id="payments-status" className="scroll-mt-8 space-y-3.5 bg-white border border-zinc-200/80 p-5 rounded-2xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 font-mono tracking-tight flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  <span>04. Payment Processing &amp; Status Lifecycles</span>
                </h2>
                <span className="text-[9px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded-2xs uppercase font-bold">
                  LIFECYCLE
                </span>
              </div>

              <p>
                Every invoice tracked in Luen transitions through structured status markers represented by the <code className="font-mono text-[11px] bg-zinc-100 px-1 py-0.5 rounded">InvoiceStatus</code> enum:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white border border-zinc-200 p-3 rounded-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-200 rounded-2xs uppercase">
                      PENDING
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">DEFAULT</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    The invoice is active and delivered to the client, but payment verification is awaiting bank settlement.
                  </p>
                </div>

                <div className="bg-white border border-zinc-200 p-3 rounded-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded-2xs uppercase">
                      PAID
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">SETTLED</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Funds have been received and verified via UPI, direct bank wire transfer, or cross-border payment gateway.
                  </p>
                </div>

                <div className="bg-white border border-zinc-200 p-3 rounded-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 border border-rose-200 rounded-2xs uppercase">
                      OVERDUE
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">ACTION REQ</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Current date has exceeded the configured <code className="font-mono text-[10px]">DueDate</code> without confirmed payment.
                  </p>
                </div>

                <div className="bg-white border border-zinc-200 p-3 rounded-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 border border-zinc-300 rounded-2xs uppercase">
                      CANCELLED
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">VOID</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    The document was voided due to revised project scope, contract adjustments, or mutual agreement.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 5: GST & TAX COMPLIANCE */}
            <section id="tax-compliance" className="scroll-mt-8 space-y-3.5 bg-white border border-zinc-200/80 p-5 rounded-2xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 font-mono tracking-tight flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-teal-600" />
                  <span>05. GST &amp; International Tax Engine</span>
                </h2>
                <span className="text-[9px] font-mono text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded-2xs uppercase font-bold">
                  TAX RULES
                </span>
              </div>

              <p>
                Luen incorporates deterministic calculation models for Indian Goods and Services Tax (GST) as well as zero-rated international export declarations:
              </p>

              <div className="space-y-2 text-[11px] font-sans">
                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xs space-y-1">
                  <span className="font-mono font-bold text-zinc-900 text-xs block">
                    1. Intra-State Supply (Buyer &amp; Seller in Same State)
                  </span>
                  <p className="text-zinc-600">
                    Applicable tax rate is split evenly between Central GST (CGST) and State GST (SGST). For an 18% standard rate: CGST = 9%, SGST = 9%.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xs space-y-1">
                  <span className="font-mono font-bold text-zinc-900 text-xs block">
                    2. Inter-State Supply (Buyer &amp; Seller in Different States)
                  </span>
                  <p className="text-zinc-600">
                    Applicable tax rate is compiled as Integrated GST (IGST). For an 18% standard rate: IGST = 18.00%.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xs space-y-1.5">
                  <span className="font-mono font-bold text-zinc-900 text-xs block">
                    3. Zero-Rated Export of Services (Under LUT)
                  </span>
                  <p className="text-zinc-600">
                    For foreign cross-border invoices, toggling LUT suppresses tax calculation and automatically embeds the mandatory statutory declaration on the PDF canvas:
                  </p>
                  <blockquote className="border-l-2 border-teal-600 pl-3 py-1 bg-white text-[10px] font-mono text-zinc-700">
                    &quot;Supply Meant for Export Under Letter of Undertaking (LUT) Without Payment of Integrated Tax&quot;
                  </blockquote>
                </div>
              </div>
            </section>

            {/* SECTION 6: SUBSCRIPTIONS & QUOTAS */}
            <section id="subscriptions-quotas" className="scroll-mt-8 space-y-3.5 bg-white border border-zinc-200/80 p-5 rounded-2xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 font-mono tracking-tight flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-600" />
                  <span>06. Multi-Currency Subscriptions &amp; Quota Rules</span>
                </h2>
                <span className="text-[9px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded-2xs uppercase font-bold">
                  BILLING &amp; PLANS
                </span>
              </div>

              <p>
                Luen features localized multi-market subscription routing via Razorpay:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-sans">
                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xs space-y-1">
                  <span className="font-mono font-bold text-zinc-900 text-xs flex items-center gap-1">
                    🇮🇳 Domestic India (INR / ₹)
                  </span>
                  <p className="text-zinc-600">
                    Billed in INR via UPI Autopay, Indian Netbanking, and domestic debit/credit cards under RBI e-Mandate compliance.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xs space-y-1">
                  <span className="font-mono font-bold text-zinc-900 text-xs flex items-center gap-1">
                    🌐 Global Market (USD / $)
                  </span>
                  <p className="text-zinc-600">
                    Billed in USD via cross-border international Visa, Mastercard, and American Express cards with automated recurring renewal.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-teal-50/60 border border-teal-200/70 rounded-2xs text-[11px] text-teal-900 space-y-1 font-sans">
                <span className="font-bold font-mono text-[10px] uppercase block text-teal-800">
                  Fair Usage &amp; Quota Guard:
                </span>
                <p>
                  Starter Free accounts receive <strong>5 PDF downloads/month</strong>. Quotas reset automatically on the 1st of every calendar month. Pro subscribers enjoy unlimited downloads, watermark removal, and custom branding.
                </p>
              </div>
            </section>

            {/* SECTION 7: EXPORT & TROUBLESHOOTING */}
            <section id="export-troubleshooting" className="scroll-mt-8 space-y-3.5 bg-white border border-zinc-200/80 p-5 rounded-2xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 font-mono tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>07. PDF Vector Compilation &amp; Troubleshooting</span>
                </h2>
                <span className="text-[9px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded-2xs uppercase font-bold">
                  TROUBLESHOOTING
                </span>
              </div>

              <div className="space-y-2 text-[11px] font-sans">
                <div className="p-2.5 bg-zinc-50 border border-zinc-200/70 rounded-2xs space-y-0.5">
                  <span className="font-mono font-bold text-zinc-900 text-[10px] uppercase">
                    • Multi-Page Table Splits:
                  </span>
                  <p className="text-zinc-600">
                    Luen embeds automatic row pagination with <code className="font-mono text-[10px] bg-zinc-200 px-1 py-0.5 rounded">break-inside: avoid</code> to prevent individual line item descriptions from being clipped across printed page boundaries.
                  </p>
                </div>

                <div className="p-2.5 bg-zinc-50 border border-zinc-200/70 rounded-2xs space-y-0.5">
                  <span className="font-mono font-bold text-zinc-900 text-[10px] uppercase">
                    • Logo &amp; Signature Image Quality:
                  </span>
                  <p className="text-zinc-600">
                    Upload PNG or SVG logo files under 2MB. Logos are embedded as Base64 vector streams to ensure 300+ DPI print clarity on high-resolution office printers.
                  </p>
                </div>

                <div className="p-2.5 bg-zinc-50 border border-zinc-200/70 rounded-2xs space-y-0.5">
                  <span className="font-mono font-bold text-zinc-900 text-[10px] uppercase">
                    • Mobile Browser Export:
                  </span>
                  <p className="text-zinc-600">
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