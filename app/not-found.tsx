import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="bg-grid absolute inset-0" />
      <p className="page-enter relative font-display text-8xl font-black text-gradient sm:text-9xl">404</p>
      <h1 className="relative mt-4 font-display text-2xl font-bold">Page not found</h1>
      <p className="relative mt-2 text-muted">This component seems to be missing from the build.</p>
      <Link
        href="/"
        className="btn-neon relative mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon to-neon-2 px-7 py-3.5 font-semibold text-bg"
      >
        <ArrowLeft className="size-4" /> Back home
      </Link>
    </div>
  );
}
