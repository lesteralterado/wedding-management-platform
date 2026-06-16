import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getDashboardMetrics(weddingId: string) {
  const guests = await prisma.guest.findMany({
    where: { weddingId },
    include: { rsvp: true },
  });

  const total = guests.length;
  const confirmed = guests.filter((guest) => guest.rsvp?.status === "GOING").length;
  const pending = guests.filter((guest) => !guest.rsvp || guest.rsvp.status === "PENDING").length;
  const declined = guests.filter((guest) => guest.rsvp?.status === "DECLINED").length;
  const responded = confirmed + declined;

  return {
    total,
    confirmed,
    pending,
    declined,
    responded,
    rsvpRate: total ? Math.round((responded / total) * 100) : 0,
  };
}
