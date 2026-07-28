"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";
import { Field, inputClass } from "@/components/admin/forms/shared";
import { createPage, updatePage, type PageInput } from "@/lib/admin/actions/pages";
import { slugify } from "@/lib/utils";

// title is NOT required here at the schema level: only one language tab is
// visible at a time (others are CSS-hidden, not unmounted), so requiring
// every one of the 4 languages up front blocks submission with an
// invisible error the moment a staff member fills in just English — the
// normal workflow. Untouched languages are instead filtered out of the
// payload entirely in onSubmit (see below), and the one/some the user did
// fill in are checked there with a visible top-level error message.
const translationSchema = z.object({
  language_code: z.enum(["en", "sw", "fr", "ar"]),
  status: z.enum(["draft", "under_review", "published"]),
  title: z.string(),
  subtitle: z.string(),
  content: z.string(),
  seo_title: z.string().max(70),
  seo_description: z.string().max(160),
});

const pageSchema = z.object({
  slug: z.string().min(1, "Required"),
  is_published: z.boolean(),
  translations: z.array(translationSchema).length(4),
});

type PageFormValues = z.infer<typeof pageSchema>;

const EMPTY_TRANSLATIONS: PageFormValues["translations"] = ADMIN_LANGUAGES.map(({ code }) => ({
  language_code: code,
  status: "draft",
  title: "",
  subtitle: "",
  content: "",
  seo_title: "",
  seo_description: "",
}));

export function PageForm({ pageId, defaultValues }: { pageId?: number; defaultValues?: PageFormValues }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: defaultValues ?? { slug: "", is_published: false, translations: EMPTY_TRANSLATIONS },
  });

  async function onSubmit(values: PageFormValues) {
    setError(null);

    // Only submit languages the user actually started filling in — an
    // untouched (blank-title) tab isn't a translation yet, just an empty
    // placeholder from EMPTY_TRANSLATIONS.
    const started = values.translations.filter((t) => t.title.trim() !== "");
    if (started.length === 0) {
      setError("Please fill in the title for at least one language.");
      return;
    }

    setSubmitting(true);
    const input: PageInput = { ...values, slug: slugify(values.slug), translations: started };
    try {
      if (pageId) {
        await updatePage(pageId, input);
      } else {
        await createPage(input);
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
        <label className="flex items-center gap-2 pt-7 text-sm font-medium text-ink-700 dark:text-ink-200">
          <input type="checkbox" {...register("is_published")} className="h-4 w-4 rounded border-ink-300" />
          Published
        </label>
      </div>

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
            <Field label="Subtitle">
              <input {...register(`translations.${index}.subtitle`)} className={inputClass} />
            </Field>
            <Field label="Content">
              <textarea rows={8} {...register(`translations.${index}.content`)} className={inputClass} />
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
