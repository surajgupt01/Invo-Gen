"use client";

import React, { useState } from "react";
import { useCustomerStore } from "@/app/store/CustomerDetail";
import List from "@/app/Icons/List";
import OpenArrow from "@/app/Icons/OpenArrow";
import AddInfo from "@/app/Icons/AddInfo";
import Info from "@/app/Icons/Info";
import Preview from "@/app/component/Preview";
import { useOptionalData } from "@/app/store/OptionalDataStore";
import { useOwner } from "@/app/store/OwnerDetail";
import QR from "@/app/Icons/QR";
import Image from "next/image";
import ImageAlt from "@/app/Icons/Img";
import SeePassword from "@/app/Icons/SeePassword";
import Docs from "@/app/Icons/Doc";
import Both from "@/app/Icons/Both";
import ItemsTable from "./Table";

function fileToBase64(file: globalThis.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("Failed to convert file");
      }
    };

    reader.onerror = reject;

    reader.readAsDataURL(file as Blob);
  });
}

export default function CreateInvoice() {
  const [dispaly, setDisplay] = useState("Form");

  return (
    <div className="flex flex-col h-full w-full bg-[#FAFAFA] border-zinc-200 rounded-sm transition-all duration-500 ease-in-out font-mono">
      {/* Top View Mode Switcher Header */}
      <div className="bg-white border-b border-zinc-200 inset-0 p-2 px-6 flex justify-center items-center shrink-0">
        <div className="bg-zinc-100 lg:w-62 w-44 py-1 px-1 gap-1.5 flex justify-center items-center rounded-md border border-zinc-200/60">
          <button
            onClick={() => setDisplay("Form")}
            className={`text-zinc-500 text-xs flex hover:text-zinc-900 duration-200 ease-in-out cursor-pointer px-2.5 py-1 rounded-md ${
              dispaly === "Form"
                ? "bg-white shadow-xs text-zinc-900 font-semibold border border-zinc-200/80"
                : ""
            } lg:flex justify-center items-center gap-1.5`}
          >
            <Docs />
            Form
          </button>
          <button
            onClick={() => setDisplay("Both")}
            className={`text-zinc-500 text-xs flex hover:text-zinc-900 duration-200 ease-in-out cursor-pointer px-2.5 py-1 rounded-md ${
              dispaly === "Both"
                ? "bg-white shadow-xs text-zinc-900 font-semibold border border-zinc-200/80"
                : ""
            } hidden lg:flex justify-center items-center gap-1.5`}
          >
            <Both />
            Both
          </button>
          <button
            onClick={() => setDisplay("Preview")}
            className={`text-zinc-500 text-xs flex hover:text-zinc-900 duration-200 ease-in-out cursor-pointer px-2.5 py-1 rounded-md ${
              dispaly === "Preview"
                ? "bg-white shadow-xs text-zinc-900 font-semibold border border-zinc-200/80"
                : ""
            } lg:flex justify-center items-center gap-1.5`}
          >
            <SeePassword />
            Preview
          </button>
        </div>
      </div>

      {/* Dynamic Main Body Display Modes */}
      {dispaly === "Both" && (
        <div className="lg:flex-row flex flex-col overflow-auto w-full relative gap-3 p-3 transition-all duration-500 ease-in-out flex-1 min-h-0">
          <div className="flex-1 min-w-0 overflow-auto custom-scrollbar duration-300 ease-in-out">
            <FormComponent />
          </div>

          <div className="flex-1 min-w-0 overflow-hidden duration-300 ease-in-out bg-white border border-zinc-200/80 rounded-sm">
            <Preview />
          </div>
        </div>
      )}

      {dispaly === "Form" && (
        <div className="flex-1 min-w-0 overflow-auto custom-scrollbar duration-300 ease-in-out p-3">
          <FormComponent />
        </div>
      )}

      {dispaly === "Preview" && (
        <div className="flex-1 min-w-0 overflow-hidden duration-300 ease-in-out p-3">
          <div className="h-full bg-white border border-zinc-200/80 rounded-sm p-2">
            <Preview />
          </div>
        </div>
      )}
    </div>
  );
}

