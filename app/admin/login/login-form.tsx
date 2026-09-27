"use client";

import { startTransition, useActionState, useState } from "react";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { FormMessage } from "@/components/admin/form-message";
import { createAdminAccount, login, type ActionState } from "../actions";

export function LoginForm({ setupNeeded }: { setupNeeded: boolean }) {
  const [mode, setMode] = useState<"signin" | "setup">(setupNeeded ? "setup" : "signin");
  const [loginState, loginAction, loginPending] = useActionState<ActionState, FormData>(login, null);
  const [setupState, setupAction, setupPending] = useActionState<ActionState, FormData>(createAdminAccount, null);

  const isSetup = mode === "setup";
  const state = isSetup ? setupState : loginState;
  const pending = isSetup ? setupPending : loginPending;

  return (
    <>
      {setupNeeded && (
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-bg p-1 text-sm">
          {(["setup", "signin"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-2 font-medium transition-all ${
                mode === m ? "bg-gradient-to-r from-neon to-neon-2 text-bg" : "text-muted hover:text-neon"
              }`}
            >
              {m === "setup" ? "Create admin" : "Sign in"}
            </button>
          ))}
        </div>
      )}

      {isSetup && (
        <p className="mb-5 rounded-xl border border-neon/30 bg-neon/5 px-4 py-3 text-sm text-muted">
          No admin exists yet. The first account you create here becomes the store admin.
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startTransition(() => (isSetup ? setupAction(formData) : loginAction(formData)));
        }}
        className="space-y-5"
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Email</span>
          <input name="email" type="email" required autoComplete="email" className="input" placeholder="admin@example.com" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={isSetup ? 6 : undefined}
            autoComplete={isSetup ? "new-password" : "current-password"}
            className="input"
            placeholder="••••••••"
          />
        </label>
        <FormMessage state={state} />
        <button
          type="submit"
          disabled={pending}
          className="btn-neon flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-6 py-3 font-semibold text-bg disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isSetup ? (
            <UserPlus className="size-4" />
          ) : (
            <LogIn className="size-4" />
          )}
          {pending ? "Please wait..." : isSetup ? "Create admin account" : "Sign in"}
        </button>
      </form>
    </>
  );
}
