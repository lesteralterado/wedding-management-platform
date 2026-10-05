import "server-only";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { createSlug, uniqueSlug } from "@/lib/utils/slug";
import { authorizeWedding, getDashboardAccess } from "@/lib/wedding/current";
import { SECTION_TYPES } from "@/templates/sections";
import { createWeddingSchema, weddingDetailsSchema } from "./schemas";

/** Calendar date at midnight UTC, matching how templates display it. */
const toDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

/** Creates the signed-in couple's first wedding from the onboarding wizard; they become its OWNER. */
export async function createWedding(input: unknown) {
  const access = await getDashboardAccess();
  if (!access) return { error: { form: ["Please sign in again."] }, status: 401 as const };
  if (access.wedding) return { error: { form: ["You already have a wedding."] }, status: 409 as const };

  const parsed = createWeddingSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  if (access.isDemo) return { success: true };

  const { sections: chosen, ...data } = parsed.data;

  // Slugs are public URLs, so they must be unique across every wedding, not just this user's.
  const base = createSlug(`${data.brideName}-${data.groomName}`);
  const taken = await prisma.wedding.findMany({ where: { slug: { startsWith: base } }, select: { slug: true } });
  const slug = uniqueSlug(base, taken.map((item) => item.slug));

  const wedding = await prisma.wedding.create({
    data: {
      userId: access.user.id,
      slug,
      brideName: data.brideName,
      groomName: data.groomName,
      date: toDate(data.date),
      venue: data.venue,
      venueAddress: data.venueAddress || null,
      status: data.status,
      coverImage: data.coverImage || null,
      templateId: data.templateId,
      paletteId: data.paletteId,
      // Record every section so the Studio starts from exactly what the couple picked.
      sections: {
        create: SECTION_TYPES.map((type, position) => ({
          type,
          position,
          enabled: type === "HERO" || chosen.includes(type),
          content: type === "EVENTS"
            ? { events: [{ kind: "ceremony", name: "Ceremony", venue: data.venue, address: data.venueAddress ?? "" }] }
            : {},
        })),
      },
    },
  });

  revalidatePath("/dashboard", "layout");
  return { success: true, wedding: { id: wedding.id, slug: wedding.slug } };
}

export async function updateWedding(input: unknown) {
  const auth = await authorizeWedding("wedding:write");
  if (!auth.ok) return { error: { form: [auth.message] }, status: auth.status };

  const parsed = weddingDetailsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  if (auth.access.isDemo) return { success: true };

  const data = parsed.data;
  await prisma.wedding.update({
    where: { id: auth.access.wedding.id },
    data: {
      brideName: data.brideName,
      groomName: data.groomName,
      date: toDate(data.date),
      venue: data.venue,
      venueAddress: data.venueAddress || null,
      status: data.status,
      coverImage: data.coverImage || null,
    },
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath(`/w/${auth.access.wedding.slug}`);
  return { success: true };
}
