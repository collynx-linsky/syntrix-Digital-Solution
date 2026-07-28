import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { fetchOneEntry, Content } from "@builder.io/sdk-react";
import { builderCustomComponents } from "@/lib/builder/components";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { ServicesShowcase } from "@/components/home/services-showcase";
import { Overview } from "@/components/home/overview";
import { TechStack } from "@/components/home/tech-stack";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { FeaturedProjects, type FeaturedProject } from "@/components/home/featured-projects";
import { Industries } from "@/components/home/industries";
import { Stats } from "@/components/home/stats";
import { Testimonials } from "@/components/home/testimonials";
import { Cta } from "@/components/home/cta";
import type { HomeSections } from "@/components/home/types";
import { SITE_URL } from "@/lib/seo";
import { getPageBySlug, getFeaturedProjects, pickTranslation, pickSectionsTranslation } from "@/lib/public-api";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: { canonical: `${SITE_URL}/${locale}` },
    openGraph: { title: t("title"), description: t("description") },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await getPageBySlug("homepage");
  const tr = page ? pickSectionsTranslation(page.translations, locale) : null;
  if (!page || !tr) notFound();

  const sections = tr.sections as unknown as HomeSections;
  const featuredProjects = await getFeaturedProjects(4);
  const projects: FeaturedProject[] = featuredProjects
    .map((project) => {
      const projectTr = pickTranslation(project.translations, locale);
      if (!projectTr) return null;
      return { slug: project.slug, title: projectTr.title, industry: project.industry, image: project.image };
    })
    .filter((p): p is FeaturedProject => p !== null);

  // Pilot: check for a published Builder.io layout before falling back to
  // the hardcoded composition below. Locale-independent urlPath — the
  // designer sets the block order/design once and it applies to all 4
  // languages; the actual translated text still flows from `sections`
  // (injected via `data`) rather than being re-authored inside Builder.
  const builderApiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
  const builderContent = builderApiKey
    ? await fetchOneEntry({
        model: "page",
        apiKey: builderApiKey,
        userAttributes: { urlPath: "/homepage-layout" },
        // Next.js patches global fetch with its own cache by default, which
        // (confirmed while debugging this pilot) can serve a stale response
        // indefinitely otherwise. 60s keeps CDN load reasonable while still
        // reflecting Builder edits quickly during the pilot.
        fetchOptions: { next: { revalidate: 60 } },
      })
    : null;

  if (builderContent) {
    return (
      <Content
        content={builderContent}
        model="page"
        apiKey={builderApiKey!}
        customComponents={builderCustomComponents}
        data={{ sections, projects }}
        locale={locale}
      />
    );
  }

  return (
    <>
      <Hero content={sections.hero} />
      <Intro content={sections.intro} />
      <ServicesShowcase content={sections.services} />
      <Overview content={sections.overview} />
      <TechStack content={sections.techStack} />
      <WhyChooseUs content={sections.whyChooseUs} />
      <FeaturedProjects content={sections.featuredProjects} projects={projects} />
      <Industries content={sections.industries} />
      <Stats content={sections.stats} />
      <Testimonials content={sections.testimonials} />
      <Cta content={sections.cta} />
    </>
  );
}
