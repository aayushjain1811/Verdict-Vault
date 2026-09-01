import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Placeholder wordmark + vault glyph. When your official logo is ready,
 * drop it at /public/logo.svg and render it here with next/image.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-ink">
        <svg viewBox="0 0 32 32" className="h-5 w-5 text-gold" fill="none" aria-hidden>
          <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 4v3M16 25v3M4 16h3M25 16h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="16" cy="16" r="1.6" fill="currentColor" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] tracking-wide text-bone">
          Verdict Vault
        </span>
        <span className="mt-0.5 text-[9px] uppercase tracking-eyebrow text-gold/60">
          Where Law Meets Clarity
        </span>
      </span>
    </Link>
  );
}
