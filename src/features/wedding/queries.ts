import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getWeddingBySlug(slug: string) {
  return prisma.wedding.findUnique({
    where: { slug },
    include: { guests: { include: { rsvp: true }, orderBy: { fullName: "asc" } } },
  });
}

export async function getWeddingById(id: string) {
  return prisma.wedding.findUnique({
    where: { id },
    include: { guests: { include: { rsvp: true }, orderBy: { fullName: "asc" } } },
  });
}

export async function getWeddingsForUser(userId: string) {
  return prisma.wedding.findMany({
    where: { userId },
    include: { guests: { include: { rsvp: true } } },
    orderBy: { createdAt: "desc" },
  });
}
