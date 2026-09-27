import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [categories, { data }] = await Promise.all([
    getCategories(),
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
  ]);
  if (!data) notFound();
  const product = data as Product;

  return (
    <>
      <AdminPageHeader title="Edit product" subtitle={product.name} />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
