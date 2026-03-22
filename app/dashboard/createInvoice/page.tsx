"use client";

import { useEffect, useState } from "react";
import { ItemsStore } from "@/app/store/InvoiceTabel";
import { useCustomerStore } from "@/app/store/CustomerDetail";
import CurrencySelect from "@/app/component/Currecny";
import List from "@/app/Icons/List";
import OpenArrow from "@/app/Icons/OpenArrow";
import Bin from "@/app/Icons/Bin";
import Add from "@/app/Icons/Add";
import AddInfo from "@/app/Icons/AddInfo";
import Info from "@/app/Icons/Info";
import Preview from "@/app/component/Preview";
import { useOptionalData } from "@/app/store/OptionalDataStore";
import { useOwner } from "@/app/store/OwnerDetail";
import QR from "@/app/Icons/QR";



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

  // const [dispaly , setDisplay] = useState(false)
  // const [expand , setExpan]  = useState(false)
  return (
    <div className="lg:flex-row flex flex-col h-full w-full relative gap-2  border-neutral-900 rounded-sm p-2 transition-all duration-500 ease-in-out">
      
   
      <div className="flex-1 min-w-0 overflow-auto custom-scrollbar duration-300 ease-in-out">
        <FormComponent />
      </div>

      <div className="flex-1 min-w-0 overflow-hidden duration-300 ease-in-out">
        <Preview />
      </div>

    </div>
  );
}
function FormComponent() {
  const [expand, setExpand] = useState(false);

  const { Items, changeHandler, addRow, delRow, Total, subTotal, TaxHandler } =
    ItemsStore();

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

  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    DetailHandler("Currency", currency);
  }, [currency]);

  // function getData(form : ) {
  //   const data = new FormData(form);
  //   console.log(Object.fromEntries(data.entries()));
  // }


  const [logo, setLogo] = useState("");

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file); // ✅ works now

    setLogo(base64); // ✅ use base64
    OwnerDetailHandler("companyLogo", base64); // ✅ send base64
  };
  return (
    <div className="w-full scroll-smooth">
      <form
        className="w-full  space-y-4  "
        onSubmit={(e) => {
          e.preventDefault();
          // getData(e.currentTarget);
        }}
      >
        <div className="   p-3 rounded-xs bg-neutral-950 shadow-xs ">
          <h1 className="text-sm font-semibold mt-2 mb-4 text-gray-400 tracking-wide">
            {"Organization's Detail"}
          </h1>
          <div className="grid grid-cols-2 gap-4 w-full">
            <label htmlFor="logo" className="col-span-2">
              <div className="w-full  group col-span-2 flex-1  cursor-pointer  bg-neutral-950 flex flex-col gap-2 items-center justify-center">
                <input
                  id="logo"
                  type="file"
                  placeholder=""
                  className="z-200 top-10 cursor-pointer   border hidden border-white bg-transparent"
                  onChange={handleLogo}
                ></input>

                <label htmlFor="logo">
                  <div className=" rounded-xs flex  justify-center items-center cursor-pointer">
                    {logo != "" ? (
                      <Image
                        alt="QR"
                        src={logo}
                        width={140}
                        height={140}
                      ></Image>
                    ) : (
                      <ImageAlt />
                    )}
                  </div>
                </label>
                <p className="text-neutral-700 whitespace-pre-line text-center text-xs">
                  {" "}
                  {`drag and drop your saved company's logo \n here, or browse your file`}{" "}
                </p>
              </div>
            </label>
            {OwnerField.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-neutral-300 tracking-wide text-xs">
                  {f.label}
                </div>

                <input
                  className="border border-neutral-800 bg-neutral-900 px-4 py-3 rounded-xs text-gray-400 text-xs hover:border-teal-400 focus:outline-teal-700 w-full"
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
        <div className="p-2 rounded-sm shadow-xs bg-neutral-950 ">
          <h1 className="text-sm font-semibold mt-2 mb-4 text-gray-400">
            {"Customer's Detail"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {fields.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-neutral-300 tracking-wide text-xs">
                  {f.label}
                </div>

                <input
                  className="border border-neutral-800 bg-neutral-900 px-4 py-3 rounded-xs w-full text-gray-400 text-xs hover:border-teal-400 focus:outline-teal-700"
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

            <div className="flex flex-col gap-1 w-full">
              <div className="text-xs text-gray-300">Currency</div>
              <CurrencySelect value={currency} onChange={setCurrency} />
            </div>
          </div>
        </div>
        <div
          className={`${
            expand ? "max-h-170 overflow-auto " : "max-h-12 overflow-hidden "
          }  cursor-pointer duration-500 ease-in-out custom-scrollbar border-1 text-xs font-bold px-2 bg-neutral-950   border-neutral-900  shadow-xs py-1 rounded-sm transition-all `}
        >
          <div
            className={` flex items-center duration-300 ease-in-out   justify-between group  p-3  text-gray-400
                    }`}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            <div className="flex items-center gap-1">
              {" "}
              <List />
              Items Table{" "}
            </div>
            <div
              className={`${
                expand ? "rotate-180" : null
              } duration-500 ease-in-out transition-all group-hover:animate-pulse`}
            >
              <OpenArrow></OpenArrow>
            </div>
          </div>
          <div
            className={`  rounded-lg py-4 px-2  transition-opacity
      duration-500 ease-in-out ${
        expand ? " translate-y-0" : "pointer-events-none  opacity-0"
      } `}
          >
            <table className="w-full table-fixed border-separate border-spacing-x-0 text-sm">
              <thead className="text-neutral-400 text-xs">
                <tr>
                  <th className="p-2 w-[40%] font-medium text-left">
                    Item Details
                  </th>
                  <th className="w-[12%] font-medium text-left">Quantity</th>
                  <th className="w-[18%] font-medium text-left">Rate</th>
                  <th className="w-[12%] font-medium text-left">Discount</th>
                  <th className="w-[14%] font-medium text-left">Amount</th>
                  <th className="w-[6%] font-medium"></th>
                </tr>
                <tr>
                  <td colSpan={6} className="border-b border-gray-200" />
                </tr>
              </thead>

              <tbody className="text-gray-400">
                {Items.map((e, index) => (
                  <tr key={index} className="text-sm">
                    <td className="p-2">
                      <input
                        className="w-full p-2 font-light border-neutral-800 bg-neutral-900 text-xs rounded-xs border outline-0"
                        placeholder="item"
                        value={e.description}
                        onChange={(temp: React.ChangeEvent<HTMLInputElement>) =>
                          changeHandler(
                            "description",
                            index,
                            temp.currentTarget.value,
                          )
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="w-full p-2 font-light border text-xs border-neutral-800 bg-neutral-900 rounded-xs outline-0"
                        placeholder="qty"
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={e.qty}
                        onChange={(temp: React.ChangeEvent<HTMLInputElement>) =>
                          changeHandler("qty", index, temp.currentTarget.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="w-full p-2 font-light border border-neutral-800 bg-neutral-900 text-xs rounded-xs outline-0"
                        placeholder="rate"
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={e.rate}
                        onChange={(temp: React.ChangeEvent<HTMLInputElement>) =>
                          changeHandler("rate", index, temp.currentTarget.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="w-full p-2 border font-light border-neutral-800 bg-neutral-900 text-xs rounded-xs outline-0"
                        placeholder="disc"
                        type="text"
                        value={e.discount}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        onChange={(temp: React.ChangeEvent<HTMLInputElement>) =>
                          changeHandler(
                            "discount",
                            index,
                            temp.currentTarget.value,
                          )
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="w-full p-2 font-light text-xs border border-neutral-800 bg-neutral-900 rounded-xs outline-0"
                        type="text"
                        value={Items[index].amt}
                        readOnly
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>,
                        ) => {
                          event.preventDefault();
                          delRow(index);
                        }}
                      >
                        <Bin />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();

                addRow();
              }}
              className="inline-flex items-center text-xs font-semibold p-1 gap-1 cursor-pointer group  mt-4 ml-2  duration-200 rounded-sm   "
            >
              <div className="group-hover:text-teal-600">
                <Add />
              </div>

              <span className="group-hover:text-gray-700">Add new line</span>
            </div>

            <div className=" text-right right-25 bottom-0 pr-6 py-2 font-semibold flex flex-col items-end gap-2 ">
              <div className="flex flex-row gap-4  justify-between w-30">
                <span className="text-gray-500">{"Sub Total"}</span>
                <span className="text-neutral-700">{subTotal}</span>
              </div>
              <div className="flex flex-row  justify-between items-center w-30">
                <span className="text-gray-500 ">{"Tax"}</span>
                <div className="felx flex-row items-center gap-1">
                  <input
                    className="text-right py-1 px-2 text-md w-14 outline-0 border-b border-neutral-800 text-neutral-700  "
                    type=""
                    placeholder="GST%"
                    onChange={(e) => TaxHandler(Number(e.currentTarget.value))}
                  ></input>
                  <span className="text-neutral-700 ">{"%"}</span>
                </div>
              </div>
              <div className="flex flex-row gap-8 text-lg  justify-end  border-t border-neutral-800 w-60">
                <span className="text-gray-500">{"Total"}</span>
                <span className="text-neutral-700">{Total}</span>
              </div>
            </div>
          </div>
        </div>

        <PaymentOptions />

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
    <div
      className="
                   cursor-pointer overflow-hidden bg-neutral-950 rounded-sm  text-xs font-bold px-2 py-3  shadow-xs  duration-500 ease-in-out transition-all `}
                "
    >
      <div className="flex items-center gap-1 py-2 text-neutral-300">
        <AddInfo />
        <span className="tracking-wide text-sm font-semibold text-gray-400">
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
    <div className="px-2 py-1 font-normal mt-2">
      <span className="text-gray-500 tracking-wide">{Title}</span>{" "}
      <span className="bg-gray-300 rounded-sm p-1 text-[7px] tracking-wide ">
        Optional
      </span>
      <textarea
        name="note"
        className="focus:outline-1 bg-neutral-900 text-gray-400 focus:outline-teal-700 focus:border-teal-700 focus:border-1 border border-neutral-800   w-full h-30 resize-none p-2 mt-2 rounded-xs"
        placeholder={Placeholder}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (Title == "Terms") HandleTerms(e.currentTarget.value);
          else HandleInfo(e.currentTarget.value);
        }}
      ></textarea>
      <div className="flex items-center text-xs gap-1 text-gray-500">
        <Info /> <span className="text-gray-600 text-[10px]">{Message}</span>
      </div>
    </div>
  );
}

import Image from "next/image";
import ImageAlt from "@/app/Icons/Img";

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
    // {
    //   label: "Company Name",
    //   name: "CompanyName",
    //   placeholder: "Company name",
    // },
    // {
    //   label: "Company Address",
    //   name: "CompanyAddress",
    //   placeholder: "Company Address",
    // },
    // {
    //   label: "Tax Details",
    //   name: "TaxDetail",
    //   placeholder: "Tax Details eg : GSTIN - ",
    // },
    // {
    //   label: "Company Mail",
    //   name: "CompanyMail",
    //   placeholder: "Company Mail",
    // },
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
      placeholder: "Bank Code eg : IFCS code",
    },
  ];
  const [option, setOption] = useState("UPI");

  const [url, setUrl] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file)
    setUrl(base64);
    OwnerDetailHandler("QR", base64);
  };

  const { OwnerDetailHandler, OwnerDetails } = useOwner();
  return (
    <div
      className="
                 bg-neutral-950  overflow-hidden text-xs font-bold px-2 py-4 mb-2   shadow-xs rounded-xs duration-500 ease-in-out transition-all `}
                "
    >
      <div className="flex items-center gap-1 ">
        {/* <Logo textColor="white" /> */}
        <span className="text-neutral-300 tracking-wide font-semibold text-sm">
          Payment Options
        </span>
      </div>

      <div className="h-full  w-full">
        <div className="p-2 w-full h-auto flex justify-between items-center gap-2">
          <button
            className={`w-full flex justify-center cursor-pointer hover:bg-neutral-800 p-2 duration-300 ease-in-out text-neutral-400 ${option == "Bank" ? "bg-neutral-700" : ""}`}
            onClick={() => {
              setOption("Bank");
              OwnerDetailHandler("paymentMethod", "Bank");
            }}
          >
            Bank Transfer
          </button>
          <button
            className={`w-full flex justify-center cursor-pointer hover:bg-neutral-800 p-2 duration-300 ease-in-out text-neutral-400 ${option == "UPI" ? "bg-neutral-700" : ""} `}
            onClick={() => {
              setOption("UPI");
              OwnerDetailHandler("paymentMethod", "UPI");
            }}
          >
            UPI
          </button>
        </div>
      </div>
      {option == "UPI" && (
        <label htmlFor="QR">
          <div className="w-full min-h-70 group  p-4 flex-1  cursor-pointer  bg-neutral-950 flex flex-col gap-2 items-center justify-center">
            <input
              id="QR"
              type="file"
              placeholder=""
              className="z-200 top-10 cursor-pointer   border hidden border-white bg-transparent"
              onChange={handleChange}
            ></input>

            <label htmlFor="QR">
              <div className=" rounded-xs flex  justify-center items-center cursor-pointer">
                {url != "" ? (
                  <Image alt="QR" src={url} width={140} height={140}></Image>
                ) : (
                  <QR />
                )}
              </div>
            </label>
            <p className="text-neutral-700 whitespace-pre-line text-center">
              {" "}
              {`drag and drop your saved QR image \n here, or browse your file`}{" "}
            </p>
            <input
              className="border border-white/10 rounded-xs px-2 w-60 py-2 text-gray-400 tracking-wide bg-neutral-950 outline-0"
              placeholder="UPI-ID"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                OwnerDetailHandler("UPIID", e.currentTarget.value);
              }}
            ></input>
          </div>
        </label>
      )}

      {option == "Bank" && (
        <div className="bg-neutral-950 w-full h-full min-h-70 p-2 duration-300 ease-in-out flex justify-center items-center">
          <div className="grid grid-cols-2 gap-4 w-full">
            {OwnerField.map((f, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <div className="text-neutral-300 tracking-wide text-xs">
                  {f.label}
                </div>

                <input
                  className="border border-neutral-800 bg-neutral-900 px-4 py-3 rounded-xs text-gray-400 text-xs hover:border-teal-400 focus:outline-teal-700 w-full"
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
