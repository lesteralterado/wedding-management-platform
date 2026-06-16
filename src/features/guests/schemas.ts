import { z } from "zod";
import { emailSchema, noteSchema, phoneSchema } from "@/lib/validators/common";

export const guestSchema = z.object({
  fullName: z.string().trim().min(1, "Guest name is required"),
  email: emailSchema,
  phone: phoneSchema,
  groupName: z.string().trim().optional().or(z.literal("")),
  inviteCode: z.string().trim().optional(),
  qrCode: z.string().optional(),
  seatsAllowed: z.coerce.number().int().min(1).max(10),
});

export const rsvpSchema = z.object({
  status: z.enum(["GOING", "PENDING", "DECLINED"]),
  guestCount: z.coerce.number().int().min(0).max(10),
  note: noteSchema,
});

export const importGuestSchema = z.array(z.object({
  fullName: z.string().trim().min(1),
  email: emailSchema,
  phone: phoneSchema,
  groupName: z.string().trim().optional().or(z.literal("")),
  seatsAllowed: z.coerce.number().int().min(1).max(10),
}));

export type GuestInput = z.infer<typeof guestSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
export type ImportGuestRow = z.infer<typeof importGuestSchema>[number];
