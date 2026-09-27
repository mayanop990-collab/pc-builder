export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-enter mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export const primaryButton =
  "btn-neon inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-5 py-2.5 text-sm font-semibold text-bg disabled:opacity-60";

export const iconButton =
  "flex size-9 items-center justify-center rounded-lg border border-line text-muted transition-all hover:-translate-y-0.5 hover:border-neon hover:text-neon";

export const dangerIconButton =
  "flex size-9 items-center justify-center rounded-lg border border-line text-muted transition-all hover:-translate-y-0.5 hover:border-neon-3 hover:bg-neon-3/10 hover:text-neon-3";

export const STATUS_STYLES: Record<string, string> = {
  pending: "bg-warn/15 text-warn border-warn/30",
  processing: "bg-neon/15 text-neon border-neon/30",
  shipped: "bg-neon-2/15 text-neon-2 border-neon-2/30",
  delivered: "bg-ok/15 text-ok border-ok/30",
  cancelled: "bg-neon-3/15 text-neon-3 border-neon-3/30",
};
