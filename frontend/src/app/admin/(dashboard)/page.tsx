import { adminFetch } from "@/lib/admin/fetch";

type TranslationCell = { code: string; label: string; state: "complete" | "draft" | "missing"; text: string };
type TranslationRow = { label: string; admin_url: string | null; cells: TranslationCell[] };
type TranslationSection = { label: string; rows: TranslationRow[] };

const CELL_STYLES: Record<TranslationCell["state"], string> = {
  complete: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  missing: "bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400",
};

export default async function AdminDashboardHome() {
  const { sections } = await adminFetch<{ sections: TranslationSection[] }>(
    "/api/admin/dashboard/translation-status/",
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Translation completeness across all content.</p>
      </div>

      {sections.map((section) => (
        <div key={section.label} className="overflow-hidden rounded-xl border border-ink-200 dark:border-ink-800">
          <div className="border-b border-ink-200 bg-pale-50 px-4 py-3 dark:border-ink-800 dark:bg-ink-900">
            <h2 className="font-medium text-ink-900 dark:text-white">{section.label}</h2>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {section.rows.map((row) => (
                <tr key={row.label} className="border-b border-ink-100 last:border-0 dark:border-ink-800">
                  <td className="px-4 py-2.5 text-ink-700 dark:text-ink-200">{row.label}</td>
                  {row.cells.map((cell) => (
                    <td key={cell.code} className="px-4 py-2.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CELL_STYLES[cell.state]}`}>
                        {cell.label}: {cell.text}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
              {section.rows.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-sm text-ink-400">No entries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
