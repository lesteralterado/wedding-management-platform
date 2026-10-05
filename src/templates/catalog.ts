/**
 * The templates couples can choose from, as plain data (safe to import anywhere, including client
 * components). The React side of each template lives in `registry.tsx`.
 */

export type ThemeTokens = {
  /** Page background. */
  bg: string;
  /** Cards and form fields. */
  surface: string;
  /** Headings and body text. */
  ink: string;
  /** Secondary text. */
  inkSoft: string;
  /** Decorative accent: rules, icons, large display numerals. Not for small text. */
  accent: string;
  /** Tint of the accent for soft fills. */
  accentSoft: string;
  /** Deeper accent that stays readable for small text and as a button fill behind `bg`-coloured text. */
  accentText: string;
};

export type Palette = { id: string; name: string; tokens: ThemeTokens };

export type TemplateInfo = {
  id: string;
  name: string;
  description: string;
  palettes: [Palette, ...Palette[]];
};

export const TEMPLATES = [
  {
    id: "royal-arch",
    name: "Royal Arch",
    description: "Ivory arch, opening doors and watercolour florals. Classic and romantic.",
    // The arch, doors and section borders are painted on ivory paper, so every colourway keeps
    // an ivory background and changes the accent, ribbons and ink instead.
    palettes: [
      {
        id: "champagne",
        name: "Champagne & Ivory",
        tokens: { bg: "#f8f6f3", surface: "#ffffff", ink: "#2d2a26", inkSoft: "#665f59", accent: "#b8963a", accentSoft: "#e8d5a8", accentText: "#7a5f1f" },
      },
      {
        id: "sage",
        name: "Sage & Linen",
        tokens: { bg: "#f7f7f2", surface: "#ffffff", ink: "#263028", inkSoft: "#59625a", accent: "#8a9a6b", accentSoft: "#d6dfc4", accentText: "#4d5d35" },
      },
      {
        id: "dusty-rose",
        name: "Dusty Rose",
        tokens: { bg: "#faf6f4", surface: "#ffffff", ink: "#33282a", inkSoft: "#6b5c5e", accent: "#c48b8f", accentSoft: "#f0d9d9", accentText: "#8b4c52" },
      },
      {
        id: "terracotta",
        name: "Terracotta",
        tokens: { bg: "#faf6f1", surface: "#ffffff", ink: "#2f2520", inkSoft: "#685a52", accent: "#c0704a", accentSoft: "#f1d7c6", accentText: "#904628" },
      },
    ],
  },
  {
    id: "radiant-citrus",
    name: "Radiant Citrus",
    description: "Bright, modern and sunny, with bold serif headlines.",
    palettes: [
      {
        id: "citrus",
        name: "Radiant Citrus",
        tokens: { bg: "#fef9f0", surface: "#fffaf2", ink: "#1f1b16", inkSoft: "#6f5330", accent: "#f5b041", accentSoft: "#fff0cf", accentText: "#9c4a0c" },
      },
      {
        id: "coral",
        name: "Coral Sunset",
        tokens: { bg: "#fff7f3", surface: "#fffbf8", ink: "#24181a", inkSoft: "#704c45", accent: "#f08a6c", accentSoft: "#ffe1d6", accentText: "#a23c23" },
      },
    ],
  },
] as const satisfies readonly TemplateInfo[];

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export const DEFAULT_TEMPLATE_ID: TemplateId = "royal-arch";

export const TEMPLATE_IDS = TEMPLATES.map((template) => template.id) as [TemplateId, ...TemplateId[]];

export function getTemplateInfo(id: string | null | undefined): TemplateInfo {
  return TEMPLATES.find((template) => template.id === id) ?? TEMPLATES[0];
}

/** Falls back to the template's first palette when the id is missing or belongs to another template. */
export function getPalette(templateId: string | null | undefined, paletteId: string | null | undefined): Palette {
  const { palettes } = getTemplateInfo(templateId);
  return palettes.find((palette) => palette.id === paletteId) ?? palettes[0];
}
