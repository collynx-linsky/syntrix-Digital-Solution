const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://syntrixdigitalsolutions.com";

/** Organization structured data (schema.org), injected on every page. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Syntrix Digital Solutions",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.svg`,
    description:
      "Syntrix Digital Solutions is a Tanzania-based technology and digital transformation company offering software development, ERP systems, SEO, and cloud solutions.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dar es Salaam",
      addressCountry: "TZ",
    },
    sameAs: [
      "https://www.linkedin.com/company/syntrixdigitalsolutions",
      "https://twitter.com/syntrixdigital",
      "https://www.facebook.com/syntrixdigitalsolutions",
      "https://www.instagram.com/syntrixdigitalsolutions",
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceJsonLd(service: { title: string; description: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${SITE_URL}/en/services/${service.slug}`,
    provider: {
      "@type": "Organization",
      name: "Syntrix Digital Solutions",
    },
    areaServed: {
      "@type": "Country",
      name: "Tanzania",
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  locale: string;
  image?: string | null;
  publishedAt?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${SITE_URL}/${article.locale}/blog/${article.slug}`,
    image: article.image ?? undefined,
    datePublished: article.publishedAt ?? undefined,
    publisher: {
      "@type": "Organization",
      name: "Syntrix Digital Solutions",
      logo: `${SITE_URL}/brand/logo.svg`,
    },
  };
}

export function projectJsonLd(project: {
  title: string;
  description: string;
  slug: string;
  locale: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${SITE_URL}/${project.locale}/portfolio/${project.slug}`,
    image: project.image ?? undefined,
    creator: {
      "@type": "Organization",
      name: "Syntrix Digital Solutions",
    },
  };
}

export { SITE_URL };
