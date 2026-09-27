"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FormState = { ok: boolean; message: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = field(formData, "name");
  const email = field(formData, "email");
  const subject = field(formData, "subject");
  const message = field(formData, "message");

  if (!name || !email || !message) return { ok: false, message: "Please fill in your name, email and message." };
  if (!EMAIL_RE.test(email)) return { ok: false, message: "Please enter a valid email address." };
  if (name.length > 120 || subject.length > 200 || message.length > 5000) {
    return { ok: false, message: "Your message is too long." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({ name, email, subject: subject || null, message });
  if (error) return { ok: false, message: "Could not send your message. Please try again." };

  return { ok: true, message: "Thanks! Your message has been sent. We'll get back to you soon." };
}

export type OrderState = { ok: boolean; message: string; orderNumber?: number } | null;

export async function placeOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const details = {
    p_customer_name: field(formData, "name"),
    p_email: field(formData, "email"),
    p_phone: field(formData, "phone"),
    p_address: field(formData, "address"),
    p_city: field(formData, "city"),
    p_notes: field(formData, "notes") || null,
  };

  if (!details.p_customer_name || !details.p_email || !details.p_phone || !details.p_address || !details.p_city) {
    return { ok: false, message: "Please fill in all required fields." };
  }
  if (!EMAIL_RE.test(details.p_email)) return { ok: false, message: "Please enter a valid email address." };

  let items: { product_id: string; quantity: number }[];
  try {
    const parsed = JSON.parse(field(formData, "items")) as { id: string; quantity: number }[];
    items = parsed.map((i) => ({ product_id: String(i.id), quantity: Math.floor(Number(i.quantity)) }));
  } catch {
    return { ok: false, message: "Your cart could not be read. Please refresh and try again." };
  }
  if (items.length === 0) return { ok: false, message: "Your cart is empty." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("place_order", { ...details, p_items: items });
  if (error) {
    const known = /stock|available|quantity|empty|Missing/i.test(error.message);
    return { ok: false, message: known ? error.message : "Could not place your order. Please try again." };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Order placed!", orderNumber: data as number };
}
