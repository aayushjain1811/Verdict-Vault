"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient gold cursor glow (desktop only, decorative).
 *
 * PERFORMANCE NOTES:
 * - Disabled entirely on touch/coarse pointers and when reduced-motion is set
 *   (mobile never pays for this).
 * - Smaller (420px) and lighter blur (60px) than before, so each frame moves a
 *   much cheaper region.
 * - The rAF loop PAUSES when the tab is hidden and only runs while the pointer
 *   is actually moving, then idles — no perpetual repaint.
 */
export function MouseSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    let raf = 0;
    let running = false;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };

    function loop() {
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.x - 210}px, ${current.y - 210}px, 0)`;
      }
      // Stop the loop once we've essentially caught up — idle until next move.
      const dx = Math.abs(target.x - current.x);
      const dy = Math.abs(target.y - current.y);
      if (dx < 0.5 && dy < 0.5) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (!running && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    }

    function onMove(e: MouseEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      start();
    }
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[420px] w-[420px] rounded-full opacity-50"
      style={{
        background: "radial-gradient(circle, rgba(201,161,90,.08) 0%, rgba(201,161,90,0) 70%)",
        filter: "blur(60px)",
        willChange: "transform",
      }}
    />
  );
}
