"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, CheckCircle2 } from "lucide-react";
import { apiPost } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal("")),
  company: z.string().max(150).optional().or(z.literal("")),
  service: z.string().max(100).optional().or(z.literal("")),
  budget: z.string().max(100).optional().or(z.literal("")),
  message: z.string().min(10).max(3000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const common = useTranslations("common");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    try {
      await apiPost("/api/contact/", { ...values, language: locale });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/5 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold-600 dark:text-gold-400" />
        <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-white">
          {common("labels.successTitle")}
        </h3>
        <p className="text-sm text-ink-600 dark:text-ink-300">{common("labels.successMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={t("name")} error={errors.name}>
          <input {...register("name")} className={inputClass} />
        </Field>
        <Field label={t("email")} error={errors.email}>
          <input type="email" {...register("email")} className={inputClass} />
        </Field>
        <Field label={t("phone")} error={errors.phone}>
          <input {...register("phone")} className={inputClass} />
        </Field>
        <Field label={t("company")} error={errors.company}>
          <input {...register("company")} className={inputClass} />
        </Field>
      </div>
      <Field label={t("message")} error={errors.message}>
        <textarea rows={5} {...register("message")} className={inputClass} />
      </Field>

      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{common("labels.errorMessage")}</p>
      )}

      <p className="text-xs text-ink-500 dark:text-ink-400">{t("privacyNote")}</p>

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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: { message?: string };
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</span>
      {children}
      {error?.message && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error.message}</span>}
    </label>
  );
}
