import { NextResponse } from "next/server";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Demo mode is disabled outside development." }, { status: 403 });
  }

  const response = NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  response.cookies.set("demo", "true", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
