"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Splash intro. Shows once each time the site is opened in a new browser
 * session (sessionStorage) — so a fresh visit gets the logo animation, but
 * clicking around the site afterwards does not replay it. Reopening the site in
 * a new tab/session shows it again.
 *
 * Uses /logo.png with a vault-glyph fallback so it works before the logo is added.
 */
export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("vv_splash");
    if (seen) return;

    sessionStorage.setItem("vv_splash", "1");
    setShow(true);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setShow(false), reduce ? 600 : 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 35%, rgba(201,161,90,.12), rgba(8,8,10,0) 55%), #08080a",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {imgOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logo.png"
                alt="Verdict Vault"
                className="h-20 w-auto object-contain"
                onError={() => setImgOk(false)}
              />
            ) : (
              <svg viewBox="0 0 32 32" className="h-16 w-16 text-gold" fill="none" aria-hidden>
                <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M16 4v3M16 25v3M4 16h3M25 16h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="16" cy="16" r="1.6" fill="currentColor" />
              </svg>
            )}

            {/* Gold line that draws itself under the logo */}
            <motion.div
              className="mt-6 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 180, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.p
              className="mt-6 font-mono text-[10px] uppercase tracking-[0.32em] text-gold/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Where Law Meets Clarity
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
