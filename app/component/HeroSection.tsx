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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-zinc-950 max-w-2xl leading-[1.15]">
            Create Client-Ready Invoices{" "}
            <span className="text-zinc-400">In Seconds, Not Hours.</span>
          </h1>

          <div className="shrink-0 mb-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-md transition-colors shadow-xs"
            >
              Start Generating
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights Bar - Single Line (horizontal scroll on mobile) */}
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
        <div className="relative  border border-neutral-200/80 shadow-2xl bg-gradient-to-r from-blue-600 via-teal-400 to-amber-500 overflow-hidden pt-4 sm:pt-10 lg:pt-12 pl-4 sm:pl-8 lg:pl-12">
          <div className=" overflow-hidden bg-zinc-50 border-t border-l border-zinc-200/80 shadow-2xl">
            <div className="w-full relative aspect-16/10 sm:aspect-16/9">
              <Image
                src="/dash.png"
                alt="Luen Live Invoice Generator Preview"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                className="object-cover object-left-top"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
