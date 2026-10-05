import { Cormorant_Garamond, Great_Vibes, Montserrat } from "next/font/google";
import type { TemplateFonts } from "../theme-scope";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-royal-heading",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-royal-body",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-royal-script",
  display: "swap",
});

export const royalArchFontClassName = `${cormorant.variable} ${montserrat.variable} ${greatVibes.variable}`;

export const royalArchFonts: TemplateFonts = {
  heading: "var(--font-royal-heading), serif",
  body: "var(--font-royal-body), sans-serif",
  script: "var(--font-royal-script), cursive",
};
