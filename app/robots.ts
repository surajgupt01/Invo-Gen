import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.luen.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/docs",
          "/terms",
          "/privacy",
          "/refund",
          "/support",
          "/pricing",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/api/",
          "/api/*",
          "/auth/",
          "/auth/*",
          "/_next/",
          "/_next/*",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/docs",
          "/terms",
          "/privacy",
          "/support",
          "/pricing",
        ],
        disallow: [
          "/dashboard/",
          "/api/",
          "/auth/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}