import { describe, expect, it } from "vitest";
import { studioSchema } from "./schemas";

const base = { templateId: "royal-arch", paletteId: "sage", galleryImages: [], sections: [] };

describe("studioSchema", () => {
  it("accepts a valid save and fills content defaults", () => {
    const parsed = studioSchema.parse({
      ...base,
      galleryImages: ["https://images.example.com/a.jpg", "/templates/royal-arch/floral/swag.webp"],
      sections: [
        { type: "HERO", enabled: false, content: {} },
        { type: "STORY", enabled: true, content: { chapters: [{ label: "2020", title: "Met", text: "Hello", image: "" }] } },
      ],
    });
    // The hero can't be hidden, blank images are dropped, and missing fields get defaults.
    expect(parsed.sections[0]).toEqual({ type: "HERO", enabled: true, content: { eyebrow: "You are invited to the wedding of" } });
    expect(parsed.sections[1].content).toEqual({ tag: "Our Love Story", title: "How We Met", chapters: [{ label: "2020", title: "Met", text: "Hello" }] });
  });

  it("rejects image links that would break the site", () => {
    for (const bad of ["http://insecure.example.com/a.jpg", "javascript:alert(1)", "images/a.jpg", "https://has space.com/a.jpg"]) {
      expect(studioSchema.safeParse({ ...base, galleryImages: [bad] }).success, bad).toBe(false);
    }
    const story = { type: "STORY", enabled: true, content: { chapters: [{ label: "", title: "x", text: "y", image: "ftp://a/b.jpg" }] } };
    const result = studioSchema.safeParse({ ...base, sections: [story] });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["sections", 0, "content", "chapters", 0, "image"]);
  });

  it("rejects a colour story from another template", () => {
    expect(studioSchema.safeParse({ ...base, paletteId: "coral" }).success).toBe(false);
  });

  it("rejects duplicate sections", () => {
    const hero = { type: "HERO", enabled: true, content: {} };
    expect(studioSchema.safeParse({ ...base, sections: [hero, hero] }).success).toBe(false);
  });
});
