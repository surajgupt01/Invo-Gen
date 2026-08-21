import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog-data";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Invoicing, GST & Engineering Insights | Luen Blog",
  description:
    "Explore in-depth articles on freelance invoicing, Indian GST compliance, cross-border LUT rules, PDF vector canvas architecture, and SaaS billing systems.",
  keywords: [
    "Invoicing Guides",
    "GST Invoicing Guide",
    "Freelancer Tax Compliance India",
    "LUT Export of Services",
    "SaaS Billing Architecture",
    "PDF Vector Generation",
    "Multi-Currency Invoicing",
  ],
  alternates: {
    canonical: "https://www.luen.in/blog",
  },
  openGraph: {
    title: "Luen Blog — Invoicing, GST & Engineering Insights",
    description:
      "Expert guides on invoicing automation, tax compliance, and modern billing systems for freelancers and small businesses.",
    url: "https://www.luen.in/blog",
    siteName: "Luen",
    type: "website",
  },
};

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Luen Blog & Insights",
    url: "https://www.luen.in/blog",
    description:
      "Guides on invoicing automation, GST compliance, and billing systems for freelancers and modern businesses.",
    publisher: {
      "@type": "Organization",
      name: "Luen",
      url: "https://www.luen.in",
      logo: {
        "@type": "ImageObject",
        url: "https://www.luen.in/favicon.png",
      },
    },
    blogPost: BLOG_POSTS.map((post, idx) => ({
      "@type": "BlogPosting",
      position: idx + 1,
      headline: post.title,
      description: post.description,
      url: `https://www.luen.in/blog/${post.slug}`,
      datePublished: post.publishedDate,
      author: {
        "@type": "Person",
        name: post.author,
      },
    })),
  };

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans selection:bg-teal-100 selection:text-teal-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogClient posts={BLOG_POSTS} />
    </div>
  );
}