"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { FormMessage } from "@/components/admin/form-message";
import { primaryButton } from "@/components/admin/page-header";
import type { Category, Product } from "@/lib/types";
import { saveProduct, type ActionState } from "../../actions";

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveProduct, null);
  const specs = Object.entries(product?.specs ?? {})
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  return (
    <form
      onSubmit={(e) => {
        // Submit manually so a validation error doesn't wipe the form.
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
      }}
      className="page-enter grid gap-6 xl:grid-cols-[1fr_340px]"
    >
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="space-y-6 rounded-2xl border border-line bg-surface p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name *" name="name" defaultValue={product?.name} required />
          <Field label="Slug (URL)" name="slug" defaultValue={product?.slug} placeholder="auto from name" />
          <Field label="Brand" name="brand" defaultValue={product?.brand ?? ""} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Category</span>
            <select name="category_id" defaultValue={product?.category_id ?? ""} className="input">
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium">Description</span>
          <textarea name="description" rows={4} defaultValue={product?.description ?? ""} className="input resize-y" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium">Specifications</span>
          <textarea
            name="specs"
            rows={6}
            defaultValue={specs}
            className="input resize-y font-mono text-sm"
            placeholder={"Cores: 8\nBoost Clock: 5.0 GHz\nSocket: AM5"}
          />
          <span className="mt-1.5 block text-xs text-muted">One per line, in the form “Name: Value”.</span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium">Image URL</span>
          <input name="image_url" type="url" defaultValue={product?.image_url ?? ""} className="input" placeholder="https://... (optional — add later)" />
          <span className="mt-1.5 block text-xs text-muted">Leave empty to show the neon icon placeholder.</span>
        </label>
      </div>

      <div className="space-y-6">
        <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display font-semibold">Pricing & stock</h2>
          <Field label="Price *" name="price" type="number" min="0" step="0.01" defaultValue={product?.price} required />
          <Field label="Sale price" name="sale_price" type="number" min="0" step="0.01" defaultValue={product?.sale_price ?? ""} placeholder="optional" />
          <Field label="Stock *" name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? 0} required />
        </div>

        <div className="space-y-4 rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display font-semibold">Visibility</h2>
          <Toggle name="active" label="Show in shop" defaultChecked={product?.active ?? true} />
          <Toggle name="featured" label="Featured on home page" defaultChecked={product?.featured ?? false} />
        </div>

        <FormMessage state={state} />

        <div className="flex gap-3">
          <button type="submit" disabled={pending} className={`${primaryButton} flex-1 justify-center py-3`}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {pending ? "Saving..." : "Save product"}
          </button>
          <Link
            href="/admin/products"
            className="rounded-xl border border-line px-5 py-3 text-sm transition-colors hover:border-neon hover:text-neon"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input {...props} className="input" />
    </label>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-text after:transition-transform peer-checked:bg-neon peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-neon/50" />
    </label>
  );
}
