import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireCoupleAdmin } from "@/lib/auth/rbac";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireCoupleAdmin();

  return <DashboardShell>{children}</DashboardShell>;
}
