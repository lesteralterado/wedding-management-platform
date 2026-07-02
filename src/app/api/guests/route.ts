import { NextResponse } from "next/server";
import { getMockWedding, getMockGuests } from "@/lib/demo/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weddingId = searchParams.get("weddingId");

  // Return wedding with guests for demo/mock mode
  const wedding = {
    ...getMockWedding(),
    guests: getMockGuests(),
  };

  // If weddingId is provided, return the wedding (wedding is already mock)
  if (weddingId) {
    return NextResponse.json({ wedding });
  }

  // Otherwise return all weddings array (for demo)
  return NextResponse.json({ weddings: [wedding] });
}

export async function POST(request: Request) {
  const body = await request.json();

  // Generate mock guest response
  const guest = {
    id: `mock-${Math.random().toString(36).slice(2, 10)}`,
    weddingId: body.weddingId || "mock-wedding-001",
    fullName: body.fullName || "New Guest",
    email: body.email || null,
    phone: body.phone || null,
    groupName: body.groupName || null,
    seatsAllowed: body.seatsAllowed || 1,
    inviteCode: body.inviteCode || `invite-${Math.random().toString(36).slice(2, 10)}`,
    qrCode: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    rsvp: null,
  };

  return NextResponse.json({ success: true, guest });
}