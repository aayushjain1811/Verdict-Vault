"use client";

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Article, ArticleBlock } from "@/types";

/**
 * Firestore document shapes. Posts mirror the Article model used across the
 * site, so admin-authored content renders through the same components as seed
 * content. `status` gates what appears publicly.
 */
export type PostStatus = "draft" | "in_review" | "published";

export interface PostDoc {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: ArticleBlock[];
  categorySlug: string;
  authorName: string;
  cover?: string;
  readingTime: number;
  status: PostStatus;
  featured?: boolean;
  trending?: boolean;
  createdAt?: number;
  publishedAt?: string;
}

/** A reader-submitted draft awaiting admin verification. */
export interface SubmissionDoc {
  id: string;
  title: string;
  authorName: string;
  authorEmail: string;
  authorPhone?: string;
  categorySlug: string;
  content: string;
  cover?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: number;
}

function toMillis(v: unknown): number | undefined {
  if (v instanceof Timestamp) return v.toMillis();
  if (typeof v === "number") return v;
  return undefined;
}

// --- Posts -----------------------------------------------------------------

export async function fetchPosts(): Promise<PostDoc[]> {
  if (!db) return [];
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PostDoc, "id">),
    createdAt: toMillis(d.data().createdAt),
  }));
}

export async function fetchPublishedPosts(): Promise<PostDoc[]> {
  if (!db) return [];
  const q = query(
    collection(db, "posts"),
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PostDoc, "id">),
    createdAt: toMillis(d.data().createdAt),
  }));
}

export async function createPost(data: Omit<PostDoc, "id" | "createdAt">) {
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, "posts"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePost(id: string, data: Partial<PostDoc>) {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "posts", id), data);
}

export async function deletePost(id: string) {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "posts", id));
}

export async function getPost(id: string): Promise<PostDoc | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "posts", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<PostDoc, "id">) };
}

// --- Submissions -----------------------------------------------------------

export async function fetchSubmissions(): Promise<SubmissionDoc[]> {
  if (!db) return [];
  const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SubmissionDoc, "id">),
    createdAt: toMillis(d.data().createdAt),
  }));
}

export async function setSubmissionStatus(
  id: string,
  status: SubmissionDoc["status"]
) {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "submissions", id), { status });
}

/** Promote an approved submission into a real (draft) post. */
export async function promoteSubmission(s: SubmissionDoc) {
  const slug = s.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);

  const body: ArticleBlock[] = s.content
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((p) => ({ type: "paragraph" as const, text: p.trim() }));

  const words = s.content.trim().split(/\s+/).length;

  await createPost({
    title: s.title,
    slug,
    excerpt: s.content.slice(0, 160).trim() + "…",
    body,
    categorySlug: s.categorySlug,
    authorName: s.authorName,
    cover: s.cover,
    readingTime: Math.max(1, Math.round(words / 200)),
    status: "published",
    publishedAt: new Date().toISOString(),
  });
  await setSubmissionStatus(s.id, "approved");

  // Email the writer that their piece is live (best-effort, never blocks).
  try {
    await fetch("/api/notify-author", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: s.title,
        authorName: s.authorName,
        authorEmail: s.authorEmail,
      }),
    });
  } catch (e) {
    console.error("notify-author failed:", e);
  }
}

// --- Subscribers -----------------------------------------------------------

export interface SubscriberDoc {
  id: string;
  email: string;
  createdAt?: number;
}

export async function fetchSubscribers(): Promise<SubscriberDoc[]> {
  if (!db) return [];
  const q = query(collection(db, "subscribers"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SubscriberDoc, "id">),
    createdAt: toMillis(d.data().createdAt),
  }));
}

export async function addSubscriber(email: string) {
  if (!db) throw new Error("Firestore not configured");
  await addDoc(collection(db, "subscribers"), {
    email,
    createdAt: serverTimestamp(),
  });
}

/** Convert a published PostDoc to the site's Article shape for rendering. */
export function postToArticle(p: PostDoc): Article {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    categorySlug: p.categorySlug,
    authorSlug: "guest",
    authorName: p.authorName,
    cover: p.cover,
    readingTime: p.readingTime,
    publishedAt: p.publishedAt ?? new Date(p.createdAt ?? Date.now()).toISOString(),
    featured: p.featured,
    trending: p.trending,
  };
}


// --- Cover image upload (Firebase Storage) ---------------------------------

/**
 * Uploads a cover image to Firebase Storage and returns its public download
 * URL, which is stored on the post's `cover` field. Requires Storage enabled
 * and the rules in storage.rules published.
 */
export async function uploadCover(file: File): Promise<string> {
  if (!storage) throw new Error("Firebase Storage is not configured.");
  const safe = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
  const path = `covers/${Date.now()}-${safe}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}