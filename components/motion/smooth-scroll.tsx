"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling (desktop, public pages only).
 *
 * IMPORTANT: Lenis is DISABLED on /admin. It hijacks the mouse wheel, which was
 * stopping native <select> dropdowns in the post editor from scrolling with the
 * wheel (you had to click the scrollbar). With Lenis off on admin, dropdowns and
 * long forms scroll natively and normally.
 *
 * Also disabled on touch devices and under reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return; // native scrolling in the admin
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [isAdmin]);

  return <>{children}</>;
}
