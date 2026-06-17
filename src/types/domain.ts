export type UserRole = "SUPER_ADMIN" | "CUSTOMER" | "STAFF";
export type WeddingRole = "OWNER" | "CO_ORGANIZER" | "PLANNER" | "STAFF" | "RECEPTIONIST" | "PHOTOGRAPHER";
export type Permission =
  | "dashboard:read"
  | "wedding:read"
  | "wedding:write"
  | "guests:read"
  | "guests:write"
  | "invitations:read"
  | "invitations:write"
  | "rsvps:read"
  | "gallery:read"
  | "gallery:write"
  | "analytics:read"
  | "settings:write"
  | "checkin:read"
  | "platform:read"
  | "platform:write";
export type WeddingStatus = "PLANNING" | "ENGAGED" | "CONFIRMED" | "COMPLETED";
export type RsvpStatus = "PENDING" | "GOING" | "DECLINED";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
