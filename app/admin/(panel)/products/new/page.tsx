import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getCategories } from "@/lib/data";
import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <>
      <AdminPageHeader title="Add product" subtitle="Create a new product for your shop." />
      <ProductForm categories={categories} />
    </>
  );
}
