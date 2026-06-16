import { NextResponse } from "next/server";
import { parseGuestFile } from "@/features/guests/csv";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "CSV or Excel file is required." }, { status: 400 });

  const rows = await parseGuestFile(file);

  return NextResponse.json({ rows });
}
