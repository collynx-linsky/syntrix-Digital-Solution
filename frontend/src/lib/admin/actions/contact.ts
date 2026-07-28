"use server";

import { revalidatePath } from "next/cache";
import { adminFetchJson } from "@/lib/admin/fetch";

export async function toggleMessageRead(id: number, isRead: boolean) {
  await adminFetchJson(`/api/admin/contact/messages/${id}/`, "PATCH", { is_read: isRead }, { allowRefresh: true });
  revalidatePath("/admin/contact");
}

export async function deleteMessage(id: number) {
  await adminFetchJson(`/api/admin/contact/messages/${id}/`, "DELETE", undefined, { allowRefresh: true });
  revalidatePath("/admin/contact");
}
