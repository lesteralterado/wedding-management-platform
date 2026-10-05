"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { authorizeWedding } from "@/lib/wedding/current";
import { studioSchema } from "./schemas";

/** Saves the couple's look, sections and gallery together, so the live site never shows half an edit. */
export async function saveStudio(input: unknown) {
  const auth = await authorizeWedding("wedding:write");
  if (!auth.ok) return { success: false as const, error: auth.message };

  const parsed = studioSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { success: false as const, error: issue?.message ?? "Some changes couldn't be saved.", path: issue?.path.map(String) ?? [] };
  }
  if (auth.access.isDemo) return { success: true as const };

  const { wedding } = auth.access;
  const { templateId, paletteId, galleryImages, sections } = parsed.data;

  await prisma.$transaction([
    prisma.wedding.update({ where: { id: wedding.id }, data: { templateId, paletteId, galleryImages } }),
    ...sections.map((section, position) => {
      const data = { enabled: section.enabled, position, content: section.content as Prisma.InputJsonValue };
      return prisma.weddingSection.upsert({
        where: { weddingId_type: { weddingId: wedding.id, type: section.type } },
        create: { weddingId: wedding.id, type: section.type, ...data },
        update: data,
      });
    }),
  ]);

  revalidatePath(`/w/${wedding.slug}`);
  revalidatePath("/dashboard", "layout");
  return { success: true as const };
}
