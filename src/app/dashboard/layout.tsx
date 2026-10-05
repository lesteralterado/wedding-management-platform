import * as React from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getTemplateInfo } from "@/templates/catalog";
import { getDashboardAccessOrRedirect } from "@/lib/wedding/current";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const access = await getDashboardAccessOrRedirect();

  // A couple without a wedding yet starts with the onboarding wizard. Staff accounts are only
  // ever invited to an existing wedding, so they never create one.
  if (!access.wedding && access.user.role === "CUSTOMER") redirect("/onboarding");

  const wedding = access.wedding
    ? { names: `${access.wedding.brideName} & ${access.wedding.groomName}`, templateName: getTemplateInfo(access.wedding.templateId).name }
    : null;

  return (
    <DashboardShell userRole={access.user.role} weddingRole={access.weddingRole} isDemo={access.isDemo} wedding={wedding}>
      {children}
    </DashboardShell>
  );
}
