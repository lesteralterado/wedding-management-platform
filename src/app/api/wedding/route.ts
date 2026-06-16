import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCoupleAdmin } from "@/lib/auth/rbac";
import { createWedding, updateWedding } from "@/features/wedding/actions";

export async function POST(request: Request) {
  const user = await requireCoupleAdmin();
  const body = await request.json();

  const result = await createWedding({ ...body, userId: user.id });
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ success: true, wedding: result.wedding });
}

export async function PUT(request: Request) {
  const user = await requireCoupleAdmin();
  const body = await request.json();

  const result = await updateWedding(body.id, user.id, body);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ success: true });
}
