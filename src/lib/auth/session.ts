import "server-only";
import { auth } from "@/features/auth/auth";

export async function getServerSession() {
  return auth();
}
