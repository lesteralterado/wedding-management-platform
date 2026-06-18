import { Building2, CalendarHeart, TrendingUp, UsersRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMockPlatformMetrics } from "@/lib/demo/demo-data";

export default async function PlatformDashboardPage() {
  const metrics = getMockPlatformMetrics();

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Platform Dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight md:text-5xl">Super Admin Overview</h1>
        <p className="mt-2 text-muted-foreground">Monitor the entire WeddingFlow SaaS platform.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Weddings" value={metrics.totalWeddings.toLocaleString()} icon={<CalendarHeart className="h-5 w-5" />} trend="+12 this week" />
        <MetricCard title="Active Subscriptions" value={metrics.activeSubscriptions.toLocaleString()} icon={<TrendingUp className="h-5 w-5" />} trend={`${metrics.churnRate}% churn`} />
        <MetricCard title="Revenue (MTD)" value={`₱${metrics.monthlyRevenue.toLocaleString()}`} icon={<Building2 className="h-5 w-5" />} trend={`₱${metrics.avgRevenuePerUser} ARPU`} />
        <MetricCard title="Total Users" value={metrics.totalUsers.toLocaleString()} icon={<UsersRound className="h-5 w-5" />} trend={`${metrics.newSignupsThisWeek} new`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Weddings</CardTitle>
            <CardDescription>Latest activity across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Visit <span className="font-semibold text-foreground">Weddings</span> in the sidebar to manage all weddings.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>{metrics.supportTicketsOpen} open tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Average response time: 2.4 hours</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <div className="rounded-xl bg-primary/20 p-2 text-accent">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="font-display text-3xl font-black">{value}</p>
        <p className="text-xs text-muted-foreground">{trend}</p>
      </CardContent>
    </Card>
  );
}
