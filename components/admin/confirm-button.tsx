"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

/** Submit button that asks for confirmation before its parent form is sent. */
export function ConfirmButton({
  children,
  message = "Are you sure?",
  className = "",
  title,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      title={title}
      aria-label={title}
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : children}
    </button>
  );
}

/** Plain submit button that shows a spinner while its form is pending. */
export function PendingButton({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" title={title} aria-label={title} disabled={pending} className={className}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : children}
    </button>
  );
}
