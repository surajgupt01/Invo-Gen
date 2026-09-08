"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Google from "../Icons/Google";
import Github from "../Icons/Github";
import SignSideBar from "../component/SignSideBar";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans select-none flex">
      {/* Left Sidebar */}
      <SignSideBar />

      {/* Right Side: Auth Area */}
      <div className="relative flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-screen bg-white">
        
        {/* Top Navigation */}
        <div className="w-full flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-950 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>back to home</span>
          </Link>
        </div>

        {/* Centered Auth Box */}
        <div className="w-full max-w-xs mx-auto my-auto space-y-6">
          
          {/* Header */}
          <div className="space-y-1.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-950">
              Sign in
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Log in to manage and send invoices for your business.
            </p>
          </div>

          {/* Social Auth Providers */}
          <div className="space-y-2.5 font-sans">
            
            {/* Google Sign-in */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full h-10 px-4 duration-300 ease-in-out bg-white text-zinc-900 border border-zinc-200 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-2.5 shadow-2xs ${
                isLoading
                  ? "opacity-75 cursor-not-allowed border-zinc-300"
                  : "hover:bg-zinc-50 hover:border-zinc-300 active:scale-95 cursor-pointer"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Google />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* GitHub Sign-in (Keep ready if enabled later) */}
            {/* <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={isLoading}
              className="w-full h-10 px-4 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs"
            >
              <Github />
              <span>Continue with GitHub</span>
            </button> */}

          </div>

          {/* Terms & Privacy Notice */}
          <p className="text-[11px] text-zinc-400 text-center leading-relaxed font-sans pt-1">
            By continuing, you agree to Luen&apos;s{" "}
            <Link
              href="/terms?tab=terms"
              className="text-zinc-700 underline underline-offset-2 hover:text-zinc-950 transition-colors"
            >
              Terms
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

        {/* Footer */}
        <div className="w-full text-left text-[11px] font-mono text-zinc-400">
          © 2026 Luen
        </div>

      </div>
    </div>
  );
}