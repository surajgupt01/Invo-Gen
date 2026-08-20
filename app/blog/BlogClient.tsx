"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import type { BlogPost } from "@/lib/blog-data";
import { BookOpen, Clock, ArrowRight, Search, Sparkles, X } from "lucide-react";

interface CategoryTab {
  label: string;
  value: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { label: "All", value: "all" },
  { label: "Company", value: "company" },
  { label: "Automation", value: "automation" },
  { label: "GST & Tax", value: "gst-tax" },
  { label: "Engineering", value: "engineering" },
  { label: "International", value: "international" },
];

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-xs text-zinc-400">
          Loading article telemetry...
        </div>
      }
    >
      <BlogContent posts={posts} />
    </Suspense>
  );
}

function BlogContent({ posts }: { posts: BlogPost[] }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let list = currentTab === "all" ? posts : posts.filter((p) => p.categoryTab === currentTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, currentTab, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-zinc-800 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
      <Nav />

      <main className="w-[92%] max-w-5xl mx-auto pt-6 sm:pt-10 pb-14 space-y-5">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200/80 pb-4 gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-mono text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-2xs uppercase tracking-widest font-bold">
              <BookOpen className="w-2.5 h-2.5 text-teal-600" />
              <span>KNOWLEDGE BASE &amp; GUIDES</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 font-sans">
              Blog &amp; Technical Insights
            </h1>
            <p className="text-[11px] text-zinc-500 font-sans max-w-md leading-relaxed">
              Engineering notes, GST tax compliance engines, and automated billing workflows for modern businesses.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
            <span>SHOWING: <strong className="text-zinc-800 font-bold">{filteredPosts.length}</strong> / {posts.length}</span>
            <span>•</span>
            <a href="mailto:support@luen.in" className="text-teal-700 hover:underline font-bold">
              support@luen.in
            </a>
          </div>
        </div>

        {/* Filter & Live Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xs border border-zinc-200/80 shadow-2xs">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {CATEGORY_TABS.map((tab) => {
              const isActive = currentTab === tab.value;
              return (
                <Link
                  key={tab.value}
                  href={tab.value === "all" ? "/blog" : `/blog?tab=${tab.value}`}
                  className={`px-2.5 py-1 text-[10px] font-mono font-semibold rounded-2xs transition-all uppercase tracking-wider ${
                    isActive
                      ? "bg-zinc-950 text-white shadow-2xs"
                      : "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200/60"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Quick Keyword Filter */}
          {/* <div className="relative min-w-[200px]">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-[10px] font-mono pl-7 pr-7 py-1 rounded-2xs focus:outline-none focus:border-teal-600 transition placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div> */}
        </div>

        {/* Compact Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {filteredPosts.map((post: BlogPost) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between bg-white p-4 sm:p-4.5 rounded-2xs border border-zinc-200/80 shadow-2xs hover:border-zinc-300 hover:shadow-xs transition-all space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-teal-700 bg-teal-50 border border-teal-200/80 px-1.5 py-0.5 rounded-2xs uppercase tracking-tight">
                      {post.category}
                    </span>
                    <span className="text-zinc-400 flex items-center gap-1 text-[9px]">
                      <Clock className="w-2.5 h-2.5 text-zinc-400" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug group-hover:text-teal-700 transition-colors font-sans">
                    <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 font-sans">
                    {post.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>By {post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-bold group-hover:translate-x-0.5 transition-transform text-[10px]"
                    aria-label={`Read ${post.title}`}
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-zinc-200/80 rounded-2xs space-y-2">
            <Sparkles className="w-5 h-5 text-zinc-400 mx-auto" />
            <p className="text-[11px] font-mono font-semibold text-zinc-700 uppercase">
              No matching articles found
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                window.history.pushState({}, "", "/blog");
              }}
              className="text-[10px] text-teal-700 underline font-mono cursor-pointer"
            >
              Clear filters and search →
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}