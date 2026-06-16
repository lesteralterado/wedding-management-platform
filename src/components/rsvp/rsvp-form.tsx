"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitRsvp } from "@/features/rsvp/actions";

type RsvpFormValues = {
  status: "GOING" | "PENDING" | "DECLINED";
  guestCount: number;
  note?: string;
};

export function RsvpForm({ inviteCode, seatsAllowed, existingStatus }: { inviteCode: string; seatsAllowed: number; existingStatus?: string | null }) {
  const [pending, setPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    defaultValues: {
      status: (existingStatus === "DECLINED" ? "DECLINED" : existingStatus === "GOING" ? "GOING" : "PENDING") as "GOING" | "PENDING" | "DECLINED",
      guestCount: existingStatus === "DECLINED" ? 0 : 1,
      note: "",
    },
  });

  const status = watch("status");

  async function onSubmit(values: RsvpFormValues) {
    const guestCount = Number(values.guestCount);

    if (values.status === "GOING" && guestCount < 1) {
      toast.error("Going guests must bring at least 1 person.");
      return;
    }
    if (guestCount > seatsAllowed) {
      toast.error(`Guest count cannot exceed ${seatsAllowed}.`);
      return;
    }

    setPending(true);
    const result = await submitRsvp(inviteCode, { ...values, guestCount });
    setPending(false);

    if (result.error) {
      const message = Object.values(result.error).flat()[0] ?? "Unable to submit RSVP.";
      toast.error(message);
      return;
    }

    toast.success("RSVP submitted.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[1.5rem] border border-border bg-card p-6 shadow-warm">
      <div className="space-y-4">
        <Field label="Attendance Status" error={undefined}>
          <Select {...register("status")}>
            <option value="GOING">Joyfully attending</option>
            <option value="PENDING">Maybe / need to confirm</option>
            <option value="DECLINED">Regretfully declined</option>
          </Select>
        </Field>
        <Field label="Guest Count" error={undefined}>
          <Input type="number" min={status === "DECLINED" ? 0 : 1} max={seatsAllowed} disabled={status === "DECLINED"} {...register("guestCount", { valueAsNumber: true })} />
          <p className="mt-1 text-xs text-muted-foreground">Maximum allowed seats: {seatsAllowed}</p>
        </Field>
        <Field label="Notes" error={undefined}>
          <Textarea {...register("note")} placeholder="Dietary needs, song requests, or a sweet note..." />
        </Field>
        <Button className="w-full" type="submit" disabled={pending}>{pending ? "Submitting..." : "Submit RSVP"}</Button>
      </div>
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