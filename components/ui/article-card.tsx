import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/types";
import { getCategory } from "@/lib/data";
import { ArticleImage } from "@/components/ui/article-image";
import { formatDate } from "@/lib/utils";

/**
 * Editorial article card. No boxed border — a hairline rule and a docket line,
 * so a grid of these reads like a contents page rather than a tile dashboard.
 */
export function ArticleCard({
  article,
  index,
}: {
  article: Article;
  index?: number;
}) {
  const category = getCategory(article.categorySlug);

  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <div className="relative overflow-hidden">
        <ArticleImage
          src={article.cover}
          alt={article.title}
          className="aspect-[4/3] w-full transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gold-sheen opacity-0 transition-opacity duration-500 group-hover:animate-sheen group-hover:opacity-100" />
      </div>

      <div className="rule-t mt-5 flex items-baseline gap-3 pt-4">
        {index !== undefined && (
          <span className="docket !text-gold/45">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <span className="docket">{category?.name}</span>
        <span className="docket ml-auto !tracking-normal !text-ash">
          {article.readingTime} min
        </span>
      </div>

      <h3 className="mt-3 font-display text-2xl leading-[1.12] text-bone transition-colors duration-300 group-hover:text-gold-pale">
        {article.title}
      </h3>

      <p className="mt-3 line-clamp-2 font-read text-[15px] leading-relaxed text-smoke">
        {article.excerpt}
      </p>

      <div className="mt-5 flex items-center gap-2 text-xs text-ash">
        <span>{article.authorName}</span>
        <span className="h-px w-4 bg-gold/30" />
        <span>{formatDate(article.publishedAt)}</span>
        <ArrowUpRight className="ml-auto h-4 w-4 -translate-x-2 text-gold opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
