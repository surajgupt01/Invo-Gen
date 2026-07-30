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
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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

  useEffect(() => {
    if (pathname) {
      const segments = pathname.split("/");
      setRoute(segments[2] || "");
    }
  }, [pathname]);

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
        menu ? "w-60 px-3.5" : "w-16 px-2"
      } h-full transition-all duration-300 ease-in-out bg-white border-r border-zinc-200/80 font-sans py-3.5 flex flex-col justify-between select-none shrink-0 relative z-30`}
    >
      {/* Top Branding & Logo */}
      <div className="flex flex-col gap-5">
        <div
          className={`flex items-center ${
            menu ? "justify-between px-1 pt-0.5" : "justify-center pt-0.5"
          }`}
        >
          {menu ? (
            <NavLogo textColor="text-zinc-900" />
          ) : (
            <div className="w-7 h-7 bg-zinc-950 text-white font-mono font-bold text-xs flex items-center justify-center rounded-2xs shadow-2xs">
              L
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-4 pt-1">
          {navItems.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {menu && (
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-2.5 block mb-1">
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
                      title={!menu ? item.label : undefined}
                      className={`flex items-center gap-2.5 py-2 px-2.5 rounded-2xs transition-all duration-150 text-xs font-medium ${
                        isActive
                          ? "bg-teal-50/70 text-teal-900 font-semibold border-l-2 border-teal-600 shadow-2xs"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                      } ${!menu ? "justify-center px-0" : ""}`}
                    >
                      <div
                        className={`text-sm shrink-0 transition-colors ${
                          isActive ? "text-teal-700" : "text-zinc-400 group-hover:text-zinc-800"
                        }`}
                      >
                        {item.icon}
                      </div>

                      {menu && (
                        <span className="truncate font-sans tracking-tight">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile & Account Actions Dropup */}
      <div className="border-t border-zinc-100 pt-3">
        <div className="relative group">
          <div
            className={`flex items-center gap-2.5 p-1.5 rounded-2xs hover:bg-zinc-50 cursor-pointer transition-colors ${
              !menu ? "justify-center" : ""
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200/80 flex items-center justify-center shrink-0">
              <Profile />
            </div>

            {menu && (
              <div className="flex flex-col min-w-0 flex-1 font-sans">
                <span className="text-xs font-semibold text-zinc-900 truncate leading-tight">
                  {name || "User Account"}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono truncate leading-tight mt-0.5">
                  {email || "user@example.com"}
                </span>
              </div>
            )}
          </div>

          {/* Hover Popover Menu */}
          <div
            className={`absolute bottom-full mb-2 ${
              menu ? "left-0 w-full" : "left-12 w-44"
            } bg-white border border-zinc-200/80 rounded-xs shadow-md p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50`}
          >
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-2xs transition-colors font-sans"
            >
              <User />
              <span>My Account</span>
            </Link>

            <div className="border-t border-zinc-100 my-1" />

            <div className="px-0.5">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}