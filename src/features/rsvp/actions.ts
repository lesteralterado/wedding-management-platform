"use server";

import { rsvpSchema } from "../guests/schemas";
import { getMockGuests } from "@/lib/demo/demo-data";

const mockGuests = getMockGuests();

export async function submitRsvp(inviteCode: string, input: {
  status: "GOING" | "PENDING" | "DECLINED";
  guestCount: number;
  note?: string;
}) {
  const parsed = rsvpSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  // Find mock guest by inviteCode
  const guest = mockGuests.find((g) => g.inviteCode === inviteCode);
  if (!guest) return { error: { inviteCode: ["Invitation not found."] } };
  if (parsed.data.guestCount > guest.seatsAllowed) {
    return { error: { guestCount: [`Guest count cannot exceed ${guest.seatsAllowed}.`] } };
  }

  // Mock successful RSVP submission (no actual DB write)
  return { success: true };
}