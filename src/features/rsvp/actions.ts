"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { isDatabaseUnavailable } from "@/lib/db/availability";
import { getMockGuests } from "@/lib/demo/demo-data";
import { rsvpSchema } from "../guests/schemas";
import { resolveGuestCount } from "./rules";

export async function submitRsvp(inviteCode: string, input: {
  status: "GOING" | "PENDING" | "DECLINED";
  guestCount: number;
  note?: string;
}) {
  const parsed = rsvpSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  let guest: { id: string; seatsAllowed: number } | null;
  let isDemo = false;
  try {
    guest = await prisma.guest.findUnique({ where: { inviteCode }, select: { id: true, seatsAllowed: true } });
  } catch (error) {
    // Demo invitations still "accept" a response on deployments without a database.
    if (!isDatabaseUnavailable(error)) throw error;
    guest = getMockGuests().find((g) => g.inviteCode === inviteCode) ?? null;
    isDemo = true;
  }

  if (!guest) return { error: { inviteCode: ["Invitation not found."] } };

  const count = resolveGuestCount(parsed.data.status, parsed.data.guestCount, guest.seatsAllowed);
  if (!count.ok) return { error: { guestCount: [count.message] } };
  if (isDemo) return { success: true };

  const response = {
    status: parsed.data.status,
    guestCount: count.guestCount,
    note: parsed.data.note || null,
    submittedAt: new Date(),
  };

  await prisma.rsvp.upsert({
    where: { guestId: guest.id },
    create: { guestId: guest.id, ...response },
    update: response,
  });

  revalidatePath(`/invite/${inviteCode}`);
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
