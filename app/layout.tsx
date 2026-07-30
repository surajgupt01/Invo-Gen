import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import Providers from "./providers";

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
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.luen.in"),
  title: {
    default: "Luen — Professional Invoice Generator",
    template: "%s | Luen",
  },
  description:
    "Generate, customize, and manage professional PDF invoices without spreadsheets. Built for freelancers and small businesses.",
  keywords: [
    "Invoice Generator",
    "PDF Invoicing",
    "GST Invoicing",
    "Freelance Billing",
    "Multi-Currency Invoices",
    "Small Business Invoicing",
  ],
  authors: [{ name: "Luen Team" }],
  creator: "Luen",
  publisher: "Luen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Luen — Professional Invoice Generator",
    description:
      "Generate, customize, and manage professional PDF invoices without spreadsheets.",
    url: "https://www.luen.in",
    siteName: "Luen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/dash-Img.png", // Recommended: Use your dashboard preview image for rich social cards
        width: 1200,
        height: 630,
        alt: "Luen Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luen — Professional Invoice Generator",
    description:
      "Generate, customize, and manage professional PDF invoices without spreadsheets.",
    images: ["/dash-Img.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#FAFAFA] text-zinc-900 antialiased selection:bg-teal-100 selection:text-teal-900 min-h-screen flex flex-col`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}