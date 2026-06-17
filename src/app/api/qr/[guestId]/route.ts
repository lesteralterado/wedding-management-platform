import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireWeddingAccess } from "@/lib/wedding/current";
import { generateQrSvg } from "@/lib/qr/generate";

export async function GET(request: Request, { params }: { params: Promise<{ guestId: string }> }) {
  const { guestId } = await params;
  const guest = await prisma.guest.findUnique({ where: { id: guestId }, include: { wedding: true } });
  if (!guest) return NextResponse.json({ error: "Guest not found." }, { status: 404 });

  await requireWeddingAccess(guest.weddingId, "invitations:write");

  const qrCode = await generateQrSvg(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/invite/${guest.inviteCode}`);
  await prisma.guest.update({ where: { id: guest.id }, data: { qrCode } });

  return NextResponse.json({ qrCode });
}
