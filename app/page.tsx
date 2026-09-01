import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { LatestArticles } from "@/components/sections/latest-articles";
import { PracticeAreas } from "@/components/sections/practice-areas";
import { Trending } from "@/components/sections/trending";
import { FeaturedAuthors } from "@/components/sections/featured-authors";
import { WhyVerdictVault } from "@/components/sections/why-verdict-vault";
import { CTA } from "@/components/sections/cta";
import { getPublishedArticles } from "@/lib/posts-server";
import { categories } from "@/lib/data";

export const revalidate = 30;

export default async function HomePage() {
  // Single Firestore read for the whole page.
  const articles = await getPublishedArticles();

  // Real per-category counts.
  const counts: Record<string, number> = {};
  for (const a of articles) {
    counts[a.categorySlug] = (counts[a.categorySlug] ?? 0) + 1;
  }

  // Real contributor list, derived from published posts.
  const names = Array.from(
    new Set(articles.map((a) => a.authorName).filter(Boolean))
  ) as string[];
  const featuredAuthors = names
    .map((name) => ({ name, count: articles.filter((a) => a.authorName === name).length }))
    .sort((x, y) => y.count - x.count)
    .slice(0, 3);

  const stats = {
    postCount: articles.length,
    categoryCount: categories.length,
    authorCount: names.length,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Verdict Vault",
    url: "https://verdictvault.example",
    slogan: "Where Law Meets Clarity",
    description:
      "A premium legal knowledge platform offering rigorous, accessible legal analysis.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero stats={stats} />
      <Marquee />
      <LatestArticles articles={articles} />
      <PracticeAreas counts={counts} />
      <Trending articles={articles} />
      <FeaturedAuthors authors={featuredAuthors} />
      <WhyVerdictVault />
      <CTA />
    </>
  );
}
