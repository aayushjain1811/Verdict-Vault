import type { Metadata } from "next";
import Link from "next/link";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { getAuthorsFromPosts } from "@/lib/posts-server";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Authors",
  description: "The contributors behind Verdict Vault.",
  alternates: { canonical: "/authors" },
};

export default async function AuthorsPage() {
  const authors = await getAuthorsFromPosts();

  return (
    <div className="pt-40">
      <header className="shell">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-gold/50" />
          <span className="eyebrow">Contributors</span>
        </div>
        <TextReveal
          text="The people behind the writing."
          as="h1"
          className="display text-4xl text-bone md:text-6xl"
        />
      </header>

      <div className="shell mt-16 pb-10">
        {authors.length === 0 ? (
          <div className="rounded-2xl border border-gold/12 bg-charcoal/40 py-20 text-center">
            <p className="font-display text-2xl text-bone">No contributors yet.</p>
            <p className="mt-3 text-sm text-smoke">
              Authors appear here once their articles are published.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {authors.map((a, i) => {
              const initials = a.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2);
              return (
                <Reveal key={a.slug} delay={(i % 3) * 0.06}>
                  <Link
                    href={`/authors/${a.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-gold/10 bg-charcoal/40 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-gold/30"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gradient-to-br from-graphite to-ink font-display text-lg text-gold">
                      {initials}
                    </span>
                    <div>
                      <h3 className="text-base text-bone transition-colors group-hover:text-gold-pale">
                        {a.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-smoke">
                        {a.count === 1 ? "1 article" : `${a.count} articles`}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
