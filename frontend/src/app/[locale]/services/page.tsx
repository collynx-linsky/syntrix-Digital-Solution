import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Code2, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import { getServices, pickTranslation } from "@/lib/public-api";
import { getLucideIcon } from "@/lib/lucide-icon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.services" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: { canonical: `${SITE_URL}/${locale}/services` },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const nav = await getTranslations("nav");

  const services = await getServices();
  const items = services
    .map((service) => {
      const tr = pickTranslation(service.translations, locale);
      if (!tr) return null;
      return { slug: service.slug, icon: service.icon, title: tr.title, summary: tr.summary };
    })
    .filter((item): item is { slug: string; icon: string; title: string; summary: string } => item !== null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `${SITE_URL}/${locale}` },
              { name: nav("services"), url: `${SITE_URL}/${locale}/services` },
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
        {items.length === 0 ? (
          <div className="container-page text-center text-sm text-ink-500 dark:text-ink-400">{t("noItems")}</div>
        ) : (
        <StaggerGroup className="container-page grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = getLucideIcon(item.icon, Code2);
            return (
              <StaggerItem key={item.slug}>
                <Link
                  href={{ pathname: "/services/[slug]", params: { slug: item.slug } }}
                  className="group flex h-full flex-col rounded-2xl border border-ink-100 p-8 transition-all hover:-translate-y-1 hover:border-gold-300 hover:shadow-glow dark:border-ink-800"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-transform duration-300 group-hover:scale-110 dark:text-gold-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-ink-950 dark:text-white">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{item.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold-600 dark:text-gold-400">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
        )}
      </section>
    </>
  );
}
