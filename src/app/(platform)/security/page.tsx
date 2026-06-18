import { getMockSecurityEvents } from "@/lib/demo/demo-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<string, "default" | "outline" | "secondary" | "success" | "danger"> = {
  Success: "success",
  Blocked: "danger",
  Completed: "outline",
};

export default async function PlatformSecurityPage() {
  const events = getMockSecurityEvents();

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Security</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight md:text-5xl">Audit Log</h1>
        <p className="mt-2 text-muted-foreground">Demo mock data — no database.</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events ({events.length})</CardTitle>
          <CardDescription>Login attempts, role changes, password resets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_MAP[event.status] || "default"}>{event.status}</Badge>
                  <div>
                    <p className="font-semibold capitalize">{event.type.replace(/_/g, " ")}</p>
                    <p className="text-sm text-muted-foreground">{event.user} · {event.ip}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{event.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
