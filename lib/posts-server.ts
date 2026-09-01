import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Article, ArticleBlock } from "@/types";

/**
 * The single source of published content for the public site.
 *
 * Every public page reads posts from Firestore through here, server-side, using
 * the Admin SDK. If Firebase isn't configured (e.g. during a CI build with no
 * env), every function returns empty data instead of throwing — so the build
 * never fails; the live site simply shows whatever is in Firestore.
 */

interface RawPost {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: ArticleBlock[];
  categorySlug?: string;
  authorName?: string;
  cover?: string;
  readingTime?: number;
  status?: string;
  featured?: boolean;
  trending?: boolean;
  publishedAt?: string;
  createdAt?: FirebaseFirestore.Timestamp | number | null;
}

function toIso(v: RawPost["createdAt"], fallback?: string): string {
  if (fallback) return fallback;
  if (v && typeof v === "object" && "toDate" in v) return v.toDate().toISOString();
  if (typeof v === "number") return new Date(v).toISOString();
  return new Date().toISOString();
}

function mapToArticle(id: string, d: RawPost): Article {
  return {
    slug: d.slug ?? id,
    title: d.title ?? "Untitled",
    excerpt: d.excerpt ?? "",
    body: d.body ?? [],
    categorySlug: d.categorySlug ?? "uncategorised",
    authorSlug: "guest",
    authorName: d.authorName ?? "Verdict Vault",
    cover: d.cover,
    readingTime: d.readingTime ?? 4,
    publishedAt: toIso(d.createdAt, d.publishedAt),
    featured: d.featured,
    trending: d.trending,
  };
}

async function fetchPublished(): Promise<Article[]> {
  if (!adminDb) return [];
  try {
    // Avoid a composite index requirement: filter by status, sort in memory.
    const snap = await adminDb
      .collection("posts")
      .where("status", "==", "published")
      .get();
    const list = snap.docs.map((doc) => mapToArticle(doc.id, doc.data() as RawPost));
    return list.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (e) {
    console.error("[posts-server] fetchPublished failed:", e);
    return [];
  }
}

export async function getPublishedArticles(): Promise<Article[]> {
  return fetchPublished();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const all = await fetchPublished();
  return all.find((a) => a.slug === slug) ?? null;
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const all = await fetchPublished();
  return all.filter((a) => a.categorySlug === categorySlug);
}

export async function getArticlesByAuthorName(name: string): Promise<Article[]> {
  const all = await fetchPublished();
  return all.filter((a) => (a.authorName ?? "").toLowerCase() === name.toLowerCase());
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const all = await fetchPublished();
  return all.find((a) => a.featured) ?? all[0] ?? null;
}

export async function getTrendingArticles(limit = 5): Promise<Article[]> {
  const all = await fetchPublished();
  const trending = all.filter((a) => a.trending);
  return (trending.length ? trending : all).slice(0, limit);
}

export async function getRelatedArticles(
  slug: string,
  categorySlug: string,
  limit = 3
): Promise<Article[]> {
  const all = await fetchPublished();
  const sameCat = all.filter((a) => a.slug !== slug && a.categorySlug === categorySlug);
  const others = all.filter((a) => a.slug !== slug && a.categorySlug !== categorySlug);
  return [...sameCat, ...others].slice(0, limit);
}

// --- Aggregations for index pages ------------------------------------------

import { slugify } from "@/lib/utils";

export interface AuthorSummary {
  name: string;
  slug: string;
  count: number;
}

/** Distinct authors across published posts, with their post counts. */
export async function getAuthorsFromPosts(): Promise<AuthorSummary[]> {
  const all = await fetchPublished();
  const map = new Map<string, AuthorSummary>();
  for (const a of all) {
    const name = a.authorName ?? "Verdict Vault";
    const slug = slugify(name);
    const existing = map.get(slug);
    if (existing) existing.count += 1;
    else map.set(slug, { name, slug, count: 1 });
  }
  return Array.from(map.values()).sort((x, y) => y.count - x.count);
}

/** Posts by an author, matched on the slug of their name. */
export async function getArticlesByAuthorSlug(slug: string): Promise<Article[]> {
  const all = await fetchPublished();
  return all.filter((a) => slugify(a.authorName ?? "Verdict Vault") === slug);
}

/** Per-category published-post counts, keyed by category slug. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const all = await fetchPublished();
  const counts: Record<string, number> = {};
  for (const a of all) counts[a.categorySlug] = (counts[a.categorySlug] ?? 0) + 1;
  return counts;
}
