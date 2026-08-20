"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import {
  Mail,
  Check,
  ChevronDown,
  Clock,
  FileQuestion,
  Headphones,
  ExternalLink,
  BookOpen,
  Scale,
  Building2,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "Billing" | "Features" | "Compliance";
}

const FAQS: FAQItem[] = [
  {
    category: "Billing",
    question: "How do subscription billing cycles and auto-renewals work?",
    answer:
      "Paid plans are billed on recurring Monthly or Yearly cycles via Razorpay. Domestic Indian customers are billed in INR (₹) supporting UPI Autopay and debit/credit cards under RBI e-Mandate rules. Global users are billed in USD ($) via international cards.",
  },
  {
    category: "Billing",
    question: "What happens when I cancel my Pro subscription?",
    answer:
      "Auto-renewal is terminated immediately with zero exit penalties. Your account retains full Pro access (unlimited exports, watermark suppression, custom logos) until the current prepaid period expires, after which it safely downgrades to Free.",
  },
  {
    category: "Features",
    question: "How do monthly export quotas reset on the Free Tier?",
    answer:
      "Free accounts are allocated 5 PDF exports per calendar month. Quota counters automatically reset to zero on the 1st of every calendar month.",
  },
  {
    category: "Compliance",
    question: "How does Luen handle Indian GST rules and Cross-Border Exports?",
    answer:
      "Luen includes deterministic GST calculation modes: Intra-State (CGST 9% + SGST 9%) and Inter-State (IGST 18%). For overseas clients, enabling 'Export Under LUT' suppresses tax charges and automatically embeds statutory Letter of Undertaking compliance text.",
  },
  {
    category: "Features",
    question: "Are uploaded logos, signatures, and client data private?",
    answer:
      "Yes. Client lists, hourly rates, and invoice line items are strictly confidential. We do not aggregate, sell, or disclose your client databases or revenue figures to advertising networks.",
  },
];

export default function SupportClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-xs text-zinc-400">
          Loading support desk...
        </div>
      }
    >
      <SupportContent />
    </Suspense>
  );
}

function SupportContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("support@luen.in");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-zinc-800 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
      <Nav />

      <main className="w-[92%] max-w-5xl mx-auto pt-10 md:pt-14 pb-16 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200/80 pb-4 gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-2xs uppercase tracking-widest font-bold">
              <Headphones className="w-3 h-3 text-teal-600" />
              <span>HELP DESK &amp; GRIEVANCE SUPPORT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-sans">
              Customer Support &amp; Contact Desk
            </h1>
            <p className="text-xs text-zinc-500 font-sans">
              Billing telemetry assistance, gateway support, GST configurations, and direct technical resolution.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="flex items-center gap-1 text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded-2xs font-bold">
              <Clock className="w-3 h-3 text-teal-600" />
              SLA: &lt;24H RESPONSE
            </span>
          </div>
        </div>

        {/* Primary Contact Banner */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xs shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-teal-50 border border-teal-200/80 text-teal-700 rounded-2xs">
                <Mail className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase text-zinc-900 tracking-wider">
                Direct Engineering &amp; Billing Desk
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
              Have questions about subscription billing, invoice formatting, tax calculations, or account issues? Contact us directly by email.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href="mailto:support@luen.in"
              className="flex-1 sm:flex-none px-4 py-2 bg-zinc-950 hover:bg-black text-white text-xs font-mono font-semibold uppercase tracking-wider rounded-2xs transition text-center shadow-2xs"
            >
              Send Email
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3.5 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-mono rounded-2xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-teal-700 font-bold">Copied</span>
                </>
              ) : (
                <span>support@luen.in</span>
              )}
            </button>
          </div>
        </div>

        {/* Support Grid: Operational Details, Docs, and Merchant Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Operating Hours & SLAs */}
          <div className="bg-white border border-zinc-200/80 p-4 rounded-2xs space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-2xs">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase">AVAILABILITY</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-xs font-bold text-zinc-900 font-mono uppercase">Operating Hours</h2>
              <p className="text-[11px] text-zinc-500 font-sans">
                Monday to Saturday: 09:00 AM – 07:00 PM IST. Inquiries received on Sundays are processed the following business day.
              </p>
            </div>
          </div>

          {/* Card 2: Technical Documentation */}
          <div className="bg-white border border-zinc-200/80 p-4 rounded-2xs space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-2xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase">SELF SERVE</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-xs font-bold text-zinc-900 font-mono uppercase">Technical Docs</h2>
              <p className="text-[11px] text-zinc-500 font-sans">
                Learn about metadata database schemas, GST tax configurations, and vector canvas rules.
              </p>
            </div>
            <div className="pt-1">
              <Link
                href="/docs"
                className="w-full py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-mono font-semibold uppercase rounded-2xs transition flex items-center justify-center gap-1.5"
              >
                <span>Read Docs</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </Link>
            </div>
          </div>

          {/* Card 3: Legal & Terms */}
          <div className="bg-white border border-zinc-200/80 p-4 rounded-2xs space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-2xs">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase">POLICIES</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-xs font-bold text-zinc-900 font-mono uppercase">Legal &amp; Terms</h2>
              <p className="text-[11px] text-zinc-500 font-sans">
                Terms of service, refund policy, auto-renewal cancellation, and privacy protections.
              </p>
            </div>
            <div className="pt-1">
              <Link
                href="/terms"
                className="w-full py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-mono font-semibold uppercase rounded-2xs transition flex items-center justify-center gap-1.5"
              >
                <span>Terms &amp; Privacy</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-2xs space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <span className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileQuestion className="w-4 h-4 text-teal-600" />
              FREQUENTLY ASKED QUESTIONS
            </span>
            <span className="text-[10px] font-mono text-zinc-400">{FAQS.length} ARTICLES</span>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-zinc-200/70 rounded-2xs overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-3 text-left text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition cursor-pointer gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-2xs uppercase">
                        {faq.category}
                      </span>
                      <span className="truncate">{faq.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform shrink-0 ${
                        isOpen ? "rotate-180 text-teal-600" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-3 pt-1 text-[11px] text-zinc-500 font-sans leading-relaxed border-t border-zinc-100 bg-zinc-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Merchant & Grievance Information Footer Box */}
        <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xs text-[11px] text-zinc-500 font-sans space-y-1.5">
          <div className="flex items-center gap-1.5 text-zinc-800 font-mono font-bold uppercase text-[10px]">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Merchant Operations &amp; Grievance Redressal</span>
          </div>
          <p className="leading-relaxed">
            Luen operates in full compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules. For grievance escalations, payment reconciliations, or statutory inquiries, email us directly at <a href="mailto:support@luen.in" className="font-mono text-zinc-900 font-bold underline">support@luen.in</a> with your relevant invoice or transaction IDs.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}