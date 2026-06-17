import "server-only";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/auth/demo";
import { getMockRsvps } from "@/lib/demo/demo-data";

export async function getRecentRsvps(weddingId: string) {
  if (await isDemoMode()) {
    return getMockRsvps();
  }

  return prisma.rsvp.findMany({
    where: { guest: { weddingId } },
    include: { guest: true },
    orderBy: { submittedAt: "desc" },
    take: 10,
  });
}
