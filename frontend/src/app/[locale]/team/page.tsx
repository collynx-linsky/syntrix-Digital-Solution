import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import { IMAGES } from "@/lib/images";
import { getTeamMembers, pickTranslation } from "@/lib/public-api";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.team" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: { canonical: `${SITE_URL}/${locale}/team` },
  };
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const nav = await getTranslations("nav");

  const teamMembers = await getTeamMembers();
  const members = teamMembers
    .map((member) => {
      const tr = pickTranslation(member.translations, locale);
      if (!tr) return null;
      return { slug: member.slug, photo: member.photo, name: tr.name, role: tr.role, bio: tr.bio };
    })
    .filter((m): m is { slug: string; photo: string | null; name: string; role: string; bio: string } => m !== null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `${SITE_URL}/${locale}` },
              { name: nav("team"), url: `${SITE_URL}/${locale}/team` },
            ])
          ),
        }}
      />

      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="absolute inset-0 bg-grid-glow" />
        <div className="container-page relative py-24 text-center lg:py-32">
          <h1 className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-ink-300">{t("hero.subtitle")}</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: nav("team") }]} />

      <section className="section-padding bg-pale-50 dark:bg-ink-950">
        {members.length === 0 ? (
          <div className="container-page text-center text-sm text-ink-500 dark:text-ink-400">{t("noMembers")}</div>
        ) : (
          <StaggerGroup className="container-page grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member) => (
              <StaggerItem key={member.slug} className="text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border border-ink-100 dark:border-ink-800">
                  <Image
                    src={member.photo ?? IMAGES.heroTeam}
                    alt={member.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-ink-950 dark:text-white">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-gold-600 dark:text-gold-400">{member.role}</p>
                {member.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{member.bio}</p>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>
    </>
  );
}
