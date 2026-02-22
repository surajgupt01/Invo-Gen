import FAQ from "./component/FAQ";
import Features from "./component/Features";
import Footer from "./component/Footer";
import HeroSection from "./component/HeroSection";
import Nav from "./component/Nav";
import Tick from "./Icons/Tick";
import Link from "next/link";
import VideoIcon from "./Icons/Video";
import { Descriptions } from "./Elements";
import Image from "next/image";
import Template from "./Icons/Tempelate";
import Docs from "./Icons/Doc";

export default function Home() {
  return (
    <div className="w-full h-full selection:bg-teal-400 scroll-smooth tracking-wide ">
      <div className="  flex flex-col items-center scroll-smooth  ">
        <Nav />

        <HeroSection />

        <div
          className="
    inline-flex justify-center items-start
    rounded-3xl md:p-3 p-2 m-2
    sm:mt-6 mt-10
    bg-gradient-to-b from bg-teal-500/60 via-green-400/80  to-blue-500/60
    shadow-xl shadow-emerald-400/30 hover:shadow-2xl duration-300 ease-in-out cursor-pointer
  "
        >
          <Image
            width={2000}
            height={4000}
            src="/dash-Img.png"
            className="md:w-[65vw] w-[97vw] md:h-auto h-[26vh] rounded-2xl"
            alt="dashboard"
          />
        </div>

        <div className="md:flex flex md:flex-row flex-col  justify-center items-center gap-6 md:mt-20 mt-5  p-8 h-150 w-full ">
          <div className="font-bold flex-col md:text-4xl sm:text-3xl text-xl md:w-[80%] w-full  flex items-center justify-center md:mt-30 mt-15 p-6 text-gray-600">
            <p className="w-full text-left leading-12 h-full font-medium ">
              <span className="md:text-8xl text-4xl">Everything</span> You Need
              to Create{" "}
              <span className="md:text-6xl text-3xl">Professional</span>{" "}
              Invoices
            </p>

            <p className="md:w-150 sm:w-120 w-80 text-left mt-6 font-light sm:text-lg text-sm">
              Our invoice generator provides all the tools you need to create,
              manage, and send professional invoices.
            </p>
          </div>
          <div className="md:w-[2px] bg-gray-300 md:h-full h-[2px] w-full"></div>
          <div className="w-full flex justify-center items-center  h-full ">
            {/* <Features /> */}
          </div>
        </div>

        <div
          id="PriceSection"
          className=" flex-col md:text-4xl md:h-200  sm:text-3xl text-xl w-full flex items-center justify-center mt-10 text-gray-600"
        >
          <p className="w-full text-center font-medium ">
            Pricing that scales with your business
          </p>

          <p className="md:w-150 sm:w-120 w-80 font-medium  text-center mt-6  sm:text-lg text-sm">
            Everything you need to create professional invoices, without
            complexity.
          </p>

          <div className="w-full   md:h-108 h-auto md:flex flex md:flex-row flex-col justify-center items-center p-4 gap-4 mt-8">
            <PayCard
              Category="Free"
              Price="$0"
              mssg="Your current plan"
            ></PayCard>
            <PayCard
              Category="Lite"
              Price="$3"
              mssg="Upgrade to Lite"
            ></PayCard>
            <PayCard Category="Pro" Price="$26" mssg="Upgrade to Pro"></PayCard>
          </div>
        </div>

        <div className="md:flex md:flex-row flex flex-col mt-20  lg:px-35 px-5  h-auto bg-gradient-to-b from-neutral-950 via-gray-950 to-neutral-950 w-full">
          <div className="font-bold border-l border-gray-900 w-full  flex-col md:text-4xl sm:text-3xl text-xl flex items-start justify-center  mt-0  py-6 text-teal-100">
            <p className=" md:text-left text-center leading-12 font-medium  px-2">
              Unlock Your Business Potential Today!
            </p>

            <p className="mt-4 font-light sm:text-lg text-sm ml-2 text-teal-100 px-2">
              No complexity—just clean, professional invoices.
            </p>
            <div className="flex items-center border-b border-gray-900 w-full p-2">
              <Link href={"/signin"}>
                <div
                  className="md:py-3 py-2 px-6 ml-2 flex justify-center items-center active:scale-90  bg-neutral-50 tracking-wide   
                rounded-xs text-black md:text-sm md:mt-4 mt-2 text-sm cursor-pointer transition-all ease-in-out duration-500"
                >
                  Get Started
                </div>
              </Link>
              <div
                className="md:py-3 py-2 px-6 ml-2 flex justify-center gap-1 border-teal-950 hover:border-teal-900 border items-center active:scale-90  bg-neutral-950 tracking-wide   
                rounded-xs text-white md:text-sm md:mt-4 mt-2 text-sm cursor-pointer transition-all ease-in-out duration-500"
              >
                see how it works
                <VideoIcon/>
              </div>
            </div>

            <div
              className=" rounded-xs p-4 w-full h-auto mt-4"

              //             bg-[radial-gradient(#0d9488_0.5px,transparent_0.5px)]
              // [background-size:10px_10px]
            >
              <section className="py-4">
                <div className="max-w-6xl mx-auto">
                  <div className="">
                    <h2 className="text-2xl font-bold text-gray-200">
                      Everything You Need to Invoice Professionally
                    </h2>
                    <p className="text-gray-400 font-light text-sm max-w-2xl">
                      Powerful features designed to simplify your billing
                      workflow.
                    </p>
                  </div>
                </div>
              </section>

              <div className="w-full h-auto   flex justify-center items-center">
                <div className="grid grid-cols-3 gap-2 lg:w-[50%] w-full">
                  <div className="col-span-2 bg-teal-800 h-50  flex-col">
                    <div
                      className="w-full h-full  bg-white flex-col gap-2 flex justify-center items-start p-4 text-gray-700 text-[16px]  
                       border border-white/20 transition duration-300 
                     "
                    >
                      <span className="text-black text-2xl">
                        {Descriptions[0].title}
                      </span>
                      <span className="text-[8px] font-light text-left">
                        {Descriptions[0].desc}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 bg-indigo-800 h-50 ">
                    <div
                      className="w-full h-full  flex-col gap-2 flex justify-center items-start lg:p-4 p-1 text-gray-700 text-[16px]  
                       transition duration-300 
                     "
                    >
                      <span className="text-indigo-300 lg:text-2xl text-xl">
                        {Descriptions[1].title}
                      </span>
                      <span className="lg:text-[10px] text-[8px] text-indigo-400  font-light text-left">
                        {Descriptions[1].desc}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-3 row-span-3 bg-emerald-950 h-60 w-auto">
                    <div className="grid md:grid-cols-2 gap-8 p-2 h-full">
                      {/* LEFT SIDE - Text */}
                      <div className="flex-col flex justify-center items-center">
                        <h3 className="text-green-100 text-2xl">
                          Smart Dashboard Insights
                        </h3>
                        <p className="text-emerald-200/80 text-[10px] mt-4 font-normal">
                          Track revenue, monitor payment status, and gain
                          real-time clarity.
                        </p>
                      </div>

                      {/* RIGHT SIDE - Graphs */}
                      <div className="bg-black/30 rounded-xs p-6 backdrop-blur-xl">
                        {/* Your charts here */}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1  bg-blue-800 h-40 ">
                    <div
                      className="w-full h-full  flex-col gap-2 flex justify-center items-start lg:p-4 p-1 text-gray-700 text-[16px]  
                       transition duration-300 
                     "
                    >
                      <span className="text-white lg:text-2xl text-lg">
                        {Descriptions[2].title}
                      </span>
                      <span className="lg:text-[10px] text-[7px] text-gray-300 font-light text-left">
                        {Descriptions[2].desc}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 row-span-3 bg-sky-950 h-40 w-auto">
                    <div className="col-span-1  bg-fuchsia-800 h-40 ">
                      <div
                        className="w-full h-full  flex-col gap-2 flex justify-center items-start p-4 text-gray-700 text-[16px]  
                       transition duration-300 
                     "
                      >
                        <span className="text-fuchsia-200 text-2xl">
                          {Descriptions[3].title}
                        </span>
                        <span className="text-[10px] text-fuchsia-300 font-light text-left">
                          {Descriptions[3].desc}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="w-[2px] bg-gray-300 h-full"></div> */}
          {/* <div className="md:w-auto w-full  h-auto  ">
            <Features />
          </div> */}
        </div>

        <FAQ />
      </div>

      <Footer />
    </div>
  );
}

