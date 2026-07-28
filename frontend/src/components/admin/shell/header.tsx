"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export function Header({ username }: { username: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await fetch("/api/admin-auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-ink-200 bg-white px-6 py-4 dark:border-ink-800 dark:bg-ink-900">
      <span className="text-sm text-ink-500 dark:text-ink-400">
        Signed in as <strong className="text-ink-900 dark:text-white">{username}</strong>
      </span>
      <button
        onClick={signOut}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-pale-100 disabled:opacity-60 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        Sign out
      </button>
    </header>
  );
}
