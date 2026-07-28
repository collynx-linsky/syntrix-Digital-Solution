import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/forms/application-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { locales } from "@/i18n/locales";
import { SITE_URL } from "@/lib/seo";
import { getJobPositions, getJobPositionBySlug, pickTranslation } from "@/lib/public-api";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const positions = await getJobPositions();
    return locales.flatMap((locale) => positions.map((p) => ({ locale, slug: p.slug })));
  } catch {
    return [];
  }
}

async function getPosition(locale: string, slug: string, t: Awaited<ReturnType<typeof getTranslations>>) {
  const position = await getJobPositionBySlug(slug);
  if (!position) return null;
  const tr = pickTranslation(position.translations, locale);
  if (!tr) return null;
  return {
    slug: position.slug,
    title: tr.title,
    summary: tr.summary,
    description: tr.description,
    department: position.department,
    location: position.location,
    type: t(`employmentTypes.${position.employment_type}`),
    seoTitle: tr.seo_title,
    seoDescription: tr.seo_description,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });
  const position = await getPosition(locale, slug, t);
  if (!position) return {};
  return {
    title: position.seoTitle || position.title,
    description: position.seoDescription || position.summary,
    alternates: { canonical: `${SITE_URL}/${locale}/careers/${slug}` },
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");
  const position = await getPosition(locale, slug, t);
  if (!position) notFound();
  const application = await getTranslations("careers.application");
  const nav = await getTranslations("nav");

  return (
    <>
      <section className="border-b border-ink-100 bg-pale-100 py-16 dark:border-ink-800 dark:bg-ink-900/40">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
            {position.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-ink-600 dark:text-ink-300">{position.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-ink-500 dark:text-ink-400">
            <span>{position.department}</span>
            <span>·</span>
            <span>{position.location}</span>
            <span>·</span>
            <span>{position.type}</span>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: nav("careers"), href: "/careers" },
          { label: position.title },
        ]}
      />

      {position.description && (
        <section className="section-padding bg-pale-50 dark:bg-ink-950">
          <Reveal className="container-page max-w-2xl">
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700 dark:text-ink-200">
              {position.description}
            </p>
          </Reveal>
        </section>
      )}

      <section className="section-padding border-t border-ink-100 bg-pale-100 dark:border-ink-800 dark:bg-ink-900/40">
        <Reveal className="container-page max-w-2xl">
          <h2 className="font-display text-xl font-semibold text-ink-950 dark:text-white">{application("title")}</h2>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{application("description")}</p>
          <div className="mt-8">
            <ApplicationForm positionSlug={position.slug} />
          </div>
        </Reveal>
      </section>
    </>
  );
}
