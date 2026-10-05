import "server-only";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { createSlug, uniqueSlug } from "@/lib/utils/slug";
import { authorizeWedding, getDashboardAccess } from "@/lib/wedding/current";
import { weddingSchema, type WeddingInput } from "./schemas";

function toWeddingData(data: WeddingInput) {
  return {
    brideName: data.brideName,
    groomName: data.groomName,
    date: new Date(data.date),
    venue: data.venue,
    venueAddress: data.venueAddress || null,
    templateId: data.templateId,
    paletteId: data.paletteId,
    status: data.status,
    coverImage: data.coverImage || null,
    galleryImages: data.galleryImages ?? [],
  };
}

/** Creates the signed-in couple's first wedding; they become its OWNER. */
export async function createWedding(input: unknown) {
  const access = await getDashboardAccess();
  if (!access) return { error: { form: ["Please sign in again."] }, status: 401 as const };
  if (access.wedding) return { error: { form: ["You already have a wedding."] }, status: 409 as const };

  const parsed = weddingSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  if (access.isDemo) return { success: true };

  // Slugs are public URLs, so they must be unique across every wedding, not just this user's.
  const base = createSlug(`${parsed.data.brideName}-${parsed.data.groomName}`);
  const taken = await prisma.wedding.findMany({ where: { slug: { startsWith: base } }, select: { slug: true } });
  const slug = uniqueSlug(base, taken.map((item) => item.slug));

  const wedding = await prisma.wedding.create({
    data: { ...toWeddingData(parsed.data), userId: access.user.id, slug },
  });

  revalidatePath("/dashboard", "layout");
  return { success: true, wedding };
}

export async function updateWedding(input: unknown) {
  const auth = await authorizeWedding("wedding:write");
  if (!auth.ok) return { error: { form: [auth.message] }, status: auth.status };

  const parsed = weddingSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  if (auth.access.isDemo) return { success: true };

  await prisma.wedding.update({
    where: { id: auth.access.wedding.id },
    data: toWeddingData(parsed.data),
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath(`/w/${auth.access.wedding.slug}`);
  return { success: true };
}
