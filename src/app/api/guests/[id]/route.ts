import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireWeddingAccess } from "@/lib/wedding/current";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const guest = await prisma.guest.findUnique({ where: { id }, include: { wedding: true } });
  if (!guest) return NextResponse.json({ error: "Guest not found." }, { status: 404 });

  await requireWeddingAccess(guest.weddingId, "guests:write");

  const updated = await prisma.guest.update({
    where: { id },
    data: {
      fullName: body.fullName,
      email: body.email || null,
      phone: body.phone || null,
      groupName: body.groupName || null,
      seatsAllowed: body.seatsAllowed,
    },
  });

  return NextResponse.json({ success: true, guest: updated });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guest = await prisma.guest.findUnique({ where: { id }, include: { wedding: true } });
  if (!guest) return NextResponse.json({ error: "Guest not found." }, { status: 404 });

  await requireWeddingAccess(guest.weddingId, "guests:write");

  await prisma.guest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
