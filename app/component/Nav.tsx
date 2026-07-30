import Link from "next/link";

interface NavProp {
  textColor?: string;
}

export function NavLogo({ textColor = "text-zinc-900" }: NavProp) {
  return (
    <Link href="/" className="inline-block select-none">
      <div className="cursor-pointer font-sans font-bold text-lg sm:text-xl tracking-tight flex items-center">
        <span className={textColor}>
          Lu<span className="text-teal-500">en</span>
        </span>
      </div>
    </Link>
  );
}

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFAFA]/80 backdrop-blur-md border-b border-zinc-200/80 font-sans select-none">
      <div className="w-[90%] max-w-5xl mx-auto h-14 flex items-center justify-between">
        
        {/* Brand Logo */}
        <NavLogo textColor="text-zinc-900" />

        {/* Right Nav Actions */}
        <div className="flex items-center gap-3">
          
          {/* Go Pro CTA */}
          <Link
            href="/#PriceSection"
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1 font-mono uppercase"
          >
            <span>go</span>
            <span className="text-teal-600 font-bold">pro</span>
          </Link>

          {/* Login / Auth CTA */}
          <Link
            href="/signin"
            className="px-4 py-2 text-xs font-medium text-white bg-zinc-950 hover:bg-black rounded-xs shadow-2xs transition-colors cursor-pointer"
          >
            Login
          </Link>

        </div>

      </div>
    </header>
  );
}