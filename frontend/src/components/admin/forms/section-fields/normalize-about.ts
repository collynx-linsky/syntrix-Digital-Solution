// Plain (non-"use client") module — see normalize-home.ts for why this
// can't live inside about-sections-form.tsx ("use client").
import { toStringListValue, type StringListItem } from "./transforms";

export type AboutSectionsFormShape = {
  hero: { eyebrow: string; title: string; subtitle: string };
  story: { eyebrow: string; title: string; paragraphs: StringListItem[] };
  vision: { title: string; description: string };
  mission: { title: string; description: string };
  values: { eyebrow: string; title: string; items: { title: string; description: string }[] };
  leadership: { eyebrow: string; title: string; description: string; members: { name: string; role: string; bio: string }[] };
  culture: { eyebrow: string; title: string; description: string; points: StringListItem[] };
};

export const EMPTY_ABOUT_SECTIONS: AboutSectionsFormShape = {
  hero: { eyebrow: "", title: "", subtitle: "" },
  story: { eyebrow: "", title: "", paragraphs: [] },
  vision: { title: "", description: "" },
  mission: { title: "", description: "" },
  values: { eyebrow: "", title: "", items: [] },
  leadership: { eyebrow: "", title: "", description: "", members: [] },
  culture: { eyebrow: "", title: "", description: "", points: [] },
};

export function normalizeAboutSections(raw: Record<string, unknown> | undefined): AboutSectionsFormShape {
  const r = (raw ?? {}) as Partial<Record<keyof AboutSectionsFormShape, Record<string, unknown>>>;
  return {
    hero: { ...EMPTY_ABOUT_SECTIONS.hero, ...(r.hero as object) },
    story: {
      ...EMPTY_ABOUT_SECTIONS.story,
      ...(r.story as object),
      paragraphs: toStringListValue(r.story?.paragraphs as string[] | undefined),
    },
    vision: { ...EMPTY_ABOUT_SECTIONS.vision, ...(r.vision as object) },
    mission: { ...EMPTY_ABOUT_SECTIONS.mission, ...(r.mission as object) },
    values: { ...EMPTY_ABOUT_SECTIONS.values, ...(r.values as object), items: (r.values?.items as never) ?? [] },
    leadership: { ...EMPTY_ABOUT_SECTIONS.leadership, ...(r.leadership as object), members: (r.leadership?.members as never) ?? [] },
    culture: {
      ...EMPTY_ABOUT_SECTIONS.culture,
      ...(r.culture as object),
      points: toStringListValue(r.culture?.points as string[] | undefined),
    },
  };
}

export function denormalizeAboutSections(sections: AboutSectionsFormShape): Record<string, unknown> {
  return {
    ...sections,
    story: { ...sections.story, paragraphs: sections.story.paragraphs.map((p) => p.value) },
    culture: { ...sections.culture, points: sections.culture.points.map((p) => p.value) },
  };
}
