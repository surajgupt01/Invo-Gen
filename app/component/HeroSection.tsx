import Link from "next/link";
import Arrow from "../Icons/Arrow";


export default function HeroSection() {
  return (
    <div className="flex flex-col  w-full items-center justify-end h-100 sm:mt-0 ">
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
        <Link href={'/dashboard'}><div className="md:p-4 p-3 flex justify-center items-center bg-black text-white md:text-md text-sm  rounded-3xl shadow-xl shadow-gray-400 cursor-pointer hover:scale-105 transition-all ease-in-out duration-500">
          Create new Invoices
          <Arrow />
        </div>
        </Link>
        <Link href={'/#Features'} className="p-3 flex justify-center items-center ml-4 text-md text-gray-600 hover:text-black  rounded-2xl shadow-2xl shadow-gray-300 border-1 border-gray-300 cursor-pointer hover:scale-102 transition-all ease-in-out duration-500">
          Learn more
        </Link>
      </div>
    </div>
  );
}
