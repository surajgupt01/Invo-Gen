import Link from "next/link";
import Arrow from "../Icons/Arrow";
import Magnify from "../Icons/Magnify";
import Create from "../Icons/Create";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="flex flex-col  w-full items-center justify-end lg:h-120 h-110 sm:mt-0 ">
      <div className="md:text-5xl text-3xl  font-bold text-gray-700 w-full flex justify-center">
        Professional Invoice
      </div>

      <div className="md:text-6xl  text-3xl w-full    font-bold bg-clip-text flex justify-center text-transparent bg-linear-to-r from-green-600 to-blue-500">
        Generation Made Simple
      </div>

      <div className="mt-10">
        <p className="text-gray-600 md-text-xl text-sm text-md   md:w-190 sm:w-160 w-80 text-center">
          Create, customize, and send professional invoices in minutes. Perfect
          for freelancers, small businesses, and entrepreneurs.
        </p>
      </div>

      <div className="mt-8 flex  p-2 w-full justify-center items-center">
        <Link
          href={"/#Features"}
          className="p-3 flex gap-1 h-11 group overflow-hidden justify-center items-center  text-sm  text-gray-200 hover:text-teal-500 bg-gray-900 hover:bg-black   rounded-sm shadow-2xl shadow-gray-300 border-1 border-gray-300 cursor-pointer hover:scale-102 transition-all ease-in-out duration-500"
        >
          <div className="flex flex-col gap-5 items-center justify-center duration-300 ease-in-out -mt-10 group-hover:mt-10">
            <div className="flex flex-row items-center justify-center ">
              <Magnify /> {"Learn more"}
            </div>
            <div className="flex flex-row items-center justify-center">
              <Magnify /> {"Learn more"}
            </div>
          </div>
        </Link>
        <Link href={"/dashboard"}>
          <div
            className="group inline-flex items-center justify-center gap-1
                md:py-4 py-3 px-4
                 text-black border border-gray-300
                md:text-md text-sm
                rounded-full  shadow-gray-400
                cursor-pointer
                ml-2
                transition-all duration-500"
          >
            <span>Create new Invoices</span>

            <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
              <div className="absolute transition-transform duration-300 group-hover:-translate-y-full">
                <Create />
              </div>

              <div className="absolute translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                <Arrow />
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className=" text-gray-600 w-full h-auto flex  flex-col text-[10px] justify-center items-center mt-4 ">
        <div className="w-full flex flex-row justify-center items-center gap-2">
          <Image
            className=""
            alt=""
            src={"/ChatGPT Image Feb 23, 2026, 12_01_02 AM.png"}
            width={120}
            height={40}
          ></Image>
          <span className="">
            <span className="font-semibold lg:text-sm text-[8px]">Trusted</span> by
            1000+ businesses & freelancers
            <br></br>
            <span className="lg:text-xs text-gray-500 font-sans text-[7px]">
              Helping businesses get paid faster, every day.
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
