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
    // Front-load top-intent keywords; keep under 60 characters
    default: "Free Invoice Generator — GST & Multi-Currency PDF | Luen",
    template: "%s | Luen",
  },
  // 150 characters with clear CTR triggers (Free, Instant, No sign-up)
  description:
    "Generate professional GST and multi-currency PDF invoices online for free. Instant vector PDF download with CGST/SGST/IGST and LUT export compliance.",
  applicationName: "Luen",
  authors: [{ name: "Luen", url: "https://www.luen.in" }],
  creator: "Luen",
  publisher: "Luen",
  category: "Business & Productivity",
  alternates: {
    canonical: "https://www.luen.in",
    languages: {
      "en-IN": "https://www.luen.in",
      "en-US": "https://www.luen.in",
      "x-default": "https://www.luen.in",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Free Invoice Generator — GST & Multi-Currency PDF | Luen",
    description:
      "Create clean, compliant GST & multi-currency vector PDF invoices in seconds. Free instant download without spreadsheets.",
    url: "https://www.luen.in",
    siteName: "Luen",
    locale: "en_IN",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/og-image.png", // Ensure you export a real 1200x630 UI snapshot to public/og-image.png
        width: 1200,
        height: 630,
        alt: "Luen Free Online GST Invoice Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator — GST & Multi-Currency PDF | Luen",
    description:
      "Generate clean, compliant GST & multi-currency vector PDF invoices in seconds. Free instant download.",
    images: ["/og-image.png"],
    creator: "@luen_in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.luen.in/#website",
        "url": "https://www.luen.in",
        "name": "Luen",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.luen.in/blog?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        "@id": "https://www.luen.in/#app",
        "name": "Luen Invoice Generator",
        "url": "https://www.luen.in",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "description":
          "Free browser-based invoice generator for freelancers and businesses. Features built-in GST calculation, LUT export support, and instant vector PDF downloads.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR",
          "category": "Free",
        },
        "featureList": [
          "Instant Vector PDF Invoice Generation",
          "Indian GST (CGST, SGST, IGST) Auto-Calculation",
          "LUT Zero-Rated Export Compliance",
          "Multi-Currency Invoicing (USD, EUR, GBP, INR)",
          "Direct UPI QR Code Payment Embedding",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://www.luen.in/#organization",
        "name": "Luen",
        "url": "https://www.luen.in",
        "logo": "https://www.luen.in/favicon.png",
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