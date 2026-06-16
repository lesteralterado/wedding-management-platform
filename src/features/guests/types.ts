import type { Guest, Rsvp, Wedding } from "@prisma/client";

export type GuestWithRsvp = Guest & { rsvp: Rsvp | null; wedding?: Wedding | null };
export type GuestWithEmail = Guest & { weddingId: string };
