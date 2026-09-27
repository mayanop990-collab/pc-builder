import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "./category-manager";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const supabase = await createClient();
  const [categories, { data: products }] = await Promise.all([
    getCategories(),
    supabase.from("products").select("category_id"),
  ]);
  const counts: Record<string, number> = {};
  for (const p of products ?? []) {
    if (p.category_id) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;
  }

  return (
    <>
      <AdminPageHeader title="Categories" subtitle="Organize your products into categories." />
      <CategoryManager categories={categories} counts={counts} />
    </>
  );
}
