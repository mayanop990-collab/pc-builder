import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu, Gamepad2, HeartHandshake, Rocket, Target, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

const VALUES = [
  { icon: Target, title: "Our Mission", text: "Make high-performance PCs accessible with honest advice and fair prices." },
  { icon: HeartHandshake, title: "Customer First", text: "We treat every build like our own and support you long after purchase." },
  { icon: Rocket, title: "Performance Obsessed", text: "Every custom rig is benchmarked and stress-tested before it ships." },
];

const STATS = [
  { value: "8+", label: "Years in business" },
  { value: "5,000+", label: "Custom PCs built" },
  { value: "30+", label: "Top brands" },
  { value: "24/7", label: "Support" },
];

const TIMELINE = [
  { year: "2018", title: "Started in a small shop", text: "A handful of enthusiasts building PCs for friends." },
  { year: "2020", title: "Went online", text: "Launched our store and started shipping nationwide." },
  { year: "2023", title: "Custom build studio", text: "Opened a dedicated studio for assembly and testing." },
  { year: "Today", title: "Thousands of happy gamers", text: "Trusted by gamers, streamers and creators." },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={`We are ${settings.store_name}`}
        subtitle="A team of PC enthusiasts helping gamers and creators build machines they love."
      />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neon">Our story</p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Built by gamers, <span className="text-gradient">for gamers</span>
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            {settings.store_name} started with a simple idea: buying PC parts should be easy, honest and exciting.
            We only stock genuine components, explain the trade-offs in plain language and help you get the
            most performance for your budget.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Whether you want a silent workstation, a streaming beast or a compact LAN rig, our team is here to
            help from the first part to the first boot.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="group glow-card rgb-border rounded-2xl border border-line bg-surface p-6 text-center">
                <p className="font-display text-3xl font-black text-gradient transition-transform duration-300 group-hover:scale-110">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wider text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <SectionHeading eyebrow="What drives us" title={<>Our <span className="text-gradient">values</span></>} />
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 100}>
              <div className="group glow-card h-full rounded-2xl border border-line bg-surface p-8">
                <span className="mb-6 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-neon/20 to-neon-2/20 text-neon transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <value.icon className="size-7" />
                </span>
                <h3 className="font-display text-lg font-semibold">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{value.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <SectionHeading eyebrow="Journey" title={<>How we <span className="text-gradient">got here</span></>} />
        <ol className="relative space-y-10 border-l border-line pl-8">
          {TIMELINE.map((item, i) => (
            <li key={item.year} className="group relative">
              <span className="absolute -left-[41px] top-1 size-4 rounded-full border-2 border-neon bg-bg transition-all group-hover:scale-125 group-hover:bg-neon group-hover:shadow-[0_0_16px_var(--color-neon)]" />
              <Reveal delay={i * 100}>
                <p className="font-display text-sm font-bold text-neon">{item.year}</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="grid gap-6 rounded-3xl border border-line bg-surface p-8 sm:p-12 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex items-start gap-5">
              <div className="hidden gap-2 sm:flex">
                {[Cpu, Gamepad2, Users].map((Icon, i) => (
                  <Icon key={i} className="size-8 text-neon animate-float" style={{ animationDelay: `${i * 0.4}s` }} />
                ))}
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Ready to start your build?</h2>
                <p className="mt-2 text-muted">Browse our components or ask us for a recommendation.</p>
              </div>
            </div>
            <Link
              href="/shop"
              className="btn-neon group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-7 py-3.5 font-semibold text-bg"
            >
              Visit the shop <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
