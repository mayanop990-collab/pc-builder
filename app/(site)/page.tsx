import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Cpu,
  Gauge,
  Headphones,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { CategoryTabs } from "@/components/home/category-tabs";
import { CountUp } from "@/components/home/count-up";
import { Countdown } from "@/components/home/countdown";
import { TypeWords } from "@/components/home/type-words";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getCategoryCounts, getProducts, getSettings } from "@/lib/data";
import type { Category } from "@/lib/types";

const BRANDS = ["AMD", "Intel", "NVIDIA", "ASUS", "MSI", "Logitech", "Razer", "Corsair", "Samsung", "HyperX", "Secretlab", "NZXT", "Lian Li", "SteelSeries"];

const FEATURES = [
  { icon: BadgeCheck, title: "100% Genuine", text: "Only original parts with official brand warranty." },
  { icon: Truck, title: "Fast Delivery", text: "Safe, well-packed shipping across the country." },
  { icon: Wrench, title: "Custom Builds", text: "Our experts assemble, cable-manage and stress-test your rig." },
  { icon: Headphones, title: "Expert Support", text: "Real PC enthusiasts help you choose the right parts." },
];

const STEPS = [
  { icon: Cpu, title: "Pick your parts", text: "Choose a CPU, GPU and the rest from our shop." },
  { icon: Gauge, title: "We check compatibility", text: "Our team makes sure every part works together." },
  { icon: Zap, title: "Build & test", text: "Assembled, benchmarked and delivered ready to game." },
];

const TESTIMONIALS = [
  { name: "Ahmed R.", role: "Competitive gamer", text: "My 4070 Super build hits 240 FPS in Valorant. Cable management was spotless!" },
  { name: "Sara K.", role: "Streamer", text: "Got my whole streaming setup here — mic, lights and chair. Delivery was super quick." },
  { name: "Bilal M.", role: "Video editor", text: "They helped me pick a Ryzen 9 workstation within budget. Render times cut in half." },
  { name: "Hamza T.", role: "Student", text: "Budget build under 150k that runs everything at 1080p. Honest advice, no upselling." },
  { name: "Ayesha N.", role: "Content creator", text: "The RGB and monitor combo transformed my desk. Genuine products and great support." },
  { name: "Usman F.", role: "Esports player", text: "Superlight mouse and 240Hz monitor arrived in perfect condition. Highly recommended." },
];

const BATTLE_STATION = [
  { slug: "monitors", title: "Monitors", text: "High refresh-rate displays", span: "sm:col-span-2 sm:row-span-2" },
  { slug: "gaming-chairs", title: "Gaming Chairs", text: "Comfort for marathon sessions", span: "" },
  { slug: "rgb-lights", title: "RGB Lights", text: "Set the vibe", span: "" },
  { slug: "headphones", title: "Headphones", text: "Hear every footstep", span: "" },
  { slug: "microphones", title: "Microphones", text: "Stream-ready voice", span: "" },
  { slug: "gaming-desks", title: "Gaming Desks", text: "Room for your whole setup", span: "sm:col-span-2" },
  { slug: "mice", title: "Mice", text: "Pixel-perfect aim", span: "" },
  { slug: "keyboards", title: "Keyboards", text: "Mechanical & RGB boards", span: "" },
];

export default async function HomePage() {
  const [settings, categories, counts, featured, deals, latest] = await Promise.all([
    getSettings(),
    getCategories(),
    getCategoryCounts(),
    getProducts({ featured: true, limit: 6 }),
    getProducts({ onSale: true, limit: 6 }),
    getProducts({ limit: 6 }),
  ]);
  const showcase = featured.length > 0 ? featured : latest;
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const station = BATTLE_STATION.map((item) => ({ ...item, category: bySlug.get(item.slug) })).filter(
    (item): item is (typeof BATTLE_STATION)[number] & { category: Category } => Boolean(item.category),
  );
  const totalProducts = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-18 overflow-hidden pt-18">
        <div className="bg-grid absolute inset-0" />
        <CircuitTraces />
        <div className="absolute -left-32 top-10 size-[28rem] rounded-full bg-neon/25 animate-pulse-glow" />
        <div className="absolute -right-32 bottom-0 size-[28rem] rounded-full bg-neon-2/25 animate-pulse-glow [animation-delay:1.2s]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2">
          <div className="page-enter">
            <p className="glass mb-6 inline-flex items-center gap-2 rounded-full border border-neon/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-neon">
              <Sparkles className="size-3.5" /> {settings.tagline}
            </p>
            <h1 className="font-display text-4xl font-black leading-[1.1] sm:text-5xl lg:text-6xl">
              <span className="text-gradient">{settings.hero_title}</span>
            </h1>
            <p className="mt-5 font-display text-xl font-semibold sm:text-2xl">
              Built for <TypeWords words={["Gaming", "Streaming", "Creators", "Esports", "You"]} />
            </p>
            <p className="mt-5 max-w-xl text-lg text-muted">{settings.hero_subtitle}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="btn-neon group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-7 py-3.5 font-semibold text-bg"
              >
                Shop Now
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="rgb-border glass inline-flex items-center gap-2 rounded-xl border border-line px-7 py-3.5 font-semibold transition-all hover:-translate-y-0.5 hover:text-neon"
              >
                Custom Build
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              <HeroStat label="Rigs built" value={<CountUp value={5000} suffix="+" />} />
              <HeroStat label="Products" value={<CountUp value={totalProducts} suffix="+" />} />
              <HeroStat label="Happy gamers" value={<CountUp value={98} suffix="%" />} />
            </dl>
          </div>

          <BuildPanel />
        </div>
      </section>

      {/* Brand marquee */}
      <section className="glass border-y border-line py-6">
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-14 hover:[animation-play-state:paused]">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span
                key={i}
                className="font-display text-xl font-bold uppercase tracking-widest text-muted/50 transition-all duration-300 hover:scale-110 hover:text-neon hover:drop-shadow-[0_0_12px_var(--color-neon)]"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="Categories"
          title={<>Everything for your <span className="text-gradient">setup</span></>}
          subtitle="PC components, gaming gear and furniture — browse by what you need."
        />
        <Reveal>
          <CategoryTabs categories={categories} counts={counts} />
        </Reveal>
      </section>

      {/* Deals of the day */}
      {deals.length > 0 && (
        <section className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-3/5 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-neon-3">
                  <Timer className="size-4" /> Limited time
                </p>
                <h2 className="font-display text-3xl font-bold sm:text-4xl">
                  Deals of the <span className="text-gradient">day</span>
                </h2>
                <p className="mt-3 text-muted">Discounts refresh every night at midnight.</p>
              </div>
              <Countdown />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((product, i) => (
                <Reveal key={product.id} delay={(i % 3) * 80}>
                  <ProductCard product={product} currency={settings.currency} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Battle station bento */}
      {station.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <SectionHeading
            eyebrow="Gaming gear"
            title={<>Level up your <span className="text-gradient">battle station</span></>}
            subtitle="Monitors, headsets, mics, chairs, desks and RGB — the full setup."
          />
          <div className="grid auto-rows-[180px] gap-4 sm:grid-cols-4">
            {station.map((item, i) => (
              <Reveal key={item.slug} delay={i * 60} className={item.span}>
                <Link
                  href={`/shop?category=${item.slug}`}
                  className="group spotlight rgb-border relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="bg-grid absolute inset-0 opacity-50" />
                  <CategoryIcon
                    name={item.category.icon}
                    className={`absolute right-5 top-5 text-neon/25 transition-all duration-700 group-hover:-rotate-12 group-hover:scale-125 group-hover:text-neon group-hover:drop-shadow-[0_0_25px_var(--color-neon)] ${
                      item.span.includes("row-span-2") ? "size-40" : "size-20"
                    }`}
                  />
                  <div className="relative">
                    <h3 className="font-display text-xl font-bold transition-colors group-hover:text-neon">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted">{item.text}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-neon opacity-0 transition-all duration-300 group-hover:opacity-100">
                      Shop now <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      {showcase.length > 0 && (
        <section className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/60 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                align="left"
                eyebrow="Featured"
                title={<>Hot picks <span className="text-gradient">this week</span></>}
              />
              <Reveal className="mb-12">
                <Link href="/shop" className="group inline-flex items-center gap-2 text-sm font-semibold text-neon">
                  View all products <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {showcase.map((product, i) => (
                <Reveal key={product.id} delay={(i % 3) * 80}>
                  <ProductCard product={product} currency={settings.currency} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading eyebrow="How it works" title={<>Your dream PC in <span className="text-gradient">3 steps</span></>} />
        <div className="relative grid gap-6 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent md:block" />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div className="group relative flex flex-col items-center text-center">
                <span className="relative mb-6 flex size-24 items-center justify-center rounded-full border border-neon/40 bg-bg transition-all duration-500 group-hover:scale-110 group-hover:border-neon group-hover:shadow-[0_0_40px_var(--color-neon)]">
                  <step.icon className="size-9 text-neon" />
                  <span className="absolute -right-1 -top-1 flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-neon to-neon-2 font-display text-sm font-bold text-bg">
                    {i + 1}
                  </span>
                </span>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-muted">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Reviews" title={<>Loved by <span className="text-gradient">gamers</span></>} />
        </div>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-6 [animation-duration:50s] hover:[animation-play-state:paused]">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <figure
                key={i}
                className="spotlight glass w-80 shrink-0 rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neon/50"
              >
                <Quote className="mb-3 size-6 text-neon/60" />
                <div className="mb-3 flex gap-0.5 text-warn">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-warn" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-text/85">{t.text}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-neon to-neon-2 font-display text-sm font-bold text-bg">
                    {t.name[0]}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 80}>
              <div className="group tilt spotlight h-full rounded-2xl border border-line bg-surface p-6">
                <feature.icon className="mb-4 size-8 text-neon transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" />
                <h3 className="font-display font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted">{feature.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="rgb-border is-active relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-16 text-center sm:px-16">
            <div className="bg-grid absolute inset-0" />
            <div className="absolute left-1/2 top-0 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-2/30 animate-pulse-glow" />
            <div className="relative">
              <ShieldCheck className="mx-auto mb-5 size-12 text-neon animate-float" />
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Need help planning your <span className="text-gradient">build?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">
                Tell us your budget and what you play — we&apos;ll recommend the perfect parts.
              </p>
              <Link
                href="/contact"
                className="btn-neon group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-7 py-3.5 font-semibold text-bg"
              >
                Talk to an expert <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function HeroStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="group">
      <dt className="font-display text-2xl font-bold text-text transition-colors group-hover:text-neon">{value}</dt>
      <dd className="text-xs uppercase tracking-wider text-muted">{label}</dd>
    </div>
  );
}

/** Decorative glowing circuit lines behind the hero. */
function CircuitTraces() {
  const paths = [
    "M0 120 H220 L260 160 H520",
    "M0 300 H140 L190 250 H420 L460 290 H700",
    "M1440 180 H1180 L1140 220 H900",
    "M1440 420 H1260 L1210 370 H1000 L960 410 H760",
    "M0 520 H300 L340 480 H560",
    "M1440 620 H1100 L1060 580 H880",
  ];
  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" fill="none">
      {paths.map((d, i) => (
        <g key={d}>
          <path d={d} stroke="var(--color-line)" strokeWidth="1.5" />
          <path
            d={d}
            className="trace"
            stroke={i % 2 ? "var(--color-neon-2)" : "var(--color-neon)"}
            strokeWidth="2"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        </g>
      ))}
    </svg>
  );
}

/** Decorative animated "system monitor" card shown in the hero instead of a photo. */
function BuildPanel() {
  const rows = [
    { label: "CPU", value: "Ryzen 7 7800X3D", load: "w-[82%]" },
    { label: "GPU", value: "RTX 4070 Super", load: "w-[94%]" },
    { label: "RAM", value: "32GB DDR5 6000", load: "w-[64%]" },
    { label: "SSD", value: "2TB NVMe Gen4", load: "w-[48%]" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-md animate-float lg:max-w-none">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-neon/30 via-neon-2/20 to-neon-3/30 blur-2xl" />
      <div className="rgb-border is-active glass relative overflow-hidden rounded-3xl border border-line p-6 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neon/10 to-transparent animate-scan" />
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-neon-3" />
            <span className="size-3 rounded-full bg-warn" />
            <span className="size-3 rounded-full bg-ok" />
          </div>
          <span className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-muted">
            <span className="size-2 animate-pulse rounded-full bg-ok" /> System Online
          </span>
        </div>

        <div className="space-y-5">
          {rows.map((row, i) => (
            <div key={row.label} className="group">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-display text-xs font-bold tracking-widest text-neon">{row.label}</span>
                <span className="text-text/90">{row.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full ${row.load} origin-left animate-bar rounded-full bg-gradient-to-r from-neon via-neon-2 to-neon-3`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            ["240", "FPS"],
            ["62°", "TEMP"],
            ["750W", "POWER"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-xl border border-line bg-bg/60 p-3 text-center transition-all hover:-translate-y-1 hover:border-neon hover:shadow-[0_0_20px_-6px_var(--color-neon)]"
            >
              <p className="font-display text-xl font-bold text-gradient">{value}</p>
              <p className="text-[10px] tracking-widest text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
