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
import { createProject, updateProject, uploadProjectImage, type ProjectInput } from "@/lib/admin/actions/portfolio";
import { slugify } from "@/lib/utils";

// title/description are NOT required at the schema level — only the
// active language tab is visible (others are CSS-hidden, not unmounted),
// so requiring all 4 up front blocks submission with an invisible error.
// Untouched languages are filtered out in onSubmit instead (see below).
const translationSchema = z.object({
  language_code: z.enum(["en", "sw", "fr", "ar"]),
  status: z.enum(["draft", "under_review", "published"]),
  title: z.string(),
  description: z.string(),
  seo_title: z.string().max(70),
  seo_description: z.string().max(160),
});

const projectSchema = z.object({
  slug: z.string().min(1, "Required"),
  client_name: z.string().min(1, "Required"),
  industry: z.string().min(1, "Required"),
  technologiesText: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0),
  is_featured: z.boolean(),
  translations: z.array(translationSchema).length(4),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const EMPTY_TRANSLATIONS: ProjectFormValues["translations"] = ADMIN_LANGUAGES.map(({ code }) => ({
  language_code: code,
  status: "draft",
  title: "",
  description: "",
  seo_title: "",
  seo_description: "",
}));

export function ProjectForm({
  projectId,
  imageUrl,
  defaultValues,
}: {
  projectId?: number;
  imageUrl?: string | null;
  defaultValues?: ProjectFormValues;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues ?? {
      slug: "",
      client_name: "",
      industry: "",
      technologiesText: "",
      order: 0,
      is_featured: false,
      translations: EMPTY_TRANSLATIONS,
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    setError(null);

    const started = values.translations.filter((t) => t.title.trim() !== "");
    if (started.length === 0) {
      setError("Please fill in the title for at least one language.");
      return;
    }
    const missingDescription = started.find((t) => t.description.trim() === "");
    if (missingDescription) {
      const label = ADMIN_LANGUAGES.find((l) => l.code === missingDescription.language_code)?.label;
      setError(`Please fill in the description for ${label} (it has a title but no description).`);
      return;
    }

    setSubmitting(true);
    const { technologiesText, ...rest } = values;
    const input: ProjectInput = {
      ...rest,
      slug: slugify(rest.slug),
      translations: started,
      technologies: technologiesText
        ? technologiesText.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };
    try {
      if (projectId) {
        await updateProject(projectId, input);
      } else {
        await createProject(input);
      }
    } catch {
      setError("Could not save. Please check the fields and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {projectId && (
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Image</span>
          <ImageUpload
            currentUrl={imageUrl ?? null}
            onUpload={async (file) => {
              const formData = new FormData();
              formData.append("image", file);
              await uploadProjectImage(projectId, formData);
            }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Slug" error={errors.slug}>
            <input {...register("slug")} className={inputClass} />
          </Field>
          <Field label="Client name" error={errors.client_name}>
            <input {...register("client_name")} className={inputClass} />
          </Field>
          <Field label="Industry" error={errors.industry}>
            <input {...register("industry")} className={inputClass} />
          </Field>
          <Field label="Order" error={errors.order}>
            <input type="number" min={0} {...register("order")} className={inputClass} />
          </Field>
        </div>

        <Field label="Technologies (comma-separated)">
          <input {...register("technologiesText")} className={inputClass} placeholder="React, Django, PostgreSQL" />
        </Field>

        <label className="flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-ink-200">
          <input type="checkbox" {...register("is_featured")} className="h-4 w-4 rounded border-ink-300" />
          Featured
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
              <Field label="Description" error={errors.translations?.[index]?.description}>
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
    </div>
  );
}
