import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getAdminStatus } from "@/lib/admin";
import { logout } from "../actions";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Admin" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { supabase, email, isAdmin } = await getAdminStatus();
  if (!email) redirect("/admin/login");

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <ShieldAlert className="mb-5 size-14 text-neon-3" />
        <h1 className="font-display text-2xl font-bold">Access denied</h1>
        <p className="mt-2 max-w-md text-muted">
          <span className="text-text">{email}</span> is signed in but is not an admin. Add this user to the
          <code className="mx-1 rounded bg-surface px-1.5 py-0.5 text-neon">admins</code>table in Supabase.
        </p>
        <form action={logout} className="mt-6">
          <button type="submit" className="rounded-xl border border-line px-5 py-2.5 text-sm hover:border-neon hover:text-neon">
            Log out
          </button>
        </form>
      </div>
    );
  }

  const [{ count: pendingOrders }, { count: unreadMessages }] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);

  return (
    <div className="min-h-screen lg:flex">
      <AdminSidebar email={email} badges={{ orders: pendingOrders ?? 0, messages: unreadMessages ?? 0 }} />
      <div className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
