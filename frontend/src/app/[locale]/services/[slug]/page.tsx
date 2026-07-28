import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { locales } from "@/i18n/locales";
import { SITE_URL, serviceJsonLd } from "@/lib/seo";
import { getServices, getServiceBySlug, pickTranslation } from "@/lib/public-api";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const services = await getServices();
    return locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
  } catch {
    // Backend unreachable at build time — fall back entirely to on-demand
    // SSR + ISR (dynamicParams defaults to true) rather than failing the build.
    return [];
  }
}

async function getService(locale: string, slug: string) {
  const service = await getServiceBySlug(slug);
  if (!service) return null;
  const tr = pickTranslation(service.translations, locale);
  if (!tr) return null;
  return { slug: service.slug, title: tr.title, summary: tr.summary, description: tr.description, features: tr.features, seoTitle: tr.seo_title, seoDescription: tr.seo_description };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getService(locale, slug);
  if (!service) return {};

  const title = service.seoTitle || service.title;
  const description = service.seoDescription || service.summary;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${locale}/services/${slug}` },
    openGraph: { title, description },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = await getService(locale, slug);
  if (!service) notFound();

  const t = await getTranslations("services");
  const c = await getTranslations("common");
  const nav = await getTranslations("nav");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd({ title: service.title, description: service.description, slug })),
        }}
      />

      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="absolute inset-0 bg-grid-glow" />
        <div className="container-page relative py-24 lg:py-28">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-200 backdrop-blur">
            {t("hero.eyebrow")}
          </span>
          <h1 className="mt-6 max-w-2xl text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-lg text-ink-300">{service.summary}</p>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: nav("services"), href: "/services" },
          { label: service.title },
        ]}
      />

      <section className="section-padding bg-pale-50 dark:bg-ink-950">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="text-base leading-relaxed text-ink-600 dark:text-ink-300">{service.description}</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-2xl border border-ink-100 bg-pale-100/60 p-7 dark:border-ink-800 dark:bg-ink-900/50">
              <h3 className="font-display text-base font-semibold text-ink-950 dark:text-white">
                {t("listTitle")}
              </h3>
              <ul className="mt-5 space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink-700 dark:text-ink-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600 dark:text-gold-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-pale-100 py-16 dark:border-ink-800 dark:bg-ink-900/40">
        <div className="container-page flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-start">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-950 dark:text-white">{t("detailCtaTitle")}</h3>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{t("detailCtaDescription")}</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gold-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-gold-500"
          >
            {c("buttons.contactUs")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </>
  );
}
