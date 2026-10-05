import { z } from "zod";
import { lookSchema, paletteMatchesTemplate } from "@/features/wedding/schemas";
import { SECTION_TYPES, imageUrlSchema, sectionContentSchemas, type SectionType } from "@/templates/sections";

/** One section as the Studio saves it; its content is checked against that section's own schema. */
const sectionInput = z
  .object({ type: z.enum(SECTION_TYPES), enabled: z.boolean(), content: z.unknown() })
  .transform((section, ctx) => {
    const parsed = sectionContentSchemas[section.type as SectionType].safeParse(section.content ?? {});
    if (!parsed.success) {
      for (const issue of parsed.error.issues) ctx.addIssue({ ...issue, path: ["content", ...issue.path] } as z.core.$ZodRawIssue);
      return z.NEVER;
    }
    return { type: section.type, enabled: section.type === "HERO" || section.enabled, content: parsed.data as object };
  });

/** Everything the Studio edits, saved in one go. Section order is the array order. */
export const studioSchema = lookSchema
  .extend({
    galleryImages: z.array(imageUrlSchema).max(24, "Up to 24 gallery photos"),
    sections: z
      .array(sectionInput)
      .max(SECTION_TYPES.length)
      .refine((sections) => new Set(sections.map((s) => s.type)).size === sections.length, "Each section can appear once"),
  })
  .refine(paletteMatchesTemplate, { path: ["paletteId"], message: "Choose a colour story for this template" });

export type StudioInput = z.input<typeof studioSchema>;
