import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getMockGuests } from "@/lib/demo/demo-data";
import { inviteUrl } from "@/features/invitations/links";
import { generateQrSvg } from "@/lib/qr/generate";
import { authorizeWedding } from "@/lib/wedding/current";

export async function GET(_request: Request, { params }: { params: Promise<{ guestId: string }> }) {
  const { guestId } = await params;

  const auth = await authorizeWedding("invitations:read");
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const guest = auth.access.isDemo
    ? getMockGuests().find((g) => g.id === guestId)
    : await prisma.guest.findFirst({ where: { id: guestId, weddingId: auth.access.wedding.id }, select: { inviteCode: true } });
  if (!guest) return NextResponse.json({ error: "Guest not found." }, { status: 404 });

  const qrCode = await generateQrSvg(inviteUrl(guest.inviteCode));
  return NextResponse.json({ qrCode });
}
