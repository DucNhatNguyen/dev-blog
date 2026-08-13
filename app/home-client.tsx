"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import type { PostSummary } from "@/lib/posts";
import { getServerThemeSnapshot, getThemeSnapshot, setThemePreference, subscribeToTheme } from "./theme";

type Post = PostSummary;

/* Legacy seed data retained temporarily while migrating existing posts to MDX.
const posts: Post[] = [
  {
    id: 1,
    slug: "distributed-systems-clock-skew",
    title: "Clock Skew and the Fallacies of Distributed Time",
    excerpt:
      "How physical clocks lie to your system, why NTP is not enough, and the case for hybrid logical clocks in modern distributed databases.",
    date: "2026-07-28",
    readTime: "12 min",
    tags: ["distributed-systems", "databases"],
    featured: true,
  },
  {
    id: 2,
    slug: "rust-async-executor",
    title: "Writing a Minimal Async Executor in Rust",
    excerpt:
      "A deep dive into building a single-threaded async runtime from scratch — task queues, waker mechanics, and the poll model explained without magic.",
    date: "2026-07-10",
    readTime: "18 min",
    tags: ["rust", "async", "systems"],
    featured: true,
  },
  {
    id: 3,
    slug: "btree-storage-engine",
    title: "B-Trees at the Storage Layer: A Field Guide",
    excerpt:
      "From page layout to WAL integration, this post walks through how modern storage engines implement B-tree variants for durability and concurrency.",
    date: "2026-06-22",
    readTime: "15 min",
    tags: ["databases", "storage"],
    featured: false,
  },
  {
    id: 4,
    slug: "llm-inference-latency",
    title: "Taming Latency in LLM Inference Serving",
    excerpt:
      "Continuous batching, speculative decoding, and KV-cache management — the techniques that actually move the needle on p99 latency at scale.",
    date: "2026-06-05",
    readTime: "10 min",
    tags: ["ml-systems", "inference"],
    featured: false,
  },
  {
    id: 5,
    slug: "linux-io-uring",
    title: "io_uring and the New World of Async I/O on Linux",
    excerpt:
      "A practitioner's look at io_uring: submission queues, completion queues, fixed buffers, and what it means for server application design.",
    date: "2026-05-19",
    readTime: "14 min",
    tags: ["linux", "systems", "async"],
    featured: false,
  },
  {
    id: 6,
    slug: "raft-consensus",
    title: "Raft Is Not as Simple as It Looks",
    excerpt:
      "Corner cases in leader election, log replication subtleties, and configuration changes — the parts the paper glosses over that bite you in production.",
    date: "2026-05-03",
    readTime: "16 min",
    tags: ["distributed-systems", "consensus"],
    featured: false,
  },
  {
    id: 7,
    slug: "zero-copy-networking",
    title: "Zero-Copy Networking: sendfile, splice, and Beyond",
    excerpt:
      "How to move data from disk to socket without ever touching userspace — the kernel interfaces that make high-throughput servers possible.",
    date: "2026-04-17",
    readTime: "11 min",
    tags: ["linux", "systems", "networking"],
    featured: false,
  },
  {
    id: 8,
    slug: "consistent-hashing-deep-dive",
    title: "Consistent Hashing: What Papers Don't Tell You",
    excerpt:
      "Virtual nodes, bounded loads, and the implementation choices that determine whether consistent hashing actually works for your use case.",
    date: "2026-04-02",
    readTime: "13 min",
    tags: ["distributed-systems", "algorithms"],
    featured: false,
  },
];
*/

type IconName =
  | "terminal"
  | "moon"
  | "sun"
  | "search"
  | "close"
  | "arrow"
  | "book";

