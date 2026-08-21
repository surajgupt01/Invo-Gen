import { MetadataRoute } from "next";

// Fetch posts from your database, CMS, or local markdown files
async function getAllBlogSlugs(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  // Example: return await db.posts.findMany({ select: { slug: true, updatedAt: true } });
  return [
    {
      slug: "about-luen-how-our-browser-first-invoicing-work",
      updatedAt: "2026-08-15T00:00:00.000Z",
    },
    {
      slug: "automate-invoicing-get-paid-faster",
      updatedAt: "2026-08-15T00:00:00.000Z",
    },
    {
      slug: "gst-compliance-digital-invoicing-guide",
      updatedAt: "2026-08-15T00:00:00.000Z",
    },
    {
      slug: "fast-browser-pdf-generation-architecture",
      updatedAt: "2026-08-15T00:00:00.000Z",
    },
    {
      slug: "international-multi-currency-invoicing-guide",
      updatedAt: "2026-08-15T00:00:00.000Z",
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

  // 2. Static routes (removed the /#PriceSection anchor)
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
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
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [...staticEntries, ...blogEntries];
}
