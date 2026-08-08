import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "../../component/Nav";
import Footer from "../../component/Footer";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-data";

// 1. Update Props interface so params is a Promise
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

// 2. Await params inside generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Luen`,
    description: post.description,
  };
}

// 3. Make the page component async and await params
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

      <div className="w-full min-h-screen bg-[#FAFAFA] text-zinc-800 font-sans selection:bg-teal-100 selection:text-teal-900 scroll-smooth">
        <Nav />

        <main className="w-[90%] max-w-5xl mx-auto pt-8 md:pt-10 pb-12">
          
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-zinc-200/80">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-block text-[11px] font-mono text-teal-600 uppercase tracking-widest">
                {post.category}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-snug">
                {post.title}
              </h1>

              <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
                {post.description}
              </p>

              <div className="pt-1">
                <Link
                  href="/blog"
                  className="inline-block px-2.5 py-1 text-[11px] font-medium bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200 rounded-xs transition-colors"
                >
                  ← Back to all articles
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-end text-[11px] font-sans text-zinc-500 space-y-1 lg:text-right">
              <div>
                <span className="text-zinc-800 font-semibold">Published:</span> {post.publishedDate}
              </div>
              <div>
                <span className="text-zinc-800 font-semibold">Read Time:</span> {post.readTime}
              </div>
              <div>
                <span className="text-zinc-800 font-semibold">Author:</span> {post.author}
              </div>
            </div>

          </div>

          {/* Article Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
            
            {/* Table of Contents Sidebar */}
            <aside className="lg:col-span-4 space-y-2.5 text-xs font-sans lg:sticky lg:top-8 bg-white p-4 rounded-xs border border-zinc-200/80 shadow-2xs">
              <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block mb-2 border-b border-zinc-100 pb-1.5">
                On this page
              </span>
              <nav className="space-y-2">
                {post.content.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-zinc-600 hover:text-zinc-950 transition font-medium text-[11px] sm:text-xs leading-normal"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Article Body */}
            <article className="lg:col-span-8 text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed space-y-8">
              {post.content.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-8 space-y-2.5">
                  <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                    {section.title}
                  </h2>

                  {section.paragraphs.map((p, idx) => (
                    <p key={idx} className="leading-relaxed">{p}</p>
                  ))}

                  {section.bulletPoints && (
                    <ul className="space-y-1.5 pt-1 pl-4 list-disc marker:text-zinc-400">
                      {section.bulletPoints.map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed">{bullet}</li>
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