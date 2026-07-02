import { NextResponse } from "next/server";
import { generateQrSvg } from "@/lib/qr/generate";
import { getMockGuests } from "@/lib/demo/demo-data";

const mockGuests = getMockGuests();

export async function GET(request: Request, { params }: { params: Promise<{ guestId: string }> }) {
  const { guestId } = await params;

  // Find mock guest
  const guest = mockGuests.find((g) => g.id === guestId);
  if (!guest) return NextResponse.json({ error: "Guest not found." }, { status: 404 });

  const inviteUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/invite/${guest.inviteCode}`;
  const qrCode = await generateQrSvg(inviteUrl);

  return NextResponse.json({ qrCode });
}