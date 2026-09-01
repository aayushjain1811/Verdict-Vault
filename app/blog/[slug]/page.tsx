import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import { getCategory } from "@/lib/data";
import {
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/posts-server";
import { formatDate } from "@/lib/utils";
import { ReadingProgress } from "@/components/motion/reading-progress";
import { ArticleImage } from "@/components/ui/article-image";
import { ArticleBody } from "@/components/ui/article-body";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { ShareButtons } from "@/components/ui/share-buttons";
import { ArticleCard } from "@/components/ui/article-card";
import { Newsletter } from "@/components/ui/newsletter";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 30;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not found" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategory(article.categorySlug);
  const related = await getRelatedArticles(article.slug, article.categorySlug);
  const headings = article.body
    .filter((b) => b.type === "heading")
    .map((b) => ({ id: (b as { id: string }).id, text: (b as { text: string }).text }));

  const initials = (article.authorName ?? "VV")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { "@type": "Person", name: article.authorName },
    publisher: { "@type": "Organization", name: "Verdict Vault" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />

      <article className="pt-36">
        <header className="shell max-w-4xl">
          <Link
            href="/blog"
            className="group mb-8 inline-flex items-center gap-2 text-sm text-smoke transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to articles
          </Link>

          <div className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-eyebrow text-gold/70">
            <Link href={`/categories/${category?.slug}`} className="hover:text-gold-pale">
              {category?.name ?? "Article"}
            </Link>
            <span className="h-1 w-1 rounded-full bg-gold/40" />
            <span className="flex items-center gap-1 normal-case tracking-normal text-smoke">
              <Clock className="h-3 w-3" /> {article.readingTime} min read
            </span>
          </div>

          <h1 className="font-display text-4xl leading-[1.08] text-bone md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-smoke">
            {article.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-gold/12 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-gradient-to-br from-graphite to-ink text-sm font-medium text-gold">
                {initials}
              </span>
              <div>
                <p className="text-sm text-bone">{article.authorName}</p>
                <p className="text-xs text-smoke">{formatDate(article.publishedAt)}</p>
              </div>
            </div>
            <ShareButtons title={article.title} />
          </div>
        </header>

        <div className="shell mt-12 max-w-5xl">
          <ArticleImage
            src={article.cover}
            alt={article.title}
            priority
            className="aspect-[16/8] w-full"
          />
        </div>

        <div className="shell mt-16 grid max-w-6xl gap-12 lg:grid-cols-[1fr_240px]">
          <div className="max-w-2xl">
            <ArticleBody blocks={article.body} />

            <Reveal className="mt-12">
              <div className="glass flex gap-5 rounded-2xl p-7">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gradient-to-br from-graphite to-ink font-display text-lg text-gold">
                  {initials}
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-eyebrow text-gold/60">
                    Written by
                  </p>
                  <h3 className="mt-1 text-lg text-bone">{article.authorName}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-smoke">
                    Contributor at Verdict Vault.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <aside>
            <TableOfContents headings={headings} />
          </aside>
        </div>

        {related.length > 0 && (
          <section className="shell mt-28">
            <div className="mb-10 flex items-center gap-3">
              <span className="h-px w-10 bg-gold/50" />
              <span className="eyebrow">Continue Reading</span>
            </div>
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.slug} delay={i * 0.06}>
                  <ArticleCard article={r} index={i} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className="shell mt-24">
          <Newsletter />
        </section>
      </article>
    </>
  );
}
