import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getDashboardAccessOrRedirect } from "@/lib/wedding/current";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const access = await getDashboardAccessOrRedirect();

  return (
    <DashboardShell
      userRole={access.user.role}
      weddingRole={access.weddingRole}
    >
      {children}
    </DashboardShell>
  );
}
