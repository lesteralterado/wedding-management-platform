import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "COUPLE_ADMIN" | "EVENT_STAFF";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "COUPLE_ADMIN" | "EVENT_STAFF";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "COUPLE_ADMIN" | "EVENT_STAFF";
  }
}