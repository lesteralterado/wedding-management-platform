export type UserRole = "COUPLE_ADMIN" | "EVENT_STAFF";
export type WeddingStatus = "PLANNING" | "ENGAGED" | "CONFIRMED" | "COMPLETED";
export type RsvpStatus = "PENDING" | "GOING" | "DECLINED";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
