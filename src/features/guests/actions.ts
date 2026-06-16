"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { generateInviteCode } from "./invite-code";
import { guestSchema, type ImportGuestRow } from "./schemas";

async function createGuestCore(weddingId: string, input: ImportGuestRow) {
  const parsed = guestSchema.safeParse({
    ...input,
    inviteCode: generateInviteCode(),
  });

  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const guest = await prisma.guest.create({
    data: {
      weddingId,
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      groupName: parsed.data.groupName || null,
      inviteCode: generateInviteCode(),
      seatsAllowed: parsed.data.seatsAllowed,
    },
  });

  return { success: true, guest };
}

export async function createGuest(weddingId: string, input: ImportGuestRow) {
  return createGuestCore(weddingId, input);
}

export async function updateGuest(id: string, input: ImportGuestRow) {
  const parsed = guestSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await prisma.guest.update({
    where: { id },
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      groupName: parsed.data.groupName || null,
      seatsAllowed: parsed.data.seatsAllowed,
    },
  });

  revalidatePath("/dashboard/guests");
  return { success: true };
}

export async function deleteGuest(id: string) {
  await prisma.guest.delete({ where: { id } });
  revalidatePath("/dashboard/guests");
  return { success: true };
}

export async function bulkImportGuests(weddingId: string, rows: ImportGuestRow[]) {
  const created: Array<{ weddingId: string; fullName: string; email?: string | null; phone?: string | null; groupName?: string | null; inviteCode: string; seatsAllowed: number }> = [];

  for (const row of rows) {
    const parsed = guestSchema.safeParse({ ...row, inviteCode: generateInviteCode() });
    if (!parsed.success) continue;

    created.push({
      weddingId,
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      groupName: parsed.data.groupName || null,
      inviteCode: generateInviteCode(),
      seatsAllowed: parsed.data.seatsAllowed,
    });
  }

  if (!created.length) return { error: { rows: ["No valid guests found."] } };

  await prisma.guest.createMany({ data: created });
  revalidatePath("/dashboard/guests");
  return { success: true, count: created.length };
}

export async function regenerateInviteCode(id: string) {
  const guest = await prisma.guest.update({
    where: { id },
    data: { inviteCode: generateInviteCode() },
  });

  revalidatePath("/dashboard/invitations");
  return { success: true, guest } as const;
}
