import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/data";
import { getArticlesByCategory } from "@/lib/posts-server";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ArticleCard } from "@/components/ui/article-card";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 30;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Not found" };
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const posts = await getArticlesByCategory(slug);

  return (
    <div className="pt-40">
      <header className="shell relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/25 bg-ink text-gold">
          <CategoryIcon name={category.icon} className="h-7 w-7" />
        </div>
        <TextReveal
          text={category.name}
          as="h1"
          className="display text-4xl text-bone md:text-6xl"
        />
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-smoke">
          {category.description}
        </p>
        <div className="mt-8 flex gap-10">
          <Stat value={String(posts.length)} label="Articles" />
        </div>
      </header>

      <div className="shell mt-16 grid gap-x-8 gap-y-16 pb-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((article, i) => (
          <Reveal key={article.slug} delay={(i % 3) * 0.06}>
            <ArticleCard article={article} index={i} />
          </Reveal>
        ))}
        {posts.length === 0 && (
          <p className="col-span-full py-16 text-center text-smoke">
            No articles in this area yet. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl text-gold-gradient">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-eyebrow text-smoke">{label}</p>
    </div>
  );
}
