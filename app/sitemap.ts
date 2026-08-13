import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteUrl } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    {
      url: siteUrl,
      lastModified: posts[0] ? new Date(posts[0].date) : new Date(),
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
