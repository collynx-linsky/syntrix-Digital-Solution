import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { locales } from "@/i18n/locales";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { SITE_URL } from "@/lib/seo";
import { getSolutions, getSolutionBySlug, pickTranslation } from "@/lib/public-api";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const solutions = await getSolutions();
    return locales.flatMap((locale) => solutions.map((s) => ({ locale, slug: s.slug })));
  } catch {
    return [];
  }
}

async function getSolution(locale: string, slug: string) {
  const solution = await getSolutionBySlug(slug);
  if (!solution) return null;
  const tr = pickTranslation(solution.translations, locale);
  if (!tr) return null;
  return { slug: solution.slug, title: tr.title, summary: tr.summary, description: tr.description, capabilities: tr.capabilities, seoTitle: tr.seo_title, seoDescription: tr.seo_description };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const solution = await getSolution(locale, slug);
  if (!solution) return {};
  return {
    title: solution.seoTitle || solution.title,
    description: solution.seoDescription || solution.summary,
    alternates: { canonical: `${SITE_URL}/${locale}/solutions/${slug}` },
  };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const solution = await getSolution(locale, slug);
  if (!solution) notFound();
  const c = await getTranslations("common");
  const nav = await getTranslations("nav");

  return (
    <>
      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="absolute inset-0 bg-grid-glow" />
        <div className="container-page relative py-24 lg:py-28">
          <h1 className="max-w-2xl text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {solution.title}
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-lg text-ink-300">{solution.summary}</p>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: nav("solutions"), href: "/solutions" },
          { label: solution.title },
        ]}
      />

      <section className="section-padding bg-pale-50 dark:bg-ink-950">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="text-base leading-relaxed text-ink-600 dark:text-ink-300">{solution.description}</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-2xl border border-ink-100 bg-pale-100/60 p-7 dark:border-ink-800 dark:bg-ink-900/50">
              <ul className="space-y-3">
                {solution.capabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-3 text-sm text-ink-700 dark:text-ink-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600 dark:text-gold-400" />
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-pale-100 py-16 text-center dark:border-ink-800 dark:bg-ink-900/40">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-gold-500"
        >
          {c("buttons.contactUs")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </section>
    </>
  );
}
