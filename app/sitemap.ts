import type { MetadataRoute } from "next";
import { siteUrl } from "./site";

const posts = [
  { slug: "distributed-systems-clock-skew", date: "2026-07-28" },
  { slug: "rust-async-executor", date: "2026-07-10" },
  { slug: "btree-storage-engine", date: "2026-06-22" },
  { slug: "llm-inference-latency", date: "2026-06-05" },
  { slug: "linux-io-uring", date: "2026-05-19" },
  { slug: "raft-consensus", date: "2026-05-03" },
  { slug: "zero-copy-networking", date: "2026-04-17" },
  { slug: "consistent-hashing-deep-dive", date: "2026-04-02" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-07-28"),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
