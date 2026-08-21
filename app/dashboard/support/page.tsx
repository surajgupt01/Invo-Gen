"use client";

import { useState } from "react";
import { Mail, ChevronDown, Check, Copy } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I upgrade my account to Pro?",
    answer:
      "Click 'Upgrade to Pro' in the left navigation sidebar or head over to the Pricing section. Once confirmed, unlimited invoice exports, custom branding, and premium features unlock immediately.",
  },
  {
    question: "What happens if I cancel my Pro subscription?",
    answer:
      "Auto-renewal will stop instantly. You retain full Pro access until the end of your paid billing period, after which your account reverts gracefully to the Starter free tier.",
  },
  {
    question: "Can I customize templates with my own brand and logo?",
    answer:
      "Yes. Pro users can upload high-resolution organization logos, digital signatures, UPI payment QR codes, and customize international tax configurations across all minimalist templates.",
  },
  {
    question: "Where can I view and download past invoices?",
    answer:
      "All generated documents, payment status tags, and historical records are securely stored under 'Invoice Register' (Invoices History) in your dashboard.",
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("support@luen.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans select-none pb-16">
      {/* Top Banner / Header Area */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium mb-1">
                Help & Assistance
              </p>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-950">
                Help & Support
              </h1>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 bg-zinc-100 px-3 py-1 rounded-md border border-zinc-200/80 shrink-0 self-start sm:self-auto">
              RESPONSE TIME: <span className="font-semibold text-zinc-900">&lt;24H</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Contact Support Banner Card */}
        <div className="bg-zinc-50/70 border border-zinc-200 p-6 sm:p-8 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-teal-700">
              <Mail className="w-4 h-4" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">
                Direct Desk Support
              </span>
            </div>
            <h2 className="text-lg font-medium text-zinc-950 tracking-tight">
              Have a custom billing or technical request?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Reach out directly for questions about payment setups, bulk invoicing, API integrations, or bespoke templates.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href="mailto:support@luen.in"
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium rounded-md transition-colors shadow-xs"
            >
              Send Email
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3.5 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-mono rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-teal-700 font-medium">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>support@luen.in</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* FAQs Accordion Container */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
          <div className="flex items-center justify-between p-6 border-b border-zinc-200 bg-white">
            <div>
              <h2 className="text-sm font-medium text-zinc-950 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Quick answers to common questions about Luen
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              {faqs.length} Articles
            </span>
          </div>

          <div className="divide-y divide-zinc-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-normal text-zinc-900 hover:bg-zinc-50/70 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "rotate-180 text-zinc-950" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 pb-5 px-5"
                        : "grid-rows-[0fr] opacity-0 pb-0 px-5"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs text-zinc-500 leading-relaxed max-w-3xl pt-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enterprise Support Banner */}
        <div className="p-4 sm:p-5 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-500">
          <span>Need custom integrations or higher invoice volume?</span>
          <a
            href="mailto:support@luen.in"
            className="text-teal-700 hover:text-teal-800 font-semibold underline underline-offset-4"
          >
            CONTACT ENTERPRISE SUPPORT →
          </a>
        </div>

      </div>
    </div>
  );
}