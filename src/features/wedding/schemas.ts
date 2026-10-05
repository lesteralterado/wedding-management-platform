import { z } from "zod";
import { TEMPLATE_IDS, getTemplateInfo } from "@/templates/catalog";

export const weddingSchema = z
  .object({
    brideName: z.string().trim().min(1, "Bride name is required"),
    groomName: z.string().trim().min(1, "Groom name is required"),
    date: z.string().min(1, "Wedding date is required"),
    venue: z.string().trim().min(1, "Venue is required"),
    venueAddress: z.string().trim().optional(),
    templateId: z.enum(TEMPLATE_IDS, "Choose a template"),
    paletteId: z.string().trim().min(1, "Choose a colour story"),
    status: z.enum(["PLANNING", "ENGAGED", "CONFIRMED", "COMPLETED"]),
    coverImage: z.string().optional(),
    galleryImages: z.array(z.string()).optional(),
  })
  .refine((data) => getTemplateInfo(data.templateId).palettes.some((palette) => palette.id === data.paletteId), {
    path: ["paletteId"],
    message: "Choose a colour story for this template",
  });

export type WeddingInput = z.infer<typeof weddingSchema>;
