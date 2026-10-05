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

export const WEDDING_ROLES: WeddingRole[] = ["OWNER", "CO_ORGANIZER", "PLANNER", "STAFF", "RECEPTIONIST", "PHOTOGRAPHER"];

export function isWeddingRole(value: unknown): value is WeddingRole {
  return typeof value === "string" && (WEDDING_ROLES as string[]).includes(value);
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
