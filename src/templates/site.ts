import "server-only";
import { cache } from "react";
import type { Guest, Rsvp, Wedding, WeddingSection } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { isDatabaseUnavailable } from "@/lib/db/availability";
import { getMockGuests, getMockSectionRows, getMockWedding } from "@/lib/demo/demo-data";
import { buildSite, type SectionRow, type Site, type SiteGuest } from "./sections";

type WeddingWithSections = Wedding & { sections: Pick<WeddingSection, "type" | "enabled" | "position" | "content">[] };

function toSite(wedding: WeddingWithSections, guest?: Guest & { rsvp: Rsvp | null }): Site {
  return buildSite({
    templateId: wedding.templateId,
    paletteId: wedding.paletteId,
    rows: wedding.sections as SectionRow[],
    wedding: {
      slug: wedding.slug,
      brideName: wedding.brideName,
      groomName: wedding.groomName,
      date: wedding.date.toISOString(),
      venue: wedding.venue,
      venueAddress: wedding.venueAddress,
      coverImage: wedding.coverImage,
      galleryImages: Array.isArray(wedding.galleryImages) ? wedding.galleryImages.filter((img): img is string => typeof img === "string") : [],
    },
    guest: guest ? toSiteGuest(guest) : null,
  });
}

function toSiteGuest(guest: Guest & { rsvp: Rsvp | null }): SiteGuest {
  return {
    fullName: guest.fullName,
    inviteCode: guest.inviteCode,
    seatsAllowed: guest.seatsAllowed,
    rsvp: guest.rsvp && {
      status: guest.rsvp.status,
      guestCount: guest.rsvp.guestCount,
      note: guest.rsvp.note,
      submittedAt: guest.rsvp.submittedAt?.toISOString() ?? null,
    },
  };
}

const sectionSelect = { select: { type: true, enabled: true, position: true, content: true } } as const;

function mockWedding(): WeddingWithSections {
  return { ...getMockWedding(), sections: getMockSectionRows() } as WeddingWithSections;
}

/** The public wedding website. Cached per request so metadata and the page share one query. */
export const getWeddingSite = cache(async (slug: string): Promise<Site | null> => {
  try {
    const wedding = await prisma.wedding.findUnique({ where: { slug }, include: { sections: sectionSelect } });
    return wedding && toSite(wedding);
  } catch (error) {
    // Keeps the public demo site up on deployments without a database.
    if (isDatabaseUnavailable(error) && slug === getMockWedding().slug) return toSite(mockWedding());
    throw error;
  }
});

/** A guest's personal invitation: the wedding website, addressed to them, with their RSVP. */
export const getInviteSite = cache(async (inviteCode: string): Promise<Site | null> => {
  try {
    const guest = await prisma.guest.findUnique({
      where: { inviteCode },
      include: { rsvp: true, wedding: { include: { sections: sectionSelect } } },
    });
    return guest && toSite(guest.wedding, guest);
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;
    const guest = getMockGuests().find((g) => g.inviteCode === inviteCode);
    return guest ? toSite(mockWedding(), guest) : null;
  }
});
