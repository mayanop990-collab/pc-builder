"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { updateOrderStatus } from "../../actions";

export function StatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Status</span>
      <select
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const formData = new FormData();
          formData.set("id", id);
          formData.set("status", e.target.value);
          startTransition(() => updateOrderStatus(formData));
        }}
        className="input w-auto py-2 capitalize"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="size-4 animate-spin text-neon" />}
    </label>
  );
}
