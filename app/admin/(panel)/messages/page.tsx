import type { Metadata } from "next";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { ConfirmButton, PendingButton } from "@/components/admin/confirm-button";
import { AdminPageHeader, dangerIconButton, iconButton } from "@/components/admin/page-header";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Message } from "@/lib/types";
import { deleteMessage, setMessageRead } from "../../actions";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  const messages = (data as Message[] | null) ?? [];
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <>
      <AdminPageHeader title="Messages" subtitle={`${messages.length} messages · ${unread} unread`} />

      <div className="space-y-3">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`page-enter glow-card rounded-2xl border bg-surface p-5 ${
              message.is_read ? "border-line" : "border-neon/40 shadow-[inset_3px_0_0_var(--color-neon)]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold">
                  {message.name}
                  {!message.is_read && (
                    <span className="ml-2 rounded-full bg-neon/15 px-2 py-0.5 text-[10px] font-bold uppercase text-neon">New</span>
                  )}
                </p>
                <p className="text-sm text-muted">
                  {message.email} · {formatDate(message.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject ?? "Your message"}`)}`}
                  title="Reply by email"
                  aria-label="Reply by email"
                  className={iconButton}
                >
                  <Reply className="size-4" />
                </a>
                <form action={setMessageRead}>
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="value" value={String(!message.is_read)} />
                  <PendingButton title={message.is_read ? "Mark as unread" : "Mark as read"} className={iconButton}>
                    {message.is_read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                  </PendingButton>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={message.id} />
                  <ConfirmButton title="Delete" message="Delete this message?" className={dangerIconButton}>
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </form>
              </div>
            </div>
            {message.subject && <p className="mt-4 font-display text-sm font-semibold">{message.subject}</p>}
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text/85">{message.message}</p>
          </article>
        ))}
        {messages.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line py-16 text-center text-muted">No messages yet.</p>
        )}
      </div>
    </>
  );
}
