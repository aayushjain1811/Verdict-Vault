import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategory } from "@/lib/data";
import { Reveal } from "@/components/motion/reveal";
import type { Article } from "@/types";

export function Trending({ articles }: { articles: Article[] }) {
  const trending = articles.filter((a) => a.trending);
  const items = (trending.length ? trending : articles).slice(0, 5);
  if (items.length === 0) return null;

  return (
    <section className="shell py-28 md:py-36">
      <div className="mb-14 flex items-center gap-4">
        <span className="docket !text-gold/50">§ 03</span>
        <span className="h-px flex-1 bg-gold/15" />
        <span className="eyebrow">Most Read This Month</span>
      </div>

      <div className="rule-t">
        {items.map((article, i) => {
          const category = getCategory(article.categorySlug);
          return (
            <Reveal key={article.slug} delay={i * 0.05}>
              <Link
                href={`/blog/${article.slug}`}
                className="rule-b group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-9 transition-colors duration-500 hover:bg-gold/[.03] md:gap-10"
              >
                <span className="font-display text-3xl text-gold/30 transition-colors duration-500 group-hover:text-gold md:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="docket mb-2">{category?.name ?? "Article"}</p>
                  <h3 className="font-display text-2xl leading-tight text-bone transition-colors duration-300 group-hover:text-gold-pale md:text-4xl">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs text-ash">
                    {article.authorName} · {article.readingTime} min
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-gold/25 transition-all duration-400 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold" />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
