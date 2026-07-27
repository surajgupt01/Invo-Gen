"use client";

import { useSession } from "next-auth/react";
import SideNav from "../component/SideNav";
import { useState, useEffect } from "react";
import Menu from "../Icons/Menu";
import CloseSide from "../Icons/CloseSide";
import { useRouter } from "next/navigation";
import { X, Layers } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, status } = useSession();
  const router = useRouter();
  
  // Desktop sidebar collapsed state
  const [menu, setMenu] = useState(false);
  
  // Mobile drawer open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Loading State
  if (status === "loading") {
    return (
      <div className="h-screen w-full bg-[#090909] text-neutral-400 flex items-center justify-center font-mono">
        <div className="flex items-center gap-2 border border-neutral-800 bg-[#121212] px-4 py-2">
          <span className="w-2 h-2 bg-[#00D2B5] animate-ping" />
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-200">
            Authenticating Session...
          </span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const name = data?.user?.name ?? "";
  const email = data?.user?.email ?? "";

  return (
    <div className="h-screen w-full overflow-hidden bg-[#090909] text-neutral-300 font-mono select-none selection:bg-[#00D2B5] selection:text-[#090909]">
      
      {/* ==========================================
          MOBILE TOP NAVBAR (< lg screens)
      ========================================== */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#121212] border-b border-neutral-800 shrink-0 z-40">
        <div className="flex items-center gap-2 font-sans">
          <div className="w-6 h-6 bg-[#00D2B5] text-[#090909] font-black text-xs flex items-center justify-center font-mono">
            L
          </div>
          <span className="font-bold text-sm tracking-widest text-white uppercase">
            Luen
          </span>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-neutral-400 hover:text-white bg-[#090909] border border-neutral-800 focus:outline-none transition"
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-[#00D2B5]" />
          ) : (
            <Menu />
          )}
        </button>
      </header>

      {/* ==========================================
          MOBILE SIDEBAR DRAWER & OVERLAY (< lg)
      ========================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] bg-[#121212] border-r border-neutral-800 h-full flex flex-col z-50 shadow-2xl">
            {/* Mobile Drawer Top Header */}
            <div className="p-3 border-b border-neutral-800 flex items-center justify-between bg-[#181818]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00D2B5]" />
                <span className="text-xs font-bold uppercase tracking-widest text-white font-sans">
                  Navigation
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-neutral-400 hover:text-white transition"
              >
                <CloseSide />
              </button>
            </div>

            {/* Mobile SideNav Container */}
            <div className="flex-1 overflow-y-auto">
              <SideNav name={name} email={email} menu={false} />
            </div>
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
          } duration-300 ease-in-out lg:block hidden border-r border-neutral-800/80 bg-[#121212]`}
        >
          <SideNav name={name} email={email} menu={menu} />
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={() => setMenu((e) => !e)}
          className={`${
            menu ? "left-48" : "left-2"
          } absolute z-40 lg:block hidden p-1.5 text-neutral-400 hover:text-white bg-[#090909] border border-neutral-800 top-2.5 transition-all duration-300`}
          title={menu ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {menu ? <CloseSide /> : <Menu />}
        </button>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 min-h-0 overflow-auto transition-all duration-300 bg-[#090909]">
          {children}
        </main>
      </div>

    </div>
  );
}