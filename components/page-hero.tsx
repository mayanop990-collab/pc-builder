export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute -top-24 left-1/4 size-72 rounded-full bg-neon/30 animate-pulse-glow" />
      <div className="absolute -bottom-24 right-1/4 size-72 rounded-full bg-neon-2/30 animate-pulse-glow [animation-delay:1.2s]" />
      <div className="page-enter relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-neon">{eyebrow}</p>
        <h1 className="font-display text-4xl font-black sm:text-5xl md:text-6xl">
          <span className="text-gradient">{title}</span>
        </h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-muted">{subtitle}</p>}
      </div>
    </section>
  );
}
