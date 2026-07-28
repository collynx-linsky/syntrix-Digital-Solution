"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteCategory } from "@/lib/admin/actions/categories";

export function DeleteCategoryButton({ id, slug }: { id: number; slug: string }) {
  const router = useRouter();

  return (
    <ConfirmDialog
      title="Delete category"
      description={`This will permanently delete "${slug}". Posts in this category will keep their other fields but lose the category link.`}
      trigger={
        <button type="button" className="inline-flex items-center gap-1 font-medium text-red-600 hover:underline dark:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      }
      onConfirm={async () => {
        await deleteCategory(id);
        router.refresh();
      }}
    />
  );
}
