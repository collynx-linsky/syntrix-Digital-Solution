const LABELS: Record<string, string> = {
  draft: "Draft",
  under_review: "Under Review",
  published: "Published",
};

const STYLES: Record<string, string> = {
  draft: "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300",
  under_review: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status] ?? STYLES.draft}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
