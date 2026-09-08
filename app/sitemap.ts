import { MetadataRoute } from "next";

// Fetch posts dynamically from your CMS, DB, or markdown files
async function getAllBlogSlugs(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  return [
    {
      slug: "about-luen-how-our-browser-first-invoicing-works",
      updatedAt: "2026-08-08T00:00:00.000Z",
    },
    {
      slug: "modern-digital-invoice-templates-guide",
      updatedAt: "2026-08-10T00:00:00.000Z",
    },
    {
      slug: "fast-browser-pdf-generation-architecture",
      updatedAt: "2026-07-15T00:00:00.000Z",
    },
    {
      slug: "international-invoice-currency-formatting-standards",
      updatedAt: "2026-07-14T00:00:00.000Z",
    },
    {
      slug: "cutting-hidden-cross-border-fx-invoicing-fees",
      updatedAt: "2026-07-22T00:00:00.000Z",
    },
    {
      slug: "gst-compliance-digital-invoicing-guide",
      updatedAt: "2026-07-28T00:00:00.000Z",
    },
    {
      slug: "automate-invoicing-get-paid-faster",
      updatedAt: "2026-08-02T00:00:00.000Z",
    },
    {
      slug: "international-multi-currency-invoicing-guide",
      updatedAt: "2026-06-30T00:00:00.000Z",
    },
    {
      slug: "how-to-create-an-invoice-step-by-step-guide",
      updatedAt: "2026-08-18T00:00:00.000Z",
    },
    {
      slug: "what-should-an-invoice-include-essential-elements",
      updatedAt: "2026-08-20T00:00:00.000Z",
    },
    {
      slug: "how-to-invoice-a-client-as-a-freelancer",
      updatedAt: "2026-08-22T00:00:00.000Z",
    },
    {
      slug: "invoice-payment-terms-guide-net-30-net-15",
      updatedAt: "2026-08-28T00:00:00.000Z",
    },
    {
      slug: "retainer-invoicing-guide-freelancers-agencies",
      updatedAt: "2026-09-02T00:00:00.000Z",
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.luen.in";
  const currentDate = new Date().toISOString();

  // 1. Fetch dynamic blog posts
  const posts = await getAllBlogSlugs();

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 2. Static & Parameterized entries
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms?tab=terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms?tab=privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [...staticEntries, ...blogEntries];
}
