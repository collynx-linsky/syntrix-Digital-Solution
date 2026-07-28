import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { locales } from "@/i18n/locales";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { SITE_URL, projectJsonLd } from "@/lib/seo";
import { IMAGES } from "@/lib/images";
import { getProjects, getProjectBySlug, pickTranslation } from "@/lib/public-api";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
  } catch {
    // Backend unreachable at build time — fall back entirely to on-demand
    // SSR + ISR (dynamicParams defaults to true) rather than failing the build.
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  const tr = project ? pickTranslation(project.translations, locale) : null;
  if (!project || !tr) return {};
  return {
    title: `${tr.title} — ${project.client_name}`,
    description: tr.description,
    alternates: { canonical: `${SITE_URL}/${locale}/portfolio/${slug}` },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = await getProjectBySlug(slug);
  const tr = project ? pickTranslation(project.translations, locale) : null;
  if (!project || !tr) notFound();
  const common = await getTranslations("common");
  const c = await getTranslations("common.buttons");
  const nav = await getTranslations("nav");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            projectJsonLd({ title: tr.title, description: tr.description, slug: project.slug, locale, image: project.image })
          ),
        }}
      />

      <div className="relative aspect-[21/9] overflow-hidden">
        <Image
          src={project.image ?? IMAGES.aboutTeam}
          alt={`${tr.title} — ${project.client_name}`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" />
      </div>

      <Breadcrumbs
        items={[
          { label: nav("portfolio"), href: "/portfolio" },
          { label: tr.title },
        ]}
      />

      <section className="section-padding bg-pale-50 dark:bg-ink-950">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-600 dark:text-gold-400">
              {project.industry}
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
              {tr.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-600 dark:text-ink-300">{tr.description}</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4">
            <div className="space-y-5 rounded-2xl border border-ink-100 bg-pale-100/60 p-6 dark:border-ink-800 dark:bg-ink-900/50">
              <div>
                <p className="text-xs font-semibold uppercase text-ink-500 dark:text-ink-400">{common("labels.client")}</p>
                <p className="mt-1 text-sm font-medium text-ink-900 dark:text-white">{project.client_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-ink-500 dark:text-ink-400">{common("labels.industry")}</p>
                <p className="mt-1 text-sm font-medium text-ink-900 dark:text-white">{project.industry}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-ink-500 dark:text-ink-400">{common("labels.technologies")}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-full bg-pale-50 px-2.5 py-1 text-xs font-medium text-ink-700 shadow-sm dark:bg-ink-800 dark:text-ink-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-pale-100 py-16 text-center dark:border-ink-800 dark:bg-ink-900/40">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-gold-500"
        >
          {c("contactUs")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </section>
    </>
  );
}
