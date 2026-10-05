"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useId, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { imageUrlSchema } from "@/templates/sections";

export function TextField({ label, value, onChange, maxLength, placeholder, hint, type = "text" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  hint?: string;
  type?: "text" | "date";
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function AreaField({ label, value, onChange, maxLength, placeholder, rows = 4 }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  rows?: number;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-xs tabular-nums text-muted-foreground">{value.length}/{maxLength}</span>
      </div>
      <Textarea id={id} rows={rows} value={value} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** True for links the site can show; blank counts as fine because the field is optional. */
export const isUsableImage = (value: string | undefined) => !value || imageUrlSchema.safeParse(value).success;

export function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = useId();
  const invalid = !isUsableImage(value);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} placeholder="https://…" aria-invalid={invalid} aria-describedby={`${id}-hint`} onChange={(e) => onChange(e.target.value.trim())} />
      <p id={`${id}-hint`} className={invalid ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
        {invalid ? "Use an image link that starts with https://" : "Paste a link to a photo. Photo uploads are coming soon."}
      </p>
    </div>
  );
}

/** Repeating items (chapters, events, questions) with add, remove and reorder. */
export function ListEditor<T>({ items, onChange, newItem, itemLabel, addLabel, max, emptyText, children }: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  itemLabel: (item: T, index: number) => string;
  addLabel: string;
  max: number;
  emptyText: string;
  /** `update` merges fields into an object item; `replace` swaps the whole item (for plain values). */
  children: (item: T, update: (patch: Partial<T>) => void, replace: (item: T) => void) => ReactNode;
}) {
  const move = (from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">{emptyText}</p>}
      {items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{itemLabel(item, index)}</p>
            <div className="flex shrink-0 gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Move down" disabled={index === items.length - 1} onClick={() => move(index, index + 1)}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" aria-label="Remove" onClick={() => onChange(items.filter((_, i) => i !== index))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {children(
            item,
            (patch) => onChange(items.map((current, i) => (i === index ? { ...current, ...patch } : current))),
            (replacement) => onChange(items.map((current, i) => (i === index ? replacement : current))),
          )}
        </div>
      ))}
      {items.length < max && (
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => onChange([...items, newItem()])}>
          <Plus className="mr-1.5 h-4 w-4" /> {addLabel}
        </Button>
      )}
    </div>
  );
}
