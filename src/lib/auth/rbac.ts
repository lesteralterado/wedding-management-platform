import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import type { UserRole } from "@/types/domain";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function requireCoupleAdmin() {
  const user = await requireUser();
  if (user.role !== "COUPLE_ADMIN") redirect("/login");
  return user;
}

export function canAccessRole(userRole: UserRole, requiredRole: UserRole) {
  if (requiredRole === "EVENT_STAFF") return userRole === "EVENT_STAFF" || userRole === "COUPLE_ADMIN";
  return userRole === requiredRole;
}
