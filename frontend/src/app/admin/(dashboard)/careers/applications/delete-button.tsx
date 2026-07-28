"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteApplication } from "@/lib/admin/actions/careers";

export function DeleteApplicationButton({ id, fullName }: { id: number; fullName: string }) {
  const router = useRouter();

  return (
    <ConfirmDialog
      title="Delete application"
      description={`This will permanently delete the application from "${fullName}".`}
      trigger={
        <button type="button" className="inline-flex items-center gap-1 font-medium text-red-600 hover:underline dark:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      }
      onConfirm={async () => {
        await deleteApplication(id);
        router.refresh();
      }}
    />
  );
}
