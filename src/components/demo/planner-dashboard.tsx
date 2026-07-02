"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";

export function PlannerDashboard() {
  const [tasks] = React.useState([
    { id: 1, task: "Vendor confirmation call — florist", time: "09:00 AM", status: "upcoming", assignee: "Planner" },
    { id: 2, task: "Finalize seating chart for 128 guests", time: "10:30 AM", status: "in-progress", assignee: "Planner" },
    { id: 3, task: "Mail check invitations to overseas guests", time: "01:00 PM", status: "pending", assignee: "Planner" },
    { id: 4, task: "Coordinate with photographer shoot schedule", time: "03:00 PM", status: "upcoming", assignee: "Planner" },
    { id: 5, task: "Confirm final guest count with caterer", time: "04:30 PM", status: "pending", assignee: "Planner" },
  ]);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    pending: tasks.filter(t => t.status === "pending").length,
  };

  const rsvpStats = { confirmed: 87, pending: 24, declined: 17 };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardDescription>Total Tasks</CardDescription><CardTitle className="text-2xl font-black">{taskStats.total}</CardTitle></CardHeader><CardContent><span className="text-xs text-muted-foreground">Wedding planning items</span></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>In Progress</CardDescription><CardTitle className="text-2xl font-black text-accent">{taskStats.inProgress}</CardTitle></CardHeader><CardContent><span className="text-xs text-muted-foreground">Active tasks</span></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>RSVP Confirmed</CardDescription><CardTitle className="text-2xl font-black">{rsvpStats.confirmed}</CardTitle></CardHeader><CardContent><span className="text-xs text-muted-foreground">72% response rate</span></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Pending RSVP</CardDescription><CardTitle className="text-2xl font-black">{rsvpStats.pending}</CardTitle></CardHeader><CardContent><span className="text-xs text-muted-foreground">Awaiting response</span></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" />Planner Tasks</CardTitle>
          <CardDescription>Manage wedding tasks and vendor coordination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tasks.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">{item.time}</span>
                  <span className="font-semibold text-sm">{item.task}</span>
                </div>
                <TaskBadge status={item.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TaskBadge({ status }: { status: string }) {
  const variant = status === "completed" ? "success" : status === "in-progress" ? "default" : "outline";
  const label = status.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());
  return <Badge variant={variant}>{label}</Badge>;
}
