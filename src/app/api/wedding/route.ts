import { NextResponse } from "next/server";
import { createWedding, updateWedding } from "@/features/wedding/actions";

export async function POST(request: Request) {
  const result = await createWedding(await request.json());
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });
  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const result = await updateWedding(await request.json());
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });
  return NextResponse.json(result);
}
