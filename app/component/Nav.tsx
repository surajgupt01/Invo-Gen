

import Link from "next/link"
import Logo from "../Icons/Logo"

export default function Nav(){



    return(
        <div className="flex justify-evenly sm:w-[80%] w-full   p-2 shadow-sm shadow-gray-300  fixed scale-90   bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
          <div className="  w-full cursor-pointer font-bold sm:text-2xl text-xl flex items-center ">
            <Logo/>
            <span>Invoice-<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-400">Gen</span> </span></div>
          <div className="flex p-2  sm:w-[60%] w-[80%] justify-end items-center">
             {/* <li className="cursor-pointer hover:text-gray-700">Home</li> */}
             <div className="md:text-sm text-xs sm:mr-4 mr-2 hover:bg-gray-200 p-2 rounded-full cursor-pointer ease-in-out duration-500">get started</div>
             <div><Link href={"/signin"} className="px-4 w-20 h-10 hover:bg-gray-800 ease-in-out duration-300 cursor-pointer bg-black rounded-full text-xs shadow-md shadow-gray-300 text-white font-semibold flex justify-center items-center">Login</Link></div>
            
          </div>
       </div>
    )
}

