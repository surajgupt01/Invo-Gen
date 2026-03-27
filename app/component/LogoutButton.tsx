"use client"

import Logout from "../Icons/Logout";
import { signOut } from "next-auth/react";
export default function LogoutButton() {
  return (
    <button
      className=" flex items-center gap-1 hover:bg-teal-400 p-1 text-red-500 rounded-sm cursor-pointer"
      onClick={() => {
        console.log("sign out called");
        signOut();
      }}
    >
      <Logout />
      Logout
    </button>
  );
}
