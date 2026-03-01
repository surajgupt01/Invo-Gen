"use client";

import { useState } from "react";
import Tick from "../Icons/Tick";

export default function PaymentOptions() {
  const [billingOption, setOption] = useState("month");
  return (
    <div
      id="PriceSection"
      className=" flex-col md:text-4xl md:h-auto  sm:text-3xl text-xl w-full flex items-center justify-center mt-30 text-gray-600"
    >
      <p className="w-full text-center font-medium text-gray-800">
        Pricing that scales with your business
      </p>

      <p className="md:w-150 sm:w-120 w-80 font-medium tracking-wider  text-center mt-6  sm:text-lg text-sm">
        Everything you need to create professional invoices, without complexity.
      </p>

      <div className="w-full p-2">
        <div className="w-full rounded-full  flex justify-center items-center mt-10">
          <div className="w-70 relative rounded-full h-9 flex items-center text-xs border border-gray-300">
            {/* Month */}
            <div
              onClick={() => {
                if (billingOption !== "month") setOption("month");
              }}
              className={`w-1/2  h-full rounded-full z-30 flex justify-center items-center cursor-pointer ${billingOption=='month' && 'text-white'}`}
            >
              Monthly
            </div>

            {/* Year */}
            <div
              onClick={() => {
                if (billingOption !== "year") setOption("year");
              }}
              className={`w-1/2 z-30  h-full rounded-full flex justify-center gap-1 p-1 items-center cursor-pointer ${billingOption=='year' && 'text-white'}`}
            >
              Yearly <span className="text-blue-400 text-[8px] font-semibold">{"— 2 months free"}</span>
            </div>

            {/* Sliding Background */}
            <div
              className={`absolute bg-black  w-1/2 h-full rounded-full 
    transition-all duration-300 ease-in-out
    ${billingOption === "year" ? "translate-x-full" : "translate-x-0"}`}
            />
          </div>
        </div>
        <div className="w-full flex flex-row h-auto justify-center  my-4 p-2">
        <div className="lg:w-[90%]   h-auto  grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2 ">
          <PayCard
            Category="Free"
            mPrice="$0"
            yPrice="$0"
            mssg="Your current plan"
            option={billingOption}
          ></PayCard>
          <PayCard Category="Lite" mPrice="$5" yPrice="$49" mssg="Upgrade to Lite" option={billingOption}></PayCard>
          <PayCard Category="Pro" mPrice="$12" yPrice="$99" mssg="Upgrade to Pro" option={billingOption}></PayCard>
          <PayCard
            Category="Enterprise"
            mPrice="Launching Soon"
            yPrice="Launching Soon"
            mssg="Join Waitlist"
            option={billingOption}
          ></PayCard>
        </div>
        </div>
      </div>
    </div>
  );
}
function PayCard({
  Category,
  mPrice,
  yPrice,
  mssg,
  option
}: {
  Category: string;
  mPrice: string;
  yPrice?: string;
  mssg: string;
  option: string;
}) {
  const FreeFeatures = [
    "Create up to 5 invoices per month",
    "Download invoice as PDF",
    "Auto-calculate subtotal, tax & total",
    "Multi-currency support (USD, GBP, EUR, INR)",
    "1 clean professional template",
    "Basic client details (name, email, address)",
    "InvoiceFlow watermark on PDF",
    "No signup required",
    "Data stored locally in browser",
  ];

  const LiteFeatures = [
    "Everything in Free",
    "Secure cloud account & login",
    "Unlimited invoice creation",
    "Invoice history (last 15 invoices stored)",
    "Edit & duplicate invoices",
    "Save client profiles",
    "Auto invoice numbering (INV-001, INV-002)",
    "Manual mark as paid",
    "Email-ready PDF export",
  ];

  const ProFeatures = [
    "Everything in Lite",
    "Remove InvoiceFlow watermark",
    "Upload business logo",
    "Custom brand colors",
    "3 premium invoice templates",
    "Advanced GST configuration",
    "Multi-currency support",
    "Invoice due date reminders",
    "Client portal (view invoice online)",
    "Basic revenue dashboard",
    "Priority email support",
  ];

  const BusinessFeatures = [
    "Everything in Pro",
    "Stripe Connect (one-click payments)",
    "Razorpay Connect (UPI / Card support)",
    "Auto-mark invoice as paid",
    "Webhook payment tracking",
    "Full live analytics dashboard",
    "Revenue by currency",
    "Outstanding payment tracker",
    "Payment method breakdown",
    "Automated payment reminders",
    "Dedicated onboarding support",
  ];
  return (
    <div
      className={`w-80 text-xs h-130 rounded-xs p-6 cursor-pointer border hover:border-gray-300 ${Category === "Pro" && "bg-gradient-to-br from-emerald-600 via-emerald-950 to-green-600"} ${Category === "Lite" && "bg-gradient-to-br from-orange-300 via-orange-500 to-amber-300"} ${Category == "Enterprise" && "bg-gradient-to-br from-[#c1446c] via-[#4c1d2f] to-[#e73c3c]"}  hover:scale-101 duration-300 ease-in-out`}
    >
      <div
        className={`font-bold text-2xl flex justify-between ${Category == "Free" && "text-gray-700"} ${Category == "Enterprise" && "text-[#250b15] tracking-wide text-shadow-2xs text-shadow-[#9e2e59]"} ${Category == "Pro" && "text-emerald-950"} ${Category == "Lite" && "text-orange-950"}`}
      >
        {Category}
        {Category=='Pro' && <span className="text-xs font-normal text-white animate-pulse">{"⭐ Most Popular"}</span>}
      </div>
      <div className="my-4">
        <span
          className={`text-3xl text-gray-50 ${Category == "Free" && "text-gray-700"}`}
        >
          {option=='month'? mPrice : yPrice}
          {Category!='Enterprise'&&<span className="text-sm font-light">
            {option == "year" ? `/year` : `/month`}
          </span>}
        </span>
        <div className="">
          <button
            className={`p-2 flex mt-4 items-center justify-center  border border-gray-300  hover:bg-black hover:text-gray-100  text-gray-200 ${
              Category == "Free" && "hover:border-gray-400 text-gray-800"
            }
                ${Category == "Enterprise" && "text-gray-300"}
                cursor-pointer  text-sm font-normal ease-in-out duration-200`}
          >
            {mssg}
          </button>
        </div>
      </div>
      <div className="font-light">
        {Category == "Free" &&
          FreeFeatures.map((e: string, index: number) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs font-light mt-2 leading-5 text-gray-400"
            >
              <Tick />
              {e}
            </span>
          ))}
        {Category == "Lite" &&
          LiteFeatures.map((e: string, index: number) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs leading-6 font-light mt-2 text-gray-100"
            >
              <Tick />
              {e}
            </span>
          ))}
        {Category == "Pro" &&
          ProFeatures.map((e: string, index: number) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs font-light mt-2 leading-5 text-gray-100"
            >
              <Tick />
              {e}
            </span>
          ))}
        {Category == "Enterprise" &&
          BusinessFeatures.map((e: string, index: number) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs font-light mt-2 leading-5 text-gray-100"
            >
              <Tick />
              {e}
            </span>
          ))}
      </div>
    </div>
  );
}
