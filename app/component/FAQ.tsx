"use client";

import React, { useState } from "react";
import Minus from "../Icons/Minus";
import Plus from "../Icons/Plus";

// Minimal Plus / Minus Accordion Icon
function AccordionIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`${
        isOpen ? "rotate-0" : "rotate-270"
      } duration-300 ease-in-out relative w-4 h-4 flex items-center justify-center shrink-0 text-zinc-400`}
    >
      {isOpen ? <Minus /> : <Plus />}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = [
    {
      question: "How do I create a GST-compliant invoice online for free?",
      answer:
        "Select your client's state to automatically split taxes between CGST + SGST (intra-state) or IGST (inter-state). Enter your GSTIN, client details, line items with HSN/SAC codes, and download a clean, vector-sharp PDF instantly without manual tax calculations.",
    },
    {
      question:
        "Can I generate invoices in foreign currencies like USD, EUR, and GBP?",
      answer:
        "Yes. Luen supports multi-currency billing across USD ($), EUR (€), GBP (£), and INR (₹). You can bill global clients in their local currency while embedding international bank wire details, SWIFT codes, or direct payment links.",
    },
    {
      question:
        "How do I bill international clients under GST LUT (zero-rated export)?",
      answer:
        "For cross-border service exports from India, toggle the 'Export under LUT' option. Luen automatically applies a 0% IGST rate and appends the mandatory statutory declaration required by Indian tax authorities on your exported PDF invoice.",
    },
    {
      question: "Can I embed a UPI QR code directly on the PDF invoice?",
      answer:
        "Yes. Add your UPI ID (VPA) or payment handle, and Luen generates a dynamic QR code on the invoice PDF. Domestic Indian clients can scan the code with PhonePe, Google Pay, or Paytm to pay the exact invoiced amount instantly.",
    },
    {
      question: "Do I need an account to create and export invoices?",
      answer:
        "Yes, creating a free account takes seconds and lets you generate compliant GST and multi-currency PDF invoices immediately. A free account secures your billing history, auto-saves client profiles, and enables multi-device cloud synchronization.",
    },
    {
      question:
        "Is this free invoice generator suitable for freelancers and agencies?",
      answer:
        "Yes. Luen is designed for freelancers, independent contractors, indie hackers, and small businesses who need professional digital invoice formatting, custom logo branding, and automated math without expensive accounting software.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="FAQ"
      className="w-full bg-white text-zinc-900 font-sans py-16 sm:py-24 border-t border-zinc-200"
    >
      {/* Schema injected into DOM for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Constrained to max-w-6xl */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-zinc-200">
          <div className="max-w-xl">
            <p className="text-[11px] sm:text-xs font-mono font-medium tracking-widest text-zinc-400 uppercase mb-3">
              Frequently Asked Questions
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-950 leading-tight">
              All your questions,{" "}
              <span className="text-zinc-400">answered.</span>
            </h2>
          </div>
          <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
            Everything you need to know about generating, customizing, and
            sharing invoices with Luen.
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-zinc-200 border-b border-zinc-200">
          {questions.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className="transition-colors">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left flex justify-between items-center gap-6 py-5 px-1 sm:px-2 hover:bg-zinc-50/70 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-normal text-zinc-900 leading-snug">
                    {item.question}
                  </span>
                  <AccordionIcon isOpen={isOpen} />
                </button>

                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 pb-5"
                      : "grid-rows-[0fr] opacity-0 pb-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans px-1 sm:px-2 pt-1 max-w-3xl">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}