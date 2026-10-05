import type { RsvpStatus } from "@/types/domain";

export type GuestCountResult =
  | { ok: true; guestCount: number }
  | { ok: false; message: string };

/** How many people a response reserves. Declining always frees every seat. */
export function resolveGuestCount(status: RsvpStatus, guestCount: number, seatsAllowed: number): GuestCountResult {
  if (status === "DECLINED") return { ok: true, guestCount: 0 };
  if (status === "GOING" && guestCount < 1) return { ok: false, message: "Let us know how many of you will attend." };
  if (guestCount > seatsAllowed) {
    return { ok: false, message: `Your invitation has ${seatsAllowed} seat${seatsAllowed === 1 ? "" : "s"}.` };
  }
  return { ok: true, guestCount };
}
