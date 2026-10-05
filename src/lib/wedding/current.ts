import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMockWedding, getMockPermissions } from "@/lib/demo/demo-data";
import { getCustomer, getPermissions, getWeddingStaffRole, hasPermission, requireCustomer } from "@/lib/auth/rbac";
import { isWeddingRole } from "@/lib/auth/permissions";
import { getDemoRole, isDemoMode } from "@/lib/auth/demo";
import type { AuthUser, Permission, WeddingRole } from "@/types/domain";
import type { Wedding } from "@prisma/client";

export type DashboardAccess = {
  user: AuthUser;
  wedding: Wedding | null;
  weddingRole: WeddingRole | null;
  permissions: Permission[];
  isDemo: boolean;
};

export type WeddingAccess = DashboardAccess & { wedding: Wedding; weddingRole: WeddingRole };

export type WeddingAccessResult =
  | { ok: true; access: WeddingAccess }
  | { ok: false; status: 401 | 403 | 404; message: string };

/**
 * Resolved once per request: the user, the wedding they work on, and what their role allows.
 * Null when signed out (or a platform admin, who has no wedding dashboard).
 */
export const getDashboardAccess = cache(async (): Promise<DashboardAccess | null> => {
  const user = await getCustomer();
  if (!user) return null;

  if (await isDemoMode()) {
    const demoRole = await getDemoRole();
    const weddingRole = isWeddingRole(demoRole) ? demoRole : "OWNER";
    return { user, wedding: getMockWedding(), weddingRole, permissions: getMockPermissions(weddingRole), isDemo: true };
  }

  const wedding = await prisma.wedding.findFirst({
    where: { OR: [{ userId: user.id }, { staffRecords: { some: { userId: user.id } } }] },
    orderBy: { createdAt: "desc" },
  });
  if (!wedding) return { user, wedding: null, weddingRole: null, permissions: [], isDemo: false };

  const weddingRole = await getWeddingStaffRole(user.id, wedding);
  return {
    user,
    wedding,
    weddingRole,
    permissions: weddingRole ? getPermissions(user.role, weddingRole) : [],
    isDemo: false,
  };
});

export async function getDashboardAccessOrRedirect(): Promise<DashboardAccess> {
  const access = await getDashboardAccess();
  if (!access) {
    await requireCustomer();
    redirect("/login");
  }
  return access;
}

export async function getCurrentWeddingOrRedirect() {
  return (await getDashboardAccessOrRedirect()).wedding;
}

/** For pages: redirect away unless the current user may do `permission` on their wedding. */
export async function requireWeddingAccess(permission: Permission): Promise<WeddingAccess> {
  const result = await authorizeWedding(permission);
  if (!result.ok) redirect(result.status === 401 ? "/login" : result.status === 404 ? "/onboarding" : "/dashboard");
  return result.access;
}

/**
 * For server actions and API routes: never redirects, so callers can answer with a proper error.
 * The wedding always comes from the session — never from a client-supplied id.
 */
export async function authorizeWedding(permission: Permission): Promise<WeddingAccessResult> {
  const access = await getDashboardAccess();
  if (!access) return { ok: false, status: 401, message: "Please sign in again." };
  if (!access.wedding || !access.weddingRole) return { ok: false, status: 404, message: "Create your wedding first." };
  if (!hasPermission(access.user.role, access.weddingRole, permission)) {
    return { ok: false, status: 403, message: "Your role can't make this change." };
  }
  return { ok: true, access: access as WeddingAccess };
}
