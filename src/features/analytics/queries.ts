import "server-only";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/auth/demo";
import { getMockAnalytics } from "@/lib/demo/demo-data";

export async function getAnalytics(weddingId: string) {
  if (await isDemoMode()) {
    return getMockAnalytics();
  }

  const guests = await prisma.guest.findMany({
    where: { weddingId },
    include: { rsvp: true },
  });

  const total = guests.length;
  const confirmed = guests.filter((guest) => guest.rsvp?.status === "GOING").length;
  const pending = guests.filter((guest) => !guest.rsvp || guest.rsvp.status === "PENDING").length;
  const declined = guests.filter((guest) => guest.rsvp?.status === "DECLINED").length;

  const byGroup = guests.reduce<Record<string, number>>((acc, guest) => {
    const group = guest.groupName || "Ungrouped";
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  const recentRsvps = guests
    .filter((guest) => guest.rsvp?.submittedAt)
    .sort((a, b) => new Date(b.rsvp!.submittedAt!).getTime() - new Date(a.rsvp!.submittedAt!).getTime())
    .slice(0, 5)
    .map((guest) => ({
      id: guest.id,
      fullName: guest.fullName,
      groupName: guest.groupName,
      status: guest.rsvp?.status ?? "PENDING",
      submittedAt: guest.rsvp?.submittedAt,
    }));

  const rsvpRate = total ? Math.round(((confirmed + declined) / total) * 100) : 0;

  return {
    total,
    confirmed,
    pending,
    declined,
    rsvpRate,
    byGroup,
    recentRsvps,
  };
}
