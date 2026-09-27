import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const settings = await getSettings();
  return <CheckoutForm currency={settings.currency} shippingFee={Number(settings.shipping_fee)} />;
}
