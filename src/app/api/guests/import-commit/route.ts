import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireWeddingAccess } from "@/lib/wedding/current";

export async function POST(request: Request) {
  const body = await request.json();
  const access = await requireWeddingAccess(body.weddingId, "guests:write");

  const rows = body.rows ?? [];
  if (!Array.isArray(rows) || !rows.length) return NextResponse.json({ error: "No rows to import." }, { status: 400 });

  const guests = rows.map((row: { fullName: string; email?: string; phone?: string; groupName?: string; seatsAllowed: number }) => ({
    weddingId: access.wedding!.id,
    fullName: row.fullName,
    email: row.email || null,
    phone: row.phone || null,
    groupName: row.groupName || null,
    seatsAllowed: row.seatsAllowed,
    inviteCode: `invite-${Math.random().toString(36).slice(2, 10)}`,
  }));

  await prisma.guest.createMany({ data: guests });

  return NextResponse.json({ success: true, count: guests.length });
}
