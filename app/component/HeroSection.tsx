import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full bg-white pt-10 sm:pt-14 lg:pt-16">
      {/* Constrained to max-w-6xl */}
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

      {/* Feature Highlights Bar */}
      <div className="border-y border-zinc-200">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 text-center">
          <div className="py-4 px-4 flex items-center justify-center">
            <span className="font-mono tracking-wider text-xs sm:text-sm font-semibold text-zinc-800 uppercase">
              Auto Calculations
            </span>
          </div>

          <div className="py-4 px-4 flex items-center justify-center">
            <span className="font-mono tracking-wider text-xs sm:text-sm font-semibold text-zinc-800 uppercase">
              Multi-Currency
            </span>
          </div>

          <div className="py-4 px-4 flex items-center justify-center">
            <span className="font-mono tracking-wider text-xs sm:text-sm font-semibold text-zinc-800 uppercase">
              Custom QR & Tax
            </span>
          </div>

          <div className="py-4 px-4 flex items-center justify-center">
            <span className="font-mono tracking-wider text-xs sm:text-sm font-semibold text-zinc-800 uppercase">
              Clean PDF Export
            </span>
          </div>

          <div className="py-4 px-4 flex items-center justify-center col-span-2 sm:col-span-1">
            <span className="font-mono tracking-wider text-xs sm:text-sm font-semibold text-teal-600 uppercase">
              Zero Watermark
            </span>
          </div>
        </div>
      </div>

      {/* Product Mockup Preview Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 my-10  ">
        <div className="relative border border-neutral-200 shadow-xl  bg-gradient-to-r from-blue-600 via-teal-400 to-amber-500 overflow-hidden pt-6 sm:pt-15 pl-6 sm:pl-12 lg:pl-16">
          <div className=" overflow-hidden bg-white   border-zinc-200/80 shadow-4xl">
            {/* Container sizing matches natural dashboard scale */}
            <div className="w-full relative bg-zinc-50 ">
              <Image
                src="/dash.png"
                alt="Luen Live Invoice Generator Preview"
                width={1920}
                height={1080}
                className="w-full h-auto object-contain object-left-top block"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
