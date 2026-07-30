"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import Google from "../Icons/Google";
import Left from "../Icons/Left";
import SignSideBar from "../component/SignSideBar";
import Github from "../Icons/Github";

export default function SignUp() {
  return (
    <div className="w-full h-screen bg-[#FAFAFA] p-3 sm:p-4 flex justify-center items-center font-sans select-none overflow-hidden">
      <div className="flex justify-center items-center w-full h-full border border-zinc-200/80 rounded-xs bg-white overflow-hidden shadow-2xs">
        
        {/* LEFT SIDEBAR */}
        <SignSideBar />

        {/* RIGHT SIDE: AUTH FORM AREA */}
        <div className="relative w-full h-full  bg-[#FAFAFA] flex items-center justify-center p-6 sm:p-10">
          
          {/* Back Navigation Button (Pinned Top Left) */}
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <Left />
              <span>back to home</span>
            </Link>
          </div>

          {/* Centered Auth Card */}
          <div className="w-full max-w-[360px] bg-white border border-zinc-200/80 p-6 sm:p-8 rounded-xs shadow-2xs space-y-6">
            
            {/* Header */}
            <div className="space-y-1 text-left">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                Log in
              </h1>
              <p className="text-xs text-zinc-400 font-sans">
                Log in to your account to continue creating invoices.
              </p>
            </div>

            {/* OAuth Provider Buttons */}
            <div className="space-y-2.5 font-sans">
              
              {/* Google Sign-in */}
              <button
                type="button"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/dashboard",
                    redirect: true,
                  })
                }
                className="w-full h-10 px-4 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/80 rounded-xs text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs"
              >
                <Google />
                <span>Continue with Google</span>
              </button>

              {/* GitHub Sign-in */}
              <button
                type="button"
                onClick={() =>
                  signIn("github", {
                    callbackUrl: "/dashboard",
                    redirect: true,
                  })
                }
                className="w-full h-10 px-4 bg-zinc-950 hover:bg-black text-white rounded-xs text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs"
              >
                <Github />
                <span>Continue with GitHub</span>
              </button>

            </div>

            {/* Terms & Privacy Disclaimer */}
            <p className="text-[11px] text-zinc-400 text-center leading-relaxed font-sans pt-1">
              {`By continuing, you agree to Luen's{" "}`}
              <Link
                href="/terms?tab=terms"
                className="text-zinc-700 underline underline-offset-2 hover:text-zinc-950 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/terms?tab=privacy"
                className="text-zinc-700 underline underline-offset-2 hover:text-zinc-950 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>

          </div>

          {/* Footer Copyright (Pinned Bottom Left) */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-[10px] font-mono text-zinc-400">
            © 2026 Invoice-Gen. All rights reserved.
          </div>

        </div>

      </div>
    </div>
  );
}