export default function Footer() {
  return (
    <div className=" w-full bg-black min-h-100 text-gray-500 text-sm p-0">
      <div className="  flex sm:flex-row flex-col justify-between font-medium tracking-wide">
        <div className="mt-20 sm:ml-10  py-4 px-2 sm:w-[55%] w-full ">
          <div className="text-4xl  flex gap-1 items-center">
            <div className="">{/* <Logo textColor="text-white"></Logo> */}</div>
            <span className="text-white">
              Ledg
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-400">
                erly
              </span>
            </span>
          </div>
          {/* <p className="ml-2 flex">Professional Invoices</p> */}

          <div className="sm:text-lg text-md  mt-4 tracking-widest px-2">
            <p className="text-gray-400">
              Create professional invoices in seconds — without spreadsheets.
            </p>
            <p className="sm:text-sm text-sm mt-2">
              Built for freelancers and small businesses who want clean,
              client-ready invoices without the hassle.
            </p>

            <div className="text-xs mt-6 flex items-center gap-2 ">
              <button className="rounded-xs hover:shadow-lg shadow-gray-900 hover:-translate-y-1 duration-300 cursor-pointer hover:text-teal-500 font-normal border-1 p-2 bg-white text-black">
                Contact Sales
              </button>
              <button className="rounded-xs hover:shadow-lg shadow-gray-900 hover:-translate-y-1 duration-500 cursor-pointer hover:text-teal-500 font-normal border-1 p-2 bg-black text-white">
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
              <p className="cursor-pointer hover:text-gray-300">About</p>{" "}
              <p className="cursor-pointer  hover:text-gray-300">Features</p>{" "}
              <p className="cursor-pointer  hover:text-gray-300">Pricing</p>{" "}
              <p className="cursor-pointer  hover:text-gray-300">Contact</p>{" "}
              <p className="cursor-pointer hover:text-gray-300">Blog</p>{" "}
            </div>
            <div className="flex flex-col gap-4 items-start">
              <p className="cursor-pointer hover:text-gray-300 ">
                Documentation
              </p>{" "}
              <p className="cursor-pointer  hover:text-gray-300">FAQ</p>{" "}
              <p className="cursor-pointer  hover:text-gray-300">Support</p>
            </div>
            <div className="flex flex-col gap-4 items-start">
              <p className="cursor-pointer  hover:text-gray-300">X(Twitter)</p>{" "}
              <p className="cursor-pointer  hover:text-gray-300">LinkedIn</p>{" "}
              <p className="cursor-pointer  hover:text-gray-300">YouTube</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full  flex justify-center items-center p-4 mt-20 cursor-pointer 
              xl:text-[200px]  lg:text-[150px] sm:text-[100px] md:text-[120px] text-[80px] font-bold tracking-widest
                bg-gradient-to-b from-gray-800 via-gray-800 to-black
                bg-clip-text text-transparent 
                drop-shadow-[0_5px_15px_rgba(0,0,0,0.15)]"
      >
        Ledgerly
      </div>
    </div>
  );
}
