import type { Metadata } from "next";
import { TextReveal } from "@/components/motion/text-reveal";
import { BlogList } from "@/components/blog-list";
import { getPublishedArticles } from "@/lib/posts-server";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Rigorous, accessible legal analysis across corporate, criminal, constitutional, and more.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="pt-40">
      <header className="shell">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-gold/50" />
          <span className="eyebrow">The Archive</span>
        </div>
        <TextReveal
          text="Every article, one vault."
          as="h1"
          className="display text-4xl text-bone md:text-6xl"
        />
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-smoke">
          Browse the full collection. Filter by practice area to find exactly the
          analysis you need.
        </p>
      </header>

      <div className="shell mt-16 pb-10">
        <BlogList articles={articles} />
      </div>
    </div>
  );
}
