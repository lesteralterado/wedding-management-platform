import { NextResponse } from "next/server";
import { bulkImportGuests } from "@/features/guests/actions";

export async function POST(request: Request) {
  const body = await request.json();

  const rows = body.rows ?? [];
  if (!Array.isArray(rows) || !rows.length) return NextResponse.json({ error: "No rows to import." }, { status: 400 });

  const result = await bulkImportGuests(rows);
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });
  return NextResponse.json(result);
}
