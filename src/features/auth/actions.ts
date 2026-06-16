"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "./schemas";

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors,
    };
  }

  const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existingUser) {
    return {
      error: {
        email: ["An account with this email already exists."],
      },
    };
  }

  const passwordHash = await hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    },
  });

  return { success: true };
}
