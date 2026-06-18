"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StaffDashboard() {
  const stats = [
    { label: "Guests Checked In", value: "87", color: "text-green-600" },
    { label: "Pending Check-in", value: "41", color: "text-amber-600" },
    { label: "Total Seats", value: "128", color: "text-foreground" },
    { label: "Tables Ready", value: "12", color: "text-foreground" },
  ];

  const recentScans = [
    { name: "Lester Santos", table: "A3", time: "2 min ago" },
    { name: "Mia Santos", table: "A3", time: "3 min ago" },
    { name: "Ethan Cruz", table: "B1", time: "5 min ago" },
    { name: "Lucas Rivera", table: "C2", time: "7 min ago" },
    { name: "Sofia Garcia", table: "B2", time: "8 min ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}><CardHeader className="pb-2"><CardDescription>{s.label}</CardDescription><CardTitle className={`text-3xl font-black ${s.color}`}>{s.value}</CardTitle></CardHeader><CardContent><span className="text-xs text-muted-foreground">Live from demo data</span></CardContent></Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent Scans</CardTitle><CardDescription>Latest guest check-ins</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentScans.map((scan, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-border p-3">
                  <span className="font-semibold text-sm">{scan.name}</span>
                  <span className="text-xs text-muted-foreground">Table {scan.table} · {scan.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Today's Shifts</CardTitle><CardDescription>Demo mock — no database.</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Morning Reception (8am - 2pm)", "Afternoon Ceremony (2pm - 6pm)", "Evening Reception (6pm - 11pm)"].map((shift, i) => (
                <div key={i} className="rounded-2xl border border-border p-3">
                  <p className="text-sm font-semibold">{shift}</p>
                  <p className="text-xs text-muted-foreground">{i === 0 ? "Active now" : "Scheduled"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
