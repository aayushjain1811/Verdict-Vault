"use client";

import { useState } from "react";
import { Link2, Twitter, Linkedin, Check } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const url = typeof window !== "undefined" ? window.location.href : "";

  const buttons = [
    { icon: Twitter, label: "Share on X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { icon: Linkedin, label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs uppercase tracking-eyebrow text-gold/60">
        Share
      </span>
      {buttons.map((b) => (
        <a
          key={b.label}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={b.label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-smoke transition-colors hover:border-gold/50 hover:text-gold"
        >
          <b.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-smoke transition-colors hover:border-gold/50 hover:text-gold"
      >
        {copied ? <Check className="h-4 w-4 text-gold" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
