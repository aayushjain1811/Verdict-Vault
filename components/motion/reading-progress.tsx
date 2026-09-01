"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A gold reading-progress line pinned to the top of the viewport.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left bg-gold-gradient"
    />
  );
}
