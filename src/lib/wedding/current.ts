import "server-only";
import { prisma } from "@/lib/db/prisma";
import { requireCoupleAdmin } from "@/lib/auth/rbac";

export async function getCurrentWeddingOrRedirect() {
  const user = await requireCoupleAdmin();
  const wedding = await prisma.wedding.findFirst({
    where: { userId: user.id },
    include: { guests: { include: { rsvp: true } } },
    orderBy: { createdAt: "desc" },
  });

  return wedding;
}
