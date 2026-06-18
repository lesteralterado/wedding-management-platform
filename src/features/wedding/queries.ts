import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMockWedding } from "@/lib/demo/demo-data";

function fallbackMockWedding() {
  return getMockWedding();
}

export async function getWeddingBySlug(slug: string) {
  try {
    return await prisma.wedding.findUnique({
      where: { slug },
      include: { guests: { include: { rsvp: true }, orderBy: { fullName: "asc" } } },
    });
  } catch (error) {
    if (slug === "cherilyn-lester") return fallbackMockWedding();
    return null;
  }
}

export async function getWeddingById(id: string) {
  try {
    return await prisma.wedding.findUnique({
      where: { id },
      include: { guests: { include: { rsvp: true }, orderBy: { fullName: "asc" } } },
    });
  } catch {
    return null;
  }
}

export async function getWeddingsForUser(userId: string) {
  try {
    return await prisma.wedding.findMany({
      where: { userId },
      include: { guests: { include: { rsvp: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
