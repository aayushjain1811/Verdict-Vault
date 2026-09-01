"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/lib/data";
import { ArticleCard } from "@/components/ui/article-card";
import type { Article } from "@/types";

export function BlogList({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all" ? articles : articles.filter((a) => a.categorySlug === active);

  // Only show category chips that actually have posts.
  const availableCats = categories.filter((c) =>
    articles.some((a) => a.categorySlug === c.slug)
  );

  return (
    <div>
      {articles.length > 0 && (
        <div className="mb-12 flex flex-wrap gap-2.5">
          <FilterPill label="All" active={active === "all"} onClick={() => setActive("all")} />
          {availableCats.map((c) => (
            <FilterPill
              key={c.slug}
              label={c.name}
              active={active === c.slug}
              onClick={() => setActive(c.slug)}
            />
          ))}
        </div>
      )}

      <motion.div layout className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((article, i) => (
            <motion.div
              key={article.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ArticleCard article={article} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {articles.length === 0 && (
        <div className="rounded-2xl border border-gold/12 bg-charcoal/40 py-20 text-center">
          <p className="font-display text-2xl text-bone">The archive is being written.</p>
          <p className="mt-3 text-sm text-smoke">
            No published articles yet. New pieces will appear here as they go live.
          </p>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
        active
          ? "border-gold/50 bg-gold/10 text-gold-pale"
          : "border-gold/15 text-smoke hover:border-gold/30 hover:text-bone"
      }`}
    >
      {label}
    </button>
  );
}
