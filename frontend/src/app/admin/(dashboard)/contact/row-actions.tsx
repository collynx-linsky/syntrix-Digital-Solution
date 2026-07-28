"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toggleMessageRead, deleteMessage } from "@/lib/admin/actions/contact";

export function ContactRowActions({ id, name, isRead }: { id: number; name: string; isRead: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleMessageRead(id, !isRead);
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
        {isRead ? "Mark unread" : "Mark read"}
      </button>
      <ConfirmDialog
        title="Delete message"
        description={`This will permanently delete the message from "${name}".`}
        trigger={
          <button type="button" className="inline-flex items-center gap-1 font-medium text-red-600 hover:underline dark:text-red-400">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        }
        onConfirm={async () => {
          await deleteMessage(id);
          router.refresh();
        }}
      />
    </div>
  );
}
