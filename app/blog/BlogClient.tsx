"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import type { BlogPost } from "@/lib/blog-data";
import { Clock, ArrowRight, Search, Sparkles, X } from "lucide-react";

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
        <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs text-zinc-400">
          Loading articles...
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
    <div className="w-full min-h-screen bg-white text-zinc-950 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20 space-y-8">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200 pb-8 gap-4">
          <div className="space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-medium">
              Knowledge Base &amp; Guides
            </p>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-950 font-sans">
              Blog &amp; Technical Insights
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-sans max-w-xl leading-relaxed">
              Engineering notes, GST tax compliance engines, and automated billing workflows for modern businesses.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 self-start sm:self-auto">
            <span>
              Showing: <strong className="text-zinc-950 font-semibold">{filteredPosts.length}</strong> / {posts.length}
            </span>
          </div>
        </div>

        {/* Filter & Live Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORY_TABS.map((tab) => {
              const isActive = currentTab === tab.value;
              return (
                <Link
                  key={tab.value}
                  href={tab.value === "all" ? "/blog" : `/blog?tab=${tab.value}`}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Quick Keyword Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-950 text-xs font-sans pl-9 pr-8 py-1.5 rounded-md focus:outline-none focus:border-zinc-950 transition-colors placeholder:text-zinc-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {filteredPosts.map((post: BlogPost) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between bg-white p-6 sm:p-7 rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-zinc-400 flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-medium text-zinc-950 leading-snug group-hover:text-teal-700 transition-colors font-sans tracking-tight">
                    <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed line-clamp-2 font-sans">
                    {post.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>By {post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-zinc-950 group-hover:text-teal-700 font-semibold group-hover:translate-x-0.5 transition-all text-xs"
                    aria-label={`Read ${post.title}`}
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-zinc-50/50 border border-zinc-200 rounded-xl space-y-3">
            <Sparkles className="w-6 h-6 text-zinc-400 mx-auto" />
            <p className="text-xs font-mono font-medium text-zinc-700 uppercase">
              No matching articles found
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                window.history.pushState({}, "", "/blog");
              }}
              className="text-xs text-teal-700 underline font-mono cursor-pointer hover:text-teal-800"
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