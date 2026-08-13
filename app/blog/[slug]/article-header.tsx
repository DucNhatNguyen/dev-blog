"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { getServerThemeSnapshot, getThemeSnapshot, setThemePreference, subscribeToTheme } from "../../theme";

type SearchPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
    </svg>
  );
}

function CloseIcon() {
  return <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m6 6 12 12" /><path d="m18 6-12 12" /></svg>;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SearchThumbnail({ post }: { post: SearchPost }) {
  return <span className={`article-search-thumbnail thumbnail-${post.id}`} aria-hidden="true">{String(post.id).padStart(2, "0")}</span>;
}

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark
    ? <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" /></svg>
    : <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20.8 12.5A8.5 8.5 0 1 1 11.5 3a6.5 6.5 0 0 0 9.3 9.5Z" /></svg>;
}

export function ArticleHeader({ posts }: { posts: SearchPost[] }) {
  const dark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return posts.filter((post) =>
      `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase().includes(normalizedQuery),
    ).slice(0, 5);
  }, [posts, query]);
  const showSearchResults = isSearchOpen && query.trim().length > 0;

  useEffect(() => {
    const closeSearchOnOutsideClick = (event: MouseEvent) => {
      if (!searchBoxRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", closeSearchOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeSearchOnOutsideClick);
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="dev.notes — Trang chủ">
          <span className="brand-mark" aria-hidden="true"><b>dn</b><i>.</i></span>
          <span className="brand-lockup">
            <span className="brand-name">dev<span>.</span>notes</span>
            <span className="brand-tagline">Nhật ký kỹ thuật độc lập</span>
          </span>
        </Link>
        <div className="header-nav">
          <div className="search-box" ref={searchBoxRef}>
            <label className="sr-only" htmlFor="article-search">Tìm kiếm bài viết</label>
            <SearchIcon />
            <input
              id="article-search"
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
            {query && <button type="button" onClick={() => { setQuery(""); setIsSearchOpen(false); }} aria-label="Xóa tìm kiếm"><CloseIcon /></button>}
            {showSearchResults && (
              <div className="search-results" aria-label="Kết quả tìm kiếm">
                {searchResults.length > 0 ? (
                  <>
                    <div className="search-results-label">Kết quả phù hợp</div>
                    {searchResults.map((post) => (
                      <Link key={post.id} className="search-result" href={`/blog/${post.slug}`} onClick={() => setIsSearchOpen(false)}>
                        <SearchThumbnail post={post} />
                        <span>
                          <strong>{post.title}</strong>
                          <small>{formatDate(post.date)}</small>
                        </span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <div className="search-empty"><SearchIcon />Không tìm thấy bài viết phù hợp.</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button className="theme-toggle" onClick={() => setThemePreference(!dark)} type="button" aria-label={dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}>
            <ThemeIcon dark={dark} />
          </button>
        </div>
      </div>
    </header>
  );
}
