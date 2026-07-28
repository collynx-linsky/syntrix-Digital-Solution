"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, CheckCircle2 } from "lucide-react";
import { API_URL } from "@/lib/api";

const applicationSchema = z.object({
  fullName: z.string().min(2).max(150),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal("")),
  linkedin: z.string().max(300).optional().or(z.literal("")),
  coverMessage: z.string().min(10).max(3000),
  consent: z.literal(true, { errorMap: () => ({ message: "Required" }) }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export function ApplicationForm({ positionSlug }: { positionSlug: string }) {
  const t = useTranslations("careers.application.form");
  const common = useTranslations("common");
  const locale = useLocale();
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormValues>({ resolver: zodResolver(applicationSchema) });

  async function onSubmit(values: ApplicationFormValues) {
    setStatus("submitting");
    try {
      const formData = new FormData();
      formData.append("full_name", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone ?? "");
      formData.append("linkedin", values.linkedin ?? "");
      formData.append("cover_message", values.coverMessage);
      formData.append("consent", String(values.consent));
      formData.append("position_slug", positionSlug);
      formData.append("language", locale);
      if (resume) formData.append("resume", resume);

      const res = await fetch(`${API_URL}/api/careers/apply/`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("failed");

      setStatus("success");
      reset();
      setResume(null);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/5 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold-600 dark:text-gold-400" />
        <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-white">{common("labels.successTitle")}</h3>
        <p className="text-sm text-ink-600 dark:text-ink-300">{common("labels.successMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate encType="multipart/form-data">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={t("fullName")} error={errors.fullName}>
          <input {...register("fullName")} className={inputClass} />
        </Field>
        <Field label={t("email")} error={errors.email}>
          <input type="email" {...register("email")} className={inputClass} />
        </Field>
        <Field label={t("phone")} error={errors.phone}>
          <input {...register("phone")} className={inputClass} />
        </Field>
        <Field label={t("linkedin")} error={errors.linkedin}>
          <input {...register("linkedin")} className={inputClass} />
        </Field>
      </div>

      <Field label={t("coverMessage")} error={errors.coverMessage}>
        <textarea rows={5} {...register("coverMessage")} className={inputClass} />
      </Field>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{t("resume")}</span>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-ink-600 file:me-4 file:rounded-lg file:border-0 file:bg-gold-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white dark:text-ink-300"
        />
      </label>

      <label className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-300">
        <input type="checkbox" {...register("consent")} className="mt-0.5" />
        {t("consent")}
      </label>
      {errors.consent && <p className="text-xs text-red-600 dark:text-red-400">{errors.consent.message}</p>}

      {status === "error" && <p className="text-sm text-red-600 dark:text-red-400">{common("labels.errorMessage")}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-gold-500 disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("submit")}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-ink-200 bg-pale-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 dark:border-ink-700 dark:bg-ink-900 dark:text-white";

function Field({ label, error, children }: { label: string; error?: { message?: string }; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</span>
      {children}
      {error?.message && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error.message}</span>}
    </label>
  );
}
