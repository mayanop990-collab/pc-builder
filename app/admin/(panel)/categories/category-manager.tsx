"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { FormMessage } from "@/components/admin/form-message";
import { dangerIconButton, iconButton, primaryButton } from "@/components/admin/page-header";
import { CATEGORY_ICONS, CategoryIcon } from "@/components/category-icon";
import { CATEGORY_SECTIONS, type Category } from "@/lib/types";
import { deleteCategory, saveCategory, type ActionState } from "../../actions";

export function CategoryManager({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [icon, setIcon] = useState("cpu");
  const [state, action, pending] = useActionState<ActionState, FormData>(saveCategory, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the editor after a successful save
      setEditing(null);
      setIcon("cpu");
    }
  }, [state]);

  function startEdit(category: Category) {
    setEditing(category);
    setIcon(category.icon);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="page-enter grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`group glow-card rgb-border flex items-start gap-4 rounded-2xl border border-line bg-surface p-5 ${
              editing?.id === category.id ? "is-active" : ""
            }`}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-neon/10 text-neon transition-transform duration-500 group-hover:rotate-12">
              <CategoryIcon name={category.icon} className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold">{category.name}</p>
              <p className="text-xs text-muted">/{category.slug} · {counts[category.id] ?? 0} products</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-neon/70">
                {CATEGORY_SECTIONS.find((sec) => sec.value === category.section)?.label}
              </p>
              {category.description && <p className="mt-2 line-clamp-2 text-sm text-muted">{category.description}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <button type="button" title="Edit" aria-label="Edit" onClick={() => startEdit(category)} className={iconButton}>
                <Pencil className="size-4" />
              </button>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <ConfirmButton
                  title="Delete"
                  message={`Delete "${category.name}"? Its products will become uncategorized.`}
                  className={dangerIconButton}
                >
                  <Trash2 className="size-4" />
                </ConfirmButton>
              </form>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-muted">No categories yet.</p>}
      </div>

      <form
        ref={formRef}
        key={editing?.id ?? "new"}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startTransition(() => action(formData));
        }}
        className="page-enter h-fit space-y-5 rounded-2xl border border-line bg-surface p-6 xl:sticky xl:top-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold">{editing ? "Edit category" : "Add category"}</h2>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setIcon("cpu");
              }}
              className="flex items-center gap-1 text-xs text-muted hover:text-neon"
            >
              <X className="size-3.5" /> Cancel
            </button>
          )}
        </div>
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <input type="hidden" name="icon" value={icon} />

        <label className="block">
          <span className="mb-2 block text-sm font-medium">Name *</span>
          <input name="name" required defaultValue={editing?.name} className="input" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Slug</span>
          <input name="slug" defaultValue={editing?.slug} placeholder="auto from name" className="input" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Section</span>
          <select name="section" defaultValue={editing?.section ?? "components"} className="input">
            {CATEGORY_SECTIONS.map((sec) => (
              <option key={sec.value} value={sec.value}>
                {sec.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Description</span>
          <textarea name="description" rows={3} defaultValue={editing?.description ?? ""} className="input resize-y" />
        </label>

        <div>
          <span className="mb-2 block text-sm font-medium">Icon</span>
          <div className="grid grid-cols-8 gap-2">
            {Object.keys(CATEGORY_ICONS).map((key) => (
              <button
                key={key}
                type="button"
                title={key}
                aria-label={key}
                aria-pressed={icon === key}
                onClick={() => setIcon(key)}
                className={`flex aspect-square items-center justify-center rounded-lg border transition-all hover:-translate-y-0.5 hover:border-neon hover:text-neon ${
                  icon === key ? "border-neon bg-neon/15 text-neon shadow-[0_0_14px_-4px_var(--color-neon)]" : "border-line text-muted"
                }`}
              >
                <CategoryIcon name={key} className="size-5" />
              </button>
            ))}
          </div>
        </div>

        <FormMessage state={state} />

        <button type="submit" disabled={pending} className={`${primaryButton} w-full justify-center py-3`}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : editing ? <Save className="size-4" /> : <Plus className="size-4" />}
          {editing ? "Update category" : "Add category"}
        </button>
      </form>
    </div>
  );
}
