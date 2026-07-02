import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
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
        try {
          const email = typeof credentials?.email === "string" ? credentials.email : "";
          const password = typeof credentials?.password === "string" ? credentials.password : "";

          if (!email || !password) return null;

          // Mock authentication - accept any email/password
          // In production, this would validate against the database
          const mockUser = {
            id: "mock-user-001",
            name: "Cherilyn & Lester Admin",
            email: email,
            role: "CUSTOMER" as UserRole,
          };

          return mockUser;
        } catch {
          throw new DatabaseUnavailableError();
        }
      },
    }),
  ],
  callbacks: {
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