import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .optional()
  .or(z.literal(""));

export const phoneSchema = z
  .string()
  .trim()
  .max(32, "Phone must be 32 characters or fewer")
  .optional()
  .or(z.literal(""));

export const noteSchema = z
  .string()
  .trim()
  .max(600, "Notes must be 600 characters or fewer")
  .optional()
  .or(z.literal(""));

export const sendInviteEmailSchema = z.object({
  to: z.string().email("Valid email required"),
  guestName: z.string().min(1, "Guest name required"),
  coupleNames: z.string().min(1, "Couple names required"),
  weddingDate: z.string().optional(),
  weddingVenue: z.string().optional(),
  inviteUrl: z.string().url("Valid invite URL required"),
});

export type SendInviteEmailInput = z.infer<typeof sendInviteEmailSchema>;
