import { redirect } from "next/navigation";
import "server-only";
import { getMockWedding, getMockPermissions } from "@/lib/demo/demo-data";
import { hasPermission, requireCustomer } from "@/lib/auth/rbac";
import { getDemoRole } from "@/lib/auth/demo";
import type { AuthUser, Permission, WeddingRole } from "@/types/domain";
import type { Guest, Rsvp, Wedding } from "@prisma/client";

type WeddingWithGuests = Wedding & { guests: (Guest & { rsvp: Rsvp | null })[] };

export type DashboardAccess = {
  user: AuthUser;
  wedding: WeddingWithGuests | null;
  weddingRole: WeddingRole | null;
  permissions: Permission[];
};

export async function getDashboardAccessOrRedirect(): Promise<DashboardAccess> {
  const demoRole = (await getDemoRole()) as WeddingRole | null;
  const user = await requireCustomer();

  return {
    user,
    wedding: getMockWedding(),
    weddingRole: demoRole ?? "OWNER",
    permissions: getMockPermissions(demoRole ?? "OWNER"),
  };
}

export async function getCurrentWeddingOrRedirect() {
  return (await getDashboardAccessOrRedirect()).wedding;
}

export async function requireWeddingAccess(weddingId: string, permission: Permission): Promise<DashboardAccess> {
  const access = await getDashboardAccessOrRedirect();

  // For demo mode, skip wedding ownership check and just validate permissions
  if (!hasPermission(access.user.role, access.weddingRole, permission)) {
    redirect("/dashboard");
  }

  return access;
}