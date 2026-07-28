import { useTranslations } from "next-intl";
import {
  Code2, Globe2, Building2, Smartphone, SearchCheck,
  Megaphone, Palette, Cloud, Users, Workflow, ArrowUpRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import type { ServicesSection } from "./types";

const ICONS: Record<string, typeof Code2> = {
  "software-development": Code2,
  "web-development": Globe2,
  "erp-solutions": Building2,
  "mobile-applications": Smartphone,
  "seo-services": SearchCheck,
  "digital-marketing": Megaphone,
  branding: Palette,
  "cloud-solutions": Cloud,
  "it-consulting": Users,
  automation: Workflow,
};

// Item list still comes from the static services.json — Services doesn't
// have admin CRUD yet (Phase 2), only the heading below is DB-backed.
export function ServicesShowcase({ content }: { content: ServicesSection }) {
  const { eyebrow, title, description, viewAll } = content;
  const s = useTranslations("services");
  const items = s.raw("items") as { slug: string; title: string; summary: string }[];

  return (
    <section className="relative overflow-hidden section-padding bg-brand-950">
      <div className="pointer-events-none absolute inset-0 bg-grid-glow opacity-70" />
      <div className="container-page relative">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} light />
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
          >
            {viewAll}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = ICONS[item.slug] ?? Code2;
            return (
              <StaggerItem key={item.slug}>
                <Link
                  href={{ pathname: "/services/[slug]", params: { slug: item.slug } }}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/[0.06] hover:shadow-glow"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-300">{item.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-400 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
