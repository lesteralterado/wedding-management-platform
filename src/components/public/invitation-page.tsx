"use client";

import * as React from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { RsvpForm } from "@/components/rsvp/rsvp-form";
import { formatDateTime } from "@/lib/utils/date";
import type { GuestWithRsvp } from "@/features/guests/types";

export function InvitationPage({ guest }: { guest: GuestWithRsvp }) {
  const wedding = guest.wedding;
  if (!wedding) return <div>Wedding not found</div>;

  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const target = new Date(wedding.date).getTime();
    const timer = window.setInterval(() => {
      setSeconds(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [wedding.date]);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return (
    <main className="px-4 py-8 md:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6 rounded-[2rem] border border-border bg-card p-6 shadow-warm md:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Personal invitation</p>
            <h1 className="mt-4 font-display text-5xl font-black tracking-tight md:text-7xl">Welcome {guest.fullName}!</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {wedding.brideName} & {wedding.groomName} are getting married, and we would be honored to celebrate with you.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Countdown label="Days" value={days} />
            <Countdown label="Hours" value={hours} />
            <Countdown label="Minutes" value={minutes} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard icon={<CalendarDays className="h-5 w-5" />} title="Date" value={formatDateTime(wedding.date)} />
            <InfoCard icon={<MapPin className="h-5 w-5" />} title="Venue" value={wedding.venue} />
          </div>
        </div>
        <div className="space-y-5">
          <RsvpForm inviteCode={guest.inviteCode} seatsAllowed={guest.seatsAllowed} existingStatus={guest.rsvp?.status ?? null} />
          <div className="rounded-[1.5rem] border border-border bg-white/40 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">Your seat allowance</p>
            <p className="mt-2 font-display text-4xl font-black">{guest.seatsAllowed}</p>
            <p className="mt-2 text-sm text-muted-foreground">You may include this many guests in your RSVP.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Countdown({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.25rem] bg-secondary p-4 text-center">
      <p className="font-display text-4xl font-black text-accent">{value}</p>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-background p-4">
      <div className="mb-3 text-accent">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
