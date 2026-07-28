import { Home, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { ComponentProps } from "react";

type Crumb = {
  label: string;
  href?: ComponentProps<typeof Link>["href"];
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useTranslations("nav");

  return (
    <nav aria-label="Breadcrumb" className="border-b border-ink-100 bg-pale-50 dark:border-ink-800 dark:bg-ink-950">
      <div className="container-page flex flex-wrap items-center gap-2 py-3.5 text-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-sm ring-1 ring-ink-200 transition-all hover:-translate-y-0.5 hover:text-gold-600 hover:ring-gold-300 hover:shadow-glow dark:bg-ink-900 dark:text-ink-200 dark:ring-ink-700"
        >
          <Home className="h-3.5 w-3.5" />
          {t("home")}
        </Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink-300 rtl:rotate-180 dark:text-ink-600" />
            {item.href ? (
              <Link href={item.href} className="text-ink-500 transition-colors hover:text-gold-600 dark:text-ink-400">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-ink-800 dark:text-ink-100">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
