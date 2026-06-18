import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireSuperAdmin } from "@/lib/auth/rbac";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  await requireSuperAdmin();

  return <DashboardShell userRole="SUPER_ADMIN" weddingRole={null}>{children}</DashboardShell>;
}
