"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <BlogPageContent />
    </Suspense>
  );
}

function BlogPageContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";

  const filteredPosts = currentTab === "all"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.categoryTab === currentTab);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-zinc-800 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
      <Nav />

      <main className="w-[90%] max-w-5xl mx-auto pt-8 md:pt-10 pb-12">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-zinc-200/80">
          
          {/* Left: Title & Intro */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="inline-block text-[11px] font-mono text-teal-600 uppercase tracking-widest">
              RESOURCES & GUIDES
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Blog & Insights
            </h1>

            <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
              Read our guides on invoicing automation, GST compliance, and billing systems. Built for freelancers and small businesses who want clean, compliant billing.
            </p>

            {/* Category Filter Tab Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[
                { label: "All Articles", value: "all" },
                { label: "Company", value: "company" },
                { label: "Automation", value: "automation" },
                { label: "GST & Tax", value: "gst-tax" },
                { label: "Engineering", value: "engineering" },
                { label: "International", value: "international" },
              ].map((tab) => (
                <Link
                  key={tab.value}
                  href={tab.value === "all" ? "/blog" : `/blog?tab=${tab.value}`}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-xs transition-colors ${
                    currentTab === tab.value
                      ? "bg-zinc-950 text-white shadow-2xs"
                      : "bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Metadata Details */}
          <div className="lg:col-span-5 flex flex-col justify-end text-[11px] font-sans text-zinc-500 space-y-1 lg:text-right">
            <div>
              <span className="text-zinc-800 font-semibold">Updated:</span> August 2026
            </div>
            <div>
              <span className="text-zinc-800 font-semibold">Focus:</span> GST & Global Multi-Currency
            </div>
            <div>
              <span className="text-zinc-800 font-semibold">Questions?</span> Contact{" "}
              <a href="mailto:support@luen.in" className="text-zinc-800 underline hover:text-teal-600 transition">
                support@luen.in
              </a>
            </div>
          </div>

        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          {filteredPosts.map((post: BlogPost) => (
            <article
              key={post.slug}
              className="flex flex-col justify-between bg-white p-4 sm:p-5 rounded-xs border border-zinc-200/80 shadow-2xs hover:border-zinc-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-teal-600 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-zinc-400">{post.readTime}</span>
                </div>

                <h2 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug hover:text-teal-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                  {post.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                <span>By {post.author}</span>
                <span>{post.publishedDate}</span>
              </div>
            </article>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}