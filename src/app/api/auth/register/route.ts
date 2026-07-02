import { NextResponse } from "next/server";
import { registerSchema } from "@/features/auth/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    // Mock successful registration - no actual DB write
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}