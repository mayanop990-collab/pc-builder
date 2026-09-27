import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getSettings } from "@/lib/data";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSettings();
  const info = [
    { icon: MapPin, label: "Visit us", value: settings.address },
    { icon: Phone, label: "Call us", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email us", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Clock, label: "Opening hours", value: "Mon – Sat, 11am – 9pm" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk hardware"
        subtitle="Questions about compatibility, a custom build quote or an order? Send us a message."
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {info.map((item, i) => (
            <Reveal key={item.label} delay={i * 80}>
              <div className="group glow-card rgb-border flex items-start gap-4 rounded-2xl border border-line bg-surface p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-neon/10 text-neon transition-all duration-500 group-hover:rotate-12 group-hover:bg-neon group-hover:text-bg">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="mt-1 block font-medium transition-colors hover:text-neon">
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
            <h2 className="font-display text-2xl font-bold">
              Send a <span className="text-gradient">message</span>
            </h2>
            <p className="mb-8 mt-2 text-sm text-muted">We usually reply within a few hours.</p>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </>
  );
}
