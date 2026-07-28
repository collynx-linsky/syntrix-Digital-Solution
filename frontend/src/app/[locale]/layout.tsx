import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { locales, isRtl, localeToBcp47 } from "@/i18n/locales";
import { ThemeProvider } from "@/components/theme-provider";
import { TopBar } from "@/components/layout/top-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { organizationJsonLd } from "@/lib/seo";
import { getServices, getSolutions, getPages, pickTranslation } from "@/lib/public-api";
import { RESERVED_PAGE_SLUGS } from "@/lib/reserved-page-slugs";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
  weight: ["500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://syntrixdigitalsolutions.com";

  return {
    metadataBase: new URL(base),
    title: {
      default: t("defaultTitle"),
      template: t("titleTemplate"),
    },
    description: t("home.description"),
    alternates: {
      canonical: `${base}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [localeToBcp47[l], `${base}/${l}`])
      ),
    },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: localeToBcp47[locale as (typeof locales)[number]],
      url: `${base}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // Enables static rendering for this locale's request-config context.
  setRequestLocale(locale);

  const messages = await getMessages();
  const rtl = isRtl(locale);

  // Navbar/Footer need the live service & solution catalog (admin-managed)
  // for their dropdown/link lists — fetched once here and passed down
  // rather than duplicating the request in both components.
  let services: { slug: string; title: string }[] = [];
  let solutions: { slug: string; title: string }[] = [];
  let pages: { slug: string; title: string }[] = [];
  try {
    const [rawServices, rawSolutions, rawPages] = await Promise.all([getServices(), getSolutions(), getPages()]);
    services = rawServices
      .map((s) => {
        const tr = pickTranslation(s.translations, locale);
        return tr ? { slug: s.slug, title: tr.title } : null;
      })
      .filter((s): s is { slug: string; title: string } => s !== null);
    solutions = rawSolutions
      .map((s) => {
        const tr = pickTranslation(s.translations, locale);
        return tr ? { slug: s.slug, title: tr.title } : null;
      })
      .filter((s): s is { slug: string; title: string } => s !== null);
    pages = rawPages
      .filter((p) => !RESERVED_PAGE_SLUGS.has(p.slug))
      .map((p) => {
        const tr = pickTranslation(p.translations, locale);
        return tr ? { slug: p.slug, title: tr.title } : null;
      })
      .filter((p): p is { slug: string; title: string } => p !== null);
  } catch {
    // Backend unreachable — nav/footer degrade to their static fallback
    // links rather than failing the whole page.
  }

  return (
    <html
      lang={localeToBcp47[locale as (typeof locales)[number]]}
      dir={rtl ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body className={`${jakarta.variable} ${grotesk.variable} font-sans`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col">
              <TopBar />
              <Navbar services={services} pages={pages} />
              <main className="flex-1">{children}</main>
              <Footer services={services} solutions={solutions} />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
