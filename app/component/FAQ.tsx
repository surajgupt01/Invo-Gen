"use client";

import React, { useState } from "react";

// Minimal Plus / Minus Animated Icon
function AccordionIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0 text-zinc-500">
      {/* Horizontal Line */}
      <span className="absolute w-3 h-[1.5px] bg-zinc-600 transition-transform duration-300" />
      {/* Vertical Line (rotates away when open) */}
      <span
        className={`absolute w-3 h-[1.5px] bg-zinc-600 transition-transform duration-300 ${
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
      question: "What is this invoice generator and who is it for?",
      answer:
        "Luen is designed for freelancers, startups, small businesses, and agencies who want to create professional invoices quickly without complex accounting software.",
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
        "Yes. The platform supports multiple currencies, tax rates (GST/VAT), discounts, and regional formatting to suit global invoicing needs.",
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

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="FAQ"
      className="relative w-full bg-[#FAFAFA] text-zinc-800 font-sans py-14 md:py-20 border-b border-zinc-200/80 select-none overflow-hidden"
    >
      <div className="w-[90%] max-w-5xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-zinc-200/80">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-mono text-teal-600 uppercase tracking-widest font-semibold">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              All your questions, answered.
            </h2>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Everything you need to know about creating, managing, and sharing invoices with Luen.
            </p>
          </div>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-zinc-200/70 border-b border-zinc-200/70">
          {questions.map((ele, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className="transition-colors rounded-2xs">
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left flex justify-between items-center gap-4 cursor-pointer group py-3 px-2 hover:bg-zinc-100/60 rounded-xs transition-colors"
                >
                  <span className="text-xs sm:text-sm font-medium text-zinc-800 group-hover:text-teal-600 transition-colors leading-snug">
                    {ele.question}
                  </span>

                  <AccordionIcon isOpen={isOpen} />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mb-3"
                      : "grid-rows-[0fr] opacity-0 mb-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-sans px-2 pt-1 pb-1">
                      {ele.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Large Bottom Faded Brand Watermark */}

    </section>
  );
}