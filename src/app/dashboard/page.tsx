import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, MailCheck, UsersRound } from "lucide-react";
import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeddingStatusBadge } from "@/components/wedding/wedding-status-badge";
import { getDashboardMetrics } from "@/features/dashboard/queries";
import { getCurrentWeddingOrRedirect } from "@/lib/wedding/current";

export default async function DashboardPage() {
  const wedding = await getCurrentWeddingOrRedirect();
  if (!wedding) redirect("/dashboard/wedding");

  const metrics = await getDashboardMetrics(wedding.id);

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-warm md:flex-row md:items-center md:p-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Dashboard</p>
          <h1 className="mt-2 font-display text-4xl font-black tracking-tight md:text-5xl">
            {wedding.brideName} & {wedding.groomName}
          </h1>
          <p className="mt-2 text-muted-foreground">{wedding.venue} · <WeddingStatusBadge status={wedding.status} /></p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/w/${wedding.slug}`}><Button variant="outline">View website</Button></Link>
          <Link href="/dashboard/guests"><Button>Add guests</Button></Link>
        </div>
      </section>

      <AnalyticsOverview {...metrics} />

      <section className="grid gap-4 lg:grid-cols-3">
        <SetupCard icon={<UsersRound className="h-5 w-5" />} title="Guest list" text={`${metrics.total} guests ready for invite codes.`} href="/dashboard/guests" />
        <SetupCard icon={<MailCheck className="h-5 w-5" />} title="Invitations" text="Generate QR codes and share personalized links." href="/dashboard/invitations" />
        <SetupCard icon={<CalendarDays className="h-5 w-5" />} title="Wedding details" text="Polish your public microsite and event details." href="/dashboard/wedding" />
      </section>
    </div>
  );
}

function SetupCard({ icon, title, text, href }: { icon: React.ReactNode; title: string; text: string; href: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-accent">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{text}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={href} className="text-sm font-bold text-accent hover:text-amber-700">Open →</Link>
      </CardContent>
    </Card>
  );
}
