import type { MetadataRoute } from "next";
import { categories } from "@/lib/data";
import { getAuthorsFromPosts } from "@/lib/posts-server";
import { getPublishedArticles } from "@/lib/posts-server";

const BASE = "https://verdictvault.co.in";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/blog", "/categories", "/authors", "/about", "/contact", "/write"].map(
    (route) => ({
      url: `${BASE}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })
  );

  const articles = await getPublishedArticles();
  const articleRoutes = articles.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const authorList = await getAuthorsFromPosts();
  const authorRoutes = authorList.map((a) => ({
    url: `${BASE}/authors/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes, ...authorRoutes];
}