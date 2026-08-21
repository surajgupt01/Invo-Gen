import type { Metadata } from "next";
import LegalPageClient from "./LegalPageClient";

export const metadata: Metadata = {
  title: "Terms of Service & Privacy Policy | Luen Invoicing",
  description:
    "Review Luen's legal agreements, subscription billing terms, auto-renewal policies, data security protocols, and privacy commitments for domestic and international users.",
  alternates: {
    canonical: "https://luen.in/terms",
  },
  openGraph: {
    title: "Terms of Service & Privacy Policy | Luen",
    description:
      "Transparent terms of service, subscription billing policies, and privacy protocols for freelancers and businesses using Luen.",
    url: "https://luen.in/terms",
    siteName: "Luen",
    type: "website",
  },
};

export default function LegalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Luen Terms of Service & Privacy Policy",
    url: "https://luen.in/terms",
    description:
      "Legal terms, multi-currency subscription contracts, data protection, and acceptable use policies for Luen.",
    publisher: {
      "@type": "Organization",
      name: "Luen",
      url: "https://luen.in",
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@luen.in",
        contactType: "customer support",
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans selection:bg-teal-100 selection:text-teal-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalPageClient />
    </div>
  );
}