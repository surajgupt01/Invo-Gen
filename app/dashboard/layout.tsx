// import { auth } from "@/auth";
"use client";
// import { useSession } from "next-auth/react";
// import SideNav from "../component/SideNav";
// import { redirect } from "next/navigation";
// import { useEffect } from "react";
// import { useState } from "react";
import Menu from "../Icons/Menu";
import CloseSide from "../Icons/CloseSide";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();

  // const { data, status } = useSession();


  // if (status === "unauthenticated") {
  //   redirect("/signin");
  // }
  

  // if (!data?.user.name || !data?.user.email) redirect("/signin");

  // const name = data.user.name;
  // const email = data.user.email;
  // const name = data?.user?.name ?? "";
  // const email = data?.user?.email ?? "";

  // const [isDesktop, setIsDesktop] = useState(false);

  // useEffect(() => {
  //   const checkScreen = () => {
  //     setIsDesktop(window.innerWidth >= 1024);
  //   };

  //   checkScreen(); // initial check
  //   window.addEventListener("resize", checkScreen);

  //   return () => window.removeEventListener("resize", checkScreen);
  // }, []);

  // const [menu , setMenu] = useState(false)
  
  // if(status=='loading'){
  //   return <div>Loading...</div>
  // }

  return (
    <div className="h-screen w-full overflow-hidden bg-black selection:bg-teal-500">
      <div className="h-full flex items-stretch gap-2 min-h-0 relative">
        {
        // <div className={`${menu ? ' ' : ' h-full z-100'} duration-500 ease-in-out `}>
        //   <SideNav name={name} email={email} menu={menu} /> 
        // </div>
        }
         {/* <button onClick={()=>setMenu(e=>!e)} className={`${menu ? 'left-48' : 'left-2'} absolute z-100   p-2 hover:text-neutral-600 top-2`}>{menu?<CloseSide/> : <Menu/>}</button> */}
        <div className="flex-1 min-w-0 min-h-0 p-1 transition-all duration-500 ease-in-out ">{children}</div>
      </div>
    </div>
  );
}