function PayCard({
  Category,
  Price,
  mssg,
}: {
  Category: string;
  Price: string;
  mssg: string;
}) {
  const FreeFeatures = [
    "Create unlimited invoices.",
    " Download invoices as PDF",
    "Auto-calculate totals & tax",
    " Multi-currency support",
    "Clean, professional template",
    "Data stays in your browser",
  ];

  const LiteFeatures = [
    " Everything in Free",
    "Save clients & products",
    "Invoice history & re-download",
    "Edit past invoices",
    "Faster invoice creation",
    "Email-ready PDF export",
  ];

  const ProFeatures = [
    "Everything in Lite",
    "Upload business logo",
    "Custom brand colors",
    "Advanced tax / GST configuration",
    " Remove watermark",
    " Priority feature updates",
  ];
  return (
    <div
      className={` ${
        Category == "Lite" ? "h-full" : "h-auto"
      } w-65 rounded-lg p-6 cursor-pointer shadow-xl shadow-gray-200 hover:scale-105 duration-300 ease-in-out`}
    >
      <div className="font-bold text-2xl">{Category}</div>
      <div className="font-light text-gray-500">
        {Category == "Free" &&
          FreeFeatures.map((e: string, index: number) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs font-light mt-2 leading-5"
            >
              <Tick />
              {e}
            </span>
          ))}
        {Category == "Lite" &&
          LiteFeatures.map((e: string, index: number) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs leading-6 font-light mt-2"
            >
              <Tick />
              {e}
            </span>
          ))}
        {Category == "Pro" &&
          ProFeatures.map((e: string, index: number) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs font-light mt-2 leading-5"
            >
              <Tick />
              {e}
            </span>
          ))}
      </div>
      <div className="mt-2">
        <span className="text-3xl">
          {Price}
          <span className="text-sm font-light">
            {Category == "Pro" ? `/year` : `/month`}
          </span>
        </span>
        <div className="w-full mt-2">
          <button
            className={`p-2 flex mt-4 items-center justify-center rounded-full w-full ${
              Category == "Free"
                ? "bg-gray-300 text-gray-800"
                : "bg-black text-gray-300"
            } cursor-pointer hover:text-teal-600  text-sm font-normal hover:scale-105 ease-in-out duration-500`}
          >
            {mssg}
          </button>
        </div>
      </div>
    </div>
  );
}
