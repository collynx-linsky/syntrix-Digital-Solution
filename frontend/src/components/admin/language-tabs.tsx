"use client";

import { useState, type ReactNode } from "react";
import { ADMIN_LANGUAGES, type AdminLanguageCode } from "@/lib/admin/languages";

export function LanguageTabs({
  renderTab,
}: {
  renderTab: (code: AdminLanguageCode, index: number) => ReactNode;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-1 border-b border-ink-200 dark:border-ink-800">
        {ADMIN_LANGUAGES.map((lang, index) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setActive(index)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              active === index
                ? "border-b-2 border-gold-600 text-gold-700 dark:text-gold-400"
                : "text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {ADMIN_LANGUAGES.map((lang, index) => (
          // Every tab stays mounted (hidden via CSS, not unmounted) so
          // react-hook-form keeps all 4 translation rows registered
          // regardless of which tab is active.
          <div key={lang.code} className={index === active ? "block" : "hidden"}>
            {renderTab(lang.code, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
