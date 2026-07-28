import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Rocket, GraduationCap, Home, Heart, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import { getJobPositions, pickTranslation } from "@/lib/public-api";

const ICONS = [Rocket, GraduationCap, Home, Heart];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.careers" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: { canonical: `${SITE_URL}/${locale}/careers` },
  };
}

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");
  const nav = await getTranslations("nav");
  const culturePoints = t.raw("culture.points") as { title: string; description: string }[];

  const jobPositions = await getJobPositions();
  const positions = jobPositions
    .map((position) => {
      const tr = pickTranslation(position.translations, locale);
      if (!tr) return null;
      return {
        slug: position.slug,
        title: tr.title,
        summary: tr.summary,
        department: position.department,
        location: position.location,
        type: t(`employmentTypes.${position.employment_type}`),
      };
    })
    .filter((p): p is { slug: string; title: string; summary: string; department: string; location: string; type: string } => p !== null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `${SITE_URL}/${locale}` },
              { name: nav("careers"), url: `${SITE_URL}/${locale}/careers` },
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

      <section className="section-padding bg-pale-100 dark:bg-ink-900/40">
        <div className="container-page">
          <Reveal>
            <h2 className="text-center font-display text-2xl font-bold text-ink-950 dark:text-white">{t("culture.title")}</h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {culturePoints.map((point, i) => {
              const Icon = ICONS[i % ICONS.length]!;
              return (
                <StaggerItem
                  key={point.title}
                  className="group rounded-2xl border border-ink-100 bg-pale-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900"
                >
                  <Icon className="h-6 w-6 text-gold-600 transition-transform duration-300 group-hover:scale-110 dark:text-gold-400" />
                  <h3 className="mt-4 font-display text-base font-semibold text-ink-950 dark:text-white">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{point.description}</p>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      <section className="section-padding bg-pale-50 dark:bg-ink-950">
        <div className="container-page">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-ink-950 dark:text-white">{t("openPositions")}</h2>
          </Reveal>
          {positions.length === 0 ? (
            <p className="mt-6 text-sm text-ink-600 dark:text-ink-300">{t("noPositions")}</p>
          ) : (
            <StaggerGroup className="mt-8 divide-y divide-ink-100 rounded-2xl border border-ink-100 dark:divide-ink-800 dark:border-ink-800">
              {positions.map((position) => (
                <StaggerItem key={position.slug}>
                  <Link
                    href={{ pathname: "/careers/[slug]", params: { slug: position.slug } }}
                    className="group flex flex-col justify-between gap-3 p-6 transition-colors hover:bg-pale-100 dark:hover:bg-ink-900/60 sm:flex-row sm:items-center"
                  >
                    <div>
                      <h3 className="font-display text-base font-semibold text-ink-950 dark:text-white">{position.title}</h3>
                      <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{position.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-ink-500 dark:text-ink-400">
                        <span>{position.department}</span>
                        <span>·</span>
                        <span>{position.location}</span>
                        <span>·</span>
                        <span>{position.type}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-gold-500 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>
    </>
  );
}
