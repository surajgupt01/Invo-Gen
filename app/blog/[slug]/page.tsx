import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "../../component/Nav";
import Footer from "../../component/Footer";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-data";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Luen`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedDate,
    author: {
      "@type": "Organization",
      name: "Luen",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonStringify(jsonLd) }}
      />

      <div className="w-full min-h-screen bg-white text-zinc-950 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
        <Nav />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20 space-y-10">
          
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-zinc-200">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 transition-colors font-medium group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to all articles</span>
                </Link>

                <span className="text-zinc-300">•</span>

                <span className="text-[10px] font-mono font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-zinc-950 leading-[1.15]">
                {post.title}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
                {post.description}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-end text-xs font-mono text-zinc-400 space-y-2 lg:text-right">
              <div className="flex lg:justify-end items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-600 font-medium">Published:</span>
                <span>{post.publishedDate}</span>
              </div>
              <div className="flex lg:justify-end items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-600 font-medium">Read Time:</span>
                <span>{post.readTime}</span>
              </div>
              <div className="flex lg:justify-end items-center gap-2">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-600 font-medium">Author:</span>
                <span>{post.author}</span>
              </div>
            </div>

          </div>

          {/* Article Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Table of Contents Sidebar */}
            <aside className="lg:col-span-4 space-y-3 font-sans lg:sticky lg:top-20 bg-white p-5 rounded-xl border border-zinc-200 shadow-xs">
              <span className="text-[11px] text-zinc-400 font-mono font-medium uppercase tracking-wider block border-b border-zinc-100 pb-2">
                On This Page
              </span>
              <nav className="space-y-1.5">
                {post.content.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-zinc-600 hover:text-zinc-950 transition-colors text-xs leading-relaxed py-1"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Article Content */}
            <article className="lg:col-span-8 text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed space-y-10">
              {post.content.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24 space-y-3">
                  <h2 className="text-lg sm:text-xl font-medium text-zinc-950 tracking-tight">
                    {section.title}
                  </h2>

                  {section.paragraphs.map((p, idx) => (
                    <p key={idx} className="leading-relaxed text-zinc-500">
                      {p}
                    </p>
                  ))}

                  {section.bulletPoints && (
                    <ul className="space-y-2 pt-1 pl-4 list-disc marker:text-zinc-400 text-zinc-500">
                      {section.bulletPoints.map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>

          </div>

        </main>

        <Footer />
      </div>
    </>
  );
}

function jsonStringify(obj: unknown) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}