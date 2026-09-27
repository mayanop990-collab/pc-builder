import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { CartView } from "./cart-view";

export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
  const settings = await getSettings();
  return <CartView currency={settings.currency} shippingFee={Number(settings.shipping_fee)} />;
}
