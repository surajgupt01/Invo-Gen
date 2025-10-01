"use client"

import Link from "next/link";
import Google from "../Icons/Google";
import Left from "../Icons/Left";
import SignSideBar from "../component/SignSideBar";
import {PhoneInput} from "react-international-phone"
import { useState } from "react";
import 'react-international-phone/style.css';

export default function SignIn() {
const [v , setValue] = useState('')
  return (
    <div className="md:p-4 p-3  w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex  justify-center  items-center">
       
       <div className="flex shadow-lg shadow-gray-400 rounded-xl w-full h-full">
        
        <SignSideBar/>

      <div className="w-full  h-full flex justify-center items-center relative p-2">
        <Link href={"/"} className="absolute top-5 left-5 text-gray-700 hover:text-black cursor-pointer flex justify-center items-center group"><Left/>back</Link>
        <div className="  p-2 border-gray-300 border-1 shadow-md rounded-lg md:scale-100 scale-95 w-100 h-150 backdrop-blur-md  bg-white/90  flex flex-col items-center justify-center">
          <p className="font-semibold w-60 text-center mb-4 text-md text-gray-600">
           Join us today <br></br> Quick and easy invoicing at your fingertips.
          </p>
          
          <PhoneInput
  defaultCountry="us"
  value={v}
  onChange={(e: string) => setValue(e)}
  className="w-[82%] h-14 rounded-md flex items-center"
  inputClassName="flex-1 h-full px-3 text-sm text-gray-700 display:none"
/>

          <input
            className="w-80 p-1.5 rounded-md border-1 border-gray-300 outline-gray-300 m-2 text-gray-700 "
            placeholder="full name "
            type="text"
          ></input>
          <input
            className="w-80 p-1.5 rounded-md border-1 border-gray-300 outline-gray-300 m-2 text-gray-700 "
            placeholder="email "
            type="email"
          ></input> 


           {/* <input
            className="w-80 p-2 rounded-md border-1 border-gray-300 m-2 text-gray-700 outline-gray-300 "
            placeholder="ph number " type="tel"
          ></input> */}
          <input
            className="w-80 p-1.5 rounded-md border-1 border-gray-300 m-2 text-gray-700 outline-gray-300 "
            placeholder="password "
            type="password"
          ></input>
          {/* <div className="text-xs hover:text-black text-gray-400 cursor-pointer w-75 text-right ">Forgot Password</div> */}
          <button className="bg-gradient-to-r from-emerald-600 to-cyan-600 font-semibold text-center rounded-lg shadow-md cursor-pointer hovera:from-emerald-700 hover:to-cyan-800 transition-all duration-500 ease-in-out shadow-gray-200 text-white px-25 py-2 m-2">
            SignUp
          </button>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-2px bg-gray-200"></div>
          </div>
          <button type="submit" className="bg-white  hover:border-gray-400 border-1 border-gray-200 font-semibold text-center rounded-lg shadow-md cursor-pointer transition-all duration-500 ease-in-out shadow-gray-200  px-15 py-2 m-2 text-black text-sm flex justify-center items-center ">
            <Google /> Continue with Google
          </button>
          <div className="mt-4">
            {"Already have an account? "}
            <span className="text-blue-500 cursor-pointer hover:text-blue-700">
             <Link href={'/signin'}>SignIn</Link>
            </span>
          </div>
        </div>
      </div>
      </div>

    </div>
  );
}

