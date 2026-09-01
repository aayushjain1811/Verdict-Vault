import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/ui/article-card";
import { Reveal } from "@/components/motion/reveal";
import type { Article } from "@/types";

export function LatestArticles({ articles }: { articles: Article[] }) {
  const latest = articles.slice(0, 6);
  if (latest.length === 0) return null;

  return (
    <section className="shell py-28 md:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-6 flex items-center gap-4">
            <span className="docket !text-gold/50">§ 01</span>
            <span className="h-px w-10 bg-gold/40" />
            <span className="eyebrow">Recent Filings</span>
          </div>
          <h2 className="display text-4xl text-bone md:text-6xl">
            Fresh from <span className="italic text-gold-gradient">the vault</span>
          </h2>
        </div>
        <Link href="/blog" className="wipe-link group flex items-center gap-2 text-sm text-gold">
          View the full archive
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {latest.map((article, i) => (
          <Reveal key={article.slug} delay={(i % 3) * 0.08}>
            <ArticleCard article={article} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
