import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getMockUser } from "@/lib/demo/demo-data";
import { isDemoMode, getDemoRole } from "./demo";
import type { AuthUser, UserRole, WeddingRole } from "@/types/domain";

export { ALL_PERMISSIONS, canAccessRole, getPermissions, hasPermission } from "./permissions";

export async function requireUser() {
  if (await isDemoMode()) {
    const demoRole = (await getDemoRole()) as UserRole | null;
    return getMockUser(demoRole || "CUSTOMER");
  }
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

/** The signed-in couple or staff member, without redirecting. Null when signed out or a platform admin. */
export async function getCustomer(): Promise<AuthUser | null> {
  if (await isDemoMode()) return getMockUser("CUSTOMER");

  const session = await auth();
  const user = session?.user;
  if (!user || (user.role !== "CUSTOMER" && user.role !== "STAFF")) return null;
  return { id: user.id, role: user.role, name: user.name ?? "", email: user.email ?? "" };
}

export async function requireCustomer() {
  if (await isDemoMode()) {
    return getMockUser("CUSTOMER");
  }
  const user = await requireUser();
  if (user.role === "SUPER_ADMIN") redirect("/platform");
  if (user.role !== "CUSTOMER" && user.role !== "STAFF") redirect("/login");
  return user;
}

export async function requireSuperAdmin() {
  if (await isDemoMode()) {
    const demoRole = await getDemoRole();
    if (demoRole === "SUPER_ADMIN") {
      return getMockUser("SUPER_ADMIN");
    }
  }
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN") redirect("/dashboard");
  return user;
}

/** The creator of a wedding is its OWNER; everyone else needs a WeddingStaff record. */
export async function getWeddingStaffRole(userId: string, wedding: { id: string; userId: string }): Promise<WeddingRole | null> {
  if (wedding.userId === userId) return "OWNER";

  const staff = await prisma.weddingStaff.findUnique({
    where: { userId_weddingId: { userId, weddingId: wedding.id } },
    select: { role: true },
  });

  return staff?.role ?? null;
}
