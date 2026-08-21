"use client";

import React, { useState } from "react";

// Minimal Plus / Minus Accordion Icon
function AccordionIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-4 h-4 flex items-center justify-center shrink-0 text-zinc-400">
      {/* Horizontal Line */}
      <span className="absolute w-3.5 h-[1.5px] bg-zinc-600 transition-transform duration-300" />
      {/* Vertical Line */}
      <span
        className={`absolute w-3.5 h-[1.5px] bg-zinc-600 transition-transform duration-300 ${
          isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
        }`}
      />
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = [
    {
      question: "What is Luen and who is it built for?",
      answer:
        "Luen is a fast, minimalist invoice generator tailored for freelancers, contractors, indie hackers, and boutique agencies who need client-ready PDFs without clunky accounting overhead.",
    },
    {
      question: "Can I customize templates, logos, and payment methods?",
      answer:
        "Yes. You can upload custom brand logos, toggle color accents, embed instant UPI payment QR codes, include wire instructions, and select from clean, designer-grade PDF layouts.",
    },
    {
      question: "Is there a free plan available?",
      answer:
        "Yes. The Starter tier is completely free forever and allows up to 5 invoices per month with full calculation features. Upgrading to Pro unlocks unlimited invoices, custom branding, and zero watermarks.",
    },
    {
      question: "How is my invoice and client data protected?",
      answer:
        "Your data security and privacy are top priorities. Invoices are stored in local-first browser memory or encrypted cloud storage with industry-standard practices. We never monetize or share your client information.",
    },
    {
      question: "Do I need to register an account to create an invoice?",
      answer:
        "No account is required to generate or export clean invoices. Creating a free account simply enables draft saving, client autofill profiles, and persistent billing history across devices.",
    },
    {
      question: "Does Luen support international taxes and currencies?",
      answer:
        "Yes. Luen includes auto-calculating support for multi-currency invoicing ($ USD, € EUR, ₹ INR, £ GBP) as well as automated Indian GST (CGST/SGST/IGST) and standard global VAT rules.",
    },
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="FAQ"
      className="w-full bg-white text-zinc-900 font-sans select-none py-16 sm:py-24 border-t border-zinc-200"
    >
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
            Everything you need to know about generating, customizing, and sharing invoices with Luen.
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
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left flex justify-between items-center gap-6 py-5 px-1 sm:px-2 hover:bg-zinc-50/70 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-normal text-zinc-900 leading-snug">
                    {item.question}
                  </span>
                  <AccordionIcon isOpen={isOpen} />
                </button>

                <div
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