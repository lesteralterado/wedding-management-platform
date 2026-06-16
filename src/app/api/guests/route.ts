import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCoupleAdmin } from "@/lib/auth/rbac";

export async function GET(request: Request) {
  const user = await requireCoupleAdmin();
  const { searchParams } = new URL(request.url);
  const weddingId = searchParams.get("weddingId");

  if (!weddingId) {
    const weddings = await prisma.wedding.findMany({ where: { userId: user.id }, include: { guests: { include: { rsvp: true } } } });
    return NextResponse.json({ weddings });
  }

  const wedding = await prisma.wedding.findFirst({
    where: { id: weddingId, userId: user.id },
    include: { guests: { include: { rsvp: true } } },
  });

  if (!wedding) return NextResponse.json({ error: "Wedding not found." }, { status: 404 });
  return NextResponse.json({ wedding });
}

export async function POST(request: Request) {
  const user = await requireCoupleAdmin();
  const body = await request.json();

  const wedding = await prisma.wedding.findFirst({ where: { id: body.weddingId, userId: user.id } });
  if (!wedding) return NextResponse.json({ error: "Wedding not found." }, { status: 404 });

  const guest = await prisma.guest.create({
    data: {
      weddingId: wedding.id,
      fullName: body.fullName,
      email: body.email || null,
      phone: body.phone || null,
      groupName: body.groupName || null,
      seatsAllowed: body.seatsAllowed,
      inviteCode: body.inviteCode || `invite-${Math.random().toString(36).slice(2, 10)}`,
    },
  });

  return NextResponse.json({ success: true, guest });
}
