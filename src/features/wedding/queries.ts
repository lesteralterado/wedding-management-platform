import "server-only";
import { prisma } from "@/lib/db/prisma";
import { isDatabaseUnavailable } from "@/lib/db/availability";
import { getMockWedding } from "@/lib/demo/demo-data";

export async function getWeddingBySlug(slug: string) {
  try {
    return await prisma.wedding.findUnique({ where: { slug } });
  } catch (error) {
    // Keeps the public demo site up on deployments without a database.
    if (isDatabaseUnavailable(error) && slug === getMockWedding().slug) return getMockWedding();
    throw error;
  }
}
