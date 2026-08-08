"use client";

import { Suspense, useState } from "react";
import Nav from "../component/Nav";
import Footer from "../component/Footer";

export default function DocsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <DocsPageContent />
    </Suspense>
  );
}

function DocsPageContent() {
  const [activeSection, setActiveSection] = useState("quickstart");

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-zinc-800 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
      <Nav />

      <main className="w-[90%] max-w-5xl mx-auto pt-8 md:pt-10 pb-12">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-zinc-200/80">
          <div className="lg:col-span-7 space-y-2.5">
            <div className="inline-block text-[11px] font-mono text-teal-600 uppercase tracking-widest">
              DOCUMENTATION & KNOWLEDGE BASE
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Luen Documentation
            </h1>
            <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
              Complete technical guides on invoice metadata storage, local
              canvas rendering, GST tax configurations, and payment status
              lifecycles.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end text-[11px] font-sans text-zinc-500 space-y-1 lg:text-right">
            <div>
              <span className="text-zinc-800 font-semibold">
                Engine Version:
              </span>{" "}
              v2.1 (Vector Canvas)
            </div>
            <div>
              <span className="text-zinc-800 font-semibold">
                Database Model:
              </span>{" "}
              Metadata-Only Persistence
            </div>
            <div>
              <span className="text-zinc-800 font-semibold">Support:</span>{" "}
              <a
                href="mailto:support@luen.in"
                className="text-zinc-800 underline hover:text-teal-600 transition"
              >
                support@luen.in
              </a>
            </div>
          </div>
        </div>

        {/* Docs Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-2.5 text-xs font-sans lg:sticky lg:top-8 bg-white p-4 rounded-xs border border-zinc-200/80 shadow-2xs">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block mb-2 border-b border-zinc-100 pb-1.5">
              Documentation Index
            </span>
            <nav className="space-y-1">
              {[
                { id: "quickstart", label: "1. Quickstart Guide" },
                {
                  id: "data-persistence",
                  label: "2. Metadata Persistence Architecture",
                },
                { id: "invoice-config", label: "3. Form Fields & Itemization" },
                {
                  id: "payments-status",
                  label: "4. Payments & Status Lifecycle",
                },
                { id: "tax-compliance", label: "5. GST & Tax Configurations" },
                {
                  id: "export-troubleshooting",
                  label: "6. PDF Export & Troubleshooting",
                },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`block px-2.5 py-1.5 rounded-xs transition text-[11px] font-medium ${
                    activeSection === item.id
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Documentation Content Article */}
          <article className="lg:col-span-8 text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed space-y-10">
            {/* SECTION 1 */}
            <section id="quickstart" className="scroll-mt-8 space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                1. Quickstart Guide (Invoice in 60 Seconds)
              </h2>
              <p>
                Luen allows independent software engineers, designers, and
                agencies to generate structured vector PDF invoices instantly
                without heavy accounting overhead.
              </p>

              <ul className="space-y-1.5 pt-1 pl-4 list-disc marker:text-zinc-400">
                <li>
                  <strong>Step 1: Fill Organization & Client Details:</strong>{" "}
                  Input your business name, address, tax registration IDs
                  (GSTIN/VAT), and client recipient details.
                </li>
                <li>
                  <strong>Step 2: Itemize Milestone Deliverables:</strong> Add
                  fixed project scope items or hourly rate breakdowns with
                  accurate line quantities.
                </li>
                <li>
                  <strong>Step 3: Configure Applicable Tax Rates:</strong> Apply
                  local GST (CGST/SGST) or inter-state IGST tax percentages.
                </li>
                <li>
                  <strong>Step 4: Export Vector PDF:</strong> Click{" "}
                  <em>Export PDF</em> to render a print-ready vector document
                  directly inside your browser.
                </li>
              </ul>

              <ScreenshotPlaceholder
                caption="Figure 1.1: The main Luen editor interface with real-time PDF generation panel."
                aspectRatio="aspect-[16/9]"
              />
            </section>

            {/* SECTION 2 */}
            <section id="data-persistence" className="scroll-mt-8 space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                2. Database Architecture & Metadata Persistence
              </h2>
              <p>
                To maintain high rendering performance and keep database storage
                footprints lightweight, Luen does <strong>not</strong> store
                generated binary PDF files or large image blobs inside the
                database.
              </p>
              <p>
                Instead, the database records only the essential structural
                metadata required to dynamically re-compile or audit the
                invoice. The actual PDF is dynamically rendered on-the-fly in
                client memory using Web Canvas vector compilation.
              </p>

              <div className="bg-zinc-900 text-zinc-100 p-3.5 rounded-xs space-y-2 font-mono text-[11px] leading-relaxed">
                <p className="text-teal-400 font-semibold">{`// Prisma Schema: Invoice Table (Metadata Only)`}</p>
                <pre className="overflow-x-auto text-[10px] text-zinc-300 leading-normal">
                  {`model Invoice {
  InvoiceId       String        @id @default(cuid())
  invoiceNumber   String        @unique // e.g. "INV-2026-001"
  
  // Customer Details
  CustomerName    String?
  CustomerEmail   String?
  CustomerAddress String?
  Subject         String?
  
  // Dates
  IssueDate       DateTime
  DueDate         DateTime
  
  // Financial Amounts
  Currency        String        @default("INR")
  subtotal        Decimal       @default(0.0)
  tax             Decimal       @default(0.0)
  discount        Decimal?      @default(0.0)
  total           Decimal       @default(0.0)
  
  // Granular Payment Status
  paymentStatus   InvoiceStatus @default(PENDING)
  
  // User Relation
  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Audit Timestamps
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@map("invoice")
}`}
                </pre>
              </div>

              <div className="bg-zinc-100/70 border border-zinc-200 p-3 rounded-xs text-[11px] text-zinc-700 space-y-1">
                <p className="font-semibold text-zinc-900">
                  Why Metadata Storage Is Superior:
                </p>
                <p>
                  1. <strong>Sub-300ms Exports:</strong> Re-generating PDFs
                  on-demand avoids expensive database file transfer payloads.
                  <br />
                  2. <strong>Audit Compliance:</strong> Essential financial
                  audit values (`subtotal`, `tax`, `total`, `Currency`) remain
                  structured and queryable for annual income reports.
                  <br />
                  3. <strong>Database Efficiency:</strong> Database records stay
                  extremely lightweight (under 1KB per record) without storing
                  heavy binary blobs.
                </p>
              </div>

              <ScreenshotPlaceholder
                caption="Figure 2.1: Architectural diagram showing local client-side vector compilation from metadata records."
                aspectRatio="aspect-[16/8]"
              />
            </section>

            {/* SECTION 3 */}
            <section id="invoice-config" className="scroll-mt-8 space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                3. Invoice Form Fields & Itemization
              </h2>
              <p>
                To minimize client payment disputes and accounts payable
                rejections, ensure line items specify explicit deliverables:
              </p>

              <ul className="space-y-1.5 pt-1 pl-4 list-disc marker:text-zinc-400">
                <li>
                  <strong>Sequential Invoice Numbering:</strong> Maintain
                  unbroken consecutive numbering (e.g.,{" "}
                  <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-[11px] text-zinc-800">
                    INV-2026-001
                  </code>
                  ).
                </li>
                <li>
                  <strong>Due Date Window:</strong> Explicitly select payment
                  terms like Net 15 or Net 30 to establish clear processing
                  timelines.
                </li>
                <li>
                  <strong>HSN/SAC Service Codes:</strong> For technical and
                  software services, use SAC code{" "}
                  <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-[11px] text-zinc-800">
                    998314
                  </code>{" "}
                  for IT/Software development.
                </li>
              </ul>

              <ScreenshotPlaceholder
                caption="Figure 3.1: Detailed line item configuration including HSN/SAC input fields and discount multipliers."
                aspectRatio="aspect-[16/9]"
              />
            </section>

            {/* SECTION 4 - NEW PAYMENTS & STATUS SECTION */}
            <section id="payments-status" className="scroll-mt-8 space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                4. Payment Processing & Invoice Status Lifecycle
              </h2>
              <p>
                Luen tracks invoice payment lifecycles using a granular status
                enum stored in the{" "}
                <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-[11px] text-zinc-800">
                  paymentStatus
                </code>{" "}
                database field. This allows users to track pending receivables,
                overdue balances, and completed settlements.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white border border-zinc-200 p-3 rounded-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-200 rounded-xs uppercase">
                      PENDING
                    </span>
                    <span className="text-[10px] text-zinc-400">Default</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    The invoice has been issued and sent to the client, but
                    payment has not yet been confirmed.
                  </p>
                </div>

                <div className="bg-white border border-zinc-200 p-3 rounded-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded-xs uppercase">
                      PAID
                    </span>
                    <span className="text-[10px] text-zinc-400">Settled</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Full funds have been received and verified via bank
                    transfer, Stripe, or direct UPI settlement.
                  </p>
                </div>

                <div className="bg-white border border-zinc-200 p-3 rounded-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 border border-rose-200 rounded-xs uppercase">
                      OVERDUE
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Action Required
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    The payment date has passed the configured{" "}
                    <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-[10px] text-zinc-800">
                      DueDate
                    </code>{" "}
                    timestamp without settlement.
                  </p>
                </div>

                <div className="bg-white border border-zinc-200 p-3 rounded-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 border border-zinc-300 rounded-xs uppercase">
                      CANCELLED / REFUNDED
                    </span>
                    <span className="text-[10px] text-zinc-400">Void</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    The invoice was voided due to contract adjustments, project
                    cancellation, or full refund.
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <p className="font-semibold text-zinc-900 text-xs">
                  Attaching Direct Payment Handles:
                </p>
                <p>
                  You can embed direct payment handles inside generated vector
                  PDFs so clients can complete payments in one click:
                </p>
                <ul className="space-y-1 pl-4 list-disc marker:text-zinc-400 text-[11px]">
                  <li>
                    <strong>UPI IDs:</strong> Embed handles (e.g.,{" "}
                    <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-[10px] text-zinc-800">
                      yourname@upi
                    </code>
                    ) for instant mobile app QR scanning.
                  </li>
                  <li>
                    <strong>Stripe & Wise Handles:</strong> Attach direct credit
                    card checkout links or Wise account details for
                    multi-currency international transfers.
                  </li>
                </ul>
              </div>

              <ScreenshotPlaceholder
                caption="Figure 4.1: Dashboard invoice table showing payment status filters (PENDING, PAID, OVERDUE) and payment link configuration."
                aspectRatio="aspect-[16/8]"
              />
            </section>

            {/* SECTION 5 */}
            <section id="tax-compliance" className="scroll-mt-8 space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                5. GST & International Tax Configurations
              </h2>
              <p>
                Luen features built-in tax calculation rules designed for both
                domestic GST compliance and international export requirements:
              </p>

              <div className="space-y-2 pt-1">
                <p>
                  <strong>• Intra-State (Same State):</strong> Splits applicable
                  tax evenly into CGST (9%) + SGST (9%).
                </p>
                <p>
                  <strong>• Inter-State (Different State):</strong> Applies
                  unified IGST (18%) across state boundaries.
                </p>
                <p>
                  <strong>• Cross-Border Export (LUT):</strong> For overseas
                  clients, enable the <em>Export Under LUT</em> toggle to
                  automatically embed the mandatory statutory declaration:
                </p>
                <blockquote className="border-l-2 border-teal-600 pl-3 py-1 bg-zinc-50 text-[11px] font-mono text-zinc-700">
                  &quot;Supply Meant for Export Under Letter of Undertaking
                  (LUT) Without Payment of Integrated Tax&quot;
                </blockquote>
              </div>

              <ScreenshotPlaceholder
                caption="Figure 5.1: GST dropdown selection and zero-rated Export of Services (LUT) toggle configuration."
                aspectRatio="aspect-[16/8]"
              />
            </section>

            {/* SECTION 6 */}
            <section
              id="export-troubleshooting"
              className="scroll-mt-8 space-y-3"
            >
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                6. PDF Compilation & Troubleshooting
              </h2>
              <p>
                Luen uses CSS{" "}
                <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-[11px] text-zinc-800">
                  break-inside: avoid
                </code>{" "}
                rendering logic to ensure multi-line tables never split text
                rows across page breaks.
              </p>

              <div className="bg-white border border-zinc-200 p-3.5 rounded-xs space-y-2 text-[11px]">
                <p className="font-semibold text-zinc-900">Common Solutions:</p>
                <p>
                  • <strong>Blurry Logo Images:</strong> Upload transparent PNG
                  files under 2MB for high-DPI rendering.
                </p>
                <p>
                  • <strong>Missing Metadata Records:</strong> Ensure{" "}
                  <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-[10px] text-zinc-800">
                    userId
                  </code>{" "}
                  relations are active when querying invoice history across
                  devices.
                </p>
              </div>

              <ScreenshotPlaceholder
                caption="Figure 6.1: High-resolution PDF export preview modal with page-break controls."
                aspectRatio="aspect-[16/9]"
              />
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

{
  /* REUSABLE SCREENSHOT PLACEHOLDER COMPONENT */
}
function ScreenshotPlaceholder({
  caption,
  aspectRatio = "aspect-[16/9]",
}: {
  caption: string;
  aspectRatio?: string;
}) {
  return (
    <figure className="my-4 space-y-1.5">
      <div
        className={`w-full ${aspectRatio} bg-zinc-100 border border-dashed border-zinc-300 rounded-xs flex flex-col items-center justify-center p-4 text-center group hover:border-zinc-400 transition-colors`}
      >
        <div className="w-8 h-8 rounded-full bg-zinc-200/80 flex items-center justify-center mb-2 group-hover:bg-zinc-300/80 transition-colors">
          <svg
            className="w-4 h-4 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-[11px] font-mono text-zinc-500 font-medium">
          [ Insert Screenshot Here ]
        </p>
        <p className="text-[10px] text-zinc-400 max-w-xs mt-0.5">
          Replace this placeholder container with your actual UI screenshot
          image tag.
        </p>
      </div>
      <figcaption className="text-[10px] font-mono text-zinc-400 text-center">
        {caption}
      </figcaption>
    </figure>
  );
}
