import type { Metadata } from "next";
import { Compass, Eye, Gem, PenLine } from "lucide-react";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Newsletter } from "@/components/ui/newsletter";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story, mission, and editorial principles behind Verdict Vault.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Compass,
    title: "Mission",
    body: "To make the law legible. We believe legal knowledge is a public good that has been kept behind unnecessary walls of jargon, paywalls, and prestige.",
  },
  {
    icon: Eye,
    title: "Vision",
    body: "A world where any person — founder, student, defendant, or citizen — can understand the rules that govern them without needing a translator.",
  },
  {
    icon: Gem,
    title: "Values",
    body: "Precision over speed. Sources over assertions. Clarity over cleverness. We would rather publish one careful piece than five hurried ones.",
  },
  {
    icon: PenLine,
    title: "Editorial independence",
    body: "No sponsored analysis. No advertiser influence over coverage. Our only obligation is to the reader trying to understand something difficult.",
  },
];

const timeline = [
  {
    year: "2021",
    title: "A frustration becomes a plan",
    body: "Three practising lawyers, tired of sending clients links to writing they knew was impenetrable, started drafting explainers for their own use.",
  },
  {
    year: "2022",
    title: "The vault opens",
    body: "Verdict Vault publishes its first twenty articles. The editorial standard is set on day one: every claim sourced, every case cited.",
  },
  {
    year: "2024",
    title: "A newsroom, not a blog",
    body: "The contributor network expands across eight practice areas, with a formal review process modelled on peer review rather than publishing.",
  },
  {
    year: "2026",
    title: "Built for the long read",
    body: "A ground-up rebuild focused on the reading experience itself — typography, pacing, and the quiet confidence the subject deserves.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-40">
      <header className="shell max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-gold/50" />
          <span className="eyebrow">About Verdict Vault</span>
        </div>
        <TextReveal
          text="We open what the law keeps closed."
          as="h1"
          className="display-hero text-4xl text-bone md:text-6xl"
        />
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-smoke">
          Verdict Vault exists because the gap between what the law says and
          what people understand it to say is where most harm happens. We write
          for the reader on the other side of that gap.
        </p>
      </header>

      {/* Values */}
      <section className="shell mt-28">
        <SectionHeading
          index="01"
          eyebrow="What We Stand For"
          title="Principles, stated plainly"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 0.08}>
              <div className="glass flex h-full gap-5 rounded-2xl p-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-ink text-gold">
                  <v.icon className="h-5 w-5" strokeWidth={1.4} />
                </div>
                <div>
                  <h3 className="text-lg text-bone">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-smoke">
                    {v.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="shell mt-28">
        <SectionHeading
          index="02"
          eyebrow="Our Story"
          title="How the vault was built"
        />
        <div className="mt-12 max-w-3xl border-l border-gold/20 pl-8 md:pl-12">
          {timeline.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.06}>
              <div className="relative pb-14 last:pb-0">
                <span className="absolute -left-[calc(2rem+5px)] top-2 h-2.5 w-2.5 rounded-full bg-gold md:-left-[calc(3rem+5px)]" />
                <p className="font-display text-2xl text-gold-gradient">
                  {t.year}
                </p>
                <h3 className="mt-2 text-xl text-bone">{t.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-smoke">
                  {t.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Editorial standards */}
      <section className="shell mt-28">
        <Reveal>
          <div className="glass rounded-3xl p-10 md:p-16">
            <p className="eyebrow">Editorial Policy</p>
            <h2 className="mt-4 max-w-2xl text-3xl leading-tight text-bone md:text-4xl">
              How an article earns its place here
            </h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "Written by a practitioner",
                  body: "Every piece is drafted by someone who has worked in the area they are writing about.",
                },
                {
                  step: "Reviewed against sources",
                  body: "An editor checks each legal claim against statute, case law, or primary regulation before publication.",
                },
                {
                  step: "Revised when the law moves",
                  body: "Articles are dated and revisited. When doctrine shifts, we update rather than quietly leave it standing.",
                },
              ].map((s, i) => (
                <li key={s.step}>
                  <span className="font-mono text-[11px] tracking-eyebrow text-gold/50">
                    § {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-base text-bone">{s.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-smoke">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      <section className="shell mt-24">
        <Newsletter />
      </section>
    </div>
  );
}
