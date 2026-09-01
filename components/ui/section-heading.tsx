import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Section header. The § mark + index echoes how legal texts are cited, so the
 * structural device encodes something true rather than decorating.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  tone = "dark",
}: {
  index?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <div className={cn("mb-6 flex items-center gap-4", align === "center" && "justify-center")}>
        {index && <span className="docket !text-gold/50">§ {index}</span>}
        <span className="h-px w-10 bg-gold/40" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2
        className={cn(
          "display text-4xl md:text-6xl",
          tone === "light" ? "text-[#121214]" : "text-bone"
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-6 max-w-xl font-read text-lg leading-relaxed",
            tone === "light" ? "text-[#4a4a4f]" : "text-smoke"
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
