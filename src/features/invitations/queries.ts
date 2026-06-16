import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getInvitations(weddingId: string) {
  return prisma.guest.findMany({
    where: { weddingId },
    include: { rsvp: true },
    orderBy: { fullName: "asc" },
  });
}
