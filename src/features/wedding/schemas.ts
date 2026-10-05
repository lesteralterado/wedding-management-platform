import { z } from "zod";
import { TEMPLATE_IDS, getTemplateInfo } from "@/templates/catalog";
import { SECTION_TYPES, imageUrlSchema } from "@/templates/sections";

/** The facts about the wedding, edited on the Wedding Details page. */
export const weddingDetailsSchema = z.object({
  brideName: z.string().trim().min(1, "Bride name is required").max(60),
  groomName: z.string().trim().min(1, "Groom name is required").max(60),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Wedding date is required"),
  venue: z.string().trim().min(1, "Venue is required").max(120),
  venueAddress: z.string().trim().max(240).optional(),
  status: z.enum(["PLANNING", "ENGAGED", "CONFIRMED", "COMPLETED"]).default("PLANNING"),
  coverImage: z.union([imageUrlSchema, z.literal("")]).optional(),
});

/** A colour story belongs to one template, so the pair is validated together. */
export const lookSchema = z.object({
  templateId: z.enum(TEMPLATE_IDS, "Choose a template"),
  paletteId: z.string().trim().min(1, "Choose a colour story"),
});

export const paletteMatchesTemplate = (look: z.infer<typeof lookSchema>) =>
  getTemplateInfo(look.templateId).palettes.some((palette) => palette.id === look.paletteId);

const paletteRefinement = { path: ["paletteId"], message: "Choose a colour story for this template" };

/** Everything the onboarding wizard collects to create a wedding. */
export const createWeddingSchema = weddingDetailsSchema
  .extend(lookSchema.shape)
  .extend({
    /** Optional sections the couple switched on; the hero is always shown. */
    sections: z.array(z.enum(SECTION_TYPES)).default([]),
  })
  .refine(paletteMatchesTemplate, paletteRefinement);

export type WeddingDetailsInput = z.input<typeof weddingDetailsSchema>;
export type CreateWeddingInput = z.input<typeof createWeddingSchema>;
