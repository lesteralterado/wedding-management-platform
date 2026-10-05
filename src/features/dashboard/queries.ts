import "server-only";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/auth/demo";
import { getMockDashboardMetrics } from "@/lib/demo/demo-data";
import type { WeddingRole } from "@/types/domain";

export async function getDashboardMetrics(weddingId: string, weddingRole?: WeddingRole | null) {
  if (await isDemoMode()) return getMockDashboardMetrics(weddingRole ?? "OWNER");

  const [total, byStatus] = await Promise.all([
    prisma.guest.count({ where: { weddingId } }),
    prisma.rsvp.groupBy({ by: ["status"], where: { guest: { weddingId } }, _count: { _all: true } }),
  ]);

  const countOf = (status: string) => byStatus.find((row) => row.status === status)?._count._all ?? 0;
  const confirmed = countOf("GOING");
  const declined = countOf("DECLINED");
  const responded = confirmed + declined;

  return {
    total,
    confirmed,
    declined,
    // Guests without an RSVP row haven't answered yet either.
    pending: total - responded,
    responded,
    rsvpRate: total ? Math.round((responded / total) * 100) : 0,
  };
}
