"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORY_SECTIONS, type Category, type CategorySection } from "@/lib/types";

export function CategoryTabs({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const [active, setActive] = useState<CategorySection>("components");
  const visible = categories.filter((c) => c.section === active);

  return (
    <div>
      <div role="tablist" className="glass mx-auto mb-10 flex w-fit flex-wrap justify-center gap-1 rounded-2xl border border-line p-1.5">
        {CATEGORY_SECTIONS.map((section) => (
          <button
            key={section.value}
            type="button"
            role="tab"
            aria-selected={active === section.value}
            onClick={() => setActive(section.value)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              active === section.value
                ? "bg-gradient-to-r from-neon to-neon-2 text-bg shadow-[0_0_25px_-5px_var(--color-neon)]"
                : "text-muted hover:text-neon"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div key={active} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((category, i) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            style={{ animationDelay: `${i * 60}ms` }}
            className="page-enter group tilt spotlight rgb-border flex h-full flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6"
          >
            <span className="flex size-14 items-center justify-center rounded-xl bg-neon/10 text-neon transition-all duration-500 group-hover:rotate-[360deg] group-hover:bg-neon group-hover:text-bg group-hover:shadow-[0_0_30px_var(--color-neon)]">
              <CategoryIcon name={category.icon} className="size-7" />
            </span>
            <div>
              <h3 className="font-display font-semibold transition-colors group-hover:text-neon">{category.name}</h3>
              {category.description && <p className="mt-1 text-sm text-muted">{category.description}</p>}
            </div>
            <div className="mt-auto flex w-full items-center justify-between text-xs text-muted">
              <span>{counts[category.id] ?? 0} products</span>
              <ArrowRight className="size-4 transition-all group-hover:translate-x-2 group-hover:text-neon" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
