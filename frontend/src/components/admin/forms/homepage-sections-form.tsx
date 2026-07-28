"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { Field, inputClass } from "@/components/admin/forms/shared";
import { StringListField } from "@/components/admin/forms/section-fields/string-list-field";
import { ObjectListField } from "@/components/admin/forms/section-fields/object-list-field";
import { TechStackCategoriesField } from "@/components/admin/forms/section-fields/tech-stack-categories-field";
import { denormalizeHomeSections, type HomeSectionsFormShape } from "@/components/admin/forms/section-fields/normalize-home";
import { updatePage, type PageInput } from "@/lib/admin/actions/pages";

type TranslationFormValues = {
  language_code: string;
  status: string;
  seo_title: string;
  seo_description: string;
  sections: HomeSectionsFormShape;
};

type HomepageFormValues = { translations: TranslationFormValues[] };

export function HomepageSectionsForm({
  pageId,
  defaultTranslations,
}: {
  pageId: number;
  defaultTranslations: { language_code: string; status: string; seo_title: string; seo_description: string; sections: HomeSectionsFormShape }[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<HomepageFormValues>({
    defaultValues: { translations: defaultTranslations },
  });
  const { register, handleSubmit } = methods;

  async function onSubmit(values: HomepageFormValues) {
    setSubmitting(true);
    setError(null);
    const input: PageInput = {
      slug: "homepage",
      is_published: true,
      translations: values.translations.map((t) => ({
        language_code: t.language_code,
        status: t.status,
        title: t.sections.hero.titleLine1 || "Homepage",
        subtitle: "",
        content: "",
        seo_title: t.seo_title,
        seo_description: t.seo_description,
        sections: denormalizeHomeSections(t.sections),
      })),
    };
    try {
      await updatePage(pageId, input);
    } catch {
      setError("Could not save. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <LanguageTabs
          renderTab={(_code, index) => {
            const base = `translations.${index}.sections` as const;
            return (
              <div className="space-y-10">
                <input type="hidden" {...register(`translations.${index}.language_code`)} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Status">
                    <select {...register(`translations.${index}.status`)} className={inputClass}>
                      <option value="draft">Draft</option>
                      <option value="under_review">Under Review</option>
                      <option value="published">Published</option>
                    </select>
                  </Field>
                  <Field label="SEO Title">
                    <input {...register(`translations.${index}.seo_title`)} className={inputClass} />
                  </Field>
                  <Field label="SEO Description">
                    <input {...register(`translations.${index}.seo_description`)} className={inputClass} />
                  </Field>
                </div>

                <SectionBlock title="Hero">
                  <Field label="Eyebrow"><input {...register(`${base}.hero.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title line 1"><input {...register(`${base}.hero.titleLine1`)} className={inputClass} /></Field>
                  <Field label="Title line 2"><input {...register(`${base}.hero.titleLine2`)} className={inputClass} /></Field>
                  <Field label="Subtitle"><textarea rows={3} {...register(`${base}.hero.subtitle`)} className={inputClass} /></Field>
                  <Field label="Primary button"><input {...register(`${base}.hero.primaryCta`)} className={inputClass} /></Field>
                  <Field label="Secondary button"><input {...register(`${base}.hero.secondaryCta`)} className={inputClass} /></Field>
                  <Field label="Trust badge"><input {...register(`${base}.hero.trustBadge`)} className={inputClass} /></Field>
                </SectionBlock>

                <SectionBlock title="Intro">
                  <Field label="Eyebrow"><input {...register(`${base}.intro.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.intro.title`)} className={inputClass} /></Field>
                  <Field label="Description"><textarea rows={3} {...register(`${base}.intro.description`)} className={inputClass} /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Badge value"><input {...register(`${base}.intro.badgeValue`)} className={inputClass} /></Field>
                    <Field label="Badge label"><input {...register(`${base}.intro.badgeLabel`)} className={inputClass} /></Field>
                  </div>
                  <StringListField name={`${base}.intro.points`} label="Points" />
                </SectionBlock>

                <SectionBlock title="Overview">
                  <Field label="Eyebrow"><input {...register(`${base}.overview.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.overview.title`)} className={inputClass} /></Field>
                  <Field label="Description"><textarea rows={3} {...register(`${base}.overview.description`)} className={inputClass} /></Field>
                  <ObjectListField
                    name={`${base}.overview.pillars`}
                    label="Pillars"
                    fields={[
                      { key: "title", label: "Title" },
                      { key: "description", label: "Description", multiline: true },
                    ]}
                  />
                </SectionBlock>

                <SectionBlock title="Featured Projects (heading only — items come from Portfolio)">
                  <Field label="Eyebrow"><input {...register(`${base}.featuredProjects.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.featuredProjects.title`)} className={inputClass} /></Field>
                  <Field label="Description"><textarea rows={2} {...register(`${base}.featuredProjects.description`)} className={inputClass} /></Field>
                </SectionBlock>

                <SectionBlock title="Services (heading only — items come from services.json)">
                  <Field label="Eyebrow"><input {...register(`${base}.services.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.services.title`)} className={inputClass} /></Field>
                  <Field label="Description"><textarea rows={2} {...register(`${base}.services.description`)} className={inputClass} /></Field>
                  <Field label='"View all" button'><input {...register(`${base}.services.viewAll`)} className={inputClass} /></Field>
                </SectionBlock>

                <SectionBlock title="Tech Stack">
                  <Field label="Eyebrow"><input {...register(`${base}.techStack.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.techStack.title`)} className={inputClass} /></Field>
                  <Field label="Description"><textarea rows={3} {...register(`${base}.techStack.description`)} className={inputClass} /></Field>
                  <TechStackCategoriesField name={`${base}.techStack.categories`} label="Categories" />
                </SectionBlock>

                <SectionBlock title="Why Choose Us">
                  <Field label="Eyebrow"><input {...register(`${base}.whyChooseUs.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.whyChooseUs.title`)} className={inputClass} /></Field>
                  <ObjectListField
                    name={`${base}.whyChooseUs.reasons`}
                    label="Reasons"
                    fields={[
                      { key: "title", label: "Title" },
                      { key: "description", label: "Description", multiline: true },
                    ]}
                  />
                </SectionBlock>

                <SectionBlock title="Industries">
                  <Field label="Eyebrow"><input {...register(`${base}.industries.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.industries.title`)} className={inputClass} /></Field>
                  <ObjectListField
                    name={`${base}.industries.items`}
                    label="Industries"
                    fields={[
                      { key: "title", label: "Title" },
                      { key: "description", label: "Description", multiline: true },
                    ]}
                  />
                </SectionBlock>

                <SectionBlock title="Stats">
                  <Field label="Eyebrow"><input {...register(`${base}.stats.eyebrow`)} className={inputClass} /></Field>
                  <ObjectListField
                    name={`${base}.stats.items`}
                    label="Stats"
                    fields={[
                      { key: "value", label: "Value (e.g. 50+)" },
                      { key: "label", label: "Label" },
                    ]}
                  />
                </SectionBlock>

                <SectionBlock title="Testimonials">
                  <Field label="Eyebrow"><input {...register(`${base}.testimonials.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.testimonials.title`)} className={inputClass} /></Field>
                  <ObjectListField
                    name={`${base}.testimonials.items`}
                    label="Testimonials"
                    fields={[
                      { key: "quote", label: "Quote", multiline: true },
                      { key: "name", label: "Name" },
                      { key: "role", label: "Role" },
                    ]}
                  />
                </SectionBlock>

                <SectionBlock title="CTA">
                  <Field label="Title"><input {...register(`${base}.cta.title`)} className={inputClass} /></Field>
                  <Field label="Description"><textarea rows={2} {...register(`${base}.cta.description`)} className={inputClass} /></Field>
                  <Field label="Primary button"><input {...register(`${base}.cta.primary`)} className={inputClass} /></Field>
                  <Field label="Secondary button"><input {...register(`${base}.cta.secondary`)} className={inputClass} /></Field>
                </SectionBlock>
              </div>
            );
          }}
        />

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="sticky bottom-4 inline-flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-gold-500 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </button>
      </form>
    </FormProvider>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 border-t border-ink-200 pt-6 first:border-t-0 first:pt-0 dark:border-ink-800">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-gold-700 dark:text-gold-400">{title}</h3>
      {children}
    </div>
  );
}
