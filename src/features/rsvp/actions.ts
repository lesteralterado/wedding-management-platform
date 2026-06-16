"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { rsvpSchema } from "../guests/schemas";

export async function submitRsvp(inviteCode: string, input: {
  status: "GOING" | "PENDING" | "DECLINED";
  guestCount: number;
  note?: string;
}) {
  const parsed = rsvpSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const guest = await prisma.guest.findUnique({
    where: { inviteCode },
    include: { rsvp: true },
  });

  if (!guest) return { error: { inviteCode: ["Invitation not found."] } };
  if (parsed.data.guestCount > guest.seatsAllowed) {
    return { error: { guestCount: [`Guest count cannot exceed ${guest.seatsAllowed}.`] } };
  }

  await prisma.rsvp.upsert({
    where: { guestId: guest.id },
    create: {
      guestId: guest.id,
      status: parsed.data.status,
      guestCount: parsed.data.guestCount,
      note: parsed.data.note || null,
      submittedAt: new Date(),
    },
    update: {
      status: parsed.data.status,
      guestCount: parsed.data.guestCount,
      note: parsed.data.note || null,
      submittedAt: new Date(),
    },
  });

  revalidatePath(`/invite/${inviteCode}`);
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/rsvps");
  return { success: true };
}
