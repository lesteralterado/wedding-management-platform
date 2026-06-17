import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRecentRsvps } from "@/features/rsvp/queries";
import { hasPermission } from "@/lib/auth/rbac";
import { getDashboardAccessOrRedirect } from "@/lib/wedding/current";

export default async function RsvpsPage() {
  const access = await getDashboardAccessOrRedirect();
  const wedding = access.wedding;
  if (!wedding) return <EmptyState />;
  if (!hasPermission(access.user.role, access.weddingRole, "rsvps:read")) redirect("/dashboard");

  const rsvps = await getRecentRsvps(wedding.id);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-warm">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">RSVPs</p>
        <h1 className="mt-2 font-display text-4xl font-black">Guest responses</h1>
        <p className="mt-2 text-muted-foreground">Track attendance, guest count, notes, and submission time.</p>
      </section>
      <Card>
        <CardHeader><CardTitle>Recent RSVPs</CardTitle><CardDescription>Latest responses from personalized invitation pages.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Guest</TableHead><TableHead>Group</TableHead><TableHead>Status</TableHead><TableHead>Guests</TableHead><TableHead>Note</TableHead><TableHead>Submitted</TableHead></TableRow></TableHeader>
            <TableBody>
              {rsvps.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell className="font-semibold">{rsvp.guest.fullName}</TableCell>
                  <TableCell>{rsvp.guest.groupName || "Ungrouped"}</TableCell>
                  <TableCell><Status status={rsvp.status} /></TableCell>
                  <TableCell>{rsvp.guestCount}</TableCell>
                  <TableCell>{rsvp.note || "—"}</TableCell>
                  <TableCell>{rsvp.submittedAt ? new Date(rsvp.submittedAt).toLocaleString() : "—"}</TableCell>
                </TableRow>
              ))}
              {!rsvps.length && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No RSVPs yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Status({ status }: { status: string }) {
  return <Badge variant={status === "GOING" ? "success" : status === "DECLINED" ? "danger" : "secondary"}>{status}</Badge>;
}

function EmptyState() {
  return <Card><CardHeader><CardTitle>Create your first wedding</CardTitle><CardDescription>Add wedding details before viewing RSVPs.</CardDescription></CardHeader></Card>;
}
