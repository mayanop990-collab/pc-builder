import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Cpu } from "lucide-react";
import { getAdminStatus, isAdminSetupNeeded } from "@/lib/admin";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin Login" };

export default async function LoginPage() {
  const [{ isAdmin }, setupNeeded] = await Promise.all([getAdminStatus(), isAdminSetupNeeded()]);
  if (isAdmin) redirect("/admin");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute left-1/4 top-1/4 size-80 rounded-full bg-neon/25 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 size-80 rounded-full bg-neon-2/25 animate-pulse-glow [animation-delay:1.2s]" />

      <div className="page-enter rgb-border is-active relative w-full max-w-md rounded-3xl border border-line bg-surface/90 p-8 backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-neon/40 bg-bg animate-float">
            <Cpu className="size-8 text-neon" />
          </span>
          <h1 className="font-display text-2xl font-bold">
            Admin <span className="text-gradient">Panel</span>
          </h1>
          <p className="mt-2 text-sm text-muted">Sign in to manage your store</p>
        </div>
        <LoginForm setupNeeded={setupNeeded} />
        <Link href="/" className="mt-6 block text-center text-sm text-muted transition-colors hover:text-neon">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
