import { Hammer, Bot, TrendingUp, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import type { OverviewSection } from "./types";

const ICONS = [Hammer, Bot, TrendingUp, ShieldCheck];

export function Overview({ content }: { content: OverviewSection }) {
  const { eyebrow, title, description, pillars } = content;

  return (
    <section className="section-padding bg-pale-100 dark:bg-ink-900/40">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} align="center" />
        </Reveal>
        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => {
            const Icon = ICONS[i % ICONS.length]!;
            return (
              <StaggerItem
                key={pillar.title}
                className="group rounded-2xl border border-ink-100 bg-pale-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-transform duration-300 group-hover:scale-110 dark:text-gold-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-950 dark:text-white">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{pillar.description}</p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
