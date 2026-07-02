import { NextResponse } from "next/server";
import { getMockGuests } from "@/lib/demo/demo-data";

const mockGuests = getMockGuests();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  // Find mock guest
  const guest = mockGuests.find((g) => g.id === id);
  if (!guest) return NextResponse.json({ error: "Guest not found." }, { status: 404 });

  const updated = {
    ...guest,
    ...body,
    email: body.email ?? guest.email,
    phone: body.phone ?? guest.phone,
    groupName: body.groupName ?? guest.groupName,
    seatsAllowed: body.seatsAllowed ?? guest.seatsAllowed,
    updatedAt: new Date(),
  };

  return NextResponse.json({ success: true, guest: updated });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Check guest exists (mock)
  const guest = mockGuests.find((g) => g.id === id);
  if (!guest) return NextResponse.json({ error: "Guest not found." }, { status: 404 });

  return NextResponse.json({ success: true });
}