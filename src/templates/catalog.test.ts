import { describe, expect, it } from "vitest";
import { TEMPLATES, getPalette, getTemplateInfo } from "./catalog";
import { contrastRatio } from "./contrast";

const AA_TEXT = 4.5;

describe.each(TEMPLATES.flatMap((t) => t.palettes.map((p) => [`${t.name} / ${p.name}`, p.tokens] as const)))(
  "palette %s",
  (_name, tokens) => {
    it("keeps body text comfortably readable", () => {
      expect(contrastRatio(tokens.ink, tokens.bg)).toBeGreaterThanOrEqual(7);
      expect(contrastRatio(tokens.ink, tokens.surface)).toBeGreaterThanOrEqual(7);
    });

    it("keeps secondary text at AA", () => {
      expect(contrastRatio(tokens.inkSoft, tokens.bg)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrastRatio(tokens.inkSoft, tokens.surface)).toBeGreaterThanOrEqual(AA_TEXT);
    });

    it("keeps accent text and accent buttons at AA", () => {
      expect(contrastRatio(tokens.accentText, tokens.bg)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrastRatio(tokens.accentText, tokens.surface)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  },
);

describe("contrastRatio", () => {
  it("matches the WCAG extremes", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21);
    expect(contrastRatio("#777777", "#777777")).toBeCloseTo(1);
  });
});

describe("catalog lookups", () => {
  it("falls back to the first template and palette", () => {
    expect(getTemplateInfo("missing").id).toBe("royal-arch");
    expect(getPalette("royal-arch", null).id).toBe("champagne");
    expect(getPalette("royal-arch", "coral").id).toBe("champagne");
    expect(getPalette("radiant-citrus", "coral").id).toBe("coral");
  });
});
