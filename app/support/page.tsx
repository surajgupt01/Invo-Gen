import type { Metadata } from "next";
import SupportClient from "./SupportClient";

export const metadata: Metadata = {
  title: "Help & Support Desk | Luen Invoicing",
  description:
    "Get customer support, billing assistance, technical integration guides, and grievance redressal for Luen Invoicing. Contact our direct engineering desk.",
  alternates: {
    canonical: "https://www.luen.in/support",
  },
  openGraph: {
    title: "Help & Support Desk | Luen",
    description:
      "Direct technical and billing support for freelancers, consultants, and businesses using Luen.",
    url: "https://www.luen.in/support",
    siteName: "Luen",
    type: "website",
  },
};

export default function SupportPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: "Luen Help & Support",
        url: "https://www.luen.in/support",
        description: "Official customer service and technical support channel for Luen Invoicing.",
        mainEntity: {
          "@type": "Organization",
          name: "Luen",
          url: "https://www.luen.in",
          contactPoint: {
            "@type": "ContactPoint",
            email: "support@luen.in",
            contactType: "Customer Support & Grievance Redressal",
            availableLanguage: ["English", "Hindi"],
            hoursAvailable: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ],
              opens: "09:00",
              closes: "19:00",
            },
          },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I upgrade to the Pro plan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Navigate to Pricing or Account Settings and select your billing cycle (Monthly or Yearly). Payments are processed securely via Razorpay supporting domestic UPI Autopay, Netbanking, and international cards.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if I cancel my auto-renewal?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Canceling auto-renewal stops future recurring charges immediately. You retain uninterrupted Pro tier access through the end of your current prepaid billing cycle.",
            },
          },
          {
            "@type": "Question",
            name: "What are the Free Tier limits?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Free accounts receive 5 invoice PDF exports per calendar month with default watermark branding. Quotas reset automatically on the 1st of every month.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SupportClient />
    </>
  );
}