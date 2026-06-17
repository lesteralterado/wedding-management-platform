import "server-only";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/auth/demo";
import { getMockGuests, getMockGuestGroups } from "@/lib/demo/demo-data";

export async function getGuests(weddingId: string, search = "", group = "") {
  if (await isDemoMode()) {
    const guests = getMockGuests();
    return guests.filter((guest) => {
      const matchesSearch = guest.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = group === "all" || guest.groupName === group;
      return matchesSearch && matchesGroup;
    });
  }

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
  if (await isDemoMode()) {
    return getMockGuestGroups();
  }

  const rows = await prisma.guest.groupBy({
    by: ["groupName"],
    where: { weddingId, groupName: { not: null } },
    _count: { groupName: true },
    orderBy: { groupName: "asc" },
  });

  return rows.map((row) => ({ name: row.groupName!, count: row._count.groupName }));
}

export async function getGuestByInviteCode(inviteCode: string) {
  if (await isDemoMode()) {
    const guests = getMockGuests();
    return guests.find((guest) => guest.inviteCode === inviteCode) ?? null;
  }

  return prisma.guest.findUnique({
    where: { inviteCode },
    include: {
      wedding: true,
      rsvp: true,
    },
  });
}
