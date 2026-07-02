import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = typeof body.role === "string" ? body.role : null;

    if (!role) {
      return NextResponse.json({ error: "Role is required." }, { status: 400 });
    }

    const allowed = ["CUSTOMER", "STAFF", "SUPER_ADMIN"];
    if (!allowed.includes(role)) {
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
