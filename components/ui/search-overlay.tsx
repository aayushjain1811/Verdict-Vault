"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, CornerDownLeft, TrendingUp } from "lucide-react";


const POPULAR = ["Mergers", "Fifth Amendment", "Patents", "Contracts"];

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<
    { slug: string; title: string; excerpt: string; categorySlug: string }[]
  >([]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setPosts(d.posts ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.categorySlug.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, posts]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-24 md:pt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            className="glass relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-elevated"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-gold/12 px-5 py-4">
              <Search className="h-5 w-5 text-gold" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the vault…"
                className="w-full bg-transparent text-base text-bone outline-none placeholder:text-smoke"
              />
              <button
                onClick={onClose}
                className="rounded-md p-1 text-smoke transition-colors hover:text-bone"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-3">
              {query.trim() === "" && (
                <div className="px-2 py-3">
                  <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-eyebrow text-gold/60">
                    <TrendingUp className="h-3 w-3" /> Popular
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map((p) => (
                      <button
                        key={p}
                        onClick={() => setQuery(p)}
                        className="rounded-full border border-gold/20 px-4 py-1.5 text-sm text-smoke transition-colors hover:border-gold/50 hover:text-bone"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() !== "" && results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-smoke">
                  No results for “{query}”. Try another term.
                </p>
              )}

              {results.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  onClick={onClose}
                  className="group flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-gold/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-bone group-hover:text-gold-pale">
                      {a.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-smoke">
                      {a.excerpt}
                    </p>
                  </div>
                  <CornerDownLeft className="ml-4 h-4 w-4 shrink-0 text-gold/0 transition-colors group-hover:text-gold" />
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
