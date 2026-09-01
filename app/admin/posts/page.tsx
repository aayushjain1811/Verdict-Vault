"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, ImagePlus, Loader2 } from "lucide-react";
import { PageHeader, AdminCard, StatusBadge, AdminButton, NotWiredNotice } from "@/components/admin/admin-ui";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { categories } from "@/lib/data";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  type PostDoc,
  type PostStatus,
  uploadCover,
} from "@/lib/firebase/firestore";
import type { ArticleBlock } from "@/types";

const empty = {
  title: "",
  excerpt: "",
  content: "",
  categorySlug: categories[0].slug,
  authorName: "",
  cover: "" as string,
  status: "draft" as PostStatus,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setPosts(await fetchPosts());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(empty);
    setEditingId(null);
    setEditorOpen(true);
  }

  function openEdit(p: PostDoc) {
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      content: p.body.map((b) => ("text" in b ? b.text : "")).join("\n\n"),
      categorySlug: p.categorySlug,
      authorName: p.authorName,
      cover: p.cover ?? "",
      status: p.status,
    });
    setEditingId(p.id);
    setEditorOpen(true);
  }

  async function save() {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    const body: ArticleBlock[] = form.content
      .split(/\n{2,}/)
      .filter(Boolean)
      .map((p) => ({ type: "paragraph" as const, text: p.trim() }));
    const words = form.content.trim().split(/\s+/).length;
    const payload = {
      title: form.title,
      slug: slugify(form.title),
      excerpt: form.excerpt || form.content.slice(0, 150) + "…",
      body,
      categorySlug: form.categorySlug,
      authorName: form.authorName || "Verdict Vault",
      cover: form.cover || undefined,
      readingTime: Math.max(1, Math.round(words / 200)),
      status: form.status,
      publishedAt: form.status === "published" ? new Date().toISOString() : undefined,
    };
    try {
      // Firestore rejects `undefined` values — remove any before writing.
      const clean = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined)
      ) as typeof payload;
      if (editingId) await updatePost(editingId, clean);
      else await createPost(clean);
      setEditorOpen(false);
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadCover(file);
      setForm((f) => ({ ...f, cover: url }));
    } catch (err) {
      console.error(err);
      alert("Upload failed. Make sure Firebase Storage is enabled and rules are published.");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    await deletePost(id);
    await load();
  }

  async function cycleStatus(p: PostDoc) {
    const next: PostStatus =
      p.status === "draft" ? "published" : p.status === "published" ? "draft" : "published";
    await updatePost(p.id, {
      status: next,
      publishedAt: next === "published" ? new Date().toISOString() : undefined,
    });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Posts"
        description="Write, edit, publish, and unpublish. Published posts appear on the public site."
        action={
          <AdminButton onClick={openNew} disabled={!isFirebaseConfigured}>
            <Plus className="h-4 w-4" /> New post
          </AdminButton>
        }
      />

      {!isFirebaseConfigured && <NotWiredNotice what="Post management" />}

      <AdminCard className="p-0">
        {loading ? (
          <p className="p-6 text-sm text-ash">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="p-6 text-sm text-ash">
            No posts yet.{" "}
            {isFirebaseConfigured ? "Create your first one." : "Connect Firebase to begin."}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gold/12 text-ash">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-gold/8 last:border-0">
                  <td className="px-6 py-4">
                    <p className="text-bone">{p.title}</p>
                    <p className="text-xs text-ash">{p.authorName}</p>
                  </td>
                  <td className="px-6 py-4 text-smoke">
                    {categories.find((c) => c.slug === p.categorySlug)?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => cycleStatus(p)} title="Toggle status">
                      <StatusBadge status={p.status} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded-lg border border-gold/20 p-2 text-smoke transition-colors hover:border-gold/50 hover:text-gold"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="rounded-lg border border-rose-500/25 p-2 text-rose-300/80 transition-colors hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>

      {/* Editor drawer */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/70 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl overflow-y-auto border-l border-gold/15 bg-obsidian p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl text-bone">
                {editingId ? "Edit post" : "New post"}
              </h2>
              <button onClick={() => setEditorOpen(false)} className="text-smoke hover:text-bone">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <Field label="Cover photo">
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-gold/15 bg-ink/60">
                    {form.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.cover} alt="Cover preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gold/30">
                        <ImagePlus className="h-6 w-6" />
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-ink/70">
                        <Loader2 className="h-5 w-5 animate-spin text-gold" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-sm text-bone transition-colors hover:border-gold/50">
                      <ImagePlus className="h-4 w-4" />
                      {form.cover ? "Replace image" : "Upload image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCover}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {form.cover && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, cover: "" })}
                        className="text-left text-xs text-rose-300/80 hover:text-rose-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </Field>

              <Field label="Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="admin-input"
                  placeholder="The anatomy of a merger"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Author">
                  <input
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    className="admin-input"
                    placeholder="Verdict Vault"
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={form.categorySlug}
                    onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                    className="admin-input"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug} className="bg-charcoal">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Excerpt">
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="admin-input resize-none"
                  placeholder="One or two sentences summarising the piece."
                />
              </Field>

              <Field label="Body (blank line between paragraphs)">
                <textarea
                  rows={12}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="admin-input resize-none font-read"
                  placeholder="Write the article here…"
                />
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as PostStatus })}
                  className="admin-input"
                >
                  <option value="draft" className="bg-charcoal">Draft</option>
                  <option value="in_review" className="bg-charcoal">In review</option>
                  <option value="published" className="bg-charcoal">Published</option>
                </select>
              </Field>

              <div className="flex gap-3 pt-2">
                <AdminButton onClick={save} disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Save changes" : "Create post"}
                </AdminButton>
                <AdminButton variant="ghost" onClick={() => setEditorOpen(false)}>
                  Cancel
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(201, 161, 90, 0.15);
          background: rgba(8, 8, 10, 0.6);
          padding: 0.7rem 1rem;
          font-size: 0.875rem;
          color: #f2efe8;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus {
          border-color: rgba(201, 161, 90, 0.5);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] uppercase tracking-eyebrow text-gold/60">
        {label}
      </label>
      {children}
    </div>
  );
}
