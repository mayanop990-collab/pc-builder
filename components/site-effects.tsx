"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Site-wide interactive effects: scroll progress bar, cursor glow, back-to-top button,
 * and pointer tracking for `.spotlight` / `.tilt` elements (via CSS variables).
 */
export function SiteEffects() {
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let tilted: HTMLElement | null = null;

    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      setShowTop(window.scrollY > 600);
    }

    function onPointerMove(e: PointerEvent) {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      }
      const target = e.target as HTMLElement | null;

      const spot = target?.closest<HTMLElement>(".spotlight");
      if (spot) {
        const rect = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        spot.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }

      if (reduceMotion) return;
      const tilt = target?.closest<HTMLElement>(".tilt") ?? null;
      if (tilted && tilted !== tilt) resetTilt(tilted);
      tilted = tilt;
      if (tilt) {
        const rect = tilt.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        tilt.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
        tilt.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
      }
    }

    function resetTilt(el: HTMLElement) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }

    function onLeave() {
      if (tilted) resetTilt(tilted);
      tilted = null;
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div className="aurora" aria-hidden />
      <div className="scanlines" aria-hidden />
      <div
        ref={barRef}
        aria-hidden
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left scale-x-0 bg-gradient-to-r from-neon via-neon-2 to-neon-3 shadow-[0_0_12px_var(--color-neon)]"
      />
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-0 hidden size-[400px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-neon)_10%,transparent),transparent_65%)] transition-transform duration-200 ease-out [@media(pointer:fine)]:block"
      />
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-xl border border-neon/50 bg-surface/90 text-neon backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-neon hover:text-bg hover:shadow-[0_0_25px_var(--color-neon)] ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="size-5" />
      </button>
    </>
  );
}
