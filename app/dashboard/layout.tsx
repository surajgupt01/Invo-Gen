"use client";

import { authClient } from "@/lib/auth-client";
import SideNav from "../component/SideNav";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Loading State
  if (isPending) {
    return (
      <div className="h-screen w-full bg-white text-zinc-900 flex items-center justify-center font-mono">
        <div className="flex items-center gap-3 border border-zinc-200 bg-white px-5 py-3 rounded-lg shadow-xs">
          <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-600">
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
    <div className="h-screen w-full bg-white text-zinc-950 font-sans select-none flex flex-col lg:flex-row overflow-hidden">
      
      {/* Mobile Top Header (< lg) */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-200 shrink-0 z-40">
        <Link href="/dashboard/overview" className="inline-flex items-center gap-2">
          <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
            <Image
              src="/favicon.png"
              alt="Luen Logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <span className="font-sans font-bold text-base tracking-tight text-zinc-950">
            Lu<span className="text-teal-500">en</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-600 hover:text-zinc-950 rounded-md hover:bg-zinc-100 transition cursor-pointer"
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer (< lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative h-full z-50 shadow-2xl flex bg-white max-w-[280px] w-full">
            <SideNav name={name} email={email} menu={true} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition z-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (lg+) with Border Collapse Button */}
      <div className="hidden lg:flex relative shrink-0 h-full">
        <SideNav name={name} email={email} menu={menu} />

        {/* Toggle Button attached directly on the sidebar border */}
        <button
          type="button"
          onClick={() => setMenu(!menu)}
          className="absolute -right-3 top-6 z-40 w-6 h-6 rounded-full bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          title={menu ? "Collapse sidebar" : "Expand sidebar"}
        >
          {menu ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto bg-white">
        {children}
      </main>

    </div>
  );
}