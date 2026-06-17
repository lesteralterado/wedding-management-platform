import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCustomer } from "@/lib/auth/rbac";
import { getDashboardAccessOrRedirect, requireWeddingAccess } from "@/lib/wedding/current";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weddingId = searchParams.get("weddingId");

  if (!weddingId) {
    const access = await getDashboardAccessOrRedirect();
    const weddings = await prisma.wedding.findMany({
      where: { OR: [{ userId: access.user.id }, { staffRecords: { some: { userId: access.user.id } } }] },
      include: { guests: { include: { rsvp: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ weddings });
  }

  const access = await requireWeddingAccess(weddingId, "guests:read");
  return NextResponse.json({ wedding: access.wedding });
}

export async function POST(request: Request) {
  const body = await request.json();
  const access = await requireWeddingAccess(body.weddingId, "guests:write");

  const guest = await prisma.guest.create({
    data: {
      weddingId: access.wedding!.id,
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
