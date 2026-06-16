import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/features/auth/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existingUser) {
      return NextResponse.json({ error: { email: ["An account already exists."] } }, { status: 409 });
    }

    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await hash(parsed.data.password, 12),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register failed:", error);

    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
