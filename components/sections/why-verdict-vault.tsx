import { ShieldCheck, Sparkles, BookOpen, Scale } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Authority you can trust",
    body: "Every article is written and reviewed by practitioners with real courtroom and boardroom experience.",
  },
  {
    icon: Sparkles,
    title: "Clarity without compromise",
    body: "We refuse to choose between rigor and readability. The law is complex; the writing needn't be.",
  },
  {
    icon: BookOpen,
    title: "Editorial standards",
    body: "Sources cited, cases linked, claims checked. Journalism-grade discipline applied to legal analysis.",
  },
  {
    icon: Scale,
    title: "Balanced by design",
    body: "We explain how the law works, not how we wish it did. Perspective, not persuasion.",
  },
];

export function WhyVerdictVault() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-vault-radial" />
      <div className="shell relative">
        <SectionHeading
          index="05"
          eyebrow="Why Verdict Vault"
          title="Built on the qualities the law demands"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.08}>
              <div className="glass flex h-full gap-5 rounded-2xl p-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-ink text-gold">
                  <p.icon className="h-5 w-5" strokeWidth={1.4} />
                </div>
                <div>
                  <h3 className="text-lg text-bone">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-smoke">
                    {p.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
