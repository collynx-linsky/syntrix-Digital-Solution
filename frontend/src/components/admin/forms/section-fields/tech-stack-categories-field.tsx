"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { inputClass } from "@/components/admin/forms/shared";
import { StringListField } from "./string-list-field";

/** The one genuinely nested shape: categories: {label, items: string[]}[]. */
export function TechStackCategoriesField({ name, label }: { name: string; label: string }) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</span>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-ink-200 p-4 dark:border-ink-700">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">Category label</span>
              <input {...register(`${name}.${index}.label`)} className={inputClass} />
            </label>
            <div className="mt-3">
              <StringListField name={`${name}.${index}.items`} label="Technologies" />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove category
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ label: "", items: [] })}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-ink-300 px-3 py-1.5 text-xs font-medium text-ink-600 hover:border-gold-400 hover:text-gold-700 dark:border-ink-700 dark:text-ink-300"
      >
        <Plus className="h-3.5 w-3.5" />
        Add category
      </button>
    </div>
  );
}
