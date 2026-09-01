"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HeroStats {
  postCount: number;
  categoryCount: number;
  authorCount: number;
}

/**
 * Tick marks are precomputed with FIXED rounding at module scope.
 *
 * Why: computing Math.cos/Math.sin during render produces floats whose final
 * digit can serialize differently in Node vs the browser (231.2566719800475 vs
 * 231.25667198004754), which React reports as a hydration mismatch. Rounding to
 * two decimals guarantees byte-identical markup on both sides.
 */
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2;
  const major = i % 6 === 0;
  const outer = 190;
  const inner = major ? 166 : 178;
  return {
    x1: +(200 + Math.cos(a) * outer).toFixed(2),
    y1: +(200 + Math.sin(a) * outer).toFixed(2),
    x2: +(200 + Math.cos(a) * inner).toFixed(2),
    y2: +(200 + Math.sin(a) * inner).toFixed(2),
    major,
  };
});

const BOLTS = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  return {
    cx: +(200 + Math.cos(a) * 128).toFixed(2),
    cy: +(200 + Math.sin(a) * 128).toFixed(2),
  };
});

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ stats }: { stats?: HeroStats }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const dialY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const dialRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-32"
    >
      {/* Smooth gradient wash — depth without texture */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(900px 620px at 20% 30%, rgba(201,161,90,.09), transparent 65%), radial-gradient(800px 600px at 85% 60%, rgba(74,26,31,.12), transparent 65%)",
        }}
      />

      {/* Vault dial — offset, bled off the right edge */}
      <motion.div
        style={{ y: dialY, rotate: dialRotate, opacity: fade }}
        className="pointer-events-none absolute right-[-24%] top-1/2 hidden -translate-y-1/2 md:block lg:right-[-14%]"
        aria-hidden
      >
        <svg viewBox="0 0 400 400" className="h-[680px] w-[680px] lg:h-[820px] lg:w-[820px]" fill="none">
          <defs>
            <radialGradient id="dialFace" cx="38%" cy="30%">
              <stop offset="0%" stopColor="#191920" />
              <stop offset="100%" stopColor="#050506" />
            </radialGradient>
            <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EBD5A3" stopOpacity=".55" />
              <stop offset="50%" stopColor="#C9A15A" stopOpacity=".18" />
              <stop offset="100%" stopColor="#7A5C2E" stopOpacity=".5" />
            </linearGradient>
          </defs>

          <circle cx="200" cy="200" r="196" fill="url(#dialFace)" />
          <circle cx="200" cy="200" r="196" stroke="url(#rim)" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="152" stroke="#C9A15A" strokeOpacity=".14" strokeWidth="1" />
          <circle cx="200" cy="200" r="104" stroke="#C9A15A" strokeOpacity=".2" strokeWidth="1" />
          <circle cx="200" cy="200" r="58" stroke="url(#rim)" strokeWidth="1.2" />

          {TICKS.map((t, i) => (
            <line
              key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="#C9A15A"
              strokeOpacity={t.major ? 0.55 : 0.2}
              strokeWidth={t.major ? 1.6 : 1}
            />
          ))}

          {BOLTS.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r="5" fill="#C9A15A" fillOpacity=".3" />
          ))}

          {/* Scales of justice at the core */}
          <g stroke="#C9A15A" strokeOpacity=".65" strokeWidth="1.6" strokeLinecap="round">
            <path d="M200 172v56M176 228h48M182 190h36" />
            <path d="M182 190l-13 24a13 13 0 0026 0z" strokeOpacity=".45" />
            <path d="M218 190l-13 24a13 13 0 0026 0z" strokeOpacity=".45" />
          </g>
        </svg>
      </motion.div>

      <motion.div style={{ y: textY, opacity: fade }} className="shell relative z-10">
        {/* Docket line */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: .2 }}
          className="mb-10 flex items-center gap-4"
        >
          <span className="h-px w-12 bg-gold/50" />
          <span className="docket">Legal Knowledge · Vol. VII</span>
        </motion.div>

        <h1 className="display max-w-[15ch] text-[17vw] text-bone sm:text-[13vw] lg:text-[10.5rem]">
          {["Law", "Explained."].map((w, i) => (
            <span key={w} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "108%" }} animate={{ y: 0 }}
                transition={{ duration: 1.15, ease, delay: .1 + i * .1 }}
              >
                {w}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden">
            <motion.span
              className="block italic text-gold-gradient"
              initial={{ y: "108%" }} animate={{ y: 0 }}
              transition={{ duration: 1.15, ease, delay: .3 }}
            >
              Clearly.
            </motion.span>
          </span>
        </h1>

        <motion.div
          className="mt-12 h-px w-full max-w-[520px] origin-left bg-gradient-to-r from-gold via-gold/40 to-transparent"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: .65, ease }}
        />

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .8, duration: .9 }}
            className="max-w-[46ch] font-read text-lg leading-[1.7] text-smoke"
          >
            A vault of legal knowledge, opened. Rigorous analysis of the cases,
            contracts and constitutions that shape modern life — written with the
            precision of a brief and the clarity of a good essay.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .95, duration: .9 }}
            className="flex shrink-0 flex-wrap items-center gap-4"
          >
            <Button href="/blog" variant="gold">
              Enter the vault <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/#newsletter" variant="outline">Subscribe</Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Credibility band — real figures from Firestore; hidden until there's content */}
      {stats && stats.postCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 1 }}
          style={{ opacity: fade }}
          className="rule-t relative z-10 mt-20"
        >
          <div className="shell grid grid-cols-3 divide-x divide-gold/10">
            {[
              [String(stats.postCount), stats.postCount === 1 ? "Article published" : "Articles published"],
              [String(stats.categoryCount), "Practice areas"],
              [String(stats.authorCount), stats.authorCount === 1 ? "Contributor" : "Contributors"],
            ].map(([v, l], i) => (
              <div key={l} className={`py-7 ${i === 0 ? "" : "pl-6"} pr-6`}>
                <p className="font-display text-2xl text-gold-gradient md:text-3xl">{v}</p>
                <p className="docket mt-2 !text-ash">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
