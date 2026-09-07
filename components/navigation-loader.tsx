"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { VaultLoader } from "@/components/vault-loader";

/**
 * Shows the branded loader while navigating between pages.
 *
 * It arms on any internal link click and reveals the loader only if the new
 * page takes longer than a short threshold to commit — so instant (cached)
 * navigations don't flash a loader, but real page loads show one. It hides
 * automatically once the new route's pathname takes effect.
 */
export function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Navigation committed (pathname changed) → hide + clear timers.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (safety.current) clearTimeout(safety.current);
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Only left-click, no modifier keys / new-tab intent.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (!href || !href.startsWith("/") || target === "_blank") return; // internal only
      if (href === pathname) return; // same page

      // Arm: show the loader only if the nav hasn't committed within 180ms.
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setLoading(true), 180);

      // Safety net: never let it hang if a navigation is cancelled.
      if (safety.current) clearTimeout(safety.current);
      safety.current = setTimeout(() => setLoading(false), 10000);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <VaultLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}