import Link from "next/link";
import { Eye, Flame } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, currency }: { product: Product; currency: string }) {
  const price = product.sale_price ?? product.price;
  const icon = product.categories?.icon ?? "cpu";
  const discount =
    product.sale_price != null && product.sale_price < product.price
      ? Math.round((1 - product.sale_price / product.price) * 100)
      : 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="group tilt spotlight rgb-border flex h-full flex-col rounded-2xl border border-line bg-surface">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-t-2xl bg-surface-2"
      >
        <ProductVisual imageUrl={product.image_url} icon={icon} name={product.name} />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-neon-3 px-2.5 py-1 text-xs font-bold text-white shadow-[0_0_20px_var(--color-neon-3)]">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="flex items-center gap-1 rounded-full bg-warn/90 px-2.5 py-1 text-[10px] font-bold uppercase text-bg">
              <Flame className="size-3" /> Hot
            </span>
          )}
        </div>
        {product.stock <= 0 ? (
          <span className="absolute right-3 top-3 rounded-full bg-bg/80 px-2.5 py-1 text-xs font-semibold text-muted backdrop-blur">
            Sold out
          </span>
        ) : (
          lowStock && (
            <span className="absolute right-3 top-3 rounded-full border border-warn/40 bg-bg/80 px-2.5 py-1 text-[10px] font-semibold text-warn backdrop-blur">
              Only {product.stock} left
            </span>
          )
        )}

        <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-bg/95 to-bg/40 py-3 text-xs font-semibold uppercase tracking-widest text-neon backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
          <Eye className="size-4" /> View details
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-wider text-muted">
          <span>{product.categories?.name ?? "Product"}</span>
          {product.brand && <span className="text-neon/80">{product.brand}</span>}
        </div>
        <Link
          href={`/shop/${product.slug}`}
          className="font-display text-base font-semibold leading-snug transition-colors group-hover:text-neon"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="text-lg font-bold">{formatPrice(price, currency)}</p>
            {discount > 0 && <p className="text-sm text-muted line-through">{formatPrice(product.price, currency)}</p>}
          </div>
          <AddToCartButton
            compact
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
      </div>
    </article>
  );
}
