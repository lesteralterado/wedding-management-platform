import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const rows = body.rows ?? [];
  if (!Array.isArray(rows) || !rows.length) return NextResponse.json({ error: "No rows to import." }, { status: 400 });

  // Mock successful import - no actual DB write
  const importedGuests = rows.map((row: { fullName: string; email?: string; phone?: string; groupName?: string; seatsAllowed: number }) => ({
    id: `mock-import-${Math.random().toString(36).slice(2, 10)}`,
    weddingId: body.weddingId || "mock-wedding-001",
    fullName: row.fullName,
    email: row.email || null,
    phone: row.phone || null,
    groupName: row.groupName || null,
    seatsAllowed: row.seatsAllowed,
    inviteCode: `invite-${Math.random().toString(36).slice(2, 10)}`,
    qrCode: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    rsvp: null,
  }));

  return NextResponse.json({ success: true, guests: importedGuests, count: importedGuests.length });
}