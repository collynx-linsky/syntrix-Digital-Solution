import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.contact" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: { canonical: `${SITE_URL}/${locale}/contact` },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const nav = await getTranslations("nav");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `${SITE_URL}/${locale}` },
              { name: nav("contact"), url: `${SITE_URL}/${locale}/contact` },
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
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ContactForm />
          </Reveal>
          <StaggerGroup className="space-y-5 lg:col-span-5">
            <StaggerItem><InfoCard icon={MapPin} title={t("info.officeTitle")} value={t("info.office")} /></StaggerItem>
            <StaggerItem><InfoCard icon={Mail} title={t("info.emailTitle")} value={t("info.email")} href={`mailto:${t("info.email")}`} /></StaggerItem>
            <StaggerItem><InfoCard icon={Phone} title={t("info.phoneTitle")} value={t("info.phone")} href={`tel:${t("info.phone")}`} /></StaggerItem>
            <StaggerItem><InfoCard icon={Clock} title={t("info.hoursTitle")} value={t("info.hours")} /></StaggerItem>

            <StaggerItem className="overflow-hidden rounded-2xl border border-ink-100 dark:border-ink-800">
              <iframe
                title={t("mapTitle")}
                className="h-64 w-full"
                loading="lazy"
                src="https://www.google.com/maps?q=Dar%20es%20Salaam%2C%20Tanzania&output=embed"
              />
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: typeof MapPin;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="group flex items-start gap-4 rounded-2xl border border-ink-100 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow dark:border-ink-800">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-transform duration-300 group-hover:scale-110 dark:text-gold-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">{title}</p>
        <p className="mt-1 text-sm font-medium text-ink-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
