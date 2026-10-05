import { NextResponse } from "next/server";
import { isWeddingRole } from "@/lib/auth/permissions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = typeof body.role === "string" ? body.role : null;

    if (!role) {
      return NextResponse.json({ error: "Role is required." }, { status: 400 });
    }

    // The role switcher offers the wedding roles plus the platform admin.
    if (!isWeddingRole(role) && role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, role });
    response.cookies.set("demo-role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
