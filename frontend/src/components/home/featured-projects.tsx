import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { IMAGES } from "@/lib/images";
import type { FeaturedProjectsSection } from "./types";

export type FeaturedProject = { slug: string; title: string; industry: string; image: string | null };

// Sourced live from Project.is_featured (see getFeaturedProjects in
// lib/public-api.ts) instead of the old static portfolio.json slice.
export function FeaturedProjects({
  content,
  projects,
}: {
  content: FeaturedProjectsSection;
  projects: FeaturedProject[];
}) {
  const { eyebrow, title, description } = content;
  const c = useTranslations("common");

  return (
    <section className="relative overflow-hidden section-padding bg-brand-950">
      <div className="pointer-events-none absolute inset-0 bg-grid-glow opacity-60" />
      <div className="container-page relative">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align="center" light />

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <StaggerItem key={project.slug}>
              <Link
                href={{ pathname: "/portfolio/[slug]", params: { slug: project.slug } }}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <Image
                  src={project.image ?? IMAGES.aboutTeam}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-gold-400">{project.industry}</span>
                  <h3 className="mt-1 font-display text-base font-semibold text-white">{project.title}</h3>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-12 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/15"
          >
            {c("buttons.viewAll")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
