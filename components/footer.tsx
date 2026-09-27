import Link from "next/link";
import { Cpu, Mail, MapPin, Phone } from "lucide-react";
import type { Category, Settings } from "@/lib/types";

export function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  return (
    <footer className="relative mt-24 border-t border-line bg-surface/50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="group mb-4 inline-flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl border border-neon/40 bg-surface transition-transform duration-300 group-hover:rotate-12">
              <Cpu className="size-5 text-neon" />
            </span>
            <span className="font-display text-lg font-bold">{settings.store_name}</span>
          </Link>
          <p className="text-sm leading-relaxed text-muted">{settings.tagline}</p>
        </div>

        <FooterColumn title="Pages">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/shop">Shop</FooterLink>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </FooterColumn>

        <FooterColumn title="Categories">
          {categories.slice(0, 6).map((c) => (
            <FooterLink key={c.id} href={`/shop?category=${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact">
          <li className="flex items-start gap-2 text-sm text-muted">
            <MapPin className="mt-0.5 size-4 shrink-0 text-neon" /> {settings.address}
          </li>
          <li className="flex items-center gap-2 text-sm text-muted">
            <Phone className="size-4 shrink-0 text-neon" /> {settings.phone}
          </li>
          <li className="flex items-center gap-2 text-sm text-muted">
            <Mail className="size-4 shrink-0 text-neon" /> {settings.email}
          </li>
        </FooterColumn>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {settings.store_name}. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest">{title}</h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="inline-block text-sm text-muted transition-all duration-300 hover:translate-x-1.5 hover:text-neon"
      >
        {children}
      </Link>
    </li>
  );
}
