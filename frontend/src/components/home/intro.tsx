import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { IMAGES } from "@/lib/images";
import type { IntroSection } from "./types";

export function Intro({ content }: { content: IntroSection }) {
  const { eyebrow, title, description, points, badgeValue, badgeLabel } = content;

  return (
    <section className="section-padding bg-pale-50 dark:bg-ink-950">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal delay={0.1} className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-glow">
              <Image
                src={IMAGES.whiteboardStrategy}
                alt="Syntrix strategists planning a client project"
                fill
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -end-6 hidden rounded-2xl bg-gold-600 px-6 py-4 text-center shadow-glow sm:block">
              <p className="font-display text-3xl font-bold text-white">{badgeValue}</p>
              <p className="text-xs font-medium text-gold-50">{badgeLabel}</p>
            </div>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {points.map((point) => (
              <StaggerItem
                key={point}
                className="group flex items-start gap-3 rounded-2xl border border-ink-100 bg-pale-100/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900/50"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 transition-transform duration-300 group-hover:scale-110 dark:text-gold-400" />
                <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{point}</span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
