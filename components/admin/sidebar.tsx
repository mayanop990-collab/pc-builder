"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  FolderTree,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  X,
  Cpu,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, badge: "orders" as const },
  { href: "/admin/messages", label: "Messages", icon: Inbox, badge: "messages" as const },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({
  email,
  badges,
}: {
  email: string;
  badges: { orders: number; messages: number };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur lg:hidden">
        <span className="font-display font-bold">
          Admin <span className="text-neon">Panel</span>
        </span>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-xl border border-line hover:border-neon hover:text-neon"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/admin" className="group flex h-18 items-center gap-2.5 border-b border-line px-6">
          <span className="flex size-9 items-center justify-center rounded-lg border border-neon/40 bg-bg transition-transform group-hover:rotate-12">
            <Cpu className="size-4 text-neon" />
          </span>
          <span className="font-display font-bold">
            Admin <span className="text-neon">Panel</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {LINKS.map((link) => {
            const active = isActive(link.href);
            const count = link.badge ? badges[link.badge] : 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:translate-x-1 hover:bg-bg hover:text-neon ${
                  active ? "bg-gradient-to-r from-neon/15 to-transparent text-neon shadow-[inset_3px_0_0_var(--color-neon)]" : "text-text/80"
                }`}
              >
                <link.icon className="size-4 transition-transform group-hover:scale-125" />
                {link.label}
                {count > 0 && (
                  <span className="ml-auto rounded-full bg-neon-3 px-2 py-0.5 text-[10px] font-bold text-white">{count}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-line p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted transition-colors hover:bg-bg hover:text-neon"
          >
            <ExternalLink className="size-4" /> View website
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted transition-colors hover:bg-neon-3/10 hover:text-neon-3"
            >
              <LogOut className="size-4" /> Log out
            </button>
          </form>
          <p className="truncate px-4 pt-1 text-xs text-muted/70">{email}</p>
        </div>
      </aside>
    </>
  );
}
