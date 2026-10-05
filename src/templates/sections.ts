import { z } from "zod";
import { getPalette, getTemplateInfo, type Palette, type TemplateId } from "./catalog";

/**
 * What a couple can put on their site. Each section's content is validated JSON, so templates can
 * render it without guessing; missing fields fall back to the defaults below.
 */

export const SECTION_TYPES = ["HERO", "STORY", "EVENTS", "GALLERY", "RSVP", "FAQ"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

const text = (max: number) => z.string().trim().max(max);

/**
 * Images couples link to. next/image throws on malformed sources, which would take the whole site
 * down, so only absolute https URLs and site paths are accepted.
 */
export const imageUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((value) => /^https:\/\/[^\s]+$/.test(value) || /^\/[^\s/][^\s]*$/.test(value), "Use an image link that starts with https://");

/** An image field a couple may leave blank. */
const optionalImage = z.union([imageUrlSchema, z.literal("")]).optional().transform((value) => value || undefined);

export const sectionContentSchemas = {
  HERO: z.object({
    eyebrow: text(80).default("You are invited to the wedding of"),
  }),
  STORY: z.object({
    tag: text(40).default("Our Love Story"),
    title: text(80).default("How We Met"),
    chapters: z
      .array(z.object({ label: text(24), title: text(80), text: text(1200), image: optionalImage }))
      .max(6)
      .default([]),
  }),
  EVENTS: z.object({
    tag: text(40).default("Join Us"),
    title: text(80).default("Wedding Events"),
    events: z
      .array(
        z.object({
          kind: z.enum(["ceremony", "reception", "other"]).default("other"),
          name: text(60),
          time: text(40).default(""),
          venue: text(120),
          address: text(240).default(""),
        }),
      )
      .max(6)
      .default([]),
  }),
  GALLERY: z.object({
    tag: text(40).default("Memories"),
    title: text(80).default("Our Gallery"),
  }),
  RSVP: z.object({
    tag: text(40).default("Your Presence"),
    title: text(80).default("Kindly Respond"),
    /** Calendar date, YYYY-MM-DD. */
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
  FAQ: z.object({
    tag: text(40).default("Good to Know"),
    title: text(80).default("Questions & Answers"),
    items: z.array(z.object({ question: text(160), answer: text(1200) })).max(12).default([]),
  }),
} satisfies Record<SectionType, z.ZodType>;

export type SectionContent<T extends SectionType> = z.infer<(typeof sectionContentSchemas)[T]>;

export type SiteSection = { [T in SectionType]: { type: T; content: SectionContent<T> } }[SectionType];

/** Wedding fields a template may show. Plain strings so it can cross into client components. */
export type SiteWedding = {
  slug: string;
  brideName: string;
  groomName: string;
  /** ISO timestamp; templates show it as a calendar date (UTC). */
  date: string;
  venue: string;
  venueAddress: string | null;
  coverImage: string | null;
  galleryImages: string[];
};

/** Present only on a guest's personal invitation. */
export type SiteGuest = {
  fullName: string;
  inviteCode: string;
  seatsAllowed: number;
  rsvp: { status: "PENDING" | "GOING" | "DECLINED"; guestCount: number; note: string | null; submittedAt: string | null } | null;
};

export type Site = {
  templateId: TemplateId;
  palette: Palette;
  wedding: SiteWedding;
  sections: SiteSection[];
  guest: SiteGuest | null;
};

export type SectionRow = { type: SectionType; enabled: boolean; position: number; content: unknown };

function parseContent<T extends SectionType>(type: T, value: unknown): SectionContent<T> {
  const parsed = sectionContentSchemas[type].safeParse(value ?? {});
  if (parsed.success) return parsed.data as SectionContent<T>;
  console.warn(`Ignoring invalid ${type} section content`, parsed.error.issues);
  return sectionContentSchemas[type].parse({}) as SectionContent<T>;
}

function defaultContent(type: SectionType, wedding: SiteWedding): unknown {
  if (type === "EVENTS") {
    return { events: [{ kind: "ceremony", name: "Ceremony", venue: wedding.venue, address: wedding.venueAddress ?? "" }] };
  }
  return {};
}

/** A section with nothing to show is left off the page rather than rendered empty. */
export function hasContent(section: SiteSection, wedding: Pick<SiteWedding, "galleryImages">) {
  switch (section.type) {
    case "STORY":
      return section.content.chapters.length > 0;
    case "EVENTS":
      return section.content.events.length > 0;
    case "GALLERY":
      return wedding.galleryImages.length > 0;
    case "FAQ":
      return section.content.items.length > 0;
    default:
      return true;
  }
}

/** Every section type in page order, with its visibility and content, whether or not it has been saved. */
export type EditableSection = SiteSection & { enabled: boolean };

/**
 * Merges the couple's saved sections over the defaults, keeping hidden and empty ones (the Studio
 * edits those too). The hero always opens the page and can't be hidden.
 */
export function resolveSections(rows: SectionRow[], wedding: Pick<SiteWedding, "venue" | "venueAddress">): EditableSection[] {
  const byType = new Map(rows.map((row) => [row.type, row]));

  return SECTION_TYPES.map((type, index) => {
    const row = byType.get(type);
    const content = parseContent(type, row ? row.content : defaultContent(type, wedding as SiteWedding));
    return {
      section: { type, content, enabled: type === "HERO" || (row?.enabled ?? true) } as EditableSection,
      position: type === "HERO" ? -1 : (row?.position ?? index),
    };
  })
    .sort((a, b) => a.position - b.position)
    .map((item) => item.section);
}

/**
 * Builds what a template renders. Every wedding gets a working site even before it has any
 * section rows; hidden sections and sections with nothing to show are left out.
 */
export function buildSite(input: {
  templateId: string | null;
  paletteId: string | null;
  wedding: SiteWedding;
  rows: SectionRow[];
  guest?: SiteGuest | null;
}): Site {
  const template = getTemplateInfo(input.templateId);
  const sections = resolveSections(input.rows, input.wedding)
    .filter((section) => section.enabled && hasContent(section, input.wedding))
    .map(({ type, content }) => ({ type, content }) as SiteSection);

  return {
    templateId: template.id as TemplateId,
    palette: getPalette(template.id, input.paletteId),
    wedding: input.wedding,
    sections,
    guest: input.guest ?? null,
  };
}

/** Anchor id and navigation label for each section type. */
export const SECTION_NAV: Record<SectionType, { id: string; label: string }> = {
  HERO: { id: "hero", label: "Home" },
  STORY: { id: "story", label: "Our Story" },
  EVENTS: { id: "events", label: "Events" },
  GALLERY: { id: "gallery", label: "Gallery" },
  RSVP: { id: "rsvp", label: "RSVP" },
  FAQ: { id: "faq", label: "FAQ" },
};
