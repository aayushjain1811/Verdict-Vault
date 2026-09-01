"use client";

import { useEffect, useState } from "react";

export function TableOfContents({
  headings,
}: {
  headings: { id: string; text: string }[];
}) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-32 hidden lg:block">
      <p className="mb-4 text-[11px] uppercase tracking-eyebrow text-gold/60">
        Contents
      </p>
      <ul className="space-y-3 border-l border-gold/15">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l-2 pl-4 text-sm leading-snug transition-all duration-300 ${
                active === h.id
                  ? "border-gold text-gold-pale"
                  : "border-transparent text-smoke hover:text-bone"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
