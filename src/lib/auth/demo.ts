import "server-only";
import { cookies } from "next/headers";

export async function isDemoMode(): Promise<boolean> {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("demo");
  return demoCookie?.value === "true";
}

export async function getDemoRole(): Promise<string | null> {
  const cookieStore = await cookies();
  const roleCookie = cookieStore.get("demo-role");
  return roleCookie?.value ?? null;
}
