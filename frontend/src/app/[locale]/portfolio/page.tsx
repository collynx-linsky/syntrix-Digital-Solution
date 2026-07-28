import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import { IMAGES } from "@/lib/images";
import { getProjects, pickTranslation } from "@/lib/public-api";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.portfolio" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: { canonical: `${SITE_URL}/${locale}/portfolio` },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");
  const c = await getTranslations("common");
  const nav = await getTranslations("nav");

  const rawProjects = await getProjects();
  const projects = rawProjects
    .map((project) => {
      const tr = pickTranslation(project.translations, locale);
      if (!tr) return null; // no published translation in this locale or "en"
      return {
        slug: project.slug,
        title: tr.title,
        description: tr.description,
        client: project.client_name,
        industry: project.industry,
        technologies: project.technologies,
        image: project.image,
      };
    })
    .filter((project): project is NonNullable<typeof project> => project !== null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `${SITE_URL}/${locale}` },
              { name: nav("portfolio"), url: `${SITE_URL}/${locale}/portfolio` },
            ])
          ),
        }}
      />

      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="absolute inset-0 bg-grid-glow" />
        <div className="container-page relative py-24 text-center lg:py-32">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-200 backdrop-blur">
            {t("hero.eyebrow")}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-ink-300">{t("hero.subtitle")}</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: t("hero.eyebrow") }]} />

      <section className="section-padding bg-pale-50 dark:bg-ink-950">
        <StaggerGroup className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <StaggerItem key={project.slug}>
              <Link
                href={{ pathname: "/portfolio/[slug]", params: { slug: project.slug } }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 transition-all hover:-translate-y-1 hover:border-gold-300 hover:shadow-glow dark:border-ink-800"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image ?? IMAGES.aboutTeam}
                    alt={`${project.title} — ${project.client}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/0 to-transparent" />
                  <span className="absolute bottom-3 start-3 rounded-full bg-brand-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {project.industry}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-base font-semibold text-ink-950 dark:text-white">{project.title}</h3>
                  <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{project.client}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="mt-4 text-sm font-semibold text-gold-600 dark:text-gold-400">{c("buttons.viewCaseStudy")}</span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </>
  );
}
