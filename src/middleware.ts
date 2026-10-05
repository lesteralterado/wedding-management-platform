import NextAuth from "next-auth";
import { authConfig } from "@/features/auth/auth.config";

// Built from the edge-safe config only: the full auth module imports Prisma, which can't run in middleware.
export const { auth: middleware } = NextAuth(authConfig);
