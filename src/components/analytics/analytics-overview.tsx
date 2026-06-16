"use client";

import { AnimatedCounter } from "@/components/motion/animated-counter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsOverview({ total, confirmed, pending, declined, rsvpRate }: { total: number; confirmed: number; pending: number; declined: number; rsvpRate: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Metric label="Total Guests" value={total} />
      <Metric label="Confirmed" value={confirmed} variant="success" />
      <Metric label="Pending" value={pending} />
      <Metric label="Declined" value={declined} variant="danger" />
      <Metric label="RSVP Rate" value={rsvpRate} suffix="%" />
    </div>
  );
}

function Metric({ label, value, suffix, variant }: { label: string; value: number; suffix?: string; variant?: "success" | "danger" }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatedCounter value={value} suffix={suffix} className={variant === "success" ? "text-emerald-700" : variant === "danger" ? "text-red-700" : "text-accent"} />
      </CardContent>
    </Card>
  );
}
