"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GuestWithRsvp } from "@/features/guests/types";

type GuestFormValues = {
  fullName: string;
  seatsAllowed: number;
  email?: string;
  phone?: string;
  groupName?: string;
};

export function GuestForm({ weddingId, guest, onSuccess }: { weddingId: string; guest?: GuestWithRsvp; onSuccess: () => void }) {
  const [pending, setPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuestFormValues>({
    defaultValues: {
      fullName: guest?.fullName ?? "",
      email: guest?.email ?? "",
      phone: guest?.phone ?? "",
      groupName: guest?.groupName ?? "",
      seatsAllowed: guest?.seatsAllowed ?? 1,
    },
  });

  React.useEffect(() => {
    if (guest) {
      reset({
        fullName: guest.fullName,
        email: guest.email ?? "",
        phone: guest.phone ?? "",
        groupName: guest.groupName ?? "",
        seatsAllowed: guest.seatsAllowed,
      });
    }
  }, [guest, reset]);

  async function onSubmit(values: GuestFormValues) {
    const seatsAllowed = Number(values.seatsAllowed);

    if (!values.fullName?.trim()) {
      toast.error("Guest name is required.");
      return;
    }
    if (isNaN(seatsAllowed) || seatsAllowed < 1 || seatsAllowed > 10) {
      toast.error("Seats must be between 1 and 10.");
      return;
    }

    setPending(true);
    const url = guest ? `/api/guests/${guest.id}` : "/api/guests";
    const response = await fetch(url, {
      method: guest ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guest ? { ...values, id: guest.id } : { weddingId, ...values }),
    });
    setPending(false);

    if (!response.ok) {
      toast.error(guest ? "Unable to update guest." : "Unable to create guest.");
      return;
    }

    toast.success(guest ? "Guest updated." : "Guest created.");
    reset();
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <Field label="Full Name" error={errors.fullName?.message}>
        <Input {...register("fullName")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <Input {...register("phone")} />
      </Field>
      <Field label="Group" error={undefined}>
        <Input {...register("groupName")} placeholder="Family" />
      </Field>
      <Field label="Seats Allowed" error={errors.seatsAllowed?.message}>
        <Input type="number" min={1} max={10} {...register("seatsAllowed", { valueAsNumber: true })} />
      </Field>
      <Button type="submit" disabled={pending}>{pending ? "Saving..." : guest ? "Update guest" : "Create guest"}</Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function guestToImportRow(values: GuestFormValues) {
  return {
    fullName: values.fullName,
    email: values.email,
    phone: values.phone,
    groupName: values.groupName,
    seatsAllowed: values.seatsAllowed,
  };
}