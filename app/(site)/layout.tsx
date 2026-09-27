import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SiteEffects } from "@/components/site-effects";
import { getCategories, getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  return (
    <>
      <SiteEffects />
      <Navbar storeName={settings.store_name} categories={categories} />
      <main className="relative flex-1">{children}</main>
      <Footer settings={settings} categories={categories} />
    </>
  );
}
