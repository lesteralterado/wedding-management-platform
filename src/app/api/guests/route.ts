import { NextResponse } from "next/server";
import { getMockWedding, getMockGuests } from "@/lib/demo/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weddingId = searchParams.get("weddingId");
  const search = searchParams.get("search")?.trim() || "";
  const group = searchParams.get("group")?.trim() || "all";

  const wedding = {
    ...getMockWedding(),
    guests: getMockGuests(),
  };

  const filteredGuests = wedding.guests.filter((guest) => {
    const matchesSearch = guest.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = group === "all" || guest.groupName === group;
    return matchesSearch && matchesGroup;
  });

  const result = weddingId ? { wedding: { ...wedding, guests: filteredGuests } } : { weddings: [{ ...wedding, guests: filteredGuests }] };

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : null;
    const phone = typeof body.phone === "string" ? body.phone.trim() : null;
    const groupName = typeof body.groupName === "string" ? body.groupName.trim() : null;
    const seatsAllowed = typeof body.seatsAllowed === "number" ? Math.max(1, body.seatsAllowed) : 1;
    const weddingId = typeof body.weddingId === "string" ? body.weddingId.trim() : "mock-wedding-001";

    if (fullName.length < 2) {
      return NextResponse.json({ error: "Full name must be at least 2 characters." }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const guest = {
      id: `mock-${Math.random().toString(36).slice(2, 10)}`,
      weddingId,
      fullName,
      email,
      phone,
      groupName,
      seatsAllowed,
      inviteCode: `invite-${Math.random().toString(36).slice(2, 10)}`,
      qrCode: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      rsvp: null,
    };

    return NextResponse.json({ success: true, guest });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
