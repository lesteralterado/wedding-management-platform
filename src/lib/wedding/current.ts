import { redirect } from "next/navigation";
import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMockPermissions, getMockWedding, getMockWeddingStaffRole } from "@/lib/demo/demo-data";
import { getPermissions, getWeddingStaffRole, hasPermission, requireCustomer } from "@/lib/auth/rbac";
import { isDemoMode, getDemoRole } from "@/lib/auth/demo";
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
  if (await isDemoMode()) {
    const demoRole = (await getDemoRole()) as WeddingRole | null;
    return {
      user: requireCustomerFromDemo(),
      wedding: getMockWedding(),
      weddingRole: demoRole,
      permissions: getMockPermissions(demoRole),
    };
  }

  const user = await requireCustomer();
  const wedding = await prisma.wedding.findFirst({
    where: { OR: [{ userId: user.id }, { staffRecords: { some: { userId: user.id } } }] },
    include: { guests: { include: { rsvp: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (!wedding) return { user, wedding: null, weddingRole: null, permissions: [] };

  const weddingRole = await getWeddingStaffRole(user.id, wedding.id);
  if (!weddingRole) return { user, wedding, weddingRole: null, permissions: [] };

  return {
    user,
    wedding,
    weddingRole,
    permissions: getPermissions(user.role, weddingRole),
  };
}

export async function getCurrentWeddingOrRedirect() {
  return (await getDashboardAccessOrRedirect()).wedding;
}

export async function requireWeddingAccess(weddingId: string, permission: Permission): Promise<DashboardAccess> {
  const access = await getDashboardAccessOrRedirect();

  if (!access.wedding || access.wedding.id !== weddingId) {
    redirect("/dashboard/wedding");
  }

  if (!hasPermission(access.user.role, access.weddingRole, permission)) {
    redirect("/dashboard");
  }

  return access;
}

function requireCustomerFromDemo(): AuthUser {
  return {
    id: "mock-user-001",
    name: "Cherilyn & Lester Admin",
    email: "admin@example.com",
    role: "CUSTOMER",
  };
}
