"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DashboardShell({ children, active }: { children: React.ReactNode; active?: string }) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}

export function StaffCheckInCard() {
  const [checkedIn, setCheckedIn] = React.useState(87);
  const [pending, setPending] = React.useState(41);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-In Station</CardTitle>
        <CardDescription>Fast lookup and attendance tracking for today&apos;s event.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          <CheckedMetric label="Checked In" value={checkedIn} variant="success" />
          <CheckedMetric label="Pending" value={pending} variant="warn" />
          <CheckedMetric label="Total Guests" value={checkedIn + pending} variant="default" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Staff can scan QR codes or search by name to record attendance.</p>
      </CardContent>
    </Card>
  );
}

export function ReceptionistCard() {
  const [assigned, setAssigned] = React.useState(12);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Front Desk Helper</CardTitle>
        <CardDescription>Guest lookup, table lookup, and attendance confirmation.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold">Quick Search</p>
            <p className="text-xs text-muted-foreground mt-1">Find guest by name / invite code</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold">Table Assignments</p>
            <p className="text-xs text-muted-foreground mt-1">{assigned} tables mapped</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PhotographerCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Station</CardTitle>
        <CardDescription>Upload photos / videos to the wedding gallery.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold">Upload Photos</p>
            <p className="text-xs text-muted-foreground mt-1">Drag and drop or click to browse</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold">Upload Videos</p>
            <p className="text-xs text-muted-foreground mt-1">MP4 / MOV up to 500MB</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CheckedMetric({ label, value, variant }: { label: string; value: number; variant: "success" | "warn" | "default" }) {
  const color = variant === "success" ? "text-green-600" : variant === "warn" ? "text-amber-600" : "text-foreground";
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-display text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

const Metric = CheckedMetric;
