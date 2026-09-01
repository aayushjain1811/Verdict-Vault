import type { Metadata } from "next";
import { TextReveal } from "@/components/motion/text-reveal";
import { categories } from "@/lib/data";
import { CategoryCard } from "@/components/ui/category-card";
import { Reveal } from "@/components/motion/reveal";
import { getCategoryCounts } from "@/lib/posts-server";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Practice Areas",
  description: "Browse legal analysis by practice area.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();

  return (
    <div className="pt-40">
      <header className="shell">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-gold/50" />
          <span className="eyebrow">Practice Areas</span>
        </div>
        <TextReveal
          text="Choose your field."
          as="h1"
          className="display text-4xl text-bone md:text-6xl"
        />
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-smoke">
          Every field we cover. Counts reflect the articles published so far.
        </p>
      </header>

      <div className="shell mt-16 grid gap-5 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 3) * 0.06}>
            <CategoryCard category={c} count={counts[c.slug] ?? 0} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
