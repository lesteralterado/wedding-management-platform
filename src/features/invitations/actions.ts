"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getMockGuests } from "@/lib/demo/demo-data";
import { generateQrSvg } from "@/lib/qr/generate";
import { sendInviteEmail, sendBulkInvites } from "@/lib/email/sendgrid";
import { authorizeWedding } from "@/lib/wedding/current";
import { inviteUrl } from "./links";

export async function generateGuestQr(guestId: string) {
  const auth = await authorizeWedding("invitations:write");
  if (!auth.ok) return { error: { guestId: [auth.message] } };

  if (auth.access.isDemo) {
    const guest = getMockGuests().find((g) => g.id === guestId);
    if (!guest) return { error: { guestId: ["Guest not found."] } };
    const url = inviteUrl(guest.inviteCode);
    return { success: true, qrCode: await generateQrSvg(url), inviteUrl: url };
  }

  const guest = await prisma.guest.findFirst({ where: { id: guestId, weddingId: auth.access.wedding.id } });
  if (!guest) return { error: { guestId: ["Guest not found."] } };

  const url = inviteUrl(guest.inviteCode);
  const qrCode = await generateQrSvg(url);

  await prisma.guest.update({
    where: { id: guest.id },
    data: { qrCode },
  });

  revalidatePath("/dashboard/invitations");
  return { success: true, qrCode, inviteUrl: url };
}

export async function sendSingleInvite(guestId: string) {
  const auth = await authorizeWedding("invitations:write");
  if (!auth.ok) return { success: false as const, error: auth.message };
  if (auth.access.isDemo) return { success: false as const, error: "Emails aren't sent in demo mode." };

  const { wedding } = auth.access;
  const guest = await prisma.guest.findFirst({ where: { id: guestId, weddingId: wedding.id } });

  if (!guest) return { success: false as const, error: "Guest not found." };
  if (!guest.email) return { success: false as const, error: "Guest has no email address." };

  const result = await sendInviteEmail({
    to: guest.email,
    guestName: guest.fullName,
    coupleNames: `${wedding.brideName} & ${wedding.groomName}`,
    weddingDate: wedding.date.toLocaleDateString(),
    weddingVenue: wedding.venue || undefined,
    inviteUrl: inviteUrl(guest.inviteCode),
  });

  if (result.success) {
    revalidatePath("/dashboard/invitations");
    return { success: true as const };
  }
  return { success: false as const, error: result.error };
}

export async function sendBulkInvitesAction() {
  const auth = await authorizeWedding("invitations:write");
  if (!auth.ok || auth.access.isDemo) return { success: 0, failed: 0 };

  const { wedding } = auth.access;
  const guests = await prisma.guest.findMany({ where: { weddingId: wedding.id, email: { not: null } } });

  const result = await sendBulkInvites(guests.map((guest) => ({
    to: guest.email!,
    guestName: guest.fullName,
    coupleNames: `${wedding.brideName} & ${wedding.groomName}`,
    weddingDate: wedding.date.toLocaleDateString(),
    weddingVenue: wedding.venue || undefined,
    inviteUrl: inviteUrl(guest.inviteCode),
  })));

  revalidatePath("/dashboard/invitations");
  return result;
}
