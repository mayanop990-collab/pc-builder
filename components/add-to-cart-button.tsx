"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart, type CartItem } from "@/components/cart-provider";

export function AddToCartButton({
  product,
  quantity = 1,
  compact = false,
}: {
  product: Omit<CartItem, "quantity">;
  quantity?: number;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleClick() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock}
      className={`btn-neon inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 font-semibold text-bg disabled:cursor-not-allowed disabled:from-line disabled:to-line disabled:text-muted ${
        compact ? "px-3 py-2 text-sm" : "px-6 py-3"
      }`}
    >
      {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
      {outOfStock ? "Out of stock" : added ? "Added!" : compact ? "Add" : "Add to cart"}
    </button>
  );
}
