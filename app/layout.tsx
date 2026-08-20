import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.luen.in"),
  title: {
    default: "Luen — Professional GST & Multi-Currency Invoice Generator",
    template: "%s | Luen",
  },
  description:
    "Generate, customize, and issue high-resolution vector PDF invoices instantly without spreadsheets. Built-in Indian GST engine (CGST/SGST/IGST), zero-rated LUT cross-border exports, and multi-currency billing for freelancers and modern businesses.",
  keywords: [
    "Invoice Generator",
    "GST Invoice Generator",
    "PDF Invoicing Software",
    "Freelancer Invoice Maker",
    "Multi-Currency Invoicing",
    "Indian GST Invoicing",
    "Export under LUT Invoice",
    "Software Engineer Invoicing",
    "Small Business Billing Software",
    "Razorpay Invoicing Tool",
    "Clean PDF Invoice Template",
    "Vector PDF Generator",
  ],
  authors: [{ name: "Luen", url: "https://www.luen.in" }],
  creator: "Luen",
  publisher: "Luen Software Inc.",
  applicationName: "Luen",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "Business & Productivity",
  classification: "Invoicing and Financial Software",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.luen.in",
    languages: {
      "en-US": "https://www.luen.in",
      "en-IN": "https://www.luen.in",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Luen — Professional GST & Multi-Currency Invoice Generator",
    description:
      "Generate clean, vector-sharp PDF invoices in seconds. Integrated Indian GST breakdown, cross-border LUT compliance, UPI QR codes, and seamless export.",
    url: "https://www.luen.in",
    siteName: "Luen Invoicing",
    locale: "en_US",
    alternateLocale: ["en_IN"],
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Luen Interactive Invoicing Dashboard & Vector PDF Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luen — Professional Invoice Generator",
    description:
      "Generate and manage compliant, vector-sharp PDF invoices without spreadsheets.",
    images: ["/favicon.png"],
    creator: "@luen_in",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_KEY",
    // yandex: "YOUR_YANDEX_VERIFICATION_KEY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Rich Structured Data (JSON-LD) for Search Engine Crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Luen",
        "url": "https://www.luen.in",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "description":
          "Modern browser-based invoicing platform for freelancers, consultants, and agencies. Generate compliant GST invoices, international export documents, and vector PDFs with instant downloads.",
        "offers": [
          {
            "@type": "Offer",
            "name": "Starter Free Tier",
            "price": "0",
            "priceCurrency": "INR",
            "description": "5 free monthly invoice exports with essential templates and local persistence.",
          },
          {
            "@type": "Offer",
            "name": "Pro Tier (Domestic India)",
            "price": "299",
            "priceCurrency": "INR",
            "billingDuration": "P1M",
            "description": "Unlimited invoice downloads, watermark suppression, and custom branding.",
          },
          {
            "@type": "Offer",
            "name": "Pro Tier (Global)",
            "price": "12",
            "priceCurrency": "USD",
            "billingDuration": "P1M",
            "description": "Unlimited invoice downloads, multi-currency engine, and global payment support.",
          },
        ],
      },
      {
        "@type": "Organization",
        "name": "Luen",
        "url": "https://www.luen.in",
        "logo": "https://www.luen.in/favicon.png",
        "sameAs": [],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "support@luen.in",
          "contactType": "Customer Support",
          "availableLanguage": ["English", "Hindi"],
        },
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#FAFAFA] text-zinc-900 antialiased selection:bg-teal-100 selection:text-teal-900 min-h-screen flex flex-col`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}