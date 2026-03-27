"use client";

import { signIn , signOut } from "next-auth/react";
import { useState } from "react";
import Google from "../Icons/Google";

type GoogleButtonProps = {
  redirectUrl?: string; // Optional: redirect after login
  className?: string;   // Optional: styling
};

export default function GoogleButton({ redirectUrl = "/", className }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin =  async() => {
    setLoading(true);
    setErrorMessage(null);

 
    await signOut({ redirect: false })
    await signIn("google", { callbackUrl: "/dashboard" });
  };


  return (
    <div>
   <button
      className="bg-white  hover:border-gray-300 border-1 border-gray-200 font-semibold text-center rounded-lg shadow-md cursor-pointer transition-all duration-500 ease-in-out shadow-gray-200  px-15 py-2 m-2 text-black text-sm flex justify-center items-center "
      onClick={handleGoogleLogin}
    >
      <Google /> Continue with Google
    </button>
      {errorMessage && <p className="text-red-500 mt-1">{errorMessage}</p>}
    </div>
  );
}


