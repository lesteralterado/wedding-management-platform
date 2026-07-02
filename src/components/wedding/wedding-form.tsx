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
import { weddingSchema, type WeddingInput } from "@/features/wedding/schemas";
import type { Wedding } from "@prisma/client";

type WeddingFormValues = WeddingInput & { id?: string };

export function WeddingForm({ wedding }: { wedding?: Wedding | null }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeddingFormValues>({
    resolver: zodResolver(weddingSchema),
    defaultValues: {
      brideName: wedding?.brideName ?? "Cherilyn",
      groomName: wedding?.groomName ?? "Lester",
      date: wedding?.date ? new Date(wedding.date).toISOString().slice(0, 10) : "2027-06-12",
      venue: wedding?.venue ?? "The Golden Orchard Estate",
      venueAddress: wedding?.venueAddress ?? "1200 Citrus Avenue, Laguna Beach, CA",
      theme: wedding?.theme ?? "Radiant Citrus",
      status: wedding?.status ?? "CONFIRMED",
      coverImage: wedding?.coverImage ?? "/images/cover.svg",
      galleryImages: (wedding?.galleryImages as unknown as string[]) ?? [],
      id: wedding?.id,
    },
  });

  const onSubmit: SubmitHandler<WeddingFormValues> = async (values) => {
    setPending(true);
    const endpoint = "/api/wedding";
    const response = await fetch(endpoint, {
      method: wedding ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wedding ? { id: wedding.id, ...values } : values),
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
      <Field label="Theme" error={errors.theme?.message}>
        <Input {...register("theme")} />
      </Field>
      <Field label="Status" error={undefined}>
        <Select {...register("status")}>
          <option value="PLANNING">Planning</option>
          <option value="ENGAGED">Engaged</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
        </Select>
      </Field>
      <Field label="Cover Photo URL" error={undefined} className="lg:col-span-2">
        <Input {...register("coverImage")} placeholder="/images/cover.svg" />
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
