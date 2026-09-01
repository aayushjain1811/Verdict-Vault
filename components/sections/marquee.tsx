import { categories } from "@/lib/data";

/**
 * Kinetic ledger band. Pure CSS marquee (no JS, no hydration risk) listing
 * every practice area — dense, typographic, and unmistakably editorial.
 */
export function Marquee() {
  const items = [...categories, ...categories];

  return (
    <section className="rule-t rule-b relative overflow-hidden bg-ink py-7">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-10">
        {items.map((c, i) => (
          <span key={`${c.slug}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
            <span className="font-display text-2xl italic text-bone/85 md:text-3xl">
              {c.name}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-gold/50" />
          </span>
        ))}
      </div>
    </section>
  );
}
