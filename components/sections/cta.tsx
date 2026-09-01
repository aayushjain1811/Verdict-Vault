import { Reveal } from "@/components/motion/reveal";
import { Newsletter } from "@/components/ui/newsletter";

export function CTA() {
  return (
    <section className="shell py-16 md:py-24">
      <Reveal>
        <Newsletter />
      </Reveal>
    </section>
  );
}
