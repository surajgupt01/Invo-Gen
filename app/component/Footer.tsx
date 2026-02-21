import Image from "next/image";

export default function Footer() {
  return (
    <div className=" w-full  min-h-100 border-t border-gray-100 text-gray-800 text-sm p-0">
      <div className="  flex sm:flex-row flex-col justify-between items-center font-medium tracking-wide">
        <div className="mt-20 sm:ml-10  py-4 px-2 sm:w-[55%] w-full ">
          <div className="text-4xl  flex gap-1 items-center">
            <div className="">{/* <Logo textColor="text-white"></Logo> */}</div>

            <span className="text-gray-800">
              Lu
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-400">
                en
              </span>
            </span>
          </div>
          {/* <p className="ml-2 flex">Professional Invoices</p> */}

          <div className="sm:text-lg text-md mt-2 tracking-widest px-2">
            <p className="text-gray-800">
              Create professional invoices in seconds — without spreadsheets.
            </p>
            <p className="sm:text-sm text-sm mt-2">
              Built for freelancers and small businesses who want clean,
              client-ready invoices without the hassle.
            </p>

            <div className="text-xs mt-6 flex items-center gap-2 ">
              <button className="rounded-xs hover:shadow-lg shadow-gray-100 hover:border-gray-400 hover:-translate-y-1 duration-300 cursor-pointer hover:text-teal-500 font-normal border-1 p-2 bg-white text-black">
                Contact Sales
              </button>
              <button className="rounded-xs hover:shadow-lg shadow-gray-200 hover:-translate-y-1 duration-300 cursor-pointer hover:text-teal-500 font-normal border-1 p-2 bg-black text-white">
                Try now
              </button>
            </div>
            <div className="flex justify-start gap-2  items-center flex-row  w-full mt-8 text-[8px]">
              <p>© 2025 Invoice-Gen. All rights reserved.</p>
              <p>Privacy Policy</p>
              <p>Terms of Use</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center sm:w-[60%] w-full mt-20">
          <div className="flex  justify-evenly w-full text-xs">
            <div className="flex flex-col gap-4 items-start">
              <p className="cursor-pointer hover:text-gray-500">About</p>{" "}
              <p className="cursor-pointer  hover:text-gray-500">Features</p>{" "}
              <p className="cursor-pointer  hover:text-gray-500">Pricing</p>{" "}
              <p className="cursor-pointer  hover:text-gray-500">Contact</p>{" "}
              <p className="cursor-pointer hover:text-gray-500">Blog</p>{" "}
            </div>
            <div className="flex flex-col gap-4 items-start">
              <p className="cursor-pointer hover:text-gray-500 ">
                Documentation
              </p>{" "}
              <p className="cursor-pointer  hover:text-gray-500">FAQ</p>{" "}
              <p className="cursor-pointer  hover:text-gray-500">Support</p>
            </div>
            <div className="flex flex-col gap-4 items-start">
              <p className="cursor-pointer  hover:text-gray-500">X(Twitter)</p>{" "}
              <p className="cursor-pointer  hover:text-gray-500">LinkedIn</p>{" "}
              <p className="cursor-pointer  hover:text-gray-500">YouTube</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full  flex justify-center items-center p-4 mt-20 cursor-pointer 
              xl:text-[200px]  lg:text-[150px] sm:text-[100px] md:text-[120px] text-[80px] font-bold tracking-widest
                bg-gradient-to-b from-black via-gray-300 to-white
                bg-clip-text text-transparent text-shadow-xl text-shadow-gray-700
                "
      >
        {"Luen"}
      </div>
    </div>
  );
}
