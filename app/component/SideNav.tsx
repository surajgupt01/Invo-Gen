"use client";

import { NavLogo } from "./Nav";
import Overview from "../Icons/Overview";
import Docs from "../Icons/Doc";
import Tempelates from "../Icons/Tempelates";
import Settings from "../Icons/Settings";
import Profile from "../Icons/Profile";
import Link from "next/link";
import User from "../Icons/User";
import LogoutButton from "./LogoutButton";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

// --- Minimal Clean SVG Icons ---
function InvoicesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function HeadphonesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function SparklesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function CheckShieldIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

export default function SideNav({
  name,
  email,
  menu,
}: {
  name: string;
  email: string;
  menu: boolean;
}) {
  const pathname = usePathname();
  const [route, setRoute] = useState("");
  const [plan, setPlan] = useState<"FREE" | "PRO">("FREE");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname) {
      const segments = pathname.split("/");
      setRoute(segments[2] || "");
    }
  }, [pathname]);

  useEffect(() => {
    async function fetchPlanStatus() {
      try {
        const res = await fetch("/api/settings", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const userPlan = data?.user?.plan || data?.plan || "FREE";
          setPlan(userPlan);
        }
      } catch (err) {
        console.error("Failed to fetch plan status in navigation:", err);
      }
    }

    fetchPlanStatus();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPro = plan === "PRO";

  const navItems = [
    {
      group: "MAIN",
      items: [
        {
          label: "Overview",
          href: "/dashboard/overview",
          id: "overview",
          icon: <Overview />,
        },
        {
          label: "Create Invoices",
          href: "/dashboard/createInvoice",
          id: "createInvoice",
          icon: <Docs />,
        },
        {
          label: "Invoices History",
          href: "/dashboard/invoices",
          id: "invoices",
          icon: <InvoicesIcon />,
        },
      ],
    },
    {
      group: "OTHERS",
      items: [
        {
          label: "Templates",
          href: "/dashboard/templates",
          id: "templates",
          icon: <Tempelates />,
        },
        {
          label: "Settings",
          href: "/dashboard/settings",
          id: "settings",
          icon: <Settings />,
        },
      ],
    },
  ];

  return (
    <aside
      className={`${
        menu ? "w-64 px-4" : "w-[72px] px-2.5"
      } h-full transition-all duration-300 ease-in-out bg-white border-r border-zinc-200 font-sans py-4 flex flex-col justify-between select-none shrink-0 relative z-30`}
    >
      {/* Top Branding & Nav */}
      <div className="flex flex-col gap-6">
        <div
          className={`flex items-center h-10 ${
            menu ? "justify-start px-2" : "justify-center"
          }`}
        >
          {menu ? (
            <NavLogo textColor="text-zinc-950" />
          ) : (
            <Link href="/" className="relative w-6 h-6 flex items-center justify-center">
              <Image
                src="/favicon.png"
                alt="Luen Logo"
                width={22}
                height={22}
                className="object-contain"
              />
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-5">
          {navItems.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {menu && (
                <span className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-widest px-3 block mb-1.5">
                  {group.group}
                </span>
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = route === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`group relative flex items-center gap-3 py-2 px-3 rounded-md transition-colors text-xs font-medium ${
                        isActive
                          ? "bg-zinc-100 text-zinc-950 font-semibold"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                      } ${!menu ? "justify-center px-0" : ""}`}
                    >
                      <div
                        className={`text-sm shrink-0 transition-colors ${
                          isActive
                            ? "text-zinc-950"
                            : "text-zinc-400 group-hover:text-zinc-700"
                        }`}
                      >
                        {item.icon}
                      </div>

                      {menu ? (
                        <span className="truncate tracking-tight">{item.label}</span>
                      ) : (
                        <div className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-950 text-white text-[11px] font-mono uppercase tracking-wider rounded-md shadow-lg opacity-0 -translate-x-1 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Area */}
      <div className="space-y-2 pt-4 border-t border-zinc-100">
        {/* Pro Status / Upgrade CTA */}
        {!isPro ? (
          <Link
            href="/dashboard/pricing"
            className={`group relative flex items-center gap-2.5 py-2 px-3 rounded-md text-xs font-medium text-zinc-950 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-colors shadow-2xs ${
              !menu ? "justify-center px-0" : ""
            }`}
          >
            <div className="text-teal-600 shrink-0">
              <SparklesIcon />
            </div>
            {menu ? (
              <div className="flex items-center justify-between w-full min-w-0">
                <span className="font-medium truncate">Upgrade to Pro</span>
                <span className="text-[10px] font-mono font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded-sm uppercase">
                  PRO
                </span>
              </div>
            ) : (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-950 text-white text-[11px] font-mono uppercase tracking-wider rounded-md shadow-lg opacity-0 -translate-x-1 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50">
                Upgrade to Pro
              </div>
            )}
          </Link>
        ) : (
          <div
            className={`group relative flex items-center gap-2.5 py-2 px-3 rounded-md text-xs font-medium bg-zinc-950 text-white border border-zinc-800 shadow-2xs ${
              !menu ? "justify-center px-0" : ""
            }`}
          >
            <div className="text-teal-400 shrink-0">
              <CheckShieldIcon />
            </div>
            {menu ? (
              <div className="flex items-center justify-between w-full min-w-0 font-mono">
                <span className="font-medium text-[11px] truncate tracking-wider">
                  PRO PLAN
                </span>
                <span className="text-[9px] text-teal-400 bg-teal-950 border border-teal-800 px-1.5 py-0.5 rounded-sm uppercase">
                  ACTIVE
                </span>
              </div>
            ) : (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-950 text-white text-[11px] font-mono uppercase tracking-wider rounded-md shadow-lg opacity-0 -translate-x-1 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50">
                Pro Plan Active
              </div>
            )}
          </div>
        )}

        {/* Help & Support */}
        <Link
          href="/dashboard/support"
          className={`group relative flex items-center gap-3 py-2 px-3 rounded-md transition-colors text-xs font-medium ${
            route === "support"
              ? "bg-zinc-100 text-zinc-950 font-semibold"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
          } ${!menu ? "justify-center px-0" : ""}`}
        >
          <div className="text-zinc-400 group-hover:text-zinc-700 shrink-0 transition-colors">
            <HeadphonesIcon />
          </div>
          {menu ? (
            <span className="truncate tracking-tight">Help & Support</span>
          ) : (
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-950 text-white text-[11px] font-mono uppercase tracking-wider rounded-md shadow-lg opacity-0 -translate-x-1 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50">
              Help & Support
            </div>
          )}
        </Link>

        {/* User Profile Popover */}
        <div className="border-t border-zinc-100 pt-2" ref={profileRef}>
          <div className="relative group">
            <div
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-zinc-50 cursor-pointer transition-colors ${
                !menu ? "justify-center" : ""
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-600">
                <Profile />
              </div>

              {menu && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-medium text-zinc-950 truncate leading-tight">
                    {name || "User Account"}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono truncate leading-tight mt-0.5">
                    {email || "user@example.com"}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div
              className={`absolute bottom-full mb-2 ${
                menu ? "left-0 w-full" : "left-12 w-52"
              } bg-white border border-zinc-200 rounded-lg shadow-xl p-1.5 transition-all z-50 ${
                isProfileOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
              }`}
            >
              <Link
                href="/dashboard/settings"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-md transition-colors"
              >
                <User />
                <span>Account Settings</span>
              </Link>

              <Link
                href="/dashboard/pricing"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-3.5 h-3.5 text-teal-600" />
                  <span>Subscription</span>
                </div>
                {!isPro && (
                  <span className="text-[9px] font-mono font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200 px-1 rounded-sm">
                    FREE
                  </span>
                )}
              </Link>

              <div className="border-t border-zinc-100 my-1" />

              <div className="px-1 py-0.5" onClick={() => setIsProfileOpen(false)}>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}