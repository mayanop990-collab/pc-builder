"use client";

import { startTransition, useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { FormMessage } from "@/components/admin/form-message";
import { primaryButton } from "@/components/admin/page-header";
import type { Settings } from "@/lib/types";
import { saveSettings, type ActionState } from "../../actions";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettings, null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
      }}
      className="page-enter max-w-4xl space-y-6"
    >
      <Section title="Store">
        <Field label="Store name" name="store_name" defaultValue={settings.store_name} />
        <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
      </Section>

      <Section title="Home page hero">
        <Field label="Hero title" name="hero_title" defaultValue={settings.hero_title} />
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">Hero subtitle</span>
          <textarea name="hero_subtitle" required rows={3} defaultValue={settings.hero_subtitle} className="input resize-y" />
        </label>
      </Section>

      <Section title="Contact details">
        <Field label="Email" name="email" type="email" defaultValue={settings.email} />
        <Field label="Phone" name="phone" defaultValue={settings.phone} />
        <Field label="Address" name="address" defaultValue={settings.address} />
      </Section>

      <Section title="Checkout">
        <Field label="Currency symbol" name="currency" defaultValue={settings.currency} />
        <Field label="Shipping fee" name="shipping_fee" type="number" min="0" step="0.01" defaultValue={settings.shipping_fee} />
      </Section>

      <FormMessage state={state} />

      <button type="submit" disabled={pending} className={`${primaryButton} px-7 py-3`}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        {pending ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="mb-5 font-display font-semibold">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input required {...props} className="input" />
    </label>
  );
}
