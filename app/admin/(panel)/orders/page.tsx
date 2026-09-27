import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { AdminPageHeader, STATUS_STYLES, dangerIconButton } from "@/components/admin/page-header";
import { getSettings } from "@/lib/data";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUSES, type Order } from "@/lib/types";
import { deleteOrder } from "../../actions";
import { StatusSelect } from "./status-select";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status && ORDER_STATUSES.includes(status as Order["status"])) query = query.eq("status", status);
  const [settings, { data }] = await Promise.all([getSettings(), query]);
  const orders = (data as Order[] | null) ?? [];

  return (
    <>
      <AdminPageHeader title="Orders" subtitle={`${orders.length} orders`} />

      <div className="mb-6 flex flex-wrap gap-2">
        {[undefined, ...ORDER_STATUSES].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all hover:-translate-y-0.5 hover:border-neon hover:text-neon ${
              status === s ? "border-neon bg-neon/10 text-neon" : "border-line text-muted"
            }`}
          >
            {s ?? "All"}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <details
            key={order.id}
            className="page-enter group overflow-hidden rounded-2xl border border-line bg-surface transition-colors open:border-neon/40 hover:border-neon/40"
          >
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="font-display font-bold text-neon">#{order.order_number}</span>
              <span className="min-w-32 flex-1 font-medium">{order.customer_name}</span>
              <span className="text-sm text-muted">{formatDate(order.created_at)}</span>
              <span className="font-semibold">{formatPrice(order.total, settings.currency)}</span>
              <span className={`rounded-full border px-2.5 py-1 text-xs capitalize ${STATUS_STYLES[order.status]}`}>
                {order.status}
              </span>
              <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" />
            </summary>

            <div className="grid gap-6 border-t border-line px-5 py-5 md:grid-cols-2">
              <div className="space-y-1.5 text-sm">
                <h3 className="mb-2 font-display text-xs uppercase tracking-widest text-muted">Customer</h3>
                <p>{order.customer_name}</p>
                <p>
                  <a href={`mailto:${order.email}`} className="text-neon hover:underline">{order.email}</a>
                </p>
                <p>
                  <a href={`tel:${order.phone}`} className="hover:text-neon">{order.phone}</a>
                </p>
                <p className="text-muted">
                  {order.address}, {order.city}
                </p>
                {order.notes && <p className="mt-3 rounded-lg bg-bg p-3 text-muted">“{order.notes}”</p>}
              </div>

              <div>
                <h3 className="mb-2 font-display text-xs uppercase tracking-widest text-muted">Items</h3>
                <ul className="divide-y divide-line text-sm">
                  {order.items.map((item) => (
                    <li key={item.product_id} className="flex justify-between gap-3 py-2">
                      <span>
                        {item.name} <span className="text-neon">× {item.quantity}</span>
                      </span>
                      <span>{formatPrice(item.price * item.quantity, settings.currency)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <StatusSelect id={order.id} status={order.status} />
                  <form action={deleteOrder}>
                    <input type="hidden" name="id" value={order.id} />
                    <ConfirmButton title="Delete order" message={`Delete order #${order.order_number}?`} className={dangerIconButton}>
                      <Trash2 className="size-4" />
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </div>
          </details>
        ))}
        {orders.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line py-16 text-center text-muted">No orders here yet.</p>
        )}
      </div>
    </>
  );
}
