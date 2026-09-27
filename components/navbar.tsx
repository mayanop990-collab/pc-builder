"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Cpu, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORY_SECTIONS, type Category } from "@/lib/types";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop", mega: true },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const ANNOUNCEMENTS = [
  "⚡ Free custom build assembly on orders above Rs 150,000",
  "🛡️ 100% genuine parts with official warranty",
  "🚚 Nationwide delivery — cash on delivery available",
  "🎮 New gaming gear: monitors, headsets, chairs & RGB lights",
];

export function Navbar({ storeName, categories }: { storeName: string; categories: Category[] }) {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pop the cart badge whenever the item count changes.
  useEffect(() => {
    if (count === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- short-lived animation flag
    setBump(true);
    const timer = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(timer);
  }, [count]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const [first, ...rest] = storeName.split(" ");

  return (
    <header className="sticky top-0 z-50">
      <div className="overflow-hidden border-b border-line bg-gradient-to-r from-neon/10 via-neon-2/10 to-neon-3/10 py-2 text-xs">
        <div className="flex w-max animate-marquee gap-16 [animation-duration:40s] hover:[animation-play-state:paused]">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((text, i) => (
            <span key={i} className="whitespace-nowrap text-text/80">
              {text}
            </span>
          ))}
        </div>
      </div>

      <div
        className={`relative transition-all duration-300 ${
          scrolled ? "glass border-b border-line shadow-[0_10px_40px_-20px_var(--color-neon)]" : "bg-transparent"
        }`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="relative flex size-10 items-center justify-center rounded-xl border border-neon/40 bg-surface transition-all duration-300 group-hover:rotate-12 group-hover:border-neon group-hover:shadow-[0_0_24px_var(--color-neon)]">
              <Cpu className="size-5 text-neon" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 animate-ping rounded-full bg-neon" />
            </span>
            <span className="glitch font-display text-lg font-bold tracking-wide">
              {first}
              <span className="text-neon"> {rest.join(" ")}</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {LINKS.map((link) => (
              <li key={link.href} onMouseEnter={() => setMegaOpen(Boolean(link.mega))}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={() => setMegaOpen(false)}
                  className={`nav-link flex items-center gap-1 text-sm font-medium transition-colors hover:text-neon ${
                    isActive(link.href) ? "text-neon" : "text-text/80"
                  }`}
                >
                  {link.label}
                  {link.mega && (
                    <ChevronDown className={`size-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              aria-label="Search products"
              className="hidden size-10 items-center justify-center rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-neon hover:text-neon sm:flex"
            >
              <Search className="size-5" />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex size-10 items-center justify-center rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-neon hover:text-neon hover:shadow-[0_0_20px_-4px_var(--color-neon)]"
            >
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span
                  className={`absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-neon-3 text-[10px] font-bold text-white shadow-[0_0_12px_var(--color-neon-3)] transition-transform duration-300 ${
                    bump ? "scale-150" : "scale-100"
                  }`}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="flex size-10 items-center justify-center rounded-xl border border-line bg-surface transition-colors hover:border-neon hover:text-neon md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {megaOpen && (
          <div className="mega-enter glass absolute inset-x-0 top-full hidden border-y border-line shadow-[0_30px_60px_-30px_var(--color-neon)] md:block">
            <div className="mx-auto grid max-w-7xl grid-cols-3 gap-8 px-6 py-8">
              {CATEGORY_SECTIONS.map((section) => (
                <div key={section.value}>
                  <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-neon">{section.label}</p>
                  <p className="mb-4 mt-1 text-xs text-muted">{section.tagline}</p>
                  <ul className="grid grid-cols-2 gap-1">
                    {categories
                      .filter((c) => c.section === section.value)
                      .map((c) => (
                        <li key={c.id}>
                          <Link
                            href={`/shop?category=${c.slug}`}
                            onClick={() => setMegaOpen(false)}
                            className="group flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-text/80 transition-all hover:translate-x-1 hover:bg-neon/10 hover:text-neon"
                          >
                            <CategoryIcon name={c.icon} className="size-4 text-muted transition-colors group-hover:text-neon" />
                            {c.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={`glass overflow-y-auto border-line transition-[max-height] duration-500 md:hidden ${
          open ? "max-h-[75vh] border-b" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 transition-all hover:translate-x-1 hover:bg-surface hover:text-neon ${
                  isActive(link.href) ? "bg-surface text-neon" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-4 py-4">
          {CATEGORY_SECTIONS.map((section) => (
            <div key={section.value} className="mb-4">
              <p className="mb-2 px-3 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-neon">{section.label}</p>
              <div className="grid grid-cols-2 gap-1">
                {categories
                  .filter((c) => c.section === section.value)
                  .map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop?category=${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text/80 hover:bg-surface hover:text-neon"
                    >
                      <CategoryIcon name={c.icon} className="size-4" />
                      {c.name}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
