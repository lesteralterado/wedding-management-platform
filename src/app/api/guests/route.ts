import { NextResponse } from "next/server";
import { createGuest } from "@/features/guests/actions";
import { getGuests } from "@/features/guests/queries";
import { authorizeWedding } from "@/lib/wedding/current";

export async function GET() {
  const auth = await authorizeWedding("guests:read");
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const guests = await getGuests(auth.access.wedding.id);
  return NextResponse.json({ wedding: { id: auth.access.wedding.id }, guests });
}

export async function POST(request: Request) {
  const result = await createGuest(await request.json());
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });
  return NextResponse.json(result);
}
