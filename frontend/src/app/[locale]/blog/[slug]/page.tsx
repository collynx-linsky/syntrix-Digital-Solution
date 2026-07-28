import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/locales";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { SITE_URL, articleJsonLd } from "@/lib/seo";
import { IMAGES } from "@/lib/images";
import { getPosts, getPostBySlug, pickTranslation, pickCategoryLabel } from "@/lib/public-api";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
  } catch {
    // Backend unreachable at build time — fall back entirely to on-demand
    // SSR + ISR (dynamicParams defaults to true) rather than failing the build.
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  const tr = post ? pickTranslation(post.translations, locale) : null;
  if (!post || !tr) return {};
  return {
    title: tr.title,
    description: tr.excerpt,
    alternates: { canonical: `${SITE_URL}/${locale}/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPostBySlug(slug);
  const tr = post ? pickTranslation(post.translations, locale) : null;
  if (!post || !tr) notFound();
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const categoryLabel = pickCategoryLabel(post.category, locale);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: tr.title,
              description: tr.excerpt,
              slug: post.slug,
              locale,
              image: post.cover_image,
              publishedAt: post.published_at,
            })
          ),
        }}
      />

      <div className="relative aspect-[21/9] overflow-hidden">
        <Image
          src={post.cover_image ?? IMAGES.ctaOffice}
          alt={tr.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <Breadcrumbs
        items={[
          { label: nav("blog"), href: "/blog" },
          { label: tr.title },
        ]}
      />

      <Reveal className="container-page max-w-3xl py-16">
        {categoryLabel && (
          <span className="text-xs font-semibold uppercase tracking-wide text-gold-600 dark:text-gold-400">
            {categoryLabel}
          </span>
        )}
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
          {tr.title}
        </h1>
        <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
          {post.read_time_minutes} {common("labels.readTime")}
        </p>
        <div className="prose prose-ink mt-8 max-w-none whitespace-pre-line dark:prose-invert">{tr.content}</div>
      </Reveal>
    </article>
  );
}
