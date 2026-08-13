import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteMetadata, siteUrl } from "../../site";
import { ArticleHeader } from "./article-header";

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
};

const posts: BlogPost[] = [
  {
    id: 1,
    slug: "distributed-systems-clock-skew",
    title: "Clock Skew and the Fallacies of Distributed Time",
    excerpt: "How physical clocks lie to your system, why NTP is not enough, and the case for hybrid logical clocks in modern distributed databases.",
    date: "2026-07-28",
    readTime: "12 min",
    tags: ["distributed-systems", "databases"],
  },
  {
    id: 2,
    slug: "rust-async-executor",
    title: "Writing a Minimal Async Executor in Rust",
    excerpt: "A deep dive into building a single-threaded async runtime from scratch — task queues, waker mechanics, and the poll model explained without magic.",
    date: "2026-07-10",
    readTime: "18 min",
    tags: ["rust", "async", "systems"],
  },
  {
    id: 3,
    slug: "btree-storage-engine",
    title: "B-Trees at the Storage Layer: A Field Guide",
    excerpt: "From page layout to WAL integration, this post walks through how modern storage engines implement B-tree variants for durability and concurrency.",
    date: "2026-06-22",
    readTime: "15 min",
    tags: ["databases", "storage"],
  },
  {
    id: 4,
    slug: "llm-inference-latency",
    title: "Taming Latency in LLM Inference Serving",
    excerpt: "Continuous batching, speculative decoding, and KV-cache management — the techniques that actually move the needle on p99 latency at scale.",
    date: "2026-06-05",
    readTime: "10 min",
    tags: ["ml-systems", "inference"],
  },
  {
    id: 5,
    slug: "linux-io-uring",
    title: "io_uring and the New World of Async I/O on Linux",
    excerpt: "A practitioner's look at io_uring: submission queues, completion queues, fixed buffers, and what it means for server application design.",
    date: "2026-05-19",
    readTime: "14 min",
    tags: ["linux", "systems", "async"],
  },
  {
    id: 6,
    slug: "raft-consensus",
    title: "Raft Is Not as Simple as It Looks",
    excerpt: "Corner cases in leader election, log replication subtleties, and configuration changes — the parts the paper glosses over that bite you in production.",
    date: "2026-05-03",
    readTime: "16 min",
    tags: ["distributed-systems", "consensus"],
  },
  {
    id: 7,
    slug: "zero-copy-networking",
    title: "Zero-Copy Networking: sendfile, splice, and Beyond",
    excerpt: "How to move data from disk to socket without ever touching userspace — the kernel interfaces that make high-throughput servers possible.",
    date: "2026-04-17",
    readTime: "11 min",
    tags: ["linux", "systems", "networking"],
  },
  {
    id: 8,
    slug: "consistent-hashing-deep-dive",
    title: "Consistent Hashing: What Papers Don't Tell You",
    excerpt: "Virtual nodes, bounded loads, and the implementation choices that determine whether consistent hashing actually works for your use case.",
    date: "2026-04-02",
    readTime: "13 min",
    tags: ["distributed-systems", "algorithms"],
  },
];

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

function CoverArt({ post }: { post: BlogPost }) {
  return (
    <div className={`article-cover thumbnail-${post.id}`} aria-hidden="true">
      <div className="cover-grid" />
      <span className="cover-index">FIELD NOTE / {String(post.id).padStart(2, "0")}</span>
      <span className="cover-topic">{post.tags[0]}</span>
      <svg viewBox="0 0 240 160" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="120" cy="80" r="54" />
        <circle cx="120" cy="80" r="28" />
        <circle cx="120" cy="26" r="7" />
        <circle cx="168" cy="55" r="7" />
        <circle cx="168" cy="109" r="7" />
        <circle cx="120" cy="134" r="7" />
        <circle cx="72" cy="109" r="7" />
        <circle cx="72" cy="55" r="7" />
        <path d="M120 33v19m42 7-17 10m17 36-17-10m-25 32v-19m-42-3 17-10M78 59l17 10" />
      </svg>
    </div>
  );
}

