import { compile, run } from "@mdx-js/mdx";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as jsxRuntime from "react/jsx-runtime";
import { getAllPosts, getPostBySlug, getPostSummaries, type Post } from "@/lib/posts";
import { siteMetadata, siteUrl } from "../../site";
import { ArticleHeader } from "./article-header";
import { mdxComponents } from "./mdx-components";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg className={direction === "left" ? "arrow-left" : ""} aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" /><path d="M7 7h10v10" />
    </svg>
  );
}

function CoverArt({ post }: { post: Post }) {
  return (
    <div className={`article-cover thumbnail-${post.id}`}>
      {post.cover && <Image className="article-cover-image" src={post.cover} alt="" fill sizes="(max-width: 1024px) 100vw, 1024px" />}
      <div className="cover-grid" />
      <span className="cover-index">FIELD NOTE / {String(post.id).padStart(2, "0")}</span>
      <span className="cover-topic">{post.tags[0] ?? "notes"}</span>
      {!post.cover && (
        <svg viewBox="0 0 240 160" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <circle cx="120" cy="80" r="54" /><circle cx="120" cy="80" r="28" /><circle cx="120" cy="26" r="7" />
          <circle cx="168" cy="55" r="7" /><circle cx="168" cy="109" r="7" /><circle cx="120" cy="134" r="7" />
          <circle cx="72" cy="109" r="7" /><circle cx="72" cy="55" r="7" />
          <path d="M120 33v19m42 7-17 10m17 36-17-10m-25 32v-19m-42-3 17-10M78 59l17 10" />
        </svg>
      )}
    </div>
  );
}

function RelatedThumbnail({ post }: { post: Post }) {
  return (
    <div className={`related-thumbnail thumbnail-${post.id}`}>
      {post.cover && <Image className="related-thumbnail-image" src={post.cover} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" />}
      <span>{String(post.id).padStart(2, "0")}</span>
      <small>{post.tags[0] ?? "notes"}</small>
      {!post.cover && <svg viewBox="0 0 100 64" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><circle cx="68" cy="32" r="20" /><circle cx="68" cy="32" r="7" /><path d="M16 32h30m22-20v40M51 18l17 14-17 14" /></svg>}
    </div>
  );
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post) return { title: "Không tìm thấy bài viết", robots: { index: false, follow: false } };

  const canonicalPath = `/blog/${post.slug}`;
  const image = post.cover ?? "/opengraph-image";
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      locale: siteMetadata.locale,
      url: canonicalPath,
      siteName: siteMetadata.name,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: ["Nguyễn Đức Nhật"],
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [image] },
  };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();

  const { default: MdxContent } = await run(
    String(await compile(post.content, { outputFormat: "function-body" })),
    jsxRuntime,
  );
  const summaries = getPostSummaries();
  const relatedPosts = getAllPosts()
    .filter((item) => item.slug !== post.slug && item.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="site-shell article-page">
      <ArticleHeader posts={summaries} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title,
            description: post.excerpt, datePublished: post.date, dateModified: post.date, inLanguage: "vi-VN",
            mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
            author: { "@type": "Person", name: "Nguyễn Đức Nhật" },
            publisher: { "@type": "Organization", name: siteMetadata.name }, keywords: post.tags.join(", "),
            image: post.cover ? `${siteUrl}${post.cover}` : `${siteUrl}/opengraph-image`,
          }).replace(/</g, "\\u003c"),
        }}
      />

      <main>
        <header className="article-heading">
          <Link className="article-back" href="/#articles"><Arrow direction="left" /> Quay lại blog</Link>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="article-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><span>•</span><span>Nguyễn Đức Nhật</span></div>
          <div className="article-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </header>

        <div className="article-cover-wrap"><CoverArt post={post} /></div>

        <div className="article-layout">
          <aside className="article-toc">
            <span className="toc-title">Bài viết</span>
            <nav><a href="#article-content">Nội dung</a></nav>
            <div className="toc-divider" />
            <span className="toc-note">Cập nhật lần cuối<br />{formatDate(post.date)}</span>
          </aside>

          <article className="article-body" id="article-content">
            {post.excerpt && <p className="article-lead">{post.excerpt}</p>}
            <MdxContent components={mdxComponents} />
            <footer className="article-author"><div className="author-avatar">DN</div><div><span>Viết bởi</span><strong>Nguyễn Đức Nhật</strong><p>Software engineer, ghi chép về hệ thống và cách phần mềm vận hành dưới tải thực tế.</p></div></footer>
          </article>
        </div>

        {relatedPosts.length > 0 && (
          <section className="related-posts">
            <div className="related-heading"><span>Bài viết liên quan</span><i /></div>
            <div className="related-grid">
              {relatedPosts.map((related) => <Link key={related.id} href={`/blog/${related.slug}`}><RelatedThumbnail post={related} /><div className="related-copy"><time dateTime={related.date}>{formatDate(related.date)}</time><h3>{related.title}</h3></div><Arrow /></Link>)}
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer"><div><span>dev<span className="accent">.</span>notes — chia sẻ kiến thức lập trình</span><span>© 2026</span></div></footer>
    </div>
  );
}
