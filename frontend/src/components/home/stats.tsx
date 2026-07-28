import { CountUp } from "@/components/motion/count-up";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import type { StatsSection } from "./types";

export function Stats({ content }: { content: StatsSection }) {
  const { items } = content;

  return (
    <section className="bg-gradient-to-r from-gold-600 to-gold-500">
      <StaggerGroup className="container-page grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
        {items.map((item) => (
          <StaggerItem key={item.label} className="text-center">
            <CountUp value={item.value} className="font-display text-4xl font-bold text-white sm:text-5xl" />
            <p className="mt-2 text-sm font-medium text-gold-50">{item.label}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
