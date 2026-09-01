import Link from "next/link";
import { slugify } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

export interface FeaturedAuthor {
  name: string;
  count: number;
}

/**
 * Real contributors, derived from published posts' author names. No profiles
 * exist for guest authors yet, so these are non-linking cards. Hidden entirely
 * when there are no published posts.
 */
export function FeaturedAuthors({ authors }: { authors: FeaturedAuthor[] }) {
  if (!authors || authors.length === 0) return null;

  return (
    <section className="shell py-28 md:py-36">
      <SectionHeading
        index="04"
        eyebrow="Featured Authors"
        title="The people behind the writing"
        intro="Contributors whose work appears across the vault."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {authors.map((author, i) => {
          const initials = author.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);
          return (
            <Reveal key={author.name} delay={i * 0.06}>
              <Link
                href={`/authors/${slugify(author.name)}`}
                className="flex items-center gap-4 rounded-2xl border border-gold/10 bg-charcoal/40 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-gold/30"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gradient-to-br from-graphite to-ink font-display text-lg text-gold">
                  {initials}
                </span>
                <div>
                  <h3 className="text-base text-bone">{author.name}</h3>
                  <p className="mt-0.5 text-xs text-smoke">
                    {author.count === 1 ? "1 article" : `${author.count} articles`}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
