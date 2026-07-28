import { redirect } from "next/navigation";
import { adminFetch, AdminSessionExpiredError } from "./fetch";

export type AdminSession = {
  username: string;
  email: string;
  is_staff: boolean;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    return await adminFetch<AdminSession>("/api/auth/me/");
  } catch (err) {
    if (err instanceof AdminSessionExpiredError) return null;
    throw err;
  }
}

// Used by the (dashboard) layout — redirects unauthenticated or non-staff
// users to /admin/login rather than letting them see a broken page.
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!session.is_staff) redirect("/admin/login?error=forbidden");
  return session;
}
