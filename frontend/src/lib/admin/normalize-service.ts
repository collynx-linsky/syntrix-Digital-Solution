// Plain (non-"use client") module — the Service edit screen is a Server
// Component and needs to call this directly; see normalize-home.ts for why
// this can't live inside service-form.tsx ("use client").
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";
import { toStringListValue, type StringListItem } from "@/components/admin/forms/section-fields/transforms";

export type ServiceTranslationFormValues = {
  language_code: string;
  status: string;
  title: string;
  summary: string;
  description: string;
  features: StringListItem[];
  seo_title: string;
  seo_description: string;
};

export type ServiceFormValues = {
  slug: string;
  icon: string;
  order: number;
  is_active: boolean;
  translations: ServiceTranslationFormValues[];
};

export function normalizeServiceTranslations(
  translations: { language_code: string; status: string; title: string; summary: string; description: string; features: string[]; seo_title: string; seo_description: string }[],
): ServiceTranslationFormValues[] {
  return ADMIN_LANGUAGES.map(({ code }) => {
    const existing = translations.find((t) => t.language_code === code);
    return existing
      ? { ...existing, features: toStringListValue(existing.features) }
      : { language_code: code, status: "draft", title: "", summary: "", description: "", features: [], seo_title: "", seo_description: "" };
  });
}
