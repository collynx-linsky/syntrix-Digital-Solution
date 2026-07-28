"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";
import { Field, inputClass } from "@/components/admin/forms/shared";
import { ImageUpload } from "@/components/admin/image-upload";
import { createGalleryImage, updateGalleryImage, uploadGalleryImageFile, type GalleryImageInput } from "@/lib/admin/actions/gallery";
import type { GalleryImageTranslationFormValues } from "@/lib/admin/normalize-gallery";
import { slugify } from "@/lib/utils";

type GalleryImageFormValues = {
  slug: string;
  order: number;
  is_active: boolean;
  translations: GalleryImageTranslationFormValues[];
};

const EMPTY_TRANSLATIONS: GalleryImageFormValues["translations"] = ADMIN_LANGUAGES.map(({ code }) => ({
  language_code: code,
  status: "draft",
  caption: "",
  seo_title: "",
  seo_description: "",
}));

export function GalleryImageForm({
  imageId,
  imageUrl,
  defaultValues,
}: {
  imageId?: number;
  imageUrl?: string | null;
  defaultValues?: GalleryImageFormValues;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GalleryImageFormValues>({
    defaultValues: defaultValues ?? { slug: "", order: 0, is_active: true, translations: EMPTY_TRANSLATIONS },
  });

  async function onSubmit(values: GalleryImageFormValues) {
    setError(null);

    // Captions are optional (a gallery image doesn't need text), so unlike
    // other forms we don't require at least one language here — an image
    // with zero captions is a perfectly valid gallery entry.
    setSubmitting(true);
    const input: GalleryImageInput = {
      ...values,
      slug: slugify(values.slug),
      translations: values.translations.filter((t) => t.caption.trim() !== ""),
    };
    try {
      if (imageId) {
        await updateGalleryImage(imageId, input);
      } else {
        await createGalleryImage(input);
      }
    } catch {
      setError("Could not save. Please check the fields and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {imageId && (
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Image</span>
          <ImageUpload
            currentUrl={imageUrl ?? null}
            onUpload={async (file) => {
              const formData = new FormData();
              formData.append("image", file);
              await uploadGalleryImageFile(imageId, formData);
            }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Slug" error={errors.slug}>
            <input {...register("slug")} className={inputClass} />
          </Field>
          <Field label="Order">
            <input type="number" {...register("order")} className={inputClass} />
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
              <Field label="Caption (optional)">
                <input {...register(`translations.${index}.caption`)} className={inputClass} />
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
    </div>
  );
}
