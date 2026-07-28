import { adminFetch } from "@/lib/admin/fetch";
import { Pagination } from "@/components/admin/data-table";
import { ContactRowActions } from "./row-actions";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  language: string;
  is_read: boolean;
  created_at: string;
};

type MessageList = { count: number; next: string | null; previous: string | null; results: ContactMessage[] };

export default async function ContactInboxPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const data = await adminFetch<MessageList>(`/api/admin/contact/messages/?page=${page}`);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Contact Messages</h1>

      {data.results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 p-10 text-center text-sm text-ink-400 dark:border-ink-700">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {data.results.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-4 ${
                msg.is_read
                  ? "border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900"
                  : "border-gold-500/40 bg-gold-500/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink-900 dark:text-white">
                    {msg.name} <span className="font-normal text-ink-500 dark:text-ink-400">&lt;{msg.email}&gt;</span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-400">
                    {[msg.company, msg.service, msg.budget].filter(Boolean).join(" · ") || "—"}
                    {" · "}
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
                <ContactRowActions id={msg.id} name={msg.name} isRead={msg.is_read} />
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink-700 dark:text-ink-200">{msg.message}</p>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} hasNext={Boolean(data.next)} hasPrevious={Boolean(data.previous)} />
    </div>
  );
}
