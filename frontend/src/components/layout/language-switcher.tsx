"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { locales, localeNames } from "@/i18n/locales";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
      >
        <Globe className="h-4 w-4" />
        <span className="ltr-only">{locale.toUpperCase()}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-ink-200 bg-pale-50 py-1 shadow-glow dark:border-ink-800 dark:bg-ink-900"
        >
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={locale === code}
              onClick={() => {
                setOpen(false);
                router.replace(
                  // @ts-expect-error -- pathname is a dynamic union; params supplies any required segments
                  { pathname, params },
                  { locale: code }
                );
              }}
              className={cn(
                "flex w-full items-center justify-between px-3.5 py-2 text-sm text-ink-700 transition-colors hover:bg-gold-50 dark:text-ink-200 dark:hover:bg-ink-800",
                locale === code && "font-semibold text-gold-600 dark:text-gold-400"
              )}
            >
              {localeNames[code]}
              {locale === code && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
