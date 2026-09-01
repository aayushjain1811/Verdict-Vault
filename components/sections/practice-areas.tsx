import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data";
import { CategoryIcon } from "@/components/ui/category-icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

/**
 * Practice areas are the site's fixed navigation taxonomy. The per-category
 * article counts, however, are REAL — passed in from the page's Firestore read.
 */
export function PracticeAreas({ counts }: { counts?: Record<string, number> }) {
  return (
    <section className="vellum-section py-28 md:py-40">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="Practice Areas"
          title="Every field, examined with care"
          intro="From the boardroom to the courtroom — coverage across the disciplines that quietly govern modern life."
          tone="light"
        />

        <div className="mt-16 grid grid-cols-1 border-t border-[#1a1a1c]/12 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => {
            const n = counts?.[c.slug] ?? 0;
            return (
              <Reveal key={c.slug} delay={(i % 4) * 0.05}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="group flex h-full flex-col justify-between border-b border-r border-[#1a1a1c]/12 p-8 transition-colors duration-500 hover:bg-[#1a1a1c]/[.04]"
                >
                  <div className="flex items-start justify-between">
                    <CategoryIcon name={c.icon} className="h-6 w-6 text-[#4A1A1F]" />
                    <ArrowUpRight className="h-4 w-4 text-[#1a1a1c]/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#4A1A1F]" />
                  </div>
                  <div className="mt-14">
                    <h3 className="font-display text-xl text-[#121214]">{c.name}</h3>
                    <p className="mt-2 font-read text-sm leading-relaxed text-[#55555c] line-clamp-2">
                      {c.description}
                    </p>
                    <p className="docket mt-5 !text-[#4A1A1F]/60">
                      {n === 0 ? "No articles yet" : n === 1 ? "1 article" : `${n} articles`}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
