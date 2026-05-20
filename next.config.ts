import type { NextConfig } from "next";

// next.config.ts

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingRoot: process.cwd(),
};



export default nextConfig;