function RelatedThumbnail({ post }: { post: BlogPost }) {
  return (
    <div className={`related-thumbnail thumbnail-${post.id}`} aria-hidden="true">
      <span>{String(post.id).padStart(2, "0")}</span>
      <small>{post.tags[0]}</small>
      <svg viewBox="0 0 100 64" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="68" cy="32" r="20" />
        <circle cx="68" cy="32" r="7" />
        <path d="M16 32h30m22-20v40M51 18l17 14-17 14" />
      </svg>
    </div>
  );
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadataLegacy({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  return post
    ? { title: `${post.title} — dev.notes`, description: post.excerpt }
    : { title: "Không tìm thấy bài viết — dev.notes" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return { title: "Không tìm thấy bài viết", robots: { index: false, follow: false } };
  }

  const canonicalPath = `/blog/${post.slug}`;
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
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  const relatedPosts = posts
    .filter((item) => item.id !== post.id && item.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="site-shell article-page">
      <ArticleHeader posts={posts} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: "vi-VN",
            mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
            author: { "@type": "Person", name: "Nguyễn Đức Nhật" },
            publisher: { "@type": "Organization", name: siteMetadata.name },
            keywords: post.tags.join(", "),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <header className="site-header" hidden>
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="dev.notes — Trang chủ">
            <span className="brand-mark">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m4 17 6-6-6-6" /><path d="M12 19h8" /></svg>
            </span>
            <span className="brand-name">dev<span>.</span>notes</span>
            <span className="brand-tagline">Ghi chép về lập trình &amp; hệ thống</span>
          </Link>
          <Link className="back-to-blog" href="/#articles"><Arrow direction="left" /> Tất cả bài viết</Link>
        </div>
      </header>

      <main>
        <header className="article-heading">
          <Link className="article-back" href="/#articles"><Arrow direction="left" /> Quay lại blog</Link>
          {/* <div className="article-kicker"><i />{post.tags[0]}<span>Field note #{String(post.id).padStart(2, "0")}</span></div> */}
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="article-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>•</span>
            <span>Nguyễn Đức Nhật</span>
          </div>
          <div className="article-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </header>

        <div className="article-cover-wrap"><CoverArt post={post} /></div>

        <div className="article-layout">
          <aside className="article-toc">
            <span className="toc-title">Trong bài viết</span>
            <nav>
              <a href="#context">01 — Bối cảnh</a>
              <a href="#mental-model">02 — Mô hình tư duy</a>
              <a href="#implementation">03 — Triển khai</a>
              <a href="#tradeoffs">04 — Đánh đổi</a>
            </nav>
            <div className="toc-divider" />
            <span className="toc-note">Cập nhật lần cuối<br />{formatDate(post.date)}</span>
          </aside>

          <article className="article-body">
            <p className="article-lead">
              {post.excerpt} Bài viết này đi từ mô hình nền tảng đến các quyết định kỹ thuật cần thiết khi đưa ý tưởng vào một hệ thống thực tế.
            </p>

            <section id="context">
              <span className="section-number">01</span>
              <h2>Bối cảnh và vấn đề thực sự</h2>
              <p>
                Những hệ thống tưởng như đơn giản thường trở nên khó đoán khi tải tăng, dữ liệu phân tán và nhiều tiến trình cùng thay đổi trạng thái. Vấn đề không nằm ở một API cụ thể, mà ở các giả định ẩn bên dưới cách chúng ta thiết kế.
              </p>
              <p>
                Với <strong>{post.title.toLowerCase()}</strong>, bước đầu tiên là xác định ranh giới tin cậy: điều gì được đảm bảo, điều gì chỉ đúng trong điều kiện lý tưởng, và thất bại sẽ xuất hiện ở đâu.
              </p>
              <blockquote>
                Một thiết kế tốt không loại bỏ mọi lỗi. Nó khiến lỗi trở nên có thể quan sát, có giới hạn và phục hồi được.
              </blockquote>
            </section>

            <section id="mental-model">
              <span className="section-number">02</span>
              <h2>Xây dựng mô hình tư duy</h2>
              <p>
                Hãy tách hệ thống thành ba lớp: trạng thái, cơ chế phối hợp và đường truyền dữ liệu. Mỗi lớp có nhịp độ thay đổi khác nhau và cần một chiến lược quan sát riêng.
              </p>
              <div className="article-callout">
                <span>Ghi chú</span>
                <p>Đừng tối ưu một chỉ số đơn lẻ. Hãy theo dõi cả throughput, tail latency và chi phí phục hồi sau lỗi.</p>
              </div>
              <ul>
                <li>Định nghĩa invariant trước khi chọn cấu trúc dữ liệu.</li>
                <li>Mô phỏng đường lỗi, không chỉ happy path.</li>
                <li>Đo p95/p99 thay vì chỉ nhìn giá trị trung bình.</li>
              </ul>
            </section>

            <section id="implementation">
              <span className="section-number">03</span>
              <h2>Từ thiết kế đến triển khai</h2>
              <p>
                Một vòng lặp triển khai nhỏ giúp giả định được kiểm chứng sớm. Đoạn mã giả dưới đây thể hiện cấu trúc xử lý có giới hạn, quan sát được và chủ động với lỗi.
              </p>
              <div className="code-block">
                <div><span>pipeline.ts</span><button type="button">TypeScript</button></div>
                <pre><code>{`async function processBatch(batch: Task[]) {
  const results = await Promise.allSettled(
    batch.map(task => execute(task))
  );

  return results.map((result, index) => ({
    id: batch[index].id,
    ok: result.status === "fulfilled",
    value: result.status === "fulfilled"
      ? result.value
      : null,
  }));
}`}</code></pre>
              </div>
              <p>
                Điểm quan trọng không phải cú pháp mà là ranh giới của batch, cách lỗi được giữ lại và dữ liệu quan sát đi cùng từng tác vụ.
              </p>
            </section>

            <section id="tradeoffs">
              <span className="section-number">04</span>
              <h2>Đánh đổi trong production</h2>
              <p>
                Mọi cơ chế đều đổi sự đơn giản lấy hiệu năng, hoặc đổi độ trễ lấy tính nhất quán. Quyết định đúng phụ thuộc vào tải thực, khả năng vận hành và mức độ chấp nhận lỗi của sản phẩm.
              </p>
              <div className="tradeoff-grid">
                <div><span>Ưu tiên</span><strong>Tính quan sát</strong><p>Metrics và traces phải giải thích được hành vi của hệ thống.</p></div>
                <div><span>Tránh</span><strong>Tối ưu quá sớm</strong><p>Chỉ thêm độ phức tạp sau khi có số liệu chứng minh.</p></div>
              </div>
            </section>

            <footer className="article-author">
              <div className="author-avatar">DN</div>
              <div><span>Viết bởi</span><strong>Nguyễn Đức Nhật</strong><p>Software engineer, ghi chép về hệ thống và cách phần mềm vận hành dưới tải thực tế.</p></div>
            </footer>
          </article>
        </div>

        {relatedPosts.length > 0 && (
          <section className="related-posts">
            <div className="related-heading"><span>Bài viết liên quan</span><i /></div>
            <div className="related-grid">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <RelatedThumbnail post={related} />
                  <div className="related-copy"><time dateTime={related.date}>{formatDate(related.date)}</time><h3>{related.title}</h3></div>
                  <Arrow />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div><span>dev<span className="accent">.</span>notes — chia sẻ kiến thức lập trình</span><span>© 2026</span></div>
      </footer>
    </div>
  );
}
