import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import { IMAGES } from "@/lib/images";
import { getPosts, pickTranslation, pickCategoryLabel } from "@/lib/public-api";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.blog" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: { canonical: `${SITE_URL}/${locale}/blog` },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");

  const rawPosts = await getPosts();
  const posts = rawPosts
    .map((post) => {
      const tr = pickTranslation(post.translations, locale);
      if (!tr) return null; // no published translation in this locale or "en"
      return {
        slug: post.slug,
        title: tr.title,
        excerpt: tr.excerpt,
        readTime: post.read_time_minutes,
        categoryLabel: pickCategoryLabel(post.category, locale),
        coverImage: post.cover_image,
      };
    })
    .filter((post): post is NonNullable<typeof post> => post !== null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `${SITE_URL}/${locale}` },
              { name: nav("blog"), url: `${SITE_URL}/${locale}/blog` },
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
        <StaggerGroup className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 transition-all hover:-translate-y-1 hover:border-gold-300 hover:shadow-glow dark:border-ink-800"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.coverImage ?? IMAGES.ctaOffice}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {post.categoryLabel && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-gold-600 dark:text-gold-400">
                      {post.categoryLabel}
                    </span>
                  )}
                  <h3 className="mt-2 font-display text-base font-semibold text-ink-950 dark:text-white">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-ink-500 dark:text-ink-400">
                    {post.readTime} {common("labels.readTime")}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </>
  );
}
