import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Compass, Target, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import { IMAGES } from "@/lib/images";
import { getPageBySlug, pickSectionsTranslation } from "@/lib/public-api";

type AboutSections = {
  hero: { eyebrow: string; title: string; subtitle: string };
  story: { eyebrow: string; title: string; paragraphs: string[] };
  vision: { title: string; description: string };
  mission: { title: string; description: string };
  values: { eyebrow: string; title: string; items: { title: string; description: string }[] };
  leadership: {
    eyebrow: string;
    title: string;
    description: string;
    members: { name: string; role: string; bio: string }[];
  };
  culture: { eyebrow: string; title: string; description: string; points: string[] };
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.about" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: { canonical: `${SITE_URL}/${locale}/about` },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");

  const page = await getPageBySlug("about");
  const tr = page ? pickSectionsTranslation(page.translations, locale) : null;
  if (!page || !tr) notFound();

  const { hero, story, vision, mission, values, leadership, culture } = tr.sections as unknown as AboutSections;
  const paragraphs = story.paragraphs;
  const members = leadership.members;
  const culturePoints = culture.points;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `${SITE_URL}/${locale}` },
              { name: nav("about"), url: `${SITE_URL}/${locale}/about` },
            ])
          ),
        }}
      />

      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="absolute inset-0 bg-grid-glow" />
        <div className="container-page relative py-24 text-center lg:py-32">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-200 backdrop-blur">
            {hero.eyebrow}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-ink-300">{hero.subtitle}</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: hero.eyebrow }]} />

      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-[420px]">
        <Image
          src={IMAGES.aboutTeam}
          alt="Syntrix Digital Solutions team in a strategy meeting"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/10 to-transparent" />
      </div>

      <section className="section-padding bg-pale-50 dark:bg-ink-950">
        <div className="container-page grid grid-cols-1 gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionHeading eyebrow={story.eyebrow} title={story.title} />
            <div className="mt-6 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-ink-600 dark:text-ink-300">{p}</p>
              ))}
            </div>
          </Reveal>
          <StaggerGroup className="flex flex-col gap-6 lg:col-span-5">
            <StaggerItem className="rounded-2xl border border-ink-100 bg-pale-100/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900/50">
              <Compass className="h-6 w-6 text-gold-600 dark:text-gold-400" />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-950 dark:text-white">{vision.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{vision.description}</p>
            </StaggerItem>
            <StaggerItem className="rounded-2xl border border-ink-100 bg-pale-100/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900/50">
              <Target className="h-6 w-6 text-gold-600 dark:text-gold-400" />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-950 dark:text-white">{mission.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{mission.description}</p>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      <section className="section-padding bg-pale-100 dark:bg-ink-900/40">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow={values.eyebrow} title={values.title} align="center" />
          </Reveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {values.items.map((v) => (
              <StaggerItem
                key={v.title}
                className="rounded-2xl border border-ink-100 bg-pale-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-ink-800 dark:bg-ink-900"
              >
                <h3 className="font-display text-base font-semibold text-ink-950 dark:text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{v.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="section-padding bg-pale-50 dark:bg-ink-950">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow={leadership.eyebrow} title={leadership.title} description={leadership.description} align="center" />
          </Reveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((m) => (
              <StaggerItem key={m.name} className="group rounded-2xl border border-ink-100 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-ink-800">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 text-lg font-bold text-white transition-transform duration-300 group-hover:scale-110">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-950 dark:text-white">{m.name}</h3>
                <p className="text-xs font-medium text-gold-600 dark:text-gold-400">{m.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{m.bio}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="section-padding bg-brand-950">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-400">
              {culture.eyebrow}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white">{culture.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-300">{culture.description}</p>
          </Reveal>
          <StaggerGroup className="space-y-3">
            {culturePoints.map((point) => (
              <StaggerItem key={point} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-medium text-ink-200 transition-colors hover:border-gold-500/30">
                {point}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  );
}
