"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logout from "../Icons/Logout";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
          router.refresh();
        },
        onError: (ctx) => {
          console.error("Signout error:", ctx.error);
          setIsPending(false);
        },
      },
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleLogout}
      className="flex items-center gap-1 p-1 text-red-500 hover:bg-teal-400 rounded-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <Logout />
      <span>{isPending ? "Logging out..." : "Logout"}</span>
    </button>
  );
}