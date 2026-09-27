import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, Settings } from "@/lib/types";

export const DEFAULT_SETTINGS: Settings = {
  id: 1,
  store_name: "PC Builder",
  tagline: "Build the rig of your dreams",
  hero_title: "Build Your Ultimate Gaming Rig",
  hero_subtitle: "Premium PC components, custom builds and expert support — all in one place.",
  email: "support@pcbuilder.pk",
  phone: "+92 300 0000000",
  address: "Lahore, Pakistan",
  currency: "Rs",
  shipping_fee: 0,
  updated_at: new Date(0).toISOString(),
};

export const getSettings = cache(async (): Promise<Settings> => {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
  return (data as Settings | null) ?? DEFAULT_SETTINGS;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return (data as Category[] | null) ?? [];
});

const PRODUCT_SELECT = "*, categories(name, slug, icon, section)";

export async function getProducts(options: {
  category?: string;
  q?: string;
  sort?: string;
  featured?: boolean;
  onSale?: boolean;
  limit?: number;
} = {}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("active", true);

  if (options.category) {
    const categories = await getCategories();
    const match = categories.find((c) => c.slug === options.category);
    if (!match) return [];
    query = query.eq("category_id", match.id);
  }
  if (options.q) {
    const term = options.q.replace(/[%,()]/g, " ").trim();
    if (term) query = query.or(`name.ilike.%${term}%,brand.ilike.%${term}%`);
  }
  if (options.featured) query = query.eq("featured", true);
  if (options.onSale) query = query.not("sale_price", "is", null);

  switch (options.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name");
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }
  if (options.limit) query = query.limit(options.limit);

  const { data } = await query;
  return (data as Product[] | null) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  return data as Product | null;
}

/** Number of live products in each category, keyed by category id. */
export const getCategoryCounts = cache(async (): Promise<Record<string, number>> => {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("category_id").eq("active", true);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (row.category_id) counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }
  return counts;
});
