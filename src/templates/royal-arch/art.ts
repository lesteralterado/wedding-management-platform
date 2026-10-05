// Royal Arch artwork lives in /public/templates/royal-arch.
export const art = (file: string) => `/templates/royal-arch/${file}`;

// The arch, doors and section borders are painted on these ivory papers; surfaces that meet the
// artwork use them so there is no visible seam, whatever palette the couple picks.
export const PAPER = "#f4eadc";
export const ARCH_PAPER = "#f4ebdf";
export const CURTAIN = "#f3ece1";

export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;
