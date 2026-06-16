import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCoupleAdmin } from "@/lib/auth/rbac";

export async function POST(request: Request) {
  const user = await requireCoupleAdmin();
  const body = await request.json();

  const wedding = await prisma.wedding.findFirst({ where: { id: body.weddingId, userId: user.id } });
  if (!wedding) return NextResponse.json({ error: "Wedding not found." }, { status: 404 });

  const rows = body.rows ?? [];
  if (!Array.isArray(rows) || !rows.length) return NextResponse.json({ error: "No rows to import." }, { status: 400 });

  const guests = rows.map((row: { fullName: string; email?: string; phone?: string; groupName?: string; seatsAllowed: number }) => ({
    weddingId: wedding.id,
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
