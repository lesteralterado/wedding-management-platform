"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TEMPLATES, getPalette, getTemplateInfo, type Palette, type TemplateId } from "@/templates/catalog";

export function Swatches({ palette, size = "md" }: { palette: Palette; size?: "sm" | "md" }) {
  const dot = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  return (
    <span className="flex -space-x-1.5" aria-hidden>
      {[palette.tokens.bg, palette.tokens.accent, palette.tokens.accentText].map((color) => (
        <span key={color} className={cn(dot, "rounded-full border border-black/10")} style={{ backgroundColor: color }} />
      ))}
    </span>
  );
}

/** Template cards, then the colour stories of the chosen template. */
export function LookPicker({ templateId, paletteId, onChange, part = "both" }: {
  templateId: TemplateId;
  paletteId: string;
  onChange: (look: { templateId: TemplateId; paletteId: string }) => void;
  /** The onboarding wizard asks for the template and the colour story on separate screens. */
  part?: "template" | "palette" | "both";
}) {
  const template = getTemplateInfo(templateId);

  return (
    <div className="space-y-6">
      {part !== "palette" && (
      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm font-semibold">Template</legend>
        {TEMPLATES.map((option) => {
          const selected = option.id === templateId;
          return (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                selected ? "border-accent bg-secondary" : "border-border hover:bg-secondary/60",
              )}
            >
              <input
                type="radio"
                name="template"
                className="sr-only"
                checked={selected}
                // A colour story belongs to one template, so switching starts from the new template's first.
                onChange={() => onChange({ templateId: option.id, paletteId: getPalette(option.id, null).id })}
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{option.name}</span>
                  {selected && <Check className="h-4 w-4 text-accent" aria-hidden />}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{option.description}</span>
                <span className="mt-3 flex gap-3">
                  {option.palettes.map((palette) => (
                    <Swatches key={palette.id} palette={palette} size="sm" />
                  ))}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>
      )}

      {part !== "template" && (
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Colour story</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {template.palettes.map((palette) => {
            const selected = palette.id === paletteId;
            return (
              <label
                key={palette.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                  selected ? "border-accent bg-secondary" : "border-border hover:bg-secondary/60",
                )}
              >
                <input type="radio" name="palette" className="sr-only" checked={selected} onChange={() => onChange({ templateId, paletteId: palette.id })} />
                <Swatches palette={palette} />
                <span className="text-sm font-semibold">{palette.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      )}
    </div>
  );
}
