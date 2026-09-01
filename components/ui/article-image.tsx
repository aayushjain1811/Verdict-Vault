"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Image container with a smooth gradient fallback.
 *
 * When no `src` is supplied it renders a soft, polished gradient panel with a
 * faint vault mark — deliberately smooth rather than textured, so a grid of
 * these reads as finished design while real imagery is still being gathered.
 */
export function ArticleImage({
  src,
  alt,
  className,
  priority,
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      {/* Smooth gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(150deg, #1b1b22 0%, #121216 45%, #0c0c10 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 80% at 30% 15%, rgba(201,161,90,.13), transparent 65%)",
        }}
      />

      {!src && (
        <svg
          viewBox="0 0 120 120"
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-gold/20"
          fill="none"
          aria-hidden
        >
          <circle cx="60" cy="60" r="44" stroke="currentColor" strokeWidth=".8" />
          <circle cx="60" cy="60" r="28" stroke="currentColor" strokeWidth=".8" />
          <path d="M60 32v-6M60 94v-6M32 60h-6M94 60h-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="60" cy="60" r="3" fill="currentColor" />
        </svg>
      )}

      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={cn(
            "object-cover transition-all duration-[1200ms] ease-out",
            loaded ? "scale-100 opacity-100 blur-0" : "scale-[1.06] opacity-0 blur-lg"
          )}
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      )}

      {/* Soft bottom vignette for legibility over photography */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
    </div>
  );
}
