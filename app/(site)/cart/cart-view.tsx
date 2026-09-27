"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { ProductVisual } from "@/components/product-visual";
import { QuantityStepper } from "@/components/quantity-add-to-cart";
import { formatPrice } from "@/lib/format";

export function CartView({ currency, shippingFee }: { currency: string; shippingFee: number }) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="page-enter mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <span className="mb-6 flex size-24 items-center justify-center rounded-full border border-neon/40 bg-surface animate-float">
          <ShoppingCart className="size-10 text-neon" />
        </span>
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-muted">Looks like you haven&apos;t added any parts yet.</p>
        <Link
          href="/shop"
          className="btn-neon mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-7 py-3.5 font-semibold text-bg"
        >
          Start shopping <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="page-enter mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="mb-10 font-display text-3xl font-bold sm:text-4xl">
        Your <span className="text-gradient">Cart</span>
      </h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="group glow-card flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-surface p-4 sm:flex-nowrap"
            >
              <Link href={`/shop/${item.slug}`} className="size-24 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                <ProductVisual imageUrl={item.image_url} icon={item.icon} name={item.name} size="sm" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/shop/${item.slug}`} className="font-display font-semibold transition-colors hover:text-neon">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-muted">{formatPrice(item.price, currency)} each</p>
              </div>
              <QuantityStepper value={item.quantity} max={item.stock} onChange={(q) => updateQuantity(item.id, q)} />
              <p className="w-32 text-right font-bold">{formatPrice(item.price * item.quantity, currency)}</p>
              <button
                type="button"
                aria-label={`Remove ${item.name}`}
                onClick={() => removeItem(item.id)}
                className="flex size-10 items-center justify-center rounded-xl text-muted transition-all hover:rotate-12 hover:bg-neon-3/10 hover:text-neon-3"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <OrderSummary currency={currency} subtotal={subtotal} shippingFee={shippingFee}>
          <Link
            href="/checkout"
            className="btn-neon group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-7 py-3.5 font-semibold text-bg"
          >
            Proceed to checkout <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/shop" className="mt-4 block text-center text-sm text-muted transition-colors hover:text-neon">
            Continue shopping
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}

export function OrderSummary({
  currency,
  subtotal,
  shippingFee,
  children,
}: {
  currency: string;
  subtotal: number;
  shippingFee: number;
  children?: React.ReactNode;
}) {
  return (
    <aside className="rgb-border is-active h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
      <h2 className="mb-6 font-display text-lg font-semibold">Order summary</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatPrice(subtotal, currency)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd>{shippingFee > 0 ? formatPrice(shippingFee, currency) : "Free"}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-base font-bold">
          <dt>Total</dt>
          <dd className="text-gradient">{formatPrice(subtotal + shippingFee, currency)}</dd>
        </div>
      </dl>
      {children}
    </aside>
  );
}
