import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getSettings } from "@/lib/data";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <AdminPageHeader title="Settings" subtitle="Store details, home page text and checkout options." />
      <SettingsForm settings={settings} />
    </>
  );
}
