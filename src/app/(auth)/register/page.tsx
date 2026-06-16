"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/features/auth/schemas";

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setPending(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setPending(false);

    if (!response.ok) {
      let payload: { error?: Record<string, string[]> } = {};

      try {
        payload = await response.json();
      } catch {
        payload = {};
      }

      if (payload.error?.email) toast.error(payload.error.email[0]);
      else toast.error("Unable to create account.");
      return;
    }

    toast.success("Account created. Please sign in.");
    router.push("/login");
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-5 rounded-[1.5rem] border border-border bg-card p-6 shadow-warm">
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Start planning</p>
          <h1 className="font-display text-4xl font-black">Create your couple account</h1>
          <p className="text-sm text-muted-foreground">Manage your wedding website, invitations, guests, and RSVPs from one dashboard.</p>
        </div>
        <div className="space-y-4">
          <Field label="Name" error={errors.name?.message}>
            <Input {...register("name")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" {...register("email")} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" {...register("password")} />
          </Field>
          <Field label="Confirm password" error={errors.confirmPassword?.message}>
            <Input type="password" {...register("confirmPassword")} />
          </Field>
        </div>
        <Button className="h-12 w-full" type="submit" disabled={pending}>
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </main>
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
