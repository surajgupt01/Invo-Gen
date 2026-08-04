"use client";

import { authClient } from "@/lib/auth-client";
import SideNav from "../component/SideNav";
import { useState, useEffect } from "react";
import Menu from "../Icons/Menu";
import CloseSide from "../Icons/CloseSide";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Desktop sidebar collapsed state
  const [menu, setMenu] = useState(true);

  // Mobile drawer open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [isPending, session, router]);

  // Automatically close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Loading State - Light Theme
  if (isPending) {
    return (
      <div className="h-screen w-full bg-[#FAFAFA] text-zinc-600 flex items-center justify-center font-mono">
        <div className="flex items-center gap-2.5 border border-zinc-200 bg-white px-4 py-2.5 shadow-sm">
          <span className="w-2 h-2 bg-teal-600 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-800">
            Authenticating Session...
          </span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const name = session.user.name ?? "";
  const email = session.user.email ?? "";

  return (
    <div className="h-screen w-full lg:overflow-hidden overflow-y-auto bg-[#FAFAFA] text-zinc-800 font-mono select-none selection:bg-teal-100 selection:text-teal-900">
      
      {/* ==========================================
          MOBILE TOP NAVBAR (< lg screens)
      ========================================== */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-200 shrink-0 z-40 shadow-2xs">
        <Link href="/dashboard/overview" className="flex items-center gap-2 font-sans">
          <div className="w-6 h-6 bg-zinc-900 text-white font-black text-xs flex items-center justify-center font-mono">
            L
          </div>
          <span className="font-bold text-sm tracking-widest text-zinc-900 uppercase">
            Luen
          </span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 focus:outline-none transition shadow-2xs cursor-pointer"
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-teal-700" />
          ) : (
            <Menu />
          )}
        </button>
      </header>

      {/* ==========================================
          MOBILE DRAWER USING SideNav COMPONENT (< lg)
      ========================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-zinc-900/30 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over Container rendering SideNav */}
          <div className="relative h-full z-50 shadow-xl flex bg-white">
            <SideNav name={name} email={email} menu={true} />
            
            {/* Close Button Header overlay for mobile drawer */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-3 right-3 p-1.5 text-zinc-500 hover:text-zinc-900 bg-zinc-50 border border-zinc-200 transition z-50 shadow-2xs cursor-pointer"
              title="Close Menu"
            >
              <CloseSide />
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          DESKTOP LAYOUT (lg+ screens)
      ========================================== */}
      <div className="h-full flex items-stretch min-h-0 relative">
        
        {/* Desktop Sidebar */}
        <div
          className={`${
            menu ? "" : "h-full z-30"
          } duration-300 ease-in-out lg:block hidden bg-white border-r border-zinc-200/80`}
        >
          <SideNav name={name} email={email} menu={menu} />
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={() => setMenu((e) => !e)}
          className={`${
            menu ? "left-52" : "left-2"
          } absolute z-40 lg:block hidden p-1.5 text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200/80 top-2.5 transition-all duration-300 shadow-2xs cursor-pointer`}
          title={menu ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {menu ? <CloseSide /> : <Menu />}
        </button>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 min-h-0 overflow-auto transition-all duration-300 bg-[#FAFAFA]">
          {children}
        </main>
      </div>

    </div>
  );
}