import { revalidatePath } from "next/cache";
import { z } from "zod";
import { weddingSchema } from "./schemas";
import { createSlug, uniqueSlug } from "@/lib/utils/slug";

const weddingCreateSchema = weddingSchema.extend({
  userId: z.string(),
});

// Mock slug store
const usedSlugs: string[] = ["cherilyn-lester"];

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

  const slug = uniqueSlug(createSlug(`${parsed.data.brideName}-${parsed.data.groomName}`), usedSlugs);

  // Mock successful creation - no actual DB write
  const wedding = {
    id: `mock-wedding-${Math.random().toString(36).slice(2, 8)}`,
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

  // Mock successful update - no actual DB write
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/wedding`);
  return { success: true };
}