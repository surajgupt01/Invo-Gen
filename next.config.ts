import type { NextConfig } from "next";

// next.config.ts

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};



export default nextConfig;
