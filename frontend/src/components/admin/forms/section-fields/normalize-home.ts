// Plain (non-"use client") module — the admin Page edit screen is a Server
// Component and needs to call this directly. Exports from a "use client"
// module become opaque client references when imported into a Server
// Component (see homepage-sections-form.tsx, which is "use client").
import { toStringListValue, type StringListItem } from "./transforms";

export type HomeSectionsFormShape = {
  hero: { eyebrow: string; titleLine1: string; titleLine2: string; subtitle: string; primaryCta: string; secondaryCta: string; trustBadge: string };
  intro: { eyebrow: string; title: string; description: string; points: StringListItem[]; badgeValue: string; badgeLabel: string };
  overview: { eyebrow: string; title: string; description: string; pillars: { title: string; description: string }[] };
  featuredProjects: { eyebrow: string; title: string; description: string };
  services: { eyebrow: string; title: string; description: string; viewAll: string };
  techStack: { eyebrow: string; title: string; description: string; categories: { label: string; items: StringListItem[] }[] };
  whyChooseUs: { eyebrow: string; title: string; reasons: { title: string; description: string }[] };
  industries: { eyebrow: string; title: string; items: { title: string; description: string }[] };
  stats: { eyebrow: string; items: { value: string; label: string }[] };
  testimonials: { eyebrow: string; title: string; items: { quote: string; name: string; role: string }[] };
  cta: { title: string; description: string; primary: string; secondary: string };
};

export const EMPTY_HOME_SECTIONS: HomeSectionsFormShape = {
  hero: { eyebrow: "", titleLine1: "", titleLine2: "", subtitle: "", primaryCta: "", secondaryCta: "", trustBadge: "" },
  intro: { eyebrow: "", title: "", description: "", points: [], badgeValue: "", badgeLabel: "" },
  overview: { eyebrow: "", title: "", description: "", pillars: [] },
  featuredProjects: { eyebrow: "", title: "", description: "" },
  services: { eyebrow: "", title: "", description: "", viewAll: "" },
  techStack: { eyebrow: "", title: "", description: "", categories: [] },
  whyChooseUs: { eyebrow: "", title: "", reasons: [] },
  industries: { eyebrow: "", title: "", items: [] },
  stats: { eyebrow: "", items: [] },
  testimonials: { eyebrow: "", title: "", items: [] },
  cta: { title: "", description: "", primary: "", secondary: "" },
};

// Raw fetched `sections` may be {} (no content yet) or missing some keys —
// normalize to the full shape and convert plain string[] to the
// {value:string}[] shape StringListField/useFieldArray require.
export function normalizeHomeSections(raw: Record<string, unknown> | undefined): HomeSectionsFormShape {
  const r = (raw ?? {}) as Partial<Record<keyof HomeSectionsFormShape, Record<string, unknown>>>;
  return {
    hero: { ...EMPTY_HOME_SECTIONS.hero, ...(r.hero as object) },
    intro: {
      ...EMPTY_HOME_SECTIONS.intro,
      ...(r.intro as object),
      points: toStringListValue(r.intro?.points as string[] | undefined),
    },
    overview: { ...EMPTY_HOME_SECTIONS.overview, ...(r.overview as object), pillars: (r.overview?.pillars as never) ?? [] },
    featuredProjects: { ...EMPTY_HOME_SECTIONS.featuredProjects, ...(r.featuredProjects as object) },
    services: { ...EMPTY_HOME_SECTIONS.services, ...(r.services as object) },
    techStack: {
      ...EMPTY_HOME_SECTIONS.techStack,
      ...(r.techStack as object),
      categories: ((r.techStack?.categories as { label: string; items: string[] }[] | undefined) ?? []).map((cat) => ({
        label: cat.label,
        items: toStringListValue(cat.items),
      })),
    },
    whyChooseUs: { ...EMPTY_HOME_SECTIONS.whyChooseUs, ...(r.whyChooseUs as object), reasons: (r.whyChooseUs?.reasons as never) ?? [] },
    industries: { ...EMPTY_HOME_SECTIONS.industries, ...(r.industries as object), items: (r.industries?.items as never) ?? [] },
    stats: { ...EMPTY_HOME_SECTIONS.stats, ...(r.stats as object), items: (r.stats?.items as never) ?? [] },
    testimonials: { ...EMPTY_HOME_SECTIONS.testimonials, ...(r.testimonials as object), items: (r.testimonials?.items as never) ?? [] },
    cta: { ...EMPTY_HOME_SECTIONS.cta, ...(r.cta as object) },
  };
}

export function denormalizeHomeSections(sections: HomeSectionsFormShape): Record<string, unknown> {
  return {
    ...sections,
    intro: { ...sections.intro, points: sections.intro.points.map((p) => p.value) },
    techStack: {
      ...sections.techStack,
      categories: sections.techStack.categories.map((cat) => ({ label: cat.label, items: cat.items.map((i) => i.value) })),
    },
  };
}
