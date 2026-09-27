"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminSetupNeeded, requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_SECTIONS, ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export type ActionState = { ok: boolean; message: string } | null;

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function refreshSite() {
  revalidatePath("/", "layout");
}

/* ---------- Auth ---------- */

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === "email_not_confirmed") {
      return { ok: false, message: "Please confirm your email first — check your inbox for the Supabase link." };
    }
    return { ok: false, message: "Invalid email or password." };
  }

  redirect("/admin");
}

/** First-run setup: creates the account that will become the store's first admin. */
export async function createAdminAccount(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isAdminSetupNeeded())) return { ok: false, message: "An admin already exists. Please sign in." };

  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 6) {
    return { ok: false, message: "Enter an email and a password of at least 6 characters." };
  }

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/admin` },
  });
  if (error) return { ok: false, message: error.message };

  if (!data.session) {
    return {
      ok: true,
      message: "Account created! Open the confirmation email from Supabase, click the link, then sign in here.",
    };
  }

  // Email confirmation is off, so the user is already signed in; the admin layout claims admin rights.
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------- Products ---------- */

function parseSpecs(raw: string) {
  const specs: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const index = line.indexOf(":");
    if (index <= 0) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (key && value) specs[key] = value;
  }
  return specs;
}

function parseMoney(value: string) {
  if (value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : NaN;
}

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const price = parseMoney(text(formData, "price"));
  const salePrice = parseMoney(text(formData, "sale_price"));
  const stock = Number(text(formData, "stock") || "0");

  if (!name) return { ok: false, message: "Product name is required." };
  if (price === null || Number.isNaN(price)) return { ok: false, message: "Enter a valid price." };
  if (Number.isNaN(salePrice)) return { ok: false, message: "Sale price must be a positive number." };
  if (!Number.isInteger(stock) || stock < 0) return { ok: false, message: "Stock must be a whole number." };

  const product = {
    name,
    slug: slugify(text(formData, "slug") || name),
    brand: text(formData, "brand") || null,
    category_id: text(formData, "category_id") || null,
    description: text(formData, "description") || null,
    price,
    sale_price: salePrice,
    stock,
    image_url: text(formData, "image_url") || null,
    specs: parseSpecs(String(formData.get("specs") ?? "")),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  };

  const { error } = id
    ? await supabase.from("products").update(product).eq("id", id)
    : await supabase.from("products").insert(product);

  if (error) {
    return {
      ok: false,
      message: error.code === "23505" ? "A product with this slug already exists." : error.message,
    };
  }

  refreshSite();
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("products").delete().eq("id", text(formData, "id"));
  refreshSite();
}

export async function toggleProductField(formData: FormData) {
  const supabase = await requireAdmin();
  const field = text(formData, "field");
  if (field !== "featured" && field !== "active") return;
  await supabase
    .from("products")
    .update({ [field]: formData.get("value") === "true" })
    .eq("id", text(formData, "id"));
  refreshSite();
}

/* ---------- Categories ---------- */

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!name) return { ok: false, message: "Category name is required." };

  const category = {
    name,
    slug: slugify(text(formData, "slug") || name),
    description: text(formData, "description") || null,
    icon: text(formData, "icon") || "cpu",
    section: CATEGORY_SECTIONS.some((sec) => sec.value === text(formData, "section"))
      ? text(formData, "section")
      : "components",
  };

  const { error } = id
    ? await supabase.from("categories").update(category).eq("id", id)
    : await supabase.from("categories").insert(category);

  if (error) {
    return { ok: false, message: error.code === "23505" ? "This slug is already used." : error.message };
  }

  refreshSite();
  return { ok: true, message: id ? "Category updated." : "Category added." };
}

export async function deleteCategory(formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("categories").delete().eq("id", text(formData, "id"));
  refreshSite();
}

/* ---------- Orders ---------- */

export async function updateOrderStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const status = text(formData, "status") as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) return;
  await supabase.from("orders").update({ status }).eq("id", text(formData, "id"));
  revalidatePath("/admin", "layout");
}

export async function deleteOrder(formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("orders").delete().eq("id", text(formData, "id"));
  revalidatePath("/admin", "layout");
}

/* ---------- Messages ---------- */

export async function setMessageRead(formData: FormData) {
  const supabase = await requireAdmin();
  await supabase
    .from("messages")
    .update({ is_read: formData.get("value") === "true" })
    .eq("id", text(formData, "id"));
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("messages").delete().eq("id", text(formData, "id"));
  revalidatePath("/admin", "layout");
}

/* ---------- Settings ---------- */

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await requireAdmin();
  const shipping = parseMoney(text(formData, "shipping_fee") || "0");
  if (shipping === null || Number.isNaN(shipping)) return { ok: false, message: "Shipping fee must be a number." };

  const required = ["store_name", "tagline", "hero_title", "hero_subtitle", "email", "phone", "address", "currency"];
  const values = Object.fromEntries(required.map((key) => [key, text(formData, key)]));
  if (required.some((key) => !values[key])) return { ok: false, message: "All fields are required." };

  const { error } = await supabase
    .from("settings")
    .update({ ...values, shipping_fee: shipping, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { ok: false, message: error.message };

  refreshSite();
  return { ok: true, message: "Settings saved." };
}
