import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luen",
  description: "Generate Professional Invoices",

  openGraph: {
    title: "Luen",
    description: "Generate Professional Invoices",
    url: "https://www.Luen.in", 
    siteName: "Luen",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "Luen - Invoice Platform",
      },
    ],
    type: "website",
  },
    twitter: {
    card: "summary_large_image",
    title: "Luen",
    description: "Generate Professional Invoices",
    images: ["/favicon.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        
      </body>
    </html>
  );
}



