import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InvitationList } from "@/components/invitations/invitation-list";
import { getInvitations } from "@/features/invitations/queries";
import { hasPermission } from "@/lib/auth/rbac";
import { getDashboardAccessOrRedirect } from "@/lib/wedding/current";

export default async function InvitationsPage() {
  const access = await getDashboardAccessOrRedirect();
  const wedding = access.wedding;
  if (!wedding) return <EmptyState />;
  if (!hasPermission(access.user.role, access.weddingRole, "invitations:read")) redirect("/dashboard");

  const guests = await getInvitations(wedding.id);
  const canWrite = hasPermission(access.user.role, access.weddingRole, "invitations:write");

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-warm">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Invitations</p>
        <h1 className="mt-2 font-display text-4xl font-black">Personalized invite links</h1>
        <p className="mt-2 text-muted-foreground">Every guest gets a unique code, QR code, and RSVP page.</p>
      </section>
      <Card>
        <CardHeader><CardTitle>Guest invitations</CardTitle><CardDescription>Copy links, generate QR codes, or email invitations to each guest.</CardDescription></CardHeader>
        <CardContent><InvitationList guests={guests} weddingId={wedding.id} readOnly={!canWrite} /></CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return <Card><CardHeader><CardTitle>Create your first wedding</CardTitle><CardDescription>Add wedding details before creating invitations.</CardDescription></CardHeader></Card>;
}
