import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { Reveal } from "@/components/reveal";
import { QuantityAddToCart } from "@/components/quantity-add-to-cart";
import { getProductBySlug, getProducts, getSettings } from "@/lib/data";
import { formatPrice } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  return { title: product?.name ?? "Product not found", description: product?.description ?? undefined };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [settings, product] = await Promise.all([getSettings(), getProductBySlug(slug)]);
  if (!product) notFound();

  const related = product.categories
    ? (await getProducts({ category: product.categories.slug, limit: 5 })).filter((p) => p.id !== product.id).slice(0, 4)
    : [];
  const price = product.sale_price ?? product.price;
  const icon = product.categories?.icon ?? "cpu";
  const specs = Object.entries(product.specs ?? {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-neon">Home</Link>
        <ChevronRight className="size-4" />
        <Link href="/shop" className="hover:text-neon">Shop</Link>
        {product.categories && (
          <>
            <ChevronRight className="size-4" />
            <Link href={`/shop?category=${product.categories.slug}`} className="hover:text-neon">
              {product.categories.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-4" />
        <span className="text-text">{product.name}</span>
      </nav>

      <div className="page-enter grid gap-10 lg:grid-cols-2">
        <div className="group rgb-border is-active relative aspect-square overflow-hidden rounded-3xl border border-line bg-surface">
          <ProductVisual imageUrl={product.image_url} icon={icon} name={product.name} size="lg" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon">
            {product.brand ?? product.categories?.name}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>

          <div className="mt-6 flex items-end gap-4">
            <p className="font-display text-3xl font-bold text-gradient">{formatPrice(price, settings.currency)}</p>
            {product.sale_price != null && product.sale_price < product.price && (
              <p className="pb-1 text-lg text-muted line-through">{formatPrice(product.price, settings.currency)}</p>
            )}
          </div>

          <p className={`mt-3 text-sm font-medium ${product.stock > 0 ? "text-ok" : "text-neon-3"}`}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </p>

          {product.description && <p className="mt-6 leading-relaxed text-muted">{product.description}</p>}

          <div className="mt-8">
            <QuantityAddToCart
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price,
                stock: product.stock,
                image_url: product.image_url,
                icon,
              }}
            />
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, text: "Official warranty" },
              { icon: Truck, text: "Nationwide delivery" },
              { icon: PackageCheck, text: "Secure packaging" },
            ].map((item) => (
              <li
                key={item.text}
                className="group flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-3 text-xs transition-colors hover:border-neon"
              >
                <item.icon className="size-4 text-neon transition-transform group-hover:scale-125" />
                {item.text}
              </li>
            ))}
          </ul>

          {specs.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 font-display text-lg font-semibold">Specifications</h2>
              <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
                {specs.map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4 bg-surface px-5 py-3 text-sm transition-colors hover:bg-surface-2">
                    <dt className="text-muted">{key}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-display text-2xl font-bold">
            You may also <span className="text-gradient">like</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} currency={settings.currency} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
