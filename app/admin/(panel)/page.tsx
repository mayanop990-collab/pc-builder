import Link from "next/link";
import { AlertTriangle, ArrowRight, DollarSign, Inbox, Package, ShoppingBag } from "lucide-react";
import { AdminPageHeader, STATUS_STYLES } from "@/components/admin/page-header";
import { getSettings } from "@/lib/data";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Order, Product } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [settings, products, orders, messages, lowStock] = await Promise.all([
    getSettings(),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("products").select("id, name, stock").lte("stock", 5).order("stock").limit(6),
  ]);

  const allOrders = (orders.data as Order[] | null) ?? [];
  const lowStockProducts = (lowStock.data as Pick<Product, "id" | "name" | "stock">[] | null) ?? [];
  const revenue = allOrders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + Number(o.total), 0);
  const pending = allOrders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Revenue", value: formatPrice(revenue, settings.currency), icon: DollarSign, href: "/admin/orders" },
    { label: "Orders", value: allOrders.length, sub: `${pending} pending`, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Products", value: products.count ?? 0, icon: Package, href: "/admin/products" },
    { label: "Unread messages", value: messages.count ?? 0, icon: Inbox, href: "/admin/messages" },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" subtitle={`Welcome back! Here's what's happening at ${settings.store_name}.`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{ animationDelay: `${i * 70}ms` }}
            className="page-enter group glow-card rgb-border rounded-2xl border border-line bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{stat.label}</p>
              <span className="flex size-10 items-center justify-center rounded-xl bg-neon/10 text-neon transition-all duration-500 group-hover:rotate-12 group-hover:bg-neon group-hover:text-bg">
                <stat.icon className="size-5" />
              </span>
            </div>
            <p className="mt-4 font-display text-2xl font-bold">{stat.value}</p>
            {stat.sub && <p className="mt-1 text-xs text-warn">{stat.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="page-enter rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-display font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="group inline-flex items-center gap-1 text-sm text-neon">
              View all <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {allOrders.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-line">
                  {allOrders.slice(0, 6).map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-surface-2">
                      <td className="px-6 py-3 font-semibold text-neon">#{order.order_number}</td>
                      <td className="px-6 py-3">{order.customer_name}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-muted">{formatDate(order.created_at)}</td>
                      <td className="whitespace-nowrap px-6 py-3 font-semibold">{formatPrice(order.total, settings.currency)}</td>
                      <td className="px-6 py-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs capitalize ${STATUS_STYLES[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="page-enter rounded-2xl border border-line bg-surface">
          <div className="flex items-center gap-2 border-b border-line px-6 py-4">
            <AlertTriangle className="size-4 text-warn" />
            <h2 className="font-display font-semibold">Low stock</h2>
          </div>
          {lowStockProducts.length > 0 ? (
            <ul className="divide-y divide-line">
              {lowStockProducts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center justify-between gap-3 px-6 py-3 text-sm transition-colors hover:bg-surface-2 hover:text-neon"
                  >
                    <span className="truncate">{p.name}</span>
                    <span className={`shrink-0 font-semibold ${p.stock === 0 ? "text-neon-3" : "text-warn"}`}>
                      {p.stock} left
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-12 text-center text-sm text-muted">All products are well stocked.</p>
          )}
        </section>
      </div>
    </>
  );
}
