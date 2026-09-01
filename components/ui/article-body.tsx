import { Scale } from "lucide-react";
import type { ArticleBlock } from "@/types";
import { Reveal } from "@/components/motion/reveal";

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-7">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                id={block.id}
                className="scroll-mt-32 pt-6 font-display text-2xl text-bone md:text-3xl"
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p
                key={i}
                className="font-read text-[1.15rem] leading-[1.8] text-smoke"
              >
                {block.text}
              </p>
            );
          case "quote":
            return (
              <Reveal key={i}>
                <blockquote className="my-10 border-l-2 border-gold py-2 pl-6">
                  <p className="font-display text-2xl leading-snug text-bone md:text-[1.75rem]">
                    “{block.text}”
                  </p>
                  {block.cite && (
                    <cite className="mt-3 block text-sm not-italic text-gold/70">
                      — {block.cite}
                    </cite>
                  )}
                </blockquote>
              </Reveal>
            );
          case "citation":
            return (
              <Reveal key={i}>
                <div className="my-8 flex gap-4 rounded-xl border border-gold/15 bg-charcoal/40 p-5">
                  <Scale className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} />
                  <div>
                    <p className="text-[0.95rem] leading-relaxed text-bone">
                      {block.text}
                    </p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-eyebrow text-gold/60">
                      {block.source}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          case "list":
            return (
              <ul key={i} className="space-y-3 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[1.05rem] leading-relaxed text-smoke">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
