import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { fetchOneEntry, Content } from "@builder.io/sdk-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { locales } from "@/i18n/locales";
import { SITE_URL } from "@/lib/seo";
import { getPages, getPageBySlug, pickTranslation } from "@/lib/public-api";
import { RESERVED_PAGE_SLUGS } from "@/lib/reserved-page-slugs";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const pages = await getPages();
    return locales.flatMap((locale) =>
      pages.filter((p) => !RESERVED_PAGE_SLUGS.has(p.slug)).map((p) => ({ locale, slug: p.slug }))
    );
  } catch {
    return [];
  }
}

async function getPage(locale: string, slug: string) {
  const page = await getPageBySlug(slug);
  if (!page) return null;
  const tr = pickTranslation(page.translations, locale);
  if (!tr) return null;
  return { title: tr.title, subtitle: tr.subtitle, content: tr.content, seoTitle: tr.seo_title, seoDescription: tr.seo_description };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (RESERVED_PAGE_SLUGS.has(slug)) return {};
  const page = await getPage(locale, slug);
  if (!page) return {};
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.subtitle,
    alternates: { canonical: `${SITE_URL}/${locale}/${slug}` },
  };
}

export default async function GenericPage({ params }: Props) {
  const { locale, slug } = await params;
  if (RESERVED_PAGE_SLUGS.has(slug)) notFound();
  setRequestLocale(locale);

  const page = await getPage(locale, slug);
  if (!page) notFound();

  // Any admin-created page can optionally get a fully custom visual layout
  // authored directly in Builder.io (native blocks — no data bindings,
  // unlike the Homepage pilot, since arbitrary pages have no DB content to
  // bind to). One entry per (page, locale); falls back to the page's own
  // flat title/subtitle/content below when nothing's published yet for
  // this specific locale.
  const builderApiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
  const builderContent = builderApiKey
    ? await fetchOneEntry({
        model: "page",
        apiKey: builderApiKey,
        userAttributes: { urlPath: `/page/${locale}/${slug}` },
        fetchOptions: { next: { revalidate: 60 } },
      })
    : null;

  if (builderContent) {
    return <Content content={builderContent} model="page" apiKey={builderApiKey!} locale={locale} />;
  }

  return (
    <>
      <Breadcrumbs items={[{ label: page.title }]} />
      <div className="container-page max-w-3xl py-20">
        <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-white">{page.title}</h1>
        {page.subtitle && <p className="mt-3 text-lg text-ink-600 dark:text-ink-300">{page.subtitle}</p>}
        <div className="prose prose-ink mt-8 max-w-none whitespace-pre-line dark:prose-invert">{page.content}</div>
      </div>
    </>
  );
}
