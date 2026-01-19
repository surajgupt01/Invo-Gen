

export default function Footer() {
  return (
    <div className=" top-full w-full bg-black min-h-100 text-gray-500 text-sm p-8 flex sm:flex-col flex-col justify-between font-medium tracking-wide">
      <div className="mt-20 sm:ml-10  p-4 sm:w-[55%] w-full ">
        <div className="text-4xl  flex gap-1 items-center">
          <div className="scale-110">
            {/* <Logo textColor="text-white"></Logo> */}
          </div>
          <span className="text-white">Ledg
            
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-400">erly</span>

          </span>
        </div>
        {/* <p className="ml-2 flex">Professional Invoices</p> */}

        <div className="sm:text-2xl text-xl  mt-4 tracking-wide font-mono">
          <p className="text-gray-400">Create professional invoices in seconds — without spreadsheets.</p>
          <p className="sm:text-xl text-lg mt-2">Built for freelancers and small businesses who want clean,
          client-ready invoices without the hassle.</p>
          
          <div className="text-xs mt-6 flex items-center gap-2 ">
            <button className="rounded-xs hover:shadow-lg shadow-gray-900 hover:-translate-y-1 duration-300 cursor-pointer hover:text-teal-500 font-normal border-1 p-2 bg-white text-black">Contact Sales</button>
            <button className="rounded-xs hover:shadow-lg shadow-gray-900 hover:-translate-y-1 duration-500 cursor-pointer hover:text-teal-500 font-normal border-1 p-2 bg-black text-white">Try now</button>
          </div>
        </div>

      </div>

      <div className="flex flex-col items-center sm:w-[100%] w-full mt-20">
        <div className="flex  justify-evenly w-[85%]">
          <div className="flex flex-col gap-2">
            <p className="cursor-pointer hover:text-gray-300 m-2">About</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">Features</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">Pricing</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">Contact</p>{" "}
            <p className="cursor-pointer hover:text-gray-300 m-2">Blog</p>{" "}
          </div>
          <div  className="flex flex-col gap-2">
            <p className="cursor-pointer hover:text-gray-300 m-2">
              Documentation
            </p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">FAQ</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">Support</p>
          </div>
          <div  className="flex flex-col gap-2">
            <p className="cursor-pointer m-2 hover:text-gray-300">X(Twitter)</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">LinkedIn</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">YouTube</p>
          </div>
        </div>
        <div className="flex justify-center items-center sm:flex-row flex-col  sm:justify-evenly sm:w-[70%] w-full mt-16 text-xs">
          <p>© 2025 Invoice-Gen. All rights reserved.</p>
          <p>Privacy Policy</p>
          <p>Terms of Use</p>
        </div>
      </div>
    </div>
  );
}
