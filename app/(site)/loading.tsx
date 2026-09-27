export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6" role="status" aria-label="Loading">
      <div className="relative size-20">
        <span className="absolute inset-0 rounded-2xl border-2 border-neon/20" />
        <span className="absolute inset-0 animate-spin rounded-2xl border-2 border-transparent border-t-neon border-r-neon-2 [animation-duration:900ms]" />
        <span className="absolute inset-4 animate-pulse rounded-lg bg-gradient-to-br from-neon/40 to-neon-2/40" />
      </div>
      <p className="font-display text-xs uppercase tracking-[0.4em] text-neon caret">Booting</p>
    </div>
  );
}
