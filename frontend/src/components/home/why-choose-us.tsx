import { ShieldCheck, Lock, MapPin, Eye, Handshake, Languages } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import type { WhyChooseUsSection } from "./types";

const ICONS = [ShieldCheck, Lock, MapPin, Eye, Handshake, Languages];

export function WhyChooseUs({ content }: { content: WhyChooseUsSection }) {
  const { eyebrow, title, reasons } = content;

  return (
    <section className="section-padding bg-pale-50 dark:bg-ink-950">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        </Reveal>
        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => {
            const Icon = ICONS[i % ICONS.length]!;
            return (
              <StaggerItem key={reason.title} className="group flex gap-4 rounded-2xl p-2">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-transform duration-300 group-hover:scale-110 dark:text-gold-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink-950 dark:text-white">{reason.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{reason.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