function FormComponent() {
  const [expand, setExpand] = useState(false);

  const { DetailHandler, Details } = useCustomerStore();
  const { OwnerDetailHandler, OwnerDetails } = useOwner();

  interface Owner {
    CompanyName: string;
    CompanyAddress: string;
    TaxDetail: string;
    CompanyMail: string;
    OwnerName: string;
    PhNo: string;
    AccountNumber: string;
    BankName: string;
    BankCode: string;
    BankAddress: string;
  }

  interface OwnerField {
    label: string;
    name: keyof Owner;
    placeholder: string;
  }

  const OwnerField: OwnerField[] = [
    {
      label: "Company Name",
      name: "CompanyName",
      placeholder: "Company name",
    },
    {
      label: "Company Address",
      name: "CompanyAddress",
      placeholder: "Company Address",
    },
    {
      label: "Tax Details",
      name: "TaxDetail",
      placeholder: "Tax Details eg : GSTIN - ",
    },
    {
      label: "Company Mail",
      name: "CompanyMail",
      placeholder: "Company Mail",
    },
  ];

  type CustomerDetails = {
    CustomerName: string;
    CustomerAddress: string;
    DueDate: string;
    IssueDate: string;
    InvoiceNo: string;
    Currency: string;
    Subject: string;
  };

  interface Field {
    label: string;
    name: keyof CustomerDetails;
    type?: string;
    placeholder?: string;
  }

  const fields: Field[] = [
    {
      label: "Customer Name",
      name: "CustomerName",
      placeholder: "Customer name",
    },
    {
      label: "Customer Address",
      name: "CustomerAddress",
      placeholder: "customer address",
    },
    { label: "Subject", name: "Subject", placeholder: "subject", type: "text" },
    {
      label: "Invoice#",
      name: "InvoiceNo",
      placeholder: "Invoice serial no. eg:- INV-XXXX",
      type: "number",
    },
    { label: "Due Date", name: "DueDate", type: "date" },
    { label: "Issue Date", name: "IssueDate", type: "date" },
  ];

  const [logo, setLogo] = useState("");

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);

    setLogo(base64);
    OwnerDetailHandler("companyLogo", base64);
  };

  return (
    <div className="w-full scroll-smooth">
      <form
        className="w-full space-y-3 px-1"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Organization's Detail Card */}
        <div className="p-5 rounded-xs bg-white border border-zinc-200/80 shadow-xs">
          <h1 className="text-xs font-semibold uppercase tracking-wider mb-3 text-zinc-800">
           {` Organization's Detail`}
          </h1>
          <div className="grid grid-cols-2 gap-3.5 w-full">
            <label htmlFor="logo" className="col-span-2">
              <div className="w-full border border-dashed border-zinc-300 rounded-sm group col-span-2 flex-1 px-4 py-6 cursor-pointer bg-zinc-50/50 hover:bg-zinc-100/50 transition flex flex-col gap-2 items-center justify-center">
                <input
                  id="logo"
                  type="file"
                  className="hidden"
                  onChange={handleLogo}
                />

                <label htmlFor="logo" className="cursor-pointer">
                  <div className="rounded-xs flex justify-center items-center">
                    {logo !== "" ? (
                      <Image
                        alt="Company Logo"
                        src={logo}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    ) : (
                      <ImageAlt />
                    )}
                  </div>
                </label>
                <p className="text-zinc-500 whitespace-pre-line text-center text-xs">
                  {`Drag and drop your saved company's logo \nhere, or `}
                  <span className="text-teal-700 font-semibold">
                    browse your file
                  </span>
                </p>
              </div>
            </label>

            {OwnerField.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-zinc-600 tracking-wide text-xs">
                  {f.label}
                </div>

                <input
                  className="border border-zinc-200 bg-white px-3 py-2 rounded-xs text-zinc-800 text-xs hover:border-zinc-400 focus:outline-teal-700 w-full transition"
                  name={f.name}
                  placeholder={f.placeholder}
                  value={OwnerDetails[f.name]}
                  type="text"
                  onChange={(e) => {
                    OwnerDetailHandler(f.name, e.currentTarget.value);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Customer's Detail Card */}
        <div className="p-5 rounded-xs bg-white border border-zinc-200/80 shadow-xs">
          <h1 className="text-xs font-semibold uppercase tracking-wider mb-3 text-zinc-800">
          {`  Customer's Detail`}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
            {fields.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-zinc-600 tracking-wide text-xs">
                  {f.label}
                </div>

                <input
                  className="border border-zinc-200 bg-white px-3 py-2 rounded-xs w-full text-zinc-800 text-xs hover:border-zinc-400 focus:outline-teal-700 transition"
                  name={f.name}
                  placeholder={f.placeholder}
                  type={f.type || "text"}
                  value={Details[f.name]}
                  onChange={(e) => {
                    DetailHandler(f.name, e.currentTarget.value);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Collapsible Items Table Section */}
        <div
          className={`${
            expand ? "max-h-170 overflow-auto" : "max-h-12 overflow-hidden"
          } cursor-pointer duration-500 ease-in-out custom-scrollbar border text-xs font-bold px-2 bg-white border-zinc-200/80 shadow-xs py-1 rounded-xs transition-all`}
        >
          <div
            className="flex items-center duration-300 ease-in-out justify-between group p-2.5 text-zinc-700"
            onClick={() => {
              setExpand(!expand);
            }}
          >
            <div className="flex items-center gap-2">
              <List />
              <span>Items Table</span>
            </div>
            <div
              className={`${
                expand ? "rotate-180" : ""
              } duration-500 ease-in-out transition-all text-zinc-500 group-hover:text-zinc-900`}
            >
              <OpenArrow />
            </div>
          </div>

          <div
            className={`rounded-lg py-3 transition-opacity duration-500 ease-in-out ${
              expand ? "translate-y-0" : "pointer-events-none opacity-0"
            }`}
          >
            <ItemsTable />
          </div>
        </div>

        {/* Payment Options Section */}
        <PaymentOptions />

        {/* Additional Information Section */}
        <InfoParent />
      </form>
    </div>
  );
}

interface AddInfoProps {
  Title: string;
  Message: string;
  Placeholder: string;
}

function InfoParent() {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-xs text-xs font-bold px-3 py-4 shadow-xs duration-500 ease-in-out transition-all">
      <div className="flex items-center gap-1.5 pb-2 text-zinc-800 border-b border-zinc-100">
        <AddInfo />
        <span className="tracking-wide text-xs font-semibold uppercase">
          Additional Information
        </span>
      </div>

      <AddInfoComponent
        Title="Additional Information"
        Placeholder="Note - Add a message or special instructions for your customer"
        Message="Additional notes for the invoice"
      />
      <AddInfoComponent
        Title="Terms"
        Placeholder="Terms & Conditions - Enter payment terms, late fees, or other conditions"
        Message="Terms & Conditions for the invoice"
      />
    </div>
  );
}

function AddInfoComponent({ Title, Message, Placeholder }: AddInfoProps) {
  const { HandleInfo, HandleTerms } = useOptionalData();

  return (
    <div className="px-1 py-1 font-normal mt-2.5">
      <div className="flex items-center gap-2">
        <span className="text-zinc-600 font-medium text-xs">{Title}</span>
        <span className="bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-xs px-1.5 py-0.5 text-[8px] uppercase tracking-wide">
          Optional
        </span>
      </div>
      <textarea
        name="note"
        className="bg-white text-zinc-800 focus:outline-teal-700 border border-zinc-200 w-full h-24 resize-none p-2.5 mt-1.5 rounded-xs text-xs transition"
        placeholder={Placeholder}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (Title === "Terms") HandleTerms(e.currentTarget.value);
          else HandleInfo(e.currentTarget.value);
        }}
      />
      <div className="flex items-center text-xs gap-1 mt-1 text-zinc-400">
        <Info />
        <span className="text-zinc-500 text-[10px]">{Message}</span>
      </div>
    </div>
  );
}

function PaymentOptions() {
  interface Owner {
    CompanyName: string;
    CompanyAddress: string;
    TaxDetail: string;
    CompanyMail: string;
    OwnerName: string;
    PhNo: string;
    AccountNumber: string;
    BankName: string;
    BankCode: string;
    BankAddress: string;
  }

  interface OwnerField {
    label: string;
    name: keyof Owner;
    placeholder: string;
  }

  const OwnerField: OwnerField[] = [
    {
      label: "Owner Name",
      name: "OwnerName",
      placeholder: "owner name",
    },
    {
      label: "Phone Number",
      name: "PhNo",
      placeholder: "phone number",
    },
    {
      label: "Bank Name",
      name: "BankName",
      placeholder: "Bank Name",
    },
    {
      label: "Account Number",
      name: "AccountNumber",
      placeholder: "Account Number",
    },
    {
      label: "Bank Address",
      name: "BankAddress",
      placeholder: "Bank Address",
    },
    {
      label: "Bank Code",
      name: "BankCode",
      placeholder: "Bank Code eg : IFSC code",
    },
  ];

  const [option, setOption] = useState("UPI");
  const [url, setUrl] = useState("");

  const { OwnerDetailHandler, OwnerDetails } = useOwner();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setUrl(base64);
    OwnerDetailHandler("QR", base64);
  };

  return (
    <div className="bg-white border border-zinc-200/80 text-xs font-bold px-3 py-4 shadow-xs rounded-xs duration-500 ease-in-out transition-all">
      <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-100">
        <span className="text-zinc-800 tracking-wide font-semibold text-xs uppercase">
          Payment Options
        </span>
      </div>

      <div className="h-full w-full mt-2">
        <div className="p-1 w-full h-auto flex justify-between items-center gap-2 bg-zinc-100 border border-zinc-200/60 rounded-xs">
          <button
            className={`w-full flex justify-center cursor-pointer p-1.5 duration-200 ease-in-out text-xs font-medium rounded-xs ${
              option === "Bank"
                ? "bg-white text-zinc-900 shadow-2xs border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
            onClick={() => {
              setOption("Bank");
              OwnerDetailHandler("paymentMethod", "Bank");
            }}
          >
            Bank Transfer
          </button>
          <button
            className={`w-full flex justify-center cursor-pointer p-1.5 duration-200 ease-in-out text-xs font-medium rounded-xs ${
              option === "UPI"
                ? "bg-white text-zinc-900 shadow-2xs border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
            onClick={() => {
              setOption("UPI");
              OwnerDetailHandler("paymentMethod", "UPI");
            }}
          >
            UPI
          </button>
        </div>
      </div>

      {option === "UPI" && (
        <div className="mt-3">
          <label htmlFor="QR" className="block">
            <div className="w-full min-h-60 group border border-dashed border-zinc-300 rounded-sm p-4 flex-1 cursor-pointer bg-zinc-50/50 hover:bg-zinc-100/50 transition flex flex-col gap-2 items-center justify-center">
              <input
                id="QR"
                type="file"
                className="hidden"
                onChange={handleChange}
              />

              <label htmlFor="QR" className="cursor-pointer">
                <div className="rounded-xs flex justify-center items-center">
                  {url !== "" ? (
                    <Image
                      alt="QR Code"
                      src={url}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  ) : (
                    <QR />
                  )}
                </div>
              </label>

              <p className="text-zinc-500 whitespace-pre-line text-center text-xs font-normal">
                {`Drag and drop your saved QR image \nhere, or `}
                <span className="text-teal-700 font-semibold">
                  browse your file
                </span>
              </p>

              <input
                className="border border-zinc-200 rounded-xs px-3 py-2 w-64 text-zinc-800 font-normal tracking-wide bg-white outline-none focus:border-teal-700 text-xs transition mt-1"
                placeholder="UPI-ID (e.g. name@upi)"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  OwnerDetailHandler("UPIID", e.currentTarget.value);
                }}
              />
            </div>
          </label>
        </div>
      )}

      {option === "Bank" && (
        <div className="bg-white w-full h-full min-h-60 p-2 mt-2 duration-300 ease-in-out flex justify-center items-center">
          <div className="grid grid-cols-2 gap-3.5 w-full">
            {OwnerField.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-zinc-600 tracking-wide text-xs font-normal">
                  {f.label}
                </div>

                <input
                  className="border border-zinc-200 bg-white px-3 py-2 rounded-xs text-zinc-800 font-normal text-xs hover:border-zinc-400 focus:outline-teal-700 w-full transition"
                  name={f.name}
                  placeholder={f.placeholder}
                  value={OwnerDetails[f.name]}
                  type="text"
                  onChange={(e) => {
                    OwnerDetailHandler(f.name, e.currentTarget.value);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}