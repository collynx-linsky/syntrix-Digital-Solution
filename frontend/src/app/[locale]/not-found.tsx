import { useTranslations } from "next-intl";
import { Home } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-7xl font-bold text-gold-600 dark:text-gold-400">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink-950 dark:text-white">Page Not Found</h1>
      <p className="mt-2 max-w-md text-sm text-ink-600 dark:text-ink-300">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-500"
      >
        <Home className="h-4 w-4" />
        {t("buttons.backToHome")}
      </Link>
    </div>
  );
}
