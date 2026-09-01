"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { SearchOverlay } from "@/components/ui/search-overlay";

const NAV = [
  { label: "Articles", href: "/blog" },
  { label: "Categories", href: "/categories" },
  { label: "Authors", href: "/authors" },
  { label: "Write", href: "/write" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
    setScrolled(y > 24);
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-120%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-4 z-[75] flex justify-center px-4"
      >
        <nav
          className={`flex w-full max-w-[1180px] items-center justify-between rounded-full border px-5 py-2.5 transition-all duration-500 ${
            scrolled
              ? "glass border-gold/15"
              : "border-transparent bg-transparent"
          }`}
        >
          <Logo />

          <div className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-sm text-smoke transition-colors hover:text-bone"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-gold/15 px-3 py-1.5 text-xs text-smoke transition-colors hover:border-gold/40 hover:text-bone"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="hidden font-mono text-[10px] text-gold/60 sm:inline">
                ⌘K
              </kbd>
            </button>
            <div className="hidden md:block">
              <Button href="/blog" variant="gold" className="px-5 py-2 text-xs">
                Read
              </Button>
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-full border border-gold/15 p-2 text-bone md:hidden"
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <Logo />
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-gold/15 p-2 text-bone"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-6 pt-6">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-gold/10 py-4 font-display text-2xl text-bone"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
