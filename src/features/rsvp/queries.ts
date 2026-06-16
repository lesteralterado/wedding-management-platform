import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getRecentRsvps(weddingId: string) {
  return prisma.rsvp.findMany({
    where: { guest: { weddingId } },
    include: { guest: true },
    orderBy: { submittedAt: "desc" },
    take: 10,
  });
}
