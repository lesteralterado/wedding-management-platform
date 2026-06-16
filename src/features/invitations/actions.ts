"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { generateQrSvg } from "@/lib/qr/generate";
import { sendInviteEmail, sendBulkInvites } from "@/lib/email/sendgrid";

export async function generateGuestQr(guestId: string) {
  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest) return { error: { guestId: ["Guest not found."] } };

  const url = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/invite/${guest.inviteCode}`;
  const qrCode = await generateQrSvg(url);

  await prisma.guest.update({
    where: { id: guestId },
    data: { qrCode },
  });

  revalidatePath("/dashboard/invitations");
  return { success: true, qrCode, inviteUrl: url };
}

export async function sendSingleInvite(guestId: string) {
  const guest = await prisma.guest.findUnique({
    where: { id: guestId },
    include: { wedding: true },
  });

  if (!guest) return { success: false as const, error: "Guest not found." };
  if (!guest.email) return { success: false as const, error: "Guest has no email address." };
  if (!guest.wedding) return { success: false as const, error: "Wedding not found." };

  const inviteUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/invite/${guest.inviteCode}`;
  const coupleNames = `${guest.wedding.brideName} & ${guest.wedding.groomName}`;

  const result = await sendInviteEmail({
    to: guest.email,
    guestName: guest.fullName,
    coupleNames,
    weddingDate: guest.wedding.date ? guest.wedding.date.toLocaleDateString() : undefined,
    weddingVenue: guest.wedding.venue || undefined,
    inviteUrl,
  });

  if (result.success) {
    revalidatePath("/dashboard/invitations");
    return { success: true as const };
  }
  return { success: false as const, error: result.error };
}

export async function sendBulkInvitesAction(weddingId: string) {
  const guests = await prisma.guest.findMany({
    where: { weddingId },
    include: { wedding: true },
  });

  const guestsWithEmail = guests.filter((g) => g.email && g.wedding);
  const inviteInputs = guestsWithEmail.map((guest) => ({
    to: guest.email!,
    guestName: guest.fullName,
    coupleNames: `${guest.wedding!.brideName} & ${guest.wedding!.groomName}`,
    weddingDate: guest.wedding!.date ? guest.wedding!.date.toLocaleDateString() : undefined,
    weddingVenue: guest.wedding!.venue || undefined,
    inviteUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/invite/${guest.inviteCode}`,
  }));

  const result = await sendBulkInvites(inviteInputs);
  revalidatePath("/dashboard/invitations");
  return result;
}
