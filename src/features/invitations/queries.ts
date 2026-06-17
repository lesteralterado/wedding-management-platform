import "server-only";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/auth/demo";
import { getMockInvitations } from "@/lib/demo/demo-data";

export async function getInvitations(weddingId: string) {
  if (await isDemoMode()) {
    return getMockInvitations();
  }

  return prisma.guest.findMany({
    where: { weddingId },
    include: { rsvp: true },
    orderBy: { fullName: "asc" },
  });
}
