import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { getMockUser } from "@/lib/demo/demo-data";
import { isDemoMode, getDemoRole } from "./demo";
import type { Permission, UserRole, WeddingRole } from "@/types/domain";

export const ALL_PERMISSIONS: Permission[] = [
  "dashboard:read",
  "wedding:read",
  "wedding:write",
  "guests:read",
  "guests:write",
  "invitations:read",
  "invitations:write",
  "rsvps:read",
  "gallery:read",
  "gallery:write",
  "analytics:read",
  "settings:write",
  "checkin:read",
  "platform:read",
  "platform:write",
];

export async function requireUser() {
  if (await isDemoMode()) {
    const demoRole = (await getDemoRole()) as UserRole | null;
    return getMockUser(demoRole || "CUSTOMER");
  }
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
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

export async function getWeddingStaffRole(): Promise<WeddingRole | null> {
  // Always return mock role (OWNER for demo)
  return "OWNER";
}

export function hasPermission(userRole: UserRole, weddingRole: WeddingRole | null, permission: Permission) {
  if (userRole === "SUPER_ADMIN") return true;

  const allowed = getPermissionSet(weddingRole);
  return allowed.has(permission);
}

export function getPermissions(userRole: UserRole, weddingRole: WeddingRole | null): Permission[] {
  return ALL_PERMISSIONS.filter((permission) => hasPermission(userRole, weddingRole, permission));
}

export function canAccessRole(userRole: UserRole, requiredRole: UserRole) {
  if (requiredRole === "SUPER_ADMIN") return userRole === "SUPER_ADMIN";
  if (requiredRole === "CUSTOMER") return userRole === "CUSTOMER" || userRole === "SUPER_ADMIN";
  return userRole === requiredRole;
}

function getPermissionSet(weddingRole: WeddingRole | null): Set<Permission> {
  switch (weddingRole) {
    case "OWNER":
    case "CO_ORGANIZER":
      return new Set<Permission>([
        "dashboard:read",
        "wedding:read",
        "wedding:write",
        "guests:read",
        "guests:write",
        "invitations:read",
        "invitations:write",
        "rsvps:read",
        "gallery:read",
        "gallery:write",
        "analytics:read",
        "settings:write",
        "checkin:read",
      ]);
    case "PLANNER":
      return new Set<Permission>(["dashboard:read", "wedding:read", "guests:read", "guests:write", "rsvps:read", "analytics:read"]);
    case "STAFF":
    case "RECEPTIONIST":
      return new Set<Permission>(["dashboard:read", "guests:read", "rsvps:read", "checkin:read"]);
    case "PHOTOGRAPHER":
      return new Set<Permission>(["gallery:read"]);
    default:
      return new Set<Permission>();
  }
}