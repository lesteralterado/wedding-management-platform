import { NextResponse } from "next/server";
import type { UserRole, WeddingRole } from "@/types/domain";

const WEDDING_ROLES: WeddingRole[] = ["OWNER", "CO_ORGANIZER", "PLANNER", "STAFF", "RECEPTIONIST", "PHOTOGRAPHER"];
const ALL_ROLES: (UserRole | WeddingRole)[] = ["SUPER_ADMIN", ...WEDDING_ROLES];

export async function GET() {
  return NextResponse.json({
    roles: ALL_ROLES.map((r) => ({ value: r, label: r.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) })),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({ role: null }));
    const role = typeof body.role === "string" ? body.role : null;

    if (!role || !ALL_ROLES.includes(role as UserRole | WeddingRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, role });
    response.cookies.set("demo-role", role, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