function Icon({ name, size = 14 }: { name: IconName; size?: number }) {
  const paths = {
    terminal: <><path d="m4 17 6-6-6-6" /><path d="M12 19h8" /></>,
    moon: <path d="M20.8 12.5A8.5 8.5 0 1 1 11.5 3a6.5 6.5 0 0 0 9.3 9.5Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    arrow: <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
  };

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function BlogThumbnail({ post, compact = false }: { post: Post; compact?: boolean }) {
  const illustrations = [
    <><circle cx="27" cy="26" r="8" /><circle cx="73" cy="31" r="8" /><circle cx="50" cy="68" r="8" /><path d="m33 31 12 29m22-24L55 61M35 26h30" /></>,
    <><path d="M18 27h64v46H18z" /><path d="m29 41 9 8-9 8m16 0h20M25 65h50" /></>,
    <><path d="M50 16v16m0 0-24 15m24-15 24 15M26 47v26m48-26v26M26 59h48" /><circle cx="50" cy="16" r="5" /></>,
    <><path d="M16 25h18v50H16zm25 12h18v38H41zm25-20h18v58H66z" /><path d="M21 34h8m17 12h8m17-20h8" /></>,
    <><circle cx="50" cy="50" r="31" /><path d="M50 19v62M19 50h62M28 29l44 42M72 29 28 71" /><circle cx="50" cy="50" r="8" /></>,
    <><circle cx="24" cy="50" r="10" /><circle cx="50" cy="27" r="10" /><circle cx="76" cy="50" r="10" /><circle cx="50" cy="73" r="10" /><path d="m31 43 12-10m14 0 12 10m0 14L57 67m-14 0L31 57" /></>,
    <><path d="M15 31h28v18H15zm42 20h28v18H57zM43 40h14m-7 0v20" /><path d="m45 56 5 5 5-5" /></>,
    <><circle cx="50" cy="50" r="31" /><circle cx="50" cy="19" r="5" /><circle cx="78" cy="39" r="5" /><circle cx="67" cy="75" r="5" /><circle cx="30" cy="75" r="5" /><circle cx="21" cy="39" r="5" /></>,
  ];

  return (
    <div className={`blog-thumbnail thumbnail-${post.id}${compact ? " compact" : ""}`} aria-hidden="true">
      <span>{String(post.id).padStart(2, "0")}</span>
      {post.cover ? <Image className="blog-thumbnail-image" src={post.cover} alt="" fill sizes={compact ? "80px" : "(max-width: 767px) 100vw, 600px"} /> : <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.4">{illustrations[post.id - 1]}</svg>}
      <b>{post.tags[0]}</b>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function TagPill({
  tag,
  active = false,
  onClick,
}: {
  tag: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button className={`tag-pill${active ? " active" : ""}`} onClick={onClick} type="button" aria-pressed={active}>
      {tag}
    </button>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <article className="featured-card">
      <a className="featured-card-link" href={`/blog/${post.slug}`}>
        <BlogThumbnail post={post} />
        <div className="featured-content">
          <div className="featured-meta">
            <span>Featured</span><i /><time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <div className="card-footer">
            <div className="tag-group">{post.tags.map((tag) => <span className="tag-pill" key={tag}>{tag}</span>)}</div>
          </div>
        </div>
      </a>
    </article>
  );
}

function PostRow({ post }: { post: Post }) {
  return (
    <a className="post-row" href={`/blog/${post.slug}`}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <BlogThumbnail post={post} compact />
      <div className="post-copy">
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="tag-group">{post.tags.map((tag) => <span className="tag-pill" key={tag}>{tag}</span>)}</div>
      </div>
      <div className="post-action"><Icon name="arrow" size={13} /></div>
    </a>
  );
}

function SectionTitle({
  children,
  count,
}: {
  children: React.ReactNode;
  count?: number;
}) {
  return <div className="section-title"><span>{children}</span><i />{typeof count === "number" && <b>{count} bài</b>}</div>;
}

export default function HomeClient({ posts }: { posts: Post[] }) {
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [isSearchOpen, setIsSearchOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(new URLSearchParams(window.location.search).get("q"));
  });
  const dark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeSearchOnOutsideClick = (event: MouseEvent) => {
      if (!searchBoxRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", closeSearchOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeSearchOnOutsideClick);
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = activeTag ? post.tags.includes(activeTag) : true;
      const matchesQuery = normalizedQuery
        ? `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase().includes(normalizedQuery)
        : true;
      return matchesTag && matchesQuery;
    });
  }, [activeTag, posts, query]);

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return posts.filter((post) =>
      `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase().includes(normalizedQuery),
    ).slice(0, 5);
  }, [posts, query]);
  const showSearchResults = isSearchOpen && query.trim().length > 0;

  const latestPosts = posts.slice(0, 3);
  const heroPost = latestPosts[activeSlide];
  const latestPostIds = new Set(latestPosts.map((post) => post.id));
  const showLatestInResults = Boolean(query || activeTag);

  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % latestPosts.length);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [activeSlide, isCarouselPaused, latestPosts.length]);

  const featured = filteredPosts.filter(
    (post) => post.featured && !latestPostIds.has(post.id),
  );
  const regular = filteredPosts.filter(
    (post) =>
      (!post.featured && !latestPostIds.has(post.id)) ||
      (showLatestInResults && latestPostIds.has(post.id)),
  );
  const toggleTag = (tag: string) => setActiveTag((current) => (current === tag ? null : tag));

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="dev.notes — Trang chủ">
            <span className="brand-mark" aria-hidden="true"><b>dn</b><i>.</i></span>
            <span className="brand-lockup">
              <span className="brand-name">dev<span>.</span>notes</span>
              <span className="brand-tagline">Nhật ký kỹ thuật độc lập</span>
            </span>
          </a>
          <div className="header-nav">
            <div className="search-box" ref={searchBoxRef}>
              <label className="sr-only" htmlFor="post-search">Tìm kiếm bài viết</label>
              <Icon name="search" size={13} />
              <input
                id="post-search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setIsSearchOpen(false);
                    event.currentTarget.blur();
                  }
                }}
                placeholder="Tìm kiếm bài viết..."
              />
              {query && <button type="button" onClick={() => { setQuery(""); setIsSearchOpen(false); }} aria-label="Xóa tìm kiếm"><Icon name="close" size={12} /></button>}
              {showSearchResults && (
                <div className="search-results" id="search-results" aria-label="Kết quả tìm kiếm">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="search-results-label">Kết quả phù hợp</div>
                      {searchResults.map((post) => (
                        <a key={post.id} className="search-result" href={`/blog/${post.slug}`} onClick={() => setIsSearchOpen(false)}>
                          <BlogThumbnail post={post} compact />
                          <span>
                            <strong>{post.title}</strong>
                            <small>{formatDate(post.date)}</small>
                          </span>
                        </a>
                      ))}
                    </>
                  ) : (
                    <div className="search-empty">
                      <Icon name="search" size={15} />
                      Không tìm thấy bài viết phù hợp.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={() => setThemePreference(!dark)}
              type="button"
              aria-label={dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
            >
              <Icon name={dark ? "sun" : "moon"} size={13} />
            </button>
          </div>
        </div>
      </header>

      <section className="carousel-hero" id="top">
        <div className="carousel-inner">
          <div className="carousel-toolbar">
            <div className="pinned-label">
              <i /><span>Đọc mới nhất</span>
              <b>Tự động · 5s</b>
            </div>
          </div>

          <div
            className={`showcase${isCarouselPaused ? " is-paused" : ""}`}
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            onFocus={() => setIsCarouselPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsCarouselPaused(false);
              }
            }}
          >
            <article className="showcase-stage" key={heroPost.id}>
              <BlogThumbnail post={heroPost} />
              <div className="showcase-shade" />
              <div className="showcase-copy">
                <div className="showcase-meta">
                  <span>{String(activeSlide + 1).padStart(2, "0")}</span>
                  <time dateTime={heroPost.date}>{formatDate(heroPost.date)}</time>
                </div>
                <h1>{heroPost.title}</h1>
                <p>{heroPost.excerpt}</p>
                <div className="showcase-footer">
                  <div className="tag-group">{heroPost.tags.map((tag) => <TagPill key={tag} tag={tag} />)}</div>
                  <a href={`/blog/${heroPost.slug}`}>Đọc bài viết <Icon name="arrow" size={14} /></a>
                </div>
              </div>
            </article>

            <nav className="showcase-rail" aria-label="Các bài viết mới nhất">
              {latestPosts.map((post, index) => (
                <button
                  key={post.id}
                  className={`showcase-tab${index === activeSlide ? " active" : ""}`}
                  type="button"
                onClick={() => setActiveSlide(index)}
                aria-current={index === activeSlide ? "true" : undefined}
              >
                  <BlogThumbnail post={post} compact />
                  <div>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <strong>{post.title}</strong>
                  </div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <main className="main-layout" id="articles">
        <div className="content-column">
          <div className="filter-row">
            <span>Chủ đề</span>
            <TagPill tag="tất cả" active={activeTag === null} onClick={() => setActiveTag(null)} />
            {tags.map((tag) => <TagPill key={tag} tag={tag} active={activeTag === tag} onClick={() => toggleTag(tag)} />)}
          </div>

          {featured.length > 0 && !query && (
            <section className="featured-section">
              <SectionTitle>Nổi bật</SectionTitle>
              <div className="featured-grid">{featured.map((post) => <FeaturedCard key={post.id} post={post} />)}</div>
            </section>
          )}

          {regular.length > 0 && (
            <section>
              <SectionTitle count={regular.length}>{query ? "Kết quả tìm kiếm" : "Tất cả bài viết"}</SectionTitle>
              <div>{regular.map((post) => <PostRow key={post.id} post={post} />)}</div>
            </section>
          )}

          {query && featured.length > 0 && (
            <div className="search-featured">{featured.map((post) => <PostRow key={post.id} post={post} />)}</div>
          )}

          {filteredPosts.length === 0 && (
            <div className="empty-state">
              <Icon name="book" size={28} />
              <p>Không tìm thấy bài viết phù hợp.</p>
              <button type="button" onClick={() => { setActiveTag(null); setQuery(""); }}>Xóa bộ lọc</button>
            </div>
          )}
        </div>

        <aside className="sidebar">
          <section>
            <SectionTitle>Chủ đề</SectionTitle>
            <div className="tag-group">{tags.map((tag) => <TagPill key={tag} tag={tag} active={activeTag === tag} onClick={() => toggleTag(tag)} />)}</div>
          </section>

          <section>
            <SectionTitle>Gần đây</SectionTitle>
            <div className="recent-list">
              {posts.slice(0, 4).map((post) => (
                <article key={post.id}>
                  <a className="recent-item" href={`/blog/${post.slug}`}>
                    <BlogThumbnail post={post} compact />
                    <div><h3>{post.title}</h3><time dateTime={post.date}>{formatDate(post.date)}</time></div>
                  </a>
                </article>
              ))}
            </div>
          </section>

        </aside>
      </main>

      <footer className="site-footer">
        <div><span>dev<span className="accent">.</span>notes — chia sẻ kiến thức lập trình</span><span>© 2026</span></div>
      </footer>
    </div>
  );
}
