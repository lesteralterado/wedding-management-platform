import { getMockSubscriptions } from "@/lib/demo/demo-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PlatformSubscriptionsPage() {
  const plans = getMockSubscriptions();

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Subscriptions</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight md:text-5xl">Subscription Plans</h1>
        <p className="mt-2 text-muted-foreground">Demo mock data — no database.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>${plan.price}/mo · {plan.users} users</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="font-display text-2xl font-black">₱{plan.revenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">monthly revenue</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
