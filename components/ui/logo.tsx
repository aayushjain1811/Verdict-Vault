"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Brand logo: the emblem image + the "Verdict Vault" wordmark to its right.
 *
 * The wordmark is ALWAYS shown (your emblem is a crest, not a text logo), and
 * the image is sized generously. If /public/logo.png is missing or fails to
 * load, the built-in vault glyph stands in so nothing looks broken.
 *
 * Props:
 *   - showTagline: show the small "Where Law Meets Clarity" line (default true)
 *   - className: extra classes on the wrapper
 */
export function Logo({
  className,
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="Verdict Vault"
          className="h-12 w-auto object-contain md:h-14"
          onError={() => setImgOk(false)}
        />
      ) : (
        <span className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-gold/30 bg-ink md:h-14 md:w-14">
          <svg viewBox="0 0 32 32" className="h-7 w-7 text-gold" fill="none" aria-hidden>
            <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M16 4v3M16 25v3M4 16h3M25 16h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="16" cy="16" r="1.6" fill="currentColor" />
          </svg>
        </span>
      )}

      {/* Wordmark — always shown, to the right of the emblem */}
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl tracking-wide text-bone md:text-2xl">
          Verdict Vault
        </span>
        {showTagline && (
          <span className="mt-1 text-[9px] uppercase tracking-eyebrow text-gold/60 md:text-[10px]">
            Where Law Meets Clarity
          </span>
        )}
      </span>
    </Link>
  );
}