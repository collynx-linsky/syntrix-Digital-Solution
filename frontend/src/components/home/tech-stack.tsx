import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import type { TechStackSection } from "./types";

export function TechStack({ content }: { content: TechStackSection }) {
  const { eyebrow, title, description, categories } = content;

  return (
    <section className="relative overflow-hidden section-padding bg-brand-950">
      <div className="pointer-events-none absolute inset-0 bg-grid-glow opacity-60" />
      <div className="container-page relative">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} align="center" light />
        </Reveal>
        <StaggerGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat) => (
            <StaggerItem
              key={cat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 hover:bg-white/[0.06]"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gold-400">{cat.label}</h3>
              <ul className="mt-4 space-y-2.5">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm font-medium text-ink-200">{item}</li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
