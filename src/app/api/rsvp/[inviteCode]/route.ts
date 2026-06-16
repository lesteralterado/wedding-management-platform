import { NextResponse } from "next/server";
import { submitRsvp } from "@/features/rsvp/actions";

export async function POST(request: Request, { params }: { params: Promise<{ inviteCode: string }> }) {
  const { inviteCode } = await params;
  const body = await request.json();
  const result = await submitRsvp(inviteCode, body);

  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
