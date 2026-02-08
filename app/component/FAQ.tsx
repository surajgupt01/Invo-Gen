"use client";

import { useState } from "react";
import Plus from "../Icons/Plus";
import Minus from "../Icons/Minus";

export default function FAQ() {
  const [open, setOpen] = useState<number>();
  const Questions = [
    {
      question: "What is this invoice generator and who is it for?",
      answer:
        "This invoice generator is designed for freelancers, startups, small businesses, and agencies who want to create professional invoices quickly without complex accounting software.",
    },
    {
      question: "Can I customize my invoice design?",
      answer:
        "Yes. You can customize invoice templates, colors, currency, logos, and business details to match your brand identity.",
    },
    {
      question: "Is it free to use?",
      answer:
        "Yes, there is a free plan that allows you to create and download invoices. Premium plans unlock advanced features like unlimited invoices, PDF branding, and invoice history.",
    },

    {
      question: "Is my data safe and secure?",
      answer:
        "Yes. Your data is securely stored and protected using industry-standard security practices. We never share your invoice data with third parties.",
    },
    {
      question: "Do I need to create an account to generate invoices?",
      answer:
        "You can create invoices without an account. However, signing up allows you to save invoices, access history, and manage your business details more efficiently.",
    },
    {
      question: "Can I manage multiple clients and businesses?",
      answer:
        "Yes. You can store multiple client profiles and business details, making it easy to switch between projects or companies.",
    },
    {
      question: "Does it support multiple currencies and taxes?",
      answer:
        "Yes. The platform supports multiple currencies, tax rates, discounts, and regional formatting to suit global invoicing needs.",
    },
    {
      question: "Can I share invoices directly with my clients?",
      answer:
        "Yes. You can share invoices via downloadable PDFs or secure invoice links that clients can view online.",
    },

    {
      question: "Can I edit an invoice after creating it?",
      answer:
        "Yes. You can edit invoices at any time before downloading or sharing them. Saved invoices can also be updated if changes are required.",
    },
    {
      question: "Is this suitable for GST or VAT invoices?",
      answer:
        "Yes. You can add GST, VAT, or other tax details depending on your region and business requirements.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "Yes. If you face any issues or have questions, you can reach out through our support channels for quick assistance.",
    },

  ];

  return (
    <div className="mt-30 flex flex-col items-center w-full h-auto  md:p-6 p-4">
      <div className="bg-gray-200 rounded-full text-xs font-semibold text-gray-700 p-4 ">
        Frequently Asked Questions
      </div>
      <div className="text-4xl font-bold text-gray-600 mt-10">FAQ</div>
      <div className="bg-gray-100 rounded-xl md:w-150 w-full h-auto mt-4 p-4">
        <div className="bg-gray-100 rounded-xl w-full mt-4 md:p-4 p-2 space-y-2">
          {Questions.map((ele, idx) => {
            const isOpen = open === idx;

            return (
              <div key={idx} className={`rounded-sm  overflow-hidden bg-gray-100 ${open==idx ? 'bg-gray-200 overflow-auto' : ''}`}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : idx)}
                  className="w-full text-left flex justify-between cursor-pointer items-center md:p-3 p-2 text-sm text-gray-700 font-semibold hover:bg-gray-200 transition-all"
                >
                  <span>{ele.question}</span>

                  <span
                    className={`transform transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                   {open==idx ? <Minus/>  : <Plus/>}
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden  ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="p-3 text-xs text-gray-700">{ele.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
