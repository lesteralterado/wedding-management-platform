import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getGuests(weddingId: string, search = "", group = "") {
  return prisma.guest.findMany({
    where: {
      weddingId,
      ...(search ? { fullName: { contains: search, mode: "insensitive" } } : {}),
      ...(group && group !== "all" ? { groupName: group } : {}),
    },
    include: { rsvp: true },
    orderBy: { fullName: "asc" },
  });
}

export async function getGuestGroups(weddingId: string) {
  const rows = await prisma.guest.groupBy({
    by: ["groupName"],
    where: { weddingId, groupName: { not: null } },
    _count: { groupName: true },
    orderBy: { groupName: "asc" },
  });

  return rows.map((row) => ({ name: row.groupName!, count: row._count.groupName }));
}

export async function getGuestByInviteCode(inviteCode: string) {
  return prisma.guest.findUnique({
    where: { inviteCode },
    include: {
      wedding: true,
      rsvp: true,
    },
  });
}
