import FAQ from "./component/FAQ";
import Features from "./component/Features";
import Footer from "./component/Footer";
import HeroSection from "./component/HeroSection";
import Nav from "./component/Nav";
import Tick from "./Icons/Tick";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full selection:bg-teal-400 scroll-smooth tracking-wide font-mono">
      <div className=" bg-linear-to-b from-gray-200/20 via-teal-50 to-gray-200/20 flex flex-col items-center scroll-smooth  ">
        <Nav />

        <HeroSection />

<div
  className="
    inline-flex justify-center items-start
    rounded-xl md:p-3 p-2 m-2
    sm:mt-6 mt-10
    bg-teal-400/40
    shadow-lg shadow-emerald-400/30
  "
>
  <img
    src="/dash-Img.png"
    className="md:w-[65vw] w-[97vw] md:h-auto h-[26vh] rounded-lg"
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

        <div className="md:flex md:flex-row flex flex-col justify-center items-center gap-6 mt-20   md:p-8 p-4 md:h-100 h-auto bg-teal-100 w-full  ">
          <div className="font-bold  flex-col md:text-4xl sm:text-3xl text-xl flex items-start justify-center md:mt-30 mt-0 md:p-6 p-2 text-gray-600">
            <p className=" md:text-left text-center leading-12 font-medium  ">
              <span className="md:text-6xl text-5xl">Unlock</span> Your Business
              Potential <span className="md:text-5xl text-3xl">Today!</span>
            </p>

            <p className="  md:mt-6 mt-4 font-light sm:text-lg text-sm ml-2">
              No complexity—just clean, professional invoices.
            </p>
            <Link href={"/signin"}>
              <div className="md:p-3 p-2 flex justify-center items-center bg-black text-white md:text-sm md:mt-4 mt-2 text-sm  rounded-3xl shadow-md shadow-gray-400 cursor-pointer hover:scale-105 transition-all ease-in-out duration-500">
                Get Started
              </div>
            </Link>
          </div>
          {/* <div className="w-[2px] bg-gray-300 h-full"></div> */}
          <div className="md:w-auto w-full  h-auto  ">
            <Features />
          </div>
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
