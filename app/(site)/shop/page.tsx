import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch, Search } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { CATEGORY_SECTIONS } from "@/lib/types";

export const metadata: Metadata = { title: "Shop" };

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const { category, q, sort } = await searchParams;
  const [settings, categories, products] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ category, q, sort }),
  ]);
  const active = categories.find((c) => c.slug === category);

  const hrefFor = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);
    const query = params.toString();
    return query ? `/shop?${query}` : "/shop";
  };

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title={active ? active.name : "All Components"}
        subtitle={active?.description ?? "Genuine parts from the brands gamers trust."}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="glass space-y-6 rounded-2xl border border-line p-4 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:self-start lg:overflow-y-auto">
          <form action="/shop" className="relative">
            {category && <input type="hidden" name="category" value={category} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input name="q" defaultValue={q} placeholder="Search products..." className="input pl-10" />
          </form>

          <CategoryLink href={hrefFor()} active={!category} icon="case" label="All products" />

          {CATEGORY_SECTIONS.map((section) => {
            const items = categories.filter((c) => c.section === section.value);
            if (items.length === 0) return null;
            return (
              <div key={section.value}>
                <h2 className="mb-2 px-3 font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-neon/80">
                  {section.label}
                </h2>
                <ul className="space-y-0.5">
                  {items.map((c) => (
                    <li key={c.id}>
                      <CategoryLink href={hrefFor(c.slug)} active={c.slug === category} icon={c.icon} label={c.name} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted">
              Showing <span className="font-semibold text-text">{products.length}</span> products
              {q && (
                <>
                  {" "}for &ldquo;<span className="text-neon">{q}</span>&rdquo;
                </>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {SORTS.map((s) => {
                const params = new URLSearchParams();
                if (category) params.set("category", category);
                if (q) params.set("q", q);
                params.set("sort", s.value);
                const isActive = (sort ?? "newest") === s.value;
                return (
                  <Link
                    key={s.value}
                    href={`/shop?${params}`}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-0.5 hover:border-neon hover:text-neon ${
                      isActive ? "border-neon bg-neon/10 text-neon" : "border-line text-muted"
                    }`}
                  >
                    {s.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line py-24 text-center">
              <PackageSearch className="mb-4 size-12 text-neon animate-float" />
              <p className="font-display text-lg font-semibold">No products found</p>
              <p className="mt-1 text-sm text-muted">Try another category or search term.</p>
              <Link href="/shop" className="mt-6 text-sm font-semibold text-neon hover:underline">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product, i) => (
                <Reveal key={product.id} delay={(i % 3) * 80}>
                  <ProductCard product={product} currency={settings.currency} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function CategoryLink({ href, active, icon, label }: { href: string; active: boolean; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:translate-x-1 hover:bg-surface hover:text-neon ${
        active ? "bg-surface text-neon shadow-[inset_3px_0_0_var(--color-neon)]" : "text-text/80"
      }`}
    >
      <CategoryIcon name={icon} className="size-4 transition-transform group-hover:scale-125" />
      {label}
    </Link>
  );
}
