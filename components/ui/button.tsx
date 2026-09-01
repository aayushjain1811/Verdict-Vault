"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/magnetic";

type Variant = "gold" | "outline" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
}

const styles: Record<Variant, string> = {
  gold:
    "relative overflow-hidden bg-gold-gradient text-ink font-medium shadow-gold-glow",
  outline:
    "border border-gold/40 text-bone hover:border-gold hover:text-gold-pale",
  ghost: "text-smoke hover:text-bone",
};

export function Button({
  children,
  href,
  onClick,
  variant = "gold",
  className,
  magnetic = true,
}: ButtonProps) {
  const inner = (
    <span
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm tracking-wide transition-colors duration-300",
        styles[variant],
        className
      )}
    >
      {variant === "gold" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gold-sheen opacity-0 transition-opacity duration-500 group-hover:animate-sheen group-hover:opacity-100" />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </span>
  );

  const node = href ? (
    <Link href={href} onClick={onClick}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick}>
      {inner}
    </button>
  );

  return magnetic ? <Magnetic strength={0.25}>{node}</Magnetic> : node;
}
