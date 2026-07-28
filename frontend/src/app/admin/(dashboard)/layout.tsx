import type { ReactNode } from "react";
import { requireAdminSession } from "@/lib/admin/session";
import { Sidebar } from "@/components/admin/shell/sidebar";
import { Header } from "@/components/admin/shell/header";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header username={session.username} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
