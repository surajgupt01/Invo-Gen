"use client"

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



export default  function SideNav({name , email , menu} : { name: string , email : string , menu : boolean} ) {

 const pathname = usePathname()

  const [route , setRoute] = useState('')

  console.log(pathname)


  useEffect(()=>{
    setRoute(pathname.split('/')[2])
 

  },[pathname])
 
 

  

  return (
    <div className={` ${menu ? 'w-60' : 'w-15'}  max-w-70 h-full transition-all duration-500 ease-in-out z-100  bg-neutral-950 py-4 px-6 flex flex-col border-r border-neutral-900 `}>
  
{menu &&        <div className="mt-2  flex justify-start">
         <div className="">
           <NavLogo textColor="text-gray-200" />
         </div>
      </div>}
      <div className={`${menu ? '' : ' delay-100  hidden'}  h-full flex-col flex justify-between mt-6 `}>
        <div className={``}>
          <span className="text-xs text-neutral-300 tracking-wide">MAIN</span>
          <Link href={'/dashboard'} className={`flex items-center mt-4 gap-1 hover:bg-white/10 ${route=='overview' ? 'bg-white/20' : ''} cursor-pointer text-neutral-400 py-1.5 px-2 rounded-xs`}>
            <div>
              <Overview />
            </div>
            <span className="text-sm">Overview</span>
          </Link>
          <Link
            href={"/dashboard/createInvoice"}
            className={`flex items-center gap-1 hover:bg-white/10 ${route=='createInvoice' ? 'bg-white/10' : ''}   cursor-pointer text-neutral-400 py-1.5 px-2 rounded-xs mt-1`}
          >
            <div className="text-xl">
              <Docs/>
            </div>
            <span className="text-sm">Create Invoices</span>
          </Link>

          <div className="mt-6 text-xs text-neutral-300 tracking-wide">OTHERS</div>

          <Link
            href={"/dashboard/templates"}
            className={`flex items-center mt-4   hover:bg-white/10 gap-1 ${route=='templates' ? 'bg-white/10' : ''}  cursor-pointer text-neutral-400 py-1.5 px-2 rounded-xs`}
          >
            <div>
              <Tempelates />
            </div>
            <span className="text-sm">Templates</span>
          </Link>

          <Link
            href={"/dashboard"}
            className={`flex items-center mt-1  hover:bg-white/10 gap-1 ${route=='settings' ? 'bg-white/10' : ''}  cursor-pointer text-neutral-400 py-1.5 px-2 rounded-xs`}
          >
            <div>
              <Settings />
            </div>
            <span className="text-sm">Settings</span>
          </Link>
        </div>

        <div className="  text-neutral-400  z-100 border-t border-white/10">
          <div className="cursor-pointer group  w-full flex gap-2 items-center relative">
            <div className="flex  items-center p-1 hover:bg-gray-900 rounded-sm w-full gap-1 ">
              <Profile />
              {menu && <div className="text-xs flex-col flex ">
                <span className="text-[16px]">{name}</span>

                <span className="text-[10px]">{email}</span>
              </div>}
            </div>
            <div className="bg-gray-100 border shadow-sm p-1 text-xs rounded-sm absolute left-46 w-26 h-15 flex flex-col justify-center group-hover:opacity-100 invisible group-hover:visible opacity-0 duration-300 ease-in-out ">
              <span className="">
                <Link
                  href={"/dashboard/settings"}
                  className="flex items-center gap-1 hover:bg-teal-400 p-1 text-gray-700 rounded-sm"
                >
                  {" "}
                  <User /> My Account
                </Link>
              </span>

              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
