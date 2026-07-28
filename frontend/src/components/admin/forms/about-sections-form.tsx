"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { Field, inputClass } from "@/components/admin/forms/shared";
import { StringListField } from "@/components/admin/forms/section-fields/string-list-field";
import { ObjectListField } from "@/components/admin/forms/section-fields/object-list-field";
import { denormalizeAboutSections, type AboutSectionsFormShape } from "@/components/admin/forms/section-fields/normalize-about";
import { updatePage, type PageInput } from "@/lib/admin/actions/pages";

type TranslationFormValues = {
  language_code: string;
  status: string;
  seo_title: string;
  seo_description: string;
  sections: AboutSectionsFormShape;
};

type AboutFormValues = { translations: TranslationFormValues[] };

export function AboutSectionsForm({
  pageId,
  defaultTranslations,
}: {
  pageId: number;
  defaultTranslations: { language_code: string; status: string; seo_title: string; seo_description: string; sections: AboutSectionsFormShape }[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<AboutFormValues>({
    defaultValues: { translations: defaultTranslations },
  });
  const { register, handleSubmit } = methods;

  async function onSubmit(values: AboutFormValues) {
    setSubmitting(true);
    setError(null);
    const input: PageInput = {
      slug: "about",
      is_published: true,
      translations: values.translations.map((t) => ({
        language_code: t.language_code,
        status: t.status,
        title: t.sections.hero.title || "About",
        subtitle: "",
        content: "",
        seo_title: t.seo_title,
        seo_description: t.seo_description,
        sections: denormalizeAboutSections(t.sections),
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
                  <Field label="Title"><input {...register(`${base}.hero.title`)} className={inputClass} /></Field>
                  <Field label="Subtitle"><textarea rows={3} {...register(`${base}.hero.subtitle`)} className={inputClass} /></Field>
                </SectionBlock>

                <SectionBlock title="Story">
                  <Field label="Eyebrow"><input {...register(`${base}.story.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.story.title`)} className={inputClass} /></Field>
                  <StringListField name={`${base}.story.paragraphs`} label="Paragraphs" />
                </SectionBlock>

                <SectionBlock title="Vision">
                  <Field label="Title"><input {...register(`${base}.vision.title`)} className={inputClass} /></Field>
                  <Field label="Description"><textarea rows={3} {...register(`${base}.vision.description`)} className={inputClass} /></Field>
                </SectionBlock>

                <SectionBlock title="Mission">
                  <Field label="Title"><input {...register(`${base}.mission.title`)} className={inputClass} /></Field>
                  <Field label="Description"><textarea rows={3} {...register(`${base}.mission.description`)} className={inputClass} /></Field>
                </SectionBlock>

                <SectionBlock title="Values">
                  <Field label="Eyebrow"><input {...register(`${base}.values.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.values.title`)} className={inputClass} /></Field>
                  <ObjectListField
                    name={`${base}.values.items`}
                    label="Values"
                    fields={[
                      { key: "title", label: "Title" },
                      { key: "description", label: "Description", multiline: true },
                    ]}
                  />
                </SectionBlock>

                <SectionBlock title="Leadership">
                  <Field label="Eyebrow"><input {...register(`${base}.leadership.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.leadership.title`)} className={inputClass} /></Field>
                  <Field label="Description"><textarea rows={2} {...register(`${base}.leadership.description`)} className={inputClass} /></Field>
                  <ObjectListField
                    name={`${base}.leadership.members`}
                    label="Team members"
                    fields={[
                      { key: "name", label: "Name" },
                      { key: "role", label: "Role" },
                      { key: "bio", label: "Bio", multiline: true },
                    ]}
                  />
                </SectionBlock>

                <SectionBlock title="Culture">
                  <Field label="Eyebrow"><input {...register(`${base}.culture.eyebrow`)} className={inputClass} /></Field>
                  <Field label="Title"><input {...register(`${base}.culture.title`)} className={inputClass} /></Field>
                  <Field label="Description"><textarea rows={2} {...register(`${base}.culture.description`)} className={inputClass} /></Field>
                  <StringListField name={`${base}.culture.points`} label="Points" />
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
