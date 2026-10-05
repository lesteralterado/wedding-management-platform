import { describe, expect, it, vi } from "vitest";
import { buildSite, type SiteWedding } from "./sections";

const wedding: SiteWedding = {
  slug: "ana-ben",
  brideName: "Ana",
  groomName: "Ben",
  date: "2027-02-07T00:00:00.000Z",
  venue: "Manila Cathedral",
  venueAddress: "Intramuros, Manila",
  coverImage: null,
  galleryImages: [],
};

const types = (site: ReturnType<typeof buildSite>) => site.sections.map((s) => s.type);

describe("buildSite", () => {
  it("gives a brand-new wedding a working site from defaults", () => {
    const site = buildSite({ templateId: null, paletteId: null, wedding, rows: [] });
    expect(site.templateId).toBe("royal-arch");
    expect(site.palette.id).toBe("champagne");
    // Story, gallery and FAQ have nothing to show yet, so they stay off the page.
    expect(types(site)).toEqual(["HERO", "EVENTS", "RSVP"]);
    const events = site.sections.find((s) => s.type === "EVENTS");
    expect(events?.type === "EVENTS" && events.content.events[0]).toMatchObject({ name: "Ceremony", venue: "Manila Cathedral" });
  });

  it("uses saved content, order and visibility", () => {
    const site = buildSite({
      templateId: "radiant-citrus",
      paletteId: "coral",
      wedding: { ...wedding, galleryImages: ["/a.jpg"] },
      rows: [
        { type: "GALLERY", enabled: true, position: 1, content: { title: "Snapshots" } },
        { type: "STORY", enabled: true, position: 2, content: { chapters: [{ label: "2020", title: "Met", text: "Hi" }] } },
        { type: "RSVP", enabled: false, position: 3, content: {} },
      ],
    });
    expect(site.palette.id).toBe("coral");
    expect(types(site)).toEqual(["HERO", "GALLERY", "STORY", "EVENTS"]);
    const gallery = site.sections.find((s) => s.type === "GALLERY");
    expect(gallery?.type === "GALLERY" && gallery.content).toEqual({ tag: "Memories", title: "Snapshots" });
  });

  it("always opens with the hero, even if a row tries to hide or move it", () => {
    const site = buildSite({ templateId: null, paletteId: null, wedding, rows: [{ type: "HERO", enabled: false, position: 99, content: {} }] });
    expect(types(site)[0]).toBe("HERO");
  });

  it("falls back to defaults when saved content is invalid", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const site = buildSite({ templateId: null, paletteId: null, wedding, rows: [{ type: "HERO", enabled: true, position: 0, content: { eyebrow: 42 } }] });
    const hero = site.sections[0];
    expect(hero.type === "HERO" && hero.content.eyebrow).toBe("You are invited to the wedding of");
  });
});
