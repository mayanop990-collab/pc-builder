import type { Metadata } from "next";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { ConfirmButton, PendingButton } from "@/components/admin/confirm-button";
import { AdminPageHeader, dangerIconButton, iconButton, primaryButton } from "@/components/admin/page-header";
import { ProductVisual } from "@/components/product-visual";
import { getSettings } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { deleteProduct, toggleProductField } from "../../actions";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("products").select("*, categories(name, slug, icon)").order("created_at", { ascending: false });
  const term = q?.replace(/[%,()]/g, " ").trim();
  if (term) query = query.or(`name.ilike.%${term}%,brand.ilike.%${term}%`);
  const [settings, { data }] = await Promise.all([getSettings(), query]);
  const products = (data as Product[] | null) ?? [];

  return (
    <>
      <AdminPageHeader
        title="Products"
        subtitle={`${products.length} products`}
        action={
          <Link href="/admin/products/new" className={primaryButton}>
            <Plus className="size-4" /> Add product
          </Link>
        }
      />

      <form className="mb-6 max-w-sm">
        <input name="q" defaultValue={q} placeholder="Search by name or brand..." className="input" />
      </form>

      <div className="page-enter overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((product) => (
              <tr key={product.id} className="group transition-colors hover:bg-surface-2">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="size-12 shrink-0 overflow-hidden rounded-lg bg-bg">
                      <ProductVisual
                        imageUrl={product.image_url}
                        icon={product.categories?.icon ?? "cpu"}
                        name={product.name}
                        size="sm"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-xs text-muted">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted">{product.categories?.name ?? "—"}</td>
                <td className="whitespace-nowrap px-5 py-3">
                  <p className="font-semibold">{formatPrice(product.sale_price ?? product.price, settings.currency)}</p>
                  {product.sale_price != null && (
                    <p className="text-xs text-muted line-through">{formatPrice(product.price, settings.currency)}</p>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span className={product.stock === 0 ? "text-neon-3" : product.stock <= 5 ? "text-warn" : ""}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      product.active ? "border-ok/30 bg-ok/10 text-ok" : "border-line text-muted"
                    }`}
                  >
                    {product.active ? "Live" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <form action={toggleProductField}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="field" value="featured" />
                      <input type="hidden" name="value" value={String(!product.featured)} />
                      <PendingButton
                        title={product.featured ? "Remove from featured" : "Mark as featured"}
                        className={`${iconButton} ${product.featured ? "border-warn/50 text-warn" : ""}`}
                      >
                        <Star className={`size-4 ${product.featured ? "fill-warn" : ""}`} />
                      </PendingButton>
                    </form>
                    <form action={toggleProductField}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="field" value="active" />
                      <input type="hidden" name="value" value={String(!product.active)} />
                      <PendingButton title={product.active ? "Hide from shop" : "Show in shop"} className={iconButton}>
                        {product.active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      </PendingButton>
                    </form>
                    <Link href={`/admin/products/${product.id}`} title="Edit" aria-label="Edit" className={iconButton}>
                      <Pencil className="size-4" />
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <ConfirmButton title="Delete" message={`Delete "${product.name}"?`} className={dangerIconButton}>
                        <Trash2 className="size-4" />
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-muted">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
