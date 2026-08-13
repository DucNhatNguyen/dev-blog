import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "posts");

type PostFrontmatter = {
  title?: string;
  slug?: string;
  date?: string | Date;
  description?: string;
  tags?: string[];
  featured?: boolean;
  cover?: string;
};

export type PostSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  featured: boolean;
  cover?: string;
};

export type Post = PostSummary & {
  content: string;
};

function dateToIso(value: PostFrontmatter["date"]) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return new Date(`${value}T00:00:00`).toISOString().slice(0, 10);
  }
  return "1970-01-01";
}

function filenameToSlug(filename: string) {
  return filename.replace(/\.(md|mdx)$/i, "");
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/i.test(entry.name))
    .map((entry) => {
      const source = fs.readFileSync(path.join(postsDirectory, entry.name), "utf8");
      const { data, content } = matter(source);
      const frontmatter = data as PostFrontmatter;
      const slug = frontmatter.slug?.trim() || filenameToSlug(entry.name);

      return {
        id: 0,
        slug,
        title: frontmatter.title?.trim() || slug,
        excerpt: frontmatter.description?.trim() || "",
        date: dateToIso(frontmatter.date),
        tags: Array.isArray(frontmatter.tags)
          ? frontmatter.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
          : [],
        featured: frontmatter.featured === true,
        cover: frontmatter.cover?.trim() || undefined,
        content,
      } satisfies Post;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return entries.map((post, index) => ({ ...post, id: index + 1 }));
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostSummaries(): PostSummary[] {
  return getAllPosts().map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    tags: post.tags,
    featured: post.featured,
    cover: post.cover,
  }));
}
