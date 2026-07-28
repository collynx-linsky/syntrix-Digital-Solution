"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { inputClass } from "@/components/admin/forms/shared";

export type ObjectListFieldDef = { key: string; label: string; multiline?: boolean };

/**
 * Config-driven repeating list of flat objects — covers every {title,
 * description}-shaped list on the homepage/about pages (pillars, reasons,
 * industries.items, values.items) plus the two 3-field shapes (stats.items,
 * testimonials.items, leadership.members) via a different `fields` config.
 */
export function ObjectListField({
  name,
  label,
  fields: fieldDefs,
}: {
  name: string;
  label: string;
  fields: ObjectListFieldDef[];
}) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  function emptyItem() {
    return Object.fromEntries(fieldDefs.map((f) => [f.key, ""]));
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</span>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-ink-200 p-4 dark:border-ink-700">
            <div className="space-y-3">
              {fieldDefs.map((def) => (
                <label key={def.key} className="block">
                  <span className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">{def.label}</span>
                  {def.multiline ? (
                    <textarea rows={3} {...register(`${name}.${index}.${def.key}`)} className={inputClass} />
                  ) : (
                    <input {...register(`${name}.${index}.${def.key}`)} className={inputClass} />
                  )}
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append(emptyItem())}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-ink-300 px-3 py-1.5 text-xs font-medium text-ink-600 hover:border-gold-400 hover:text-gold-700 dark:border-ink-700 dark:text-ink-300"
      >
        <Plus className="h-3.5 w-3.5" />
        Add item
      </button>
    </div>
  );
}
