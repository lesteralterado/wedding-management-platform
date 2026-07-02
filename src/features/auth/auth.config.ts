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

      if (!protectedPaths.some((path) => pathname.startsWith(path))) return true;
      if (auth) return true;

      const demoCookie = request.cookies.get("demo");
      if (demoCookie?.value === "true") return true;

      return false;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
