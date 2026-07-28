import type { ReactNode } from "react";
import Link from "next/link";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T extends { id: number | string }>({
  columns,
  rows,
  emptyMessage = "No results yet.",
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-200 p-10 text-center text-sm text-ink-400 dark:border-ink-700">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-200 bg-pale-50 dark:border-ink-800 dark:bg-ink-900">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-medium text-ink-500 dark:text-ink-400 ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-ink-100 last:border-0 hover:bg-pale-50/60 dark:border-ink-800 dark:hover:bg-ink-900/60"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-ink-700 dark:text-ink-200 ${col.className ?? ""}`}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, hasNext, hasPrevious }: { page: number; hasNext: boolean; hasPrevious: boolean }) {
  if (!hasNext && !hasPrevious) return null;

  return (
    <div className="mt-4 flex items-center justify-end gap-3 text-sm">
      <PageLink page={page - 1} disabled={!hasPrevious} label="Previous" />
      <span className="text-ink-400">Page {page}</span>
      <PageLink page={page + 1} disabled={!hasNext} label="Next" />
    </div>
  );
}

function PageLink({ page, disabled, label }: { page: number; disabled: boolean; label: string }) {
  if (disabled) {
    return <span className="rounded-lg px-3 py-1.5 text-ink-300 dark:text-ink-700">{label}</span>;
  }
  return (
    <Link
      href={`?page=${page}`}
      className="rounded-lg px-3 py-1.5 font-medium text-ink-600 hover:bg-pale-100 dark:text-ink-300 dark:hover:bg-ink-800"
    >
      {label}
    </Link>
  );
}
