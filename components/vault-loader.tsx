"use client";

import { useState } from "react";

/**
 * The branded loading visual: your logo (PNG, with a vault-glyph fallback)
 * inside a slowly rotating gold ring, on a dark gradient. Shared by the
 * navigation loader and the route Suspense fallback so they look identical.
 */
export function VaultLoader({ label = "Opening the vault" }: { label?: string }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 30%, rgba(201,161,90,.10), rgba(10,10,12,0) 55%), #0a0a0c",
      }}
    >
      <div className="relative flex h-28 w-28 items-center justify-center">
        {/* Rotating ring */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full animate-spin text-gold/60"
          style={{ animationDuration: "2.4s" }}
          fill="none"
          aria-hidden
        >
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
          <path
            d="M50 4a46 46 0 0 1 46 46"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        {/* Logo (or glyph fallback) in the centre */}
        {imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/logo.png"
            alt="Verdict Vault"
            className="h-12 w-12 object-contain"
            onError={() => setImgOk(false)}
          />
        ) : (
          <svg viewBox="0 0 32 32" className="h-10 w-10 text-gold" fill="none" aria-hidden>
            <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M16 4v3M16 25v3M4 16h3M25 16h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="16" cy="16" r="1.6" fill="currentColor" />
          </svg>
        )}
      </div>

      <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.32em] text-gold/50">
        {label}
      </p>
    </div>
  );
}