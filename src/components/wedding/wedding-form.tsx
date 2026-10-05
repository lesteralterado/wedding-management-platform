"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";
import { weddingSchema, type WeddingInput } from "@/features/wedding/schemas";
import { DEFAULT_TEMPLATE_ID, TEMPLATES, getPalette, getTemplateInfo, type TemplateId } from "@/templates/catalog";
import type { Wedding } from "@prisma/client";

export function WeddingForm({ wedding }: { wedding?: Wedding | null }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const templateId = (getTemplateInfo(wedding?.templateId ?? DEFAULT_TEMPLATE_ID).id) as TemplateId;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WeddingInput>({
    resolver: zodResolver(weddingSchema),
    defaultValues: {
      brideName: wedding?.brideName ?? "",
      groomName: wedding?.groomName ?? "",
      date: wedding?.date ? new Date(wedding.date).toISOString().slice(0, 10) : "",
      venue: wedding?.venue ?? "",
      venueAddress: wedding?.venueAddress ?? "",
      templateId,
      paletteId: getPalette(templateId, wedding?.paletteId).id,
      status: wedding?.status ?? "PLANNING",
      coverImage: wedding?.coverImage ?? "",
      galleryImages: (wedding?.galleryImages as unknown as string[]) ?? [],
    },
  });

  const selectedTemplate = getTemplateInfo(watch("templateId"));
  const selectedPalette = watch("paletteId");

  const onSubmit: SubmitHandler<WeddingInput> = async (values) => {
    setPending(true);
    const response = await fetch("/api/wedding", {
      method: wedding ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setPending(false);

    if (!response.ok) {
      toast.error("Unable to save wedding details.");
      return;
    }

    toast.success("Wedding details saved.");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 lg:grid-cols-2">
      <Field label="Bride Name" error={errors.brideName?.message}>
        <Input {...register("brideName")} />
      </Field>
      <Field label="Groom Name" error={errors.groomName?.message}>
        <Input {...register("groomName")} />
      </Field>
      <Field label="Wedding Date" error={errors.date?.message}>
        <Input type="date" {...register("date")} />
      </Field>
      <Field label="Venue" error={errors.venue?.message}>
        <Input {...register("venue")} />
      </Field>
      <Field label="Venue Address" error={undefined} className="lg:col-span-2">
        <Textarea {...register("venueAddress")} />
      </Field>
      <Field label="Template" error={errors.templateId?.message}>
        <Select
          {...register("templateId", {
            // A colour story belongs to one template, so switching starts from the new template's first.
            onChange: (event) => setValue("paletteId", getPalette(event.target.value, null).id),
          })}
        >
          {TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </Select>
        <p className="mt-1 text-xs text-muted-foreground">{selectedTemplate.description}</p>
      </Field>
      <Field label="Status" error={undefined}>
        <Select {...register("status")}>
          <option value="PLANNING">Planning</option>
          <option value="ENGAGED">Engaged</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
        </Select>
      </Field>
      <fieldset className="lg:col-span-2">
        <legend className="text-sm font-semibold leading-none">Colour story</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {selectedTemplate.palettes.map((palette) => (
            <label
              key={palette.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                selectedPalette === palette.id ? "border-accent bg-secondary" : "border-border hover:bg-secondary/60",
              )}
            >
              <input type="radio" value={palette.id} {...register("paletteId")} className="sr-only" />
              <span className="flex -space-x-1.5" aria-hidden>
                {[palette.tokens.bg, palette.tokens.accent, palette.tokens.accentText].map((color) => (
                  <span key={color} className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                ))}
              </span>
              <span className="text-sm font-semibold">{palette.name}</span>
            </label>
          ))}
        </div>
        {errors.paletteId?.message && <p className="mt-1 text-sm text-destructive">{errors.paletteId.message}</p>}
      </fieldset>
      <Field label="Cover Photo URL" error={undefined} className="lg:col-span-2">
        <Input {...register("coverImage")} placeholder="https://…" />
      </Field>
      <div className="lg:col-span-2">
        <Button className="w-full sm:w-auto" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save wedding details"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
