"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toggleSubscriberActive, deleteSubscriber } from "@/lib/admin/actions/newsletter";

export function SubscriberRowActions({ id, email, isActive }: { id: number; email: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleSubscriberActive(id, !isActive);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className="inline-flex items-center gap-1 font-medium text-gold-700 hover:underline disabled:opacity-60 dark:text-gold-400"
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {isActive ? "Deactivate" : "Activate"}
      </button>
      <ConfirmDialog
        title="Delete subscriber"
        description={`This will permanently delete "${email}" from the newsletter list.`}
        trigger={
          <button type="button" className="inline-flex items-center gap-1 font-medium text-red-600 hover:underline dark:text-red-400">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        }
        onConfirm={async () => {
          await deleteSubscriber(id);
          router.refresh();
        }}
      />
    </div>
  );
}
