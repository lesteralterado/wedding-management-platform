import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ request, auth }) {
      const protectedPaths = ["/dashboard"];
      const { pathname } = request.nextUrl;

      if (protectedPaths.some((path) => pathname.startsWith(path)) && !auth) return false;
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
