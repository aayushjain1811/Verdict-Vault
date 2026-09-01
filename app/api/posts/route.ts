import { NextResponse } from "next/server";
import { getPublishedArticles } from "@/lib/posts-server";

export const revalidate = 30;

/**
 * Public, read-only list of published posts. Used by client components (search)
 * that can't call the Admin SDK directly. Returns a slim shape.
 */
export async function GET() {
  const articles = await getPublishedArticles();
  const slim = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    categorySlug: a.categorySlug,
  }));
  return NextResponse.json({ posts: slim });
}
