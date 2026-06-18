import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAnalytics } from "@/features/analytics/queries";
import { getCurrentWeddingOrRedirect } from "@/lib/wedding/current";

export default async function AnalyticsPage() {
  const wedding = await getCurrentWeddingOrRedirect();
  if (!wedding) return <EmptyState />;

  const analytics = await getAnalytics(wedding.id);
  const groups = Object.entries(analytics.byGroup);
  const rsvpRate = analytics.total ? Math.round(((analytics.confirmed + analytics.declined) / analytics.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-warm">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Analytics</p>
        <h1 className="mt-2 font-display text-4xl font-black">RSVP health</h1>
        <p className="mt-2 text-muted-foreground">Real-time overview of guest response progress.</p>
      </section>
      <AnalyticsOverview total={analytics.total} confirmed={analytics.confirmed} pending={analytics.pending} declined={analytics.declined} rsvpRate={rsvpRate} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Group breakdown</CardTitle><CardDescription>Guests organized by invitation group.</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groups.map(([name, count]) => (
                <div key={name} className="flex items-center justify-between rounded-xl bg-secondary p-4">
                  <span className="font-semibold">{name}</span>
                  <Badge>{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent responses</CardTitle><CardDescription>Latest RSVP activity.</CardDescription></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Guest</TableHead><TableHead>Status</TableHead><TableHead>Submitted</TableHead></TableRow></TableHeader>
              <TableBody>
                {analytics.recentRsvps.map((rsvp) => (
                  <TableRow key={rsvp.id}>
                    <TableCell>{rsvp.fullName}</TableCell>
                    <TableCell><Badge variant={rsvp.status === "GOING" ? "success" : rsvp.status === "DECLINED" ? "danger" : "secondary"}>{rsvp.status}</Badge></TableCell>
                    <TableCell>{rsvp.submittedAt ? new Date(rsvp.submittedAt).toLocaleDateString() : "—"}</TableCell>
                  </TableRow>
                ))}
                {!analytics.recentRsvps.length && <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No responses yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyState() {
  return <Card><CardHeader><CardTitle>Create your first wedding</CardTitle><CardDescription>Add wedding details before viewing analytics.</CardDescription></CardHeader></Card>;
}
