"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReceptionistDashboard() {
  const stats = [
    { label: "Guest Lookup", value: "128", hint: "Total guests" },
    { label: "Checked In", value: "87", hint: "Today" },
    { label: "Pending", value: "41", hint: "Awaiting arrival" },
    { label: "Tables", value: "12", hint: "Assigned" },
  ];

  const tableAssignments = [
    { table: "Table 1", guests: ["Lester Santos", "Mia Santos", "Noah Santos"], assigned: "A3" },
    { table: "Table 2", guests: ["Ava Reyes", "Ethan Cruz", "Sofia Garcia"], assigned: "A4" },
    { table: "Table 3", guests: ["Lucas Rivera", "Isabella Torres", "Mateo Flores"], assigned: "B1" },
    { table: "Table 4", guests: ["Emma Chen", "James Wilson", "Olivia Brown"], assigned: "B2" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-3xl font-black">{s.value}</CardTitle>
            </CardHeader>
            <CardContent><span className="text-xs text-muted-foreground">{s.hint}</span></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Table Assignments</CardTitle>
          <CardDescription>Demo mock — no database.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {tableAssignments.map((t) => (
              <div key={t.table} className="rounded-2xl border border-border p-4">
                <p className="font-semibold">{t.table} <span className="text-xs text-muted-foreground font-normal">({t.assigned})</span></p>
                <ul className="mt-2 space-y-1">
                  {t.guests.map((g) => (
                    <li key={g} className="text-sm text-muted-foreground">• {g}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
