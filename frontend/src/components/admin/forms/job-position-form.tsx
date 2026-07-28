"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";
import { Field, inputClass } from "@/components/admin/forms/shared";
import { createJobPosition, updateJobPosition, type JobPositionInput } from "@/lib/admin/actions/careers";
import type { JobPositionTranslationFormValues } from "@/lib/admin/normalize-job-position";
import { slugify } from "@/lib/utils";

type JobPositionFormValues = {
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  is_active: boolean;
  translations: JobPositionTranslationFormValues[];
};

const EMPTY_TRANSLATIONS: JobPositionFormValues["translations"] = ADMIN_LANGUAGES.map(({ code }) => ({
  language_code: code,
  status: "draft",
  title: "",
  summary: "",
  description: "",
  seo_title: "",
  seo_description: "",
}));

export function JobPositionForm({ positionId, defaultValues }: { positionId?: number; defaultValues?: JobPositionFormValues }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobPositionFormValues>({
    defaultValues: defaultValues ?? {
      slug: "",
      department: "",
      location: "",
      employment_type: "full_time",
      is_active: true,
      translations: EMPTY_TRANSLATIONS,
    },
  });

  async function onSubmit(values: JobPositionFormValues) {
    setError(null);

    // Only the active language tab is visible at a time — treat an
    // untouched (blank-title) tab as "not translated yet" rather than
    // sending it to the backend, which rejects a blank title.
    const started = values.translations.filter((t) => t.title.trim() !== "");
    if (started.length === 0) {
      setError("Please fill in the title for at least one language.");
      return;
    }
    const missingSummary = started.find((t) => t.summary.trim() === "");
    if (missingSummary) {
      const label = ADMIN_LANGUAGES.find((l) => l.code === missingSummary.language_code)?.label;
      setError(`Please fill in the summary for ${label} (it has a title but no summary).`);
      return;
    }

    setSubmitting(true);
    const input: JobPositionInput = { ...values, slug: slugify(values.slug), translations: started };
    try {
      if (positionId) {
        await updateJobPosition(positionId, input);
      } else {
        await createJobPosition(input);
      }
    } catch {
      setError("Could not save. Please check the fields and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Slug" error={errors.slug}>
          <input {...register("slug")} className={inputClass} />
        </Field>
        <Field label="Department" error={errors.department}>
          <input {...register("department")} className={inputClass} />
        </Field>
        <Field label="Location" error={errors.location}>
          <input {...register("location")} className={inputClass} />
        </Field>
        <Field label="Employment type">
          <select {...register("employment_type")} className={inputClass}>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-ink-200">
        <input type="checkbox" {...register("is_active")} className="h-4 w-4 rounded border-ink-300" />
        Active
      </label>

      <LanguageTabs
        renderTab={(_code, index) => (
          <div className="space-y-4">
            <input type="hidden" {...register(`translations.${index}.language_code`)} />
            <Field label="Status">
              <select {...register(`translations.${index}.status`)} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="under_review">Under Review</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field label="Title" error={errors.translations?.[index]?.title}>
              <input {...register(`translations.${index}.title`)} className={inputClass} />
            </Field>
            <Field label="Summary" error={errors.translations?.[index]?.summary}>
              <textarea rows={2} {...register(`translations.${index}.summary`)} className={inputClass} />
            </Field>
            <Field label="Description">
              <textarea rows={6} {...register(`translations.${index}.description`)} className={inputClass} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="SEO Title">
                <input {...register(`translations.${index}.seo_title`)} className={inputClass} />
              </Field>
              <Field label="SEO Description">
                <input {...register(`translations.${index}.seo_description`)} className={inputClass} />
              </Field>
            </div>
          </div>
        )}
      />

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-500 disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save
      </button>
    </form>
  );
}
