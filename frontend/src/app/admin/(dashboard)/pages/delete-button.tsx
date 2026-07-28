"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deletePage } from "@/lib/admin/actions/pages";

export function DeletePageButton({ id, slug }: { id: number; slug: string }) {
  const router = useRouter();

  return (
    <ConfirmDialog
      title="Delete page"
      description={`This will permanently delete "${slug}" and all its translations.`}
      trigger={
        <button type="button" className="inline-flex items-center gap-1 font-medium text-red-600 hover:underline dark:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      }
      onConfirm={async () => {
        await deletePage(id);
        router.refresh();
      }}
    />
  );
}
