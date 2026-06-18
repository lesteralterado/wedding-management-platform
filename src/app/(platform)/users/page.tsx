import { getMockPlatformUsers } from "@/lib/demo/demo-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PlatformUsersPage() {
  const users = getMockPlatformUsers();

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Users</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight md:text-5xl">User Management</h1>
        <p className="mt-2 text-muted-foreground">Manage platform accounts.</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
          <CardDescription>Demo mock data — no database.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{user.role}</p>
                  <p className="text-xs text-muted-foreground">{user.weddings} weddings · {user.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
