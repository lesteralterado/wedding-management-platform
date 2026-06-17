import "server-only";
import { cookies } from "next/headers";

export async function isDemoMode(): Promise<boolean> {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("demo");
  return demoCookie?.value === "true";
}
