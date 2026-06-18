import { getMockPlatformWeddings } from "@/lib/demo/demo-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PlatformWeddingsPage() {
  const weddings = getMockPlatformWeddings();

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Weddings</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight md:text-5xl">Wedding Management</h1>
        <p className="mt-2 text-muted-foreground">All weddings on the platform.</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>All Weddings ({weddings.length})</CardTitle>
          <CardDescription>Demo mock data — no database.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weddings.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="font-semibold">{w.couple}</p>
                  <p className="text-sm text-muted-foreground">{w.venue} · {w.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{w.guests} guests</p>
                  <p className="text-xs text-muted-foreground">{w.plan} · {w.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
