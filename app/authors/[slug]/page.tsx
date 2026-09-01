import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByAuthorSlug, getAuthorsFromPosts } from "@/lib/posts-server";
import { ArticleCard } from "@/components/ui/article-card";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 30;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const authors = await getAuthorsFromPosts();
  const author = authors.find((a) => a.slug === slug);
  if (!author) return { title: "Author not found" };
  return {
    title: author.name,
    description: `Articles by ${author.name} on Verdict Vault.`,
    alternates: { canonical: `/authors/${slug}` },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getArticlesByAuthorSlug(slug);
  if (posts.length === 0) notFound();

  const name = posts[0].authorName ?? "Verdict Vault";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="pt-40">
      <header className="shell max-w-4xl">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
          <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gradient-to-br from-graphite to-ink font-display text-3xl text-gold">
            {initials}
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-eyebrow text-gold/60">
              Contributor
            </p>
            <h1 className="mt-2 font-display text-4xl text-bone md:text-5xl">{name}</h1>
            <p className="mt-3 text-sm text-smoke">
              {posts.length === 1 ? "1 published article" : `${posts.length} published articles`}
            </p>
          </div>
        </div>
      </header>

      <section className="shell mt-16 pb-10">
        <div className="mb-10 flex items-center gap-3">
          <span className="h-px w-10 bg-gold/50" />
          <span className="eyebrow">Published Work</span>
        </div>
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((article, i) => (
            <Reveal key={article.slug} delay={(i % 3) * 0.06}>
              <ArticleCard article={article} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
