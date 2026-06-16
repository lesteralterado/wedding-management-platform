import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCoupleAdmin } from "@/lib/auth/rbac";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireCoupleAdmin();
  const { id } = await params;
  const body = await request.json();

  const guest = await prisma.guest.findUnique({ where: { id }, include: { wedding: true } });
  if (!guest || guest.wedding.userId !== user.id) return NextResponse.json({ error: "Guest not found." }, { status: 404 });

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
  const user = await requireCoupleAdmin();
  const { id } = await params;
  const guest = await prisma.guest.findUnique({ where: { id }, include: { wedding: true } });
  if (!guest || guest.wedding.userId !== user.id) return NextResponse.json({ error: "Guest not found." }, { status: 404 });

  await prisma.guest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
