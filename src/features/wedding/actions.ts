import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { createSlug, uniqueSlug } from "@/lib/utils/slug";
import { weddingSchema } from "./schemas";

const weddingCreateSchema = weddingSchema.extend({
  userId: z.string(),
});

export async function createWedding(input: {
  userId: string;
  brideName: string;
  groomName: string;
  date: string;
  venue: string;
  venueAddress?: string;
  theme: string;
  status: "PLANNING" | "ENGAGED" | "CONFIRMED" | "COMPLETED";
  coverImage?: string;
  galleryImages?: string[];
}) {
  const parsed = weddingCreateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const used = await prisma.wedding.findMany({ where: { userId: parsed.data.userId }, select: { slug: true } });
  const slug = uniqueSlug(createSlug(`${parsed.data.brideName}-${parsed.data.groomName}`), used.map((item) => item.slug));

  const wedding = await prisma.wedding.create({
    data: {
      userId: parsed.data.userId,
      brideName: parsed.data.brideName,
      groomName: parsed.data.groomName,
      date: new Date(parsed.data.date),
      venue: parsed.data.venue,
      venueAddress: parsed.data.venueAddress,
      theme: parsed.data.theme,
      status: parsed.data.status,
      coverImage: parsed.data.coverImage,
      galleryImages: parsed.data.galleryImages ?? [],
      slug,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, wedding };
}

export async function updateWedding(id: string, userId: string, input: {
  brideName: string;
  groomName: string;
  date: string;
  venue: string;
  venueAddress?: string;
  theme: string;
  status: "PLANNING" | "ENGAGED" | "CONFIRMED" | "COMPLETED";
  coverImage?: string;
  galleryImages?: string[];
}) {
  const parsed = weddingSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await prisma.wedding.updateMany({
    where: { id, userId },
    data: {
      brideName: parsed.data.brideName,
      groomName: parsed.data.groomName,
      date: new Date(parsed.data.date),
      venue: parsed.data.venue,
      venueAddress: parsed.data.venueAddress,
      theme: parsed.data.theme,
      status: parsed.data.status,
      coverImage: parsed.data.coverImage,
      galleryImages: parsed.data.galleryImages ?? [],
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/wedding`);
  return { success: true };
}
