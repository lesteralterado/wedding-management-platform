import { auth, signOut } from "@/features/auth/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-warm">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Settings</p>
        <h1 className="mt-2 font-display text-4xl font-black">Account settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your profile, role, and sign out.</p>
      </section>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Authenticated couple admin account.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold">Name</p>
            <p className="text-muted-foreground">{session?.user.name}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-muted-foreground">{session?.user.email}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Role</p>
            <p className="text-muted-foreground">{session?.user.role}</p>
          </div>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <Button variant="outline" type="submit">Sign out</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
