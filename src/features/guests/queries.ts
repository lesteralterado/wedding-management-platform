import "server-only";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/auth/demo";
import { getMockGuests, getMockGuestGroups } from "@/lib/demo/demo-data";

export async function getGuests(weddingId: string) {
  if (await isDemoMode()) return getMockGuests();

  return prisma.guest.findMany({
    where: { weddingId },
    include: { rsvp: true },
    orderBy: { fullName: "asc" },
  });
}

export async function getGuestGroups(weddingId: string) {
  if (await isDemoMode()) return getMockGuestGroups();

  const rows = await prisma.guest.groupBy({
    by: ["groupName"],
    where: { weddingId, groupName: { not: null } },
    _count: { groupName: true },
    orderBy: { groupName: "asc" },
  });

  return rows.map((row) => ({ name: row.groupName!, count: row._count.groupName }));
}
