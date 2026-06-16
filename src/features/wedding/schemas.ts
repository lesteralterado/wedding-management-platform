import { z } from "zod";

export const weddingSchema = z.object({
  brideName: z.string().trim().min(1, "Bride name is required"),
  groomName: z.string().trim().min(1, "Groom name is required"),
  date: z.string().min(1, "Wedding date is required"),
  venue: z.string().trim().min(1, "Venue is required"),
  venueAddress: z.string().trim().optional(),
  theme: z.string().trim().min(1, "Theme is required"),
  status: z.enum(["PLANNING", "ENGAGED", "CONFIRMED", "COMPLETED"]),
  coverImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
});

export type WeddingInput = z.infer<typeof weddingSchema>;
