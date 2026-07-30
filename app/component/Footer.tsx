import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAFAFA] border-t border-zinc-200/80 text-zinc-800 font-sans select-none overflow-hidden pt-12 pb-6">
      
      {/* Main Footer Container (Aligned with max-w-5xl layout) */}
      <div className="w-[90%] max-w-5xl mx-auto">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-200/80">
          
          {/* Left Column: Branding, Tagline & Action Buttons */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Brand Logo */}
            <Link href="/" className="inline-block text-3xl font-bold tracking-tight text-zinc-900">
              Lu<span className="text-teal-500">en</span>
            </Link>

            {/* Tagline */}
            <div className="space-y-1 max-w-md">
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900 leading-snug">
                Create professional invoices in seconds — without spreadsheets.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                Built for freelancers and small businesses who want clean, client-ready invoices without the hassle.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="mailto:support@luen.app"
                className="px-4 py-2 text-xs font-medium text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xs shadow-2xs transition-colors cursor-pointer"
              >
                Contact Sales
              </a>

              <Link
                href="/dashboard"
                className="px-4 py-2 text-xs font-medium text-white bg-zinc-950 hover:bg-black rounded-xs shadow-2xs transition-colors cursor-pointer"
              >
                Try now
              </Link>
            </div>

          </div>

          {/* Right Column: Navigation Links */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-6 text-xs font-sans pt-2">
            
            {/* Column 1: Product / About */}
            <div className="flex flex-col gap-3 items-start">
              <Link href="/#about" className="text-zinc-600 hover:text-teal-600 transition-colors">
                About
              </Link>
              <Link href="/#Features" className="text-zinc-600 hover:text-teal-600 transition-colors">
                Features
              </Link>
              <Link href="/#PriceSection" className="text-zinc-600 hover:text-teal-600 transition-colors">
                Pricing
              </Link>
              <a href="mailto:support@luen.app" className="text-zinc-600 hover:text-teal-600 transition-colors">
                Contact
              </a>
              <Link href="/blog" className="text-zinc-600 hover:text-teal-600 transition-colors">
                Blog
              </Link>
            </div>

            {/* Column 2: Resources & Docs */}
            <div className="flex flex-col gap-3 items-start">
              <Link href="/docs" className="text-zinc-600 hover:text-teal-600 transition-colors">
                Documentation
              </Link>
              <Link href="/#FAQ" className="text-zinc-600 hover:text-teal-600 transition-colors">
                FAQ
              </Link>
              <a href="mailto:support@luen.app" className="text-zinc-600 hover:text-teal-600 transition-colors">
                Support
              </a>
            </div>

            {/* Column 3: Social Links */}
            <div className="flex flex-col gap-3 items-start">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-teal-600 transition-colors"
              >
                X (Twitter)
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-teal-600 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-teal-600 transition-colors"
              >
                YouTube
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 text-[11px] text-zinc-400 font-sans">
          <p>© 2026 Invoice-Gen. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link href="/terms?tab=privacy" className="hover:text-zinc-800 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms?tab=terms" className="hover:text-zinc-800 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>

      </div>

      {/* Large Bottom Faded Brand Watermark */}
      <div className="w-full flex justify-center pointer-events-none select-none pt-10">
        <span className="text-[12vw] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-zinc-300/30 via-zinc-200/10 to-transparent tracking-tighter">
          Luen
        </span>
      </div>

    </footer>
  );
}