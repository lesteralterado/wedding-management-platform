import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { authConfig } from "./auth.config";
import { loginSchema } from "./schemas";
import { prisma } from "@/lib/db/prisma";
import type { UserRole } from "@/types/domain";

class DatabaseUnavailableError extends CredentialsSignin {
  code = "database_unavailable";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        let user;
        try {
          user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        } catch (error) {
          console.error("Authentication failed:", error);
          throw new DatabaseUnavailableError();
        }

        if (!user) return null;
        if (!(await compare(parsed.data.password, user.passwordHash))) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = (user.role ?? "CUSTOMER") as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});
