import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import type { TestimonialsSection } from "./types";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Testimonials({ content }: { content: TestimonialsSection }) {
  const { eyebrow, title, items } = content;

  return (
    <section className="section-padding bg-pale-50 dark:bg-ink-950">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        </Reveal>
        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <StaggerItem
              key={item.name}
              className="flex flex-col rounded-2xl border border-ink-100 bg-pale-100/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900/50"
            >
              <Quote className="h-6 w-6 text-gold-500" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
                {item.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-200 pt-4 dark:border-ink-800">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-700 text-xs font-bold text-white">
                  {initials(item.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-950 dark:text-white">{item.name}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">{item.role}</p>
                </div>
              </figcaption>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
