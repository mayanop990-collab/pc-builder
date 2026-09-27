"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect } from "react";
import { CheckCircle2, Loader2, Lock, XCircle } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";
import { placeOrder, type OrderState } from "../actions";
import { OrderSummary } from "../cart/cart-view";

export function CheckoutForm({ currency, shippingFee }: { currency: string; shippingFee: number }) {
  const { items, subtotal, clear } = useCart();
  const [state, action, pending] = useActionState<OrderState, FormData>(placeOrder, null);

  useEffect(() => {
    if (state?.ok) clear();
  }, [state, clear]);

  if (state?.ok) {
    return (
      <div className="page-enter mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <span className="mb-6 flex size-24 items-center justify-center rounded-full border border-ok/50 bg-ok/10 shadow-[0_0_40px_-5px_var(--color-ok)]">
          <CheckCircle2 className="size-12 text-ok" />
        </span>
        <h1 className="font-display text-3xl font-bold">Order confirmed!</h1>
        <p className="mt-3 text-muted">
          Your order number is <span className="font-bold text-neon">#{state.orderNumber}</span>. We&apos;ll contact
          you shortly to confirm delivery.
        </p>
        <Link
          href="/shop"
          className="btn-neon mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-7 py-3.5 font-semibold text-bg"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-enter mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Nothing to checkout</h1>
        <p className="mt-3 text-muted">Your cart is empty.</p>
        <Link href="/shop" className="mt-6 inline-block font-semibold text-neon hover:underline">
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="page-enter mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="mb-10 font-display text-3xl font-bold sm:text-4xl">
        <span className="text-gradient">Checkout</span>
      </h1>
      <form
        onSubmit={(e) => {
          // Submit manually so React does not clear the fields when the order fails.
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startTransition(() => action(formData));
        }}
        className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <input type="hidden" name="items" value={JSON.stringify(items.map((i) => ({ id: i.id, quantity: i.quantity })))} />

        <div className="space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold">Shipping details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name *" name="name" autoComplete="name" required />
            <Field label="Phone *" name="phone" type="tel" autoComplete="tel" required />
          </div>
          <Field label="Email *" name="email" type="email" autoComplete="email" required />
          <Field label="Address *" name="address" autoComplete="street-address" required />
          <Field label="City *" name="city" autoComplete="address-level2" required />
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Order notes</span>
            <textarea name="notes" rows={3} maxLength={1000} className="input resize-y" placeholder="Anything we should know?" />
          </label>
          <p className="rounded-xl border border-neon/30 bg-neon/5 px-4 py-3 text-sm text-muted">
            Payment method: <span className="font-semibold text-text">Cash on Delivery</span>
          </p>
        </div>

        <OrderSummary currency={currency} subtotal={subtotal} shippingFee={shippingFee}>
          <ul className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="text-muted">
                  {item.name} <span className="text-neon">× {item.quantity}</span>
                </span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity, currency)}</span>
              </li>
            ))}
          </ul>

          {state && !state.ok && (
            <p className="page-enter mt-5 flex items-center gap-2 rounded-xl border border-neon-3/40 bg-neon-3/10 px-4 py-3 text-sm text-neon-3">
              <XCircle className="size-4 shrink-0" /> {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-neon mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-7 py-3.5 font-semibold text-bg disabled:opacity-60"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {pending ? "Placing order..." : "Place order"}
          </button>
        </OrderSummary>
      </form>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input {...props} maxLength={props.maxLength ?? 200} className="input" />
    </label>
  );
}
