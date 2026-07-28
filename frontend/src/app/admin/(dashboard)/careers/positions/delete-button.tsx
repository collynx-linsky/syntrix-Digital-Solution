"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteJobPosition } from "@/lib/admin/actions/careers";

export function DeleteJobPositionButton({ id, slug }: { id: number; slug: string }) {
  const router = useRouter();

  return (
    <ConfirmDialog
      title="Delete job position"
      description={`This will permanently delete "${slug}", all its translations, and any applications submitted for it.`}
      trigger={
        <button type="button" className="inline-flex items-center gap-1 font-medium text-red-600 hover:underline dark:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      }
      onConfirm={async () => {
        await deleteJobPosition(id);
        router.refresh();
      }}
    />
  );
}
