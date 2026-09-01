import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types";
import { CategoryIcon } from "@/components/ui/category-icon";

export function CategoryCard({
  category,
  count,
}: {
  category: Category;
  count?: number;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold/10 bg-charcoal/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/30"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-ink text-gold transition-colors duration-500 group-hover:border-gold/50">
          <CategoryIcon name={category.icon} className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-gold/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold" />
      </div>
      <div className="mt-8">
        <h3 className="text-lg text-bone transition-colors group-hover:text-gold-pale">
          {category.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-smoke">
          {category.description}
        </p>
        <p className="mt-4 text-[11px] uppercase tracking-eyebrow text-gold/60">
          {count === undefined
            ? ""
            : count === 0
            ? "No articles yet"
            : count === 1
            ? "1 article"
            : `${count} articles`}
        </p>
      </div>
    </Link>
  );
}
