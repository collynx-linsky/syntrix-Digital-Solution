"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";
import { Field, inputClass } from "@/components/admin/forms/shared";
import { ImageUpload } from "@/components/admin/image-upload";
import { createPost, updatePost, uploadPostImage, type PostInput } from "@/lib/admin/actions/posts";
import { slugify } from "@/lib/utils";

// title/excerpt are NOT required at the schema level — only the active
// language tab is visible (others are CSS-hidden, not unmounted), so
// requiring all 4 up front blocks submission with an invisible error.
// Untouched languages are filtered out in onSubmit instead (see below).
const translationSchema = z.object({
  language_code: z.enum(["en", "sw", "fr", "ar"]),
  status: z.enum(["draft", "under_review", "published"]),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  seo_title: z.string().max(70),
  seo_description: z.string().max(160),
});

const postSchema = z.object({
  slug: z.string().min(1, "Required"),
  category: z.string(), // "" or a numeric id as string, coerced on submit
  read_time_minutes: z.coerce.number().int().positive(),
  is_published: z.boolean(),
  published_at: z.string().optional().or(z.literal("")),
  translations: z.array(translationSchema).length(4),
});

type PostFormValues = z.infer<typeof postSchema>;

const EMPTY_TRANSLATIONS: PostFormValues["translations"] = ADMIN_LANGUAGES.map(({ code }) => ({
  language_code: code,
  status: "draft",
  title: "",
  excerpt: "",
  content: "",
  seo_title: "",
  seo_description: "",
}));

export function PostForm({
  postId,
  coverImageUrl,
  categories,
  defaultValues,
}: {
  postId?: number;
  coverImageUrl?: string | null;
  categories: { id: number; slug: string }[];
  defaultValues?: PostFormValues;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: defaultValues ?? {
      slug: "",
      category: "",
      read_time_minutes: 5,
      is_published: false,
      published_at: "",
      translations: EMPTY_TRANSLATIONS,
    },
  });

  async function onSubmit(values: PostFormValues) {
    setError(null);

    const started = values.translations.filter((t) => t.title.trim() !== "");
    if (started.length === 0) {
      setError("Please fill in the title for at least one language.");
      return;
    }
    const missingExcerpt = started.find((t) => t.excerpt.trim() === "");
    if (missingExcerpt) {
      const label = ADMIN_LANGUAGES.find((l) => l.code === missingExcerpt.language_code)?.label;
      setError(`Please fill in the excerpt for ${label} (it has a title but no excerpt).`);
      return;
    }

    setSubmitting(true);
    const input: PostInput = {
      ...values,
      slug: slugify(values.slug),
      category: values.category ? Number(values.category) : null,
      published_at: values.published_at || null,
      translations: started,
    };
    try {
      if (postId) {
        await updatePost(postId, input);
      } else {
        await createPost(input);
      }
    } catch {
      setError("Could not save. Please check the fields and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {postId && (
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Cover Image</span>
          <ImageUpload
            currentUrl={coverImageUrl ?? null}
            onUpload={async (file) => {
              const formData = new FormData();
              formData.append("image", file);
              await uploadPostImage(postId, formData);
            }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Slug" error={errors.slug}>
            <input {...register("slug")} className={inputClass} />
          </Field>
          <Field label="Category">
            <select {...register("category")} className={inputClass}>
              <option value="">— None —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.slug}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Read time (minutes)" error={errors.read_time_minutes}>
            <input type="number" min={1} {...register("read_time_minutes")} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-ink-200">
            <input type="checkbox" {...register("is_published")} className="h-4 w-4 rounded border-ink-300" />
            Published
          </label>
          <Field label="Published at">
            <input type="datetime-local" {...register("published_at")} className={inputClass} />
          </Field>
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
              <Field label="Excerpt" error={errors.translations?.[index]?.excerpt}>
                <textarea rows={2} {...register(`translations.${index}.excerpt`)} className={inputClass} />
              </Field>
              <Field label="Content">
                <textarea rows={10} {...register(`translations.${index}.content`)} className={inputClass} />
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
