import "server-only";
import type { Wedding } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getMockSectionRows } from "@/lib/demo/demo-data";
import { getPalette, getTemplateInfo, type TemplateId } from "@/templates/catalog";
import { resolveSections, type EditableSection, type SectionRow, type SiteWedding } from "@/templates/sections";

export type StudioState = {
  templateId: TemplateId;
  paletteId: string;
  galleryImages: string[];
  sections: EditableSection[];
  /** Read-only here (edited on Wedding Details); the preview needs them. */
  wedding: Omit<SiteWedding, "galleryImages">;
};

export async function getStudioState(wedding: Wedding, isDemo: boolean): Promise<StudioState> {
  const rows = isDemo
    ? getMockSectionRows()
    : await prisma.weddingSection.findMany({ where: { weddingId: wedding.id }, select: { type: true, enabled: true, position: true, content: true } });

  const template = getTemplateInfo(wedding.templateId);
  return {
    templateId: template.id as TemplateId,
    paletteId: getPalette(template.id, wedding.paletteId).id,
    galleryImages: Array.isArray(wedding.galleryImages) ? wedding.galleryImages.filter((img): img is string => typeof img === "string") : [],
    sections: resolveSections(rows as SectionRow[], wedding),
    wedding: {
      slug: wedding.slug,
      brideName: wedding.brideName,
      groomName: wedding.groomName,
      date: wedding.date.toISOString(),
      venue: wedding.venue,
      venueAddress: wedding.venueAddress,
      coverImage: wedding.coverImage,
    },
  };
}
