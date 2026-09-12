import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full bg-white pt-10 sm:pt-14 lg:pt-16 overflow-hidden">
      {/* Constrained Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Tagline */}
        <p className="text-[11px] sm:text-xs font-mono font-medium tracking-widest text-zinc-400 uppercase mb-5">
          TRUSTED BY 1,000+ FREELANCERS & FOUNDERS
        </p>

        {/* Headline + Call to Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-zinc-950 max-w-2xl leading-[1.15]">
              Free GST & Multi-Currency{" "}
              <span className="text-zinc-400">Invoice Generator.</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mt-3 leading-relaxed">
              Create client-ready, vector-sharp PDF invoices in seconds.
              Automated CGST/SGST/IGST calculation, LUT export support, and
              instant downloads.
            </p>
          </div>

          <div className="shrink-0 mb-1 flex flex-col items-start md:items-end gap-1.5">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-md transition-colors shadow-xs"
            >
              Create Free Invoice
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights Bar - Pure Single Line (No Scroll) */}
      <div className="w-full border-y border-zinc-200 overflow-hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between divide-x divide-zinc-200 text-center">
          <div className="py-2.5 sm:py-4 px-1 sm:px-3 flex-1 flex items-center justify-center min-w-0">
            <span className="font-mono tracking-tighter sm:tracking-wider text-[8.5px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-zinc-800 uppercase truncate">
              Auto Calculations
            </span>
          </div>

          <div className="py-2.5 sm:py-4 px-1 sm:px-3 flex-1 flex items-center justify-center min-w-0">
            <span className="font-mono tracking-tighter sm:tracking-wider text-[8.5px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-zinc-800 uppercase truncate">
              Multi-Currency
            </span>
          </div>

          <div className="py-2.5 sm:py-4 px-1 sm:px-3 flex-1 flex items-center justify-center min-w-0">
            <span className="font-mono tracking-tighter sm:tracking-wider text-[8.5px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-zinc-800 uppercase truncate">
              Custom QR & Tax
            </span>
          </div>

          <div className="py-2.5 sm:py-4 px-1 sm:px-3 flex-1 flex items-center justify-center min-w-0">
            <span className="font-mono tracking-tighter sm:tracking-wider text-[8.5px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-zinc-800 uppercase truncate">
              Clean PDF Export
            </span>
          </div>

          <div className="py-2.5 sm:py-4 px-1 sm:px-3 flex-1 flex items-center justify-center min-w-0">
            <span className="font-mono tracking-tighter sm:tracking-wider text-[8.5px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-teal-600 uppercase truncate">
              Zero Watermark
            </span>
          </div>
        </div>
      </div>

      {/* Product Mockup Preview Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 my-6 sm:my-10">
        <div className="relative border border-neutral-200/80 shadow-2xl bg-gradient-to-r from-blue-600 via-teal-400 to-amber-500 overflow-hidden pt-4 sm:pt-10 lg:pt-12 pl-4 sm:pl-8 lg:pl-12">
          <div className="overflow-hidden bg-zinc-50 border-t border-l border-zinc-200/80 shadow-2xl">
            <div className="w-full relative aspect-16/10 sm:aspect-16/9">
              <Image
                src="/dash.png"
                alt="Luen Free GST Invoice Generator and Billing Dashboard Preview"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                className="object-cover object-left-top"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <ComplianceGrid />
    </section>
  );
}

// import Link from "next/link";

const formats = [
  {
    tag: "GST READY",
    title: "Create GST Invoices",
    desc: "Generate GST-compliant invoices with automatic CGST, SGST, and IGST calculations, HSN/SAC codes, GSTINs, and place-of-supply details.",
  },
  {
    tag: "GET PAID FASTER",
    title: "Add UPI QR Payments",
    desc: "Let customers pay directly from your invoice with a dynamic UPI QR code compatible with Google Pay, PhonePe, Paytm, and BHIM.",
  },
  {
    tag: "PROFESSIONAL PDF",
    title: "Download Instant PDFs",
    desc: "Turn your invoice into a clean, professional PDF that's ready to email, WhatsApp, print, or send to your customer.",
  },
  {
    tag: "INTERNATIONAL",
    title: "Invoice Global Clients",
    desc: "Create invoices for international customers in USD, EUR, GBP, and other currencies with export-ready invoice details.",
  },
  {
    tag: "BEFORE THE SALE",
    title: "Quotes & Proforma Invoices",
    desc: "Create estimates and proforma invoices, then convert them into final GST invoices without entering your items again.",
  },
  {
    tag: "YOUR BRAND",
    title: "Make It Yours",
    desc: "Add your logo, business details, payment information, signature, and custom invoice preferences to every invoice.",
  },
];

function ComplianceGrid() {
  return (
    <div className="w-full border-t border-zinc-200 bg-white py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <p className="text-[11px] sm:text-xs font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
              Statutory Compliance & Formats
            </p>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-950 max-w-xl">
              Engineered for every tax scenario,{" "}
              <span className="text-zinc-400">domestic and cross-border.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-sm leading-relaxed">
            Standardized templates adhering strictly to Rule 46 of the CGST Act
            and global billing conventions.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-zinc-200">
          {formats.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 border-r border-b border-zinc-200 flex flex-col justify-between hover:bg-zinc-50/50 transition-colors"
            >
              <div>
                <span className="font-mono text-[10px] tracking-wider uppercase font-semibold text-teal-600 mb-3 block">
                  {item.tag}
                </span>
                <h3 className="text-base sm:text-lg font-medium text-zinc-950 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
