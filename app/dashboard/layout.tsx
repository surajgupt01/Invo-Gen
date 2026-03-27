"use client";

import { useSession } from "next-auth/react";
import SideNav from "../component/SideNav";
import { useState } from "react";
import Menu from "../Icons/Menu";
import CloseSide from "../Icons/CloseSide";
import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, status } = useSession();
  const router = useRouter(); 
  const [menu, setMenu] = useState(false);

  // 👇 add this
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-white">Loading...</div>;
  }


  if (status === "unauthenticated") {
    return null;
  }

  const name = data?.user?.name ?? "";
  const email = data?.user?.email ?? "";

  return (
    <div className="h-screen w-full overflow-hidden bg-black selection:bg-teal-500">
      <div className="h-full flex items-stretch min-h-0 relative">
        <div
          className={`${menu ? " " : " h-full z-100"} duration-500 ease-in-out lg:block hidden `}
        >
          <SideNav name={name} email={email} menu={menu} />
        </div>

        <button
          onClick={() => setMenu((e) => !e)}
          className={`${menu ? "left-48" : "left-2"} absolute z-100 lg:block hidden p-2 hover:text-neutral-600 top-2`}
        >
          {menu ? <CloseSide /> : <Menu />}
        </button>
        <div className="flex-1 min-w-0 min-h-0 transition-all duration-500 ease-in-out">
          {children}
        </div>
      </div>
    </div>
  );
}