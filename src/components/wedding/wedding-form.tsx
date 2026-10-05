"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { weddingDetailsSchema, type WeddingDetailsInput } from "@/features/wedding/schemas";
import type { Wedding } from "@prisma/client";

/** The facts about the wedding. The look and the website's sections are edited in the Studio. */
export function WeddingForm({ wedding }: { wedding: Wedding }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeddingDetailsInput>({
    resolver: zodResolver(weddingDetailsSchema),
    defaultValues: {
      brideName: wedding.brideName,
      groomName: wedding.groomName,
      date: new Date(wedding.date).toISOString().slice(0, 10),
      venue: wedding.venue,
      venueAddress: wedding.venueAddress ?? "",
      status: wedding.status,
      coverImage: wedding.coverImage ?? "",
    },
  });

  const onSubmit: SubmitHandler<WeddingDetailsInput> = async (values) => {
    setPending(true);
    const response = await fetch("/api/wedding", {
      method: "PUT",
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
      <Field label="Venue Address" error={errors.venueAddress?.message} className="lg:col-span-2">
        <Textarea {...register("venueAddress")} />
      </Field>
      <Field label="Status" error={undefined}>
        <Select {...register("status")}>
          <option value="PLANNING">Planning</option>
          <option value="ENGAGED">Engaged</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
        </Select>
      </Field>
      <Field label="Cover Photo URL" error={errors.coverImage?.message}>
        <Input {...register("coverImage")} placeholder="https://…" />
      </Field>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:col-span-2">
        <Button className="w-full sm:w-auto" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save wedding details"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Template, colours and website sections live in the{" "}
          <Link href="/dashboard/studio" className="font-semibold text-accent hover:underline">Studio</Link>.
        </p>
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
