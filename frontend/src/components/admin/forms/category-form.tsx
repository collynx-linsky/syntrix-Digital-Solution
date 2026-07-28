"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";
import { Field, inputClass } from "@/components/admin/forms/shared";
import { slugify } from "@/lib/utils";
import { createCategory, updateCategory, type CategoryInput } from "@/lib/admin/actions/categories";

// name is NOT required at the schema level — only the active language tab
// is visible (others are CSS-hidden, not unmounted), so requiring all 4
// up front blocks submission with an invisible error. Untouched languages
// are filtered out in onSubmit instead (see below).
const translationSchema = z.object({
  language_code: z.enum(["en", "sw", "fr", "ar"]),
  status: z.enum(["draft", "under_review", "published"]),
  name: z.string(),
  seo_title: z.string().max(70),
  seo_description: z.string().max(160),
});

const categorySchema = z.object({
  slug: z.string().min(1, "Required"),
  translations: z.array(translationSchema).length(4),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const EMPTY_TRANSLATIONS: CategoryFormValues["translations"] = ADMIN_LANGUAGES.map(({ code }) => ({
  language_code: code,
  status: "draft",
  name: "",
  seo_title: "",
  seo_description: "",
}));

export function CategoryForm({ categoryId, defaultValues }: { categoryId?: number; defaultValues?: CategoryFormValues }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? { slug: "", translations: EMPTY_TRANSLATIONS },
  });

  async function onSubmit(values: CategoryFormValues) {
    setError(null);

    const started = values.translations.filter((t) => t.name.trim() !== "");
    if (started.length === 0) {
      setError("Please fill in the name for at least one language.");
      return;
    }

    setSubmitting(true);
    const input: CategoryInput = { ...values, slug: slugify(values.slug), translations: started };
    try {
      if (categoryId) {
        await updateCategory(categoryId, input);
      } else {
        await createCategory(input);
      }
    } catch {
      setError("Could not save. Please check the fields and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Field label="Slug" error={errors.slug}>
        <input {...register("slug")} className={inputClass} />
      </Field>

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
            <Field label="Name" error={errors.translations?.[index]?.name}>
              <input {...register(`translations.${index}.name`)} className={inputClass} />
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
