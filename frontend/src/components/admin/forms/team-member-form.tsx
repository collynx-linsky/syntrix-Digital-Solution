"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { ADMIN_LANGUAGES } from "@/lib/admin/languages";
import { Field, inputClass } from "@/components/admin/forms/shared";
import { ImageUpload } from "@/components/admin/image-upload";
import { createTeamMember, updateTeamMember, uploadTeamMemberPhoto, type TeamMemberInput } from "@/lib/admin/actions/team";
import { slugify } from "@/lib/utils";
import type { TeamMemberTranslationFormValues } from "@/lib/admin/normalize-team-member";

type TeamMemberFormValues = {
  slug: string;
  order: number;
  is_active: boolean;
  translations: TeamMemberTranslationFormValues[];
};

const EMPTY_TRANSLATIONS: TeamMemberFormValues["translations"] = ADMIN_LANGUAGES.map(({ code }) => ({
  language_code: code,
  status: "draft",
  name: "",
  role: "",
  bio: "",
  seo_title: "",
  seo_description: "",
}));

export function TeamMemberForm({
  memberId,
  photoUrl,
  defaultValues,
}: {
  memberId?: number;
  photoUrl?: string | null;
  defaultValues?: TeamMemberFormValues;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamMemberFormValues>({
    defaultValues: defaultValues ?? { slug: "", order: 0, is_active: true, translations: EMPTY_TRANSLATIONS },
  });

  async function onSubmit(values: TeamMemberFormValues) {
    setError(null);

    // Only the active language tab is visible at a time — treat an
    // untouched (blank-name) tab as "not translated yet" rather than
    // sending it to the backend, which rejects a blank name.
    const started = values.translations.filter((t) => t.name.trim() !== "");
    if (started.length === 0) {
      setError("Please fill in the name for at least one language.");
      return;
    }
    const missingRole = started.find((t) => t.role.trim() === "");
    if (missingRole) {
      const label = ADMIN_LANGUAGES.find((l) => l.code === missingRole.language_code)?.label;
      setError(`Please fill in the role for ${label} (it has a name but no role).`);
      return;
    }

    setSubmitting(true);
    const input: TeamMemberInput = { ...values, slug: slugify(values.slug), translations: started };
    try {
      if (memberId) {
        await updateTeamMember(memberId, input);
      } else {
        await createTeamMember(input);
      }
    } catch {
      setError("Could not save. Please check the fields and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {memberId && (
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Photo</span>
          <ImageUpload
            currentUrl={photoUrl ?? null}
            onUpload={async (file) => {
              const formData = new FormData();
              formData.append("image", file);
              await uploadTeamMemberPhoto(memberId, formData);
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
              <Field label="Name" error={errors.translations?.[index]?.name}>
                <input {...register(`translations.${index}.name`)} className={inputClass} />
              </Field>
              <Field label="Role" error={errors.translations?.[index]?.role}>
                <input {...register(`translations.${index}.role`)} className={inputClass} />
              </Field>
              <Field label="Bio">
                <textarea rows={4} {...register(`translations.${index}.bio`)} className={inputClass} />
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
