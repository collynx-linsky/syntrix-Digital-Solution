import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import { IMAGES } from "@/lib/images";
import { getGalleryImages, pickTranslation } from "@/lib/public-api";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.gallery" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: { canonical: `${SITE_URL}/${locale}/gallery` },
  };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");

  const rawImages = await getGalleryImages();
  const images = rawImages
    .map((img) => {
      const tr = pickTranslation(img.translations, locale);
      return { slug: img.slug, caption: tr?.caption ?? "", image: img.image };
    })
    .filter((img) => img.image !== null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `${SITE_URL}/${locale}` },
              { name: nav("gallery"), url: `${SITE_URL}/${locale}/gallery` },
            ])
          ),
        }}
      />

      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="absolute inset-0 bg-grid-glow" />
        <div className="container-page relative py-24 text-center lg:py-32">
          <h1 className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {nav("gallery")}
          </h1>
        </div>
      </section>

      <Breadcrumbs items={[{ label: nav("gallery") }]} />

      <section className="section-padding bg-pale-50 dark:bg-ink-950">
        {images.length === 0 ? (
          <div className="container-page text-center text-sm text-ink-500 dark:text-ink-400">
            No photos yet — check back soon.
          </div>
        ) : (
          <StaggerGroup className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <StaggerItem
                key={img.slug}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-100 dark:border-ink-800"
              >
                <Image
                  src={img.image ?? IMAGES.ctaOffice}
                  alt={img.caption || img.slug}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/80 to-transparent p-4">
                    <p className="text-sm font-medium text-white">{img.caption}</p>
                  </div>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>
    </>
  );
}
