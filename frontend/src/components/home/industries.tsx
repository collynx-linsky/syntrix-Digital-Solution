import { GraduationCap, Landmark, HeartPulse, ShoppingBag, Building, Truck } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import type { IndustriesSection } from "./types";

const ICON_STYLES = [
  { icon: GraduationCap, iconClass: "bg-brand-500/10 text-brand-600 dark:text-brand-300" },
  { icon: Landmark, iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { icon: HeartPulse, iconClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { icon: ShoppingBag, iconClass: "bg-gold-500/10 text-gold-600 dark:text-gold-400" },
  { icon: Building, iconClass: "bg-ink-500/10 text-ink-600 dark:text-ink-300" },
  { icon: Truck, iconClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
];

export function Industries({ content }: { content: IndustriesSection }) {
  const { eyebrow, title, items } = content;

  return (
    <section className="section-padding bg-pale-100 dark:bg-ink-900/40">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        </Reveal>
        <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const { icon: Icon, iconClass } = ICON_STYLES[i % ICON_STYLES.length]!;
            return (
              <StaggerItem
                key={item.title}
                className="group rounded-2xl border border-ink-100 bg-pale-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${iconClass}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-950 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{item.description}</p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
