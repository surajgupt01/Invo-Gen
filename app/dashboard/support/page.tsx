"use client";

import { useState } from "react";

// --- Minimalist Icons ---
function MailIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function CheckIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I upgrade my account to Pro?",
    answer: "Click 'Upgrade to Pro' in the left sidebar or navigate to Settings. Payment verification through Razorpay instantly lifts account limits upon confirmation.",
  },
  {
    question: "What happens when I cancel my subscription?",
    answer: "Auto-renewal stops immediately. Access stays on Pro Tier through the end of your current billing cycle before safely reverting to Free Tier.",
  },
  {
    question: "Can I customize PDF invoice templates?",
    answer: "Yes. Pro users can upload custom company logos, digital signatures, configure GST/international tax engines, and pick premium layout themes.",
  },
  {
    question: "Where can I find my past invoice records?",
    answer: "All generated document logs, status markers, and payment telemetry are stored under 'Invoices History' in your dashboard.",
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
    <main className="w-full max-w-5xl mx-auto p-4 sm:p-6 font-sans select-none space-y-5">
      {/* Dashboard Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-3.5 bg-teal-600 rounded-2xs" />
            <h1 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">
              HELP & SUPPORT
            </h1>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans pl-3.5">
            Knowledge base, system telemetry guides, and developer support.
          </p>
        </div>
        <div className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-2xs border border-zinc-200/60">
          RESPONSE TIME: &lt;24H
        </div>
      </div>

      {/* Main Support Box */}
      <div className="bg-white border border-zinc-200/80 p-4 rounded-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-teal-700">
            <MailIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              DIRECT DESK SUPPORT
            </span>
          </div>
          <h2 className="text-xs font-bold text-zinc-900 tracking-tight">
            Have a custom technical or billing request?
          </h2>
          <p className="text-[11px] text-zinc-400 font-sans">
            Reach out directly for assistance with payment gateways, API keys, or custom templates.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="mailto:support@luen.in"
            className="px-3 py-1.5 bg-zinc-950 hover:bg-black text-white text-[11px] font-medium rounded-2xs transition-colors shadow-2xs"
          >
            Send Mail
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="px-3 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-[11px] font-mono rounded-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <CheckIcon className="text-teal-600" />
                <span className="text-teal-700 font-bold">COPIED</span>
              </>
            ) : (
              <span>support@luen.in</span>
            )}
          </button>
        </div>
      </div>

      {/* Compact FAQs Section */}
      <div className="bg-white border border-zinc-200/80 rounded-2xs p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-[10px] font-mono font-bold text-zinc-900 uppercase tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            {faqs.length} ARTICLES
          </span>
        </div>

        <div className="space-y-1.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-zinc-200/60 rounded-2xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left text-[11px] font-semibold text-zinc-800 hover:bg-zinc-50/80 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDownIcon
                    
                    className={`size-3 text-zinc-400 transition-transform duration-150 ${
                      isOpen ? "rotate-180 text-teal-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-3 pb-2.5 pt-1 text-[11px] text-zinc-500 font-sans leading-relaxed border-t border-zinc-100 bg-zinc-50/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Disclaimer */}
      <div className="px-3 py-2 bg-zinc-50 border border-zinc-200/60 rounded-2xs flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span>Need higher volume invoice throughput?</span>
        <a
          href="mailto:support@luen.in"
          className="text-teal-700 hover:text-teal-800 font-bold underline underline-offset-2"
        >
          CONTACT ENTERPRISE SUPPORT
        </a>
      </div>
    </main>
  );
}