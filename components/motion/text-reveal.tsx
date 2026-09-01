"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Reveals a headline word-by-word with a masked upward slide.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const words = text.split(" ");
  return (
    <Tag className={cn("flex flex-wrap", className)} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="overflow-hidden pb-[0.12em]"
          aria-hidden
        >
          <motion.span
            className="inline-block pr-[0.28em]"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * 0.06,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
