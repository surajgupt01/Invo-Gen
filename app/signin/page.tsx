"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import Google from "../Icons/Google";
import Left from "../Icons/Left";
import SignSideBar from "../component/SignSideBar";
import Github from "../Icons/Github";

export default function SignUp() {
  return (
    <div className="md:p-4 p-3  w-full h-screen   flex  justify-center  items-center ">
      <div className="flex  rounded-4xl w-full h-full">
        <SignSideBar />

        <div className="w-full  h-full flex justify-center items-center relative lg:bg-gray-50 ">
          <Link
            href={"/"}
            className="absolute top-5 left-5 text-gray-700 hover:text-black cursor-pointer flex justify-center items-center group"
          >
            <Left />
            back
          </Link>
          <div className="  py-2 px-4 border-gray-50 border-1 shadow-lg lg:shadow-gray-200 rounded-2xl md:w-90 w-100 h-100 md:scale-100 scale-95  backdrop-blur-md  bg-white  flex flex-col items-center justify-center gap-8">
            <h1 className="text-2xl font-semibold text-gray-700 w-full text-left px-2">
              Log in
            </h1>
            <span className="text-gray-500 text-xs font-extralight">{`Log in to your account to continue.`}</span>

            <div className="flex flex-col items-center gap-2 w-full px-4">
              <button
                className="bg-white w-full  hover:border-gray-400 border-1 border-gray-300 active:scale-95 font-semibold text-center rounded-lg cursor-pointer transition-all duration-500 ease-in-out shadow-gray-200  px-4 py-2  text-black text-sm flex justify-center items-center "
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/dashboard",
                    redirect: true,
                  })
                }
              >
                <Google />
                <span className="text-gray-700 font-medium tracking-wide text-sm">{`continue with Google`}</span>
              </button>
              <button
                className=" w-full bg-gray-800 hover:bg-gray-700  hover:border-gray-200 border-1 border-gray-200  active:scale-95  font-semibold text-center rounded-lg  cursor-pointer transition-all duration-500 ease-in-out shadow-gray-200  px-4 py-2 text-black text-xs flex justify-center items-center gap-2 "
                onClick={() =>
                  signIn("github", {
                    callbackUrl: "/dashboard",
                    redirect: true,
                  })
                }
              >
                <Github />
                <span className="text-white font-medium tracking-wide text-sm">{`continue with Github`}</span>
              </button>
            </div>

            <span className="text-xs w-full px-6 text-gray-600 text-center">
              {`By continuing, you agree to Luen's`}
              <span className="underline cursor-pointer hover:text-gray-400">{` Terms of Service and Privacy Policy.`}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
