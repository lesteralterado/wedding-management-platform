import "server-only";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/auth/demo";
import { isDatabaseUnavailable } from "@/lib/db/availability";
import { getMockGuests, getMockGuestGroups, getMockWedding } from "@/lib/demo/demo-data";

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

export async function getGuestByInviteCode(inviteCode: string) {
  try {
    return await prisma.guest.findUnique({
      where: { inviteCode },
      include: { wedding: true, rsvp: true },
    });
  } catch (error) {
    // Keeps the demo invitations working on deployments without a database.
    if (!isDatabaseUnavailable(error)) throw error;
    const guest = getMockGuests().find((g) => g.inviteCode === inviteCode);
    return guest ? { ...guest, wedding: getMockWedding() } : null;
  }
}
