import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-ink-200 bg-pale-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 dark:border-ink-700 dark:bg-ink-900 dark:text-white";

export function Field({ label, error, children }: { label: string; error?: { message?: string }; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</span>
      {children}
      {error?.message && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error.message}</span>}
    </label>
  );
}
