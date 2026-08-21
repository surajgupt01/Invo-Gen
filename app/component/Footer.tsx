import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-zinc-200 text-zinc-900 font-sans select-none overflow-hidden pt-16 pb-8">
      {/* Constrained to max-w-6xl */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-zinc-200">
          
          {/* Left Column: Brand, Tagline & Action Buttons */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Brand Logo */}
            <Link href="/" className="inline-flex items-center gap-2 select-none">
              <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                <Image
                  src="/favicon.png"
                  alt="Luen Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="font-sans font-bold text-lg tracking-tight text-zinc-900">
                Lu<span className="text-teal-500">en</span>
              </span>
            </Link>

            {/* Tagline */}
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-base sm:text-lg font-normal tracking-tight text-zinc-950 leading-snug">
                Client-ready invoices created in seconds —{" "}
                <span className="text-zinc-400">zero spreadsheets.</span>
              </h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Built for modern freelancers, contractors, and agencies who demand fast, clean, and beautifully structured PDF invoices.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-xs font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-md transition-colors shadow-xs"
              >
                Create Invoice
              </Link>

              <a
                href="mailto:support@luen.in"
                className="px-4 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
              >
                Contact Support
              </a>
            </div>

          </div>

          {/* Right Column: Navigation Links */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-6 text-xs font-sans pt-1">
            
            {/* Column 1: Product */}
            <div className="flex flex-col gap-3 items-start">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Product
              </span>
              <Link href="/#Features" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                Features
              </Link>
              <Link href="#templates" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                Templates
              </Link>
              <Link href="/#PriceSection" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                Changelog & Blog
              </Link>
            </div>

            {/* Column 2: Resources & Docs */}
            <div className="flex flex-col gap-3 items-start">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Resources
              </span>
              <Link href="/docs" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                Documentation
              </Link>
              <Link href="/#FAQ" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                FAQs
              </Link>
              <a href="mailto:support@luen.in" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                Help Desk
              </a>
            </div>

            {/* Column 3: Social Links */}
            <div className="flex flex-col gap-3 items-start">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Connect
              </span>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-zinc-950 transition-colors"
              >
                X (Twitter)
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-zinc-950 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-zinc-950 transition-colors"
              >
                GitHub
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-zinc-400 font-sans">
          <p>© {new Date().getFullYear()} Luen. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/terms?tab=privacy" className="hover:text-zinc-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms?tab=terms" className="hover:text-zinc-900 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>

      {/* Large Bottom Faded Brand Watermark */}
      <div className="w-full flex justify-center pointer-events-none select-none pt-12">
        <span className="text-[13vw] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-zinc-200/40 via-zinc-100/10 to-transparent tracking-tighter">
          Luen
        </span>
      </div>

    </footer>
  );
}