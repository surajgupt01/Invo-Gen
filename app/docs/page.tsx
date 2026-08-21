import type { Metadata } from "next";
import DocsClient from "./DocClient";

export const metadata: Metadata = {
  title: "Documentation & Technical Architecture | Luen Invoicing",
  description:
    "Explore comprehensive technical documentation for Luen. Learn about our metadata-only database persistence, on-the-fly vector PDF compilation, Indian GST engines, and multi-currency billing lifecycles.",
  keywords: [
    "invoice generator documentation",
    "metadata database architecture",
    "vector PDF generation",
    "GST invoice technical guide",
    "SaaS subscription lifecycle",
    "Razorpay multi-currency invoices",
    "Prisma invoice schema",
  ],
  alternates: {
    canonical: "https://luen.in/docs",
  },
  openGraph: {
    title: "Luen Documentation & Technical Knowledge Base",
    description:
      "Deep dive into Luen's metadata-first database schema, local vector rendering engine, and automated GST compliance models.",
    url: "https://luen.in/docs",
    siteName: "Luen",
    type: "article",
  },
};

export default function DocsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Luen Invoicing Platform Technical Architecture & Documentation",
    description:
      "Technical specifications detailing metadata-only persistence, vector canvas PDF compilation, multi-currency subscription lifecycles, and Indian GST rules.",
    url: "https://luen.in/docs",
    author: {
      "@type": "Organization",
      name: "Luen Engineering",
      url: "https://luen.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Luen",
      url: "https://luen.in",
      logo: {
        "@type": "ImageObject",
        url: "https://luen.in/favicon.png",
      },
    },
    about: [
      {
        "@type": "SoftwareApplication",
        name: "Luen Invoicing",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web-based",
      },
    ],
  };

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans selection:bg-teal-100 selection:text-teal-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DocsClient />
    </div>
  );
}