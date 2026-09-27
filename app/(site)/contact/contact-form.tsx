"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2, Send, XCircle } from "lucide-react";
import { sendMessage, type FormState } from "../actions";

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(sendMessage, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        // Submit manually so a failed send keeps what the visitor typed.
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Name *</span>
          <input name="name" required maxLength={120} className="input" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Email *</span>
          <input name="email" type="email" required maxLength={200} className="input" placeholder="you@example.com" />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Subject</span>
        <input name="subject" maxLength={200} className="input" placeholder="Custom build quote, order question..." />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Message *</span>
        <textarea name="message" required maxLength={5000} rows={6} className="input resize-y" placeholder="Tell us what you need" />
      </label>

      {state && (
        <p
          className={`page-enter flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            state.ok ? "border-ok/40 bg-ok/10 text-ok" : "border-neon-3/40 bg-neon-3/10 text-neon-3"
          }`}
        >
          {state.ok ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-neon inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-7 py-3.5 font-semibold text-bg disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
