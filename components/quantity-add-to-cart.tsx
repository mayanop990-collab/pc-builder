"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { CartItem } from "@/components/cart-provider";

export function QuantityAddToCart({ product }: { product: Omit<CartItem, "quantity"> }) {
  const [quantity, setQuantity] = useState(1);
  const max = Math.max(product.stock, 1);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <QuantityStepper value={quantity} max={max} onChange={setQuantity} />
      <AddToCartButton product={product} quantity={quantity} />
    </div>
  );
}

export function QuantityStepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const buttonClass =
    "flex size-10 items-center justify-center text-muted transition-colors hover:bg-neon/10 hover:text-neon disabled:opacity-40";
  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-line bg-surface">
      <button type="button" aria-label="Decrease" className={buttonClass} disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Minus className="size-4" />
      </button>
      <span className="w-10 text-center font-semibold tabular-nums">{value}</span>
      <button type="button" aria-label="Increase" className={buttonClass} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="size-4" />
      </button>
    </div>
  );
}
