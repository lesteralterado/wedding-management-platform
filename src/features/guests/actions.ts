"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { authorizeWedding } from "@/lib/wedding/current";
import { generateInviteCode } from "./invite-code";
import { guestSchema, type ImportGuestRow } from "./schemas";

// Every action resolves the wedding from the session and scopes writes to it,
// so a guest id from another wedding simply isn't found.

function toGuestData(data: ImportGuestRow) {
  return {
    fullName: data.fullName,
    email: data.email || null,
    phone: data.phone || null,
    groupName: data.groupName || null,
    seatsAllowed: data.seatsAllowed,
  };
}

function revalidateGuestPages() {
  revalidatePath("/dashboard", "layout");
}

export async function createGuest(input: ImportGuestRow) {
  const auth = await authorizeWedding("guests:write");
  if (!auth.ok) return { error: { form: [auth.message] }, status: auth.status };

  const parsed = guestSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  if (auth.access.isDemo) return { success: true };

  const guest = await prisma.guest.create({
    data: { ...toGuestData(parsed.data), weddingId: auth.access.wedding.id, inviteCode: generateInviteCode() },
  });

  revalidateGuestPages();
  return { success: true, guest };
}

export async function updateGuest(id: string, input: ImportGuestRow) {
  const auth = await authorizeWedding("guests:write");
  if (!auth.ok) return { error: { form: [auth.message] }, status: auth.status };

  const parsed = guestSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  if (auth.access.isDemo) return { success: true };

  const { count } = await prisma.guest.updateMany({
    where: { id, weddingId: auth.access.wedding.id },
    data: toGuestData(parsed.data),
  });
  if (!count) return { error: { form: ["Guest not found."] }, status: 404 as const };

  revalidateGuestPages();
  return { success: true };
}

export async function deleteGuest(id: string) {
  const auth = await authorizeWedding("guests:write");
  if (!auth.ok) return { error: { form: [auth.message] }, status: auth.status };
  if (auth.access.isDemo) return { success: true };

  const { count } = await prisma.guest.deleteMany({ where: { id, weddingId: auth.access.wedding.id } });
  if (!count) return { error: { form: ["Guest not found."] }, status: 404 as const };

  revalidateGuestPages();
  return { success: true };
}

export async function bulkImportGuests(rows: ImportGuestRow[]) {
  const auth = await authorizeWedding("guests:write");
  if (!auth.ok) return { error: { form: [auth.message] }, status: auth.status };

  const weddingId = auth.access.wedding.id;
  const valid = rows.flatMap((row) => {
    const parsed = guestSchema.safeParse(row);
    return parsed.success ? [{ ...toGuestData(parsed.data), weddingId, inviteCode: generateInviteCode() }] : [];
  });

  if (!valid.length) return { error: { rows: ["No valid guests found."] } };
  if (auth.access.isDemo) return { success: true, count: valid.length, skipped: rows.length - valid.length };

  await prisma.guest.createMany({ data: valid });
  revalidateGuestPages();
  return { success: true, count: valid.length, skipped: rows.length - valid.length };
}

export async function regenerateInviteCode(id: string) {
  const auth = await authorizeWedding("guests:write");
  if (!auth.ok) return { success: false, error: auth.message };
  if (auth.access.isDemo) return { success: true };

  // The stored QR encodes the old link, so clear it; it is regenerated on demand.
  const { count } = await prisma.guest.updateMany({
    where: { id, weddingId: auth.access.wedding.id },
    data: { inviteCode: generateInviteCode(), qrCode: null },
  });
  if (!count) return { success: false, error: "Guest not found." };

  revalidateGuestPages();
  return { success: true };
}
