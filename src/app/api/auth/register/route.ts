import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerUser(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
