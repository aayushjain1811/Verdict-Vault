import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the Verdict Vault editorial desk.",
  alternates: { canonical: "/contact" },
};

const details = [
  {
    icon: Mail,
    label: "Editorial desk",
    value: "editors@verdictvault.example",
    note: "Corrections, pitches, and reader questions.",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "DLF Cyber City, Gurugram",
    note: "Visits by appointment only.",
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within two business days",
    note: "Corrections are prioritised and handled same-day.",
  },
];

export default function ContactPage() {
  return (
    <div className="pt-40">
      <header className="shell max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-gold/50" />
          <span className="eyebrow">Contact</span>
        </div>
        <TextReveal
          text="Tell us what you need."
          as="h1"
          className="display-hero text-4xl text-bone md:text-6xl"
        />
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-smoke">
          Whether you have spotted an error, want to contribute, or need a point
          of law clarified — this reaches a person, not a queue.
        </p>
      </header>

      <div className="shell mt-16 grid gap-10 pb-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {details.map((d, i) => (
            <Reveal key={d.label} delay={i * 0.06}>
              <div className="flex gap-4 rounded-2xl border border-gold/10 bg-charcoal/40 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-ink text-gold">
                  <d.icon className="h-4.5 w-4.5" strokeWidth={1.4} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-eyebrow text-gold/60">
                    {d.label}
                  </p>
                  <p className="mt-1.5 text-base text-bone">{d.value}</p>
                  <p className="mt-1 text-sm text-smoke">{d.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
