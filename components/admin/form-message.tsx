import { CheckCircle2, XCircle } from "lucide-react";

export function FormMessage({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={`page-enter flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
        state.ok ? "border-ok/40 bg-ok/10 text-ok" : "border-neon-3/40 bg-neon-3/10 text-neon-3"
      }`}
    >
      {state.ok ? <CheckCircle2 className="size-4 shrink-0" /> : <XCircle className="size-4 shrink-0" />}
      {state.message}
    </p>
  );
}
