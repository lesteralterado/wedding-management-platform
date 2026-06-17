import { redirect } from "next/navigation";
import { CreateGuestDialog } from "@/components/guests/create-guest-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CsvImportDialog } from "@/components/guests/csv-import-dialog";
import { GuestTable } from "@/components/guests/guest-table";
import { getGuestGroups, getGuests } from "@/features/guests/queries";
import { hasPermission } from "@/lib/auth/rbac";
import { getDashboardAccessOrRedirect } from "@/lib/wedding/current";

export default async function GuestsPage() {
  const access = await getDashboardAccessOrRedirect();
  const wedding = access.wedding;
  if (!wedding) return <EmptyState />;
  if (!hasPermission(access.user.role, access.weddingRole, "guests:read")) redirect("/dashboard");

  const [guests, groups] = await Promise.all([getGuests(wedding.id), getGuestGroups(wedding.id)]);
  const canWrite = hasPermission(access.user.role, access.weddingRole, "guests:write");

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-warm md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Guests</p>
          <h1 className="mt-2 font-display text-4xl font-black">Invite the people who matter</h1>
          <p className="mt-2 text-muted-foreground">Create, import, search, group, and prepare every guest for RSVP.</p>
        </div>
        {canWrite && (
          <div className="flex flex-wrap gap-3">
            <CsvImportDialog weddingId={wedding.id} />
            <CreateGuestDialog weddingId={wedding.id} />
          </div>
        )}
      </section>
      <Card>
        <CardHeader><CardTitle>Guest list</CardTitle><CardDescription>{guests.length} guests across {groups.length || 1} group{groups.length === 1 ? "" : "s"}.</CardDescription></CardHeader>
        <CardContent><GuestTable guests={guests} groups={groups} readOnly={!canWrite} /></CardContent>
      </Card>
    </div>
  );
}
function EmptyState() {
  return <Card><CardHeader><CardTitle>Create your first wedding</CardTitle><CardDescription>Add wedding details before managing guests.</CardDescription></CardHeader></Card>;
}
