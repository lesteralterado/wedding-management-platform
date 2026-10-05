import type { TemplateDefinition } from "../registry-types";
import { Events } from "./events";
import { Faq } from "./faq";
import { royalArchFontClassName, royalArchFonts } from "./fonts";
import { Gallery } from "./gallery";
import { Hero } from "./hero";
import { RoyalArchLayout } from "./layout";
import { Rsvp } from "./rsvp";
import { Story } from "./story";

export const royalArch: TemplateDefinition = {
  fonts: royalArchFonts,
  fontClassName: royalArchFontClassName,
  Layout: RoyalArchLayout,
  sections: { HERO: Hero, STORY: Story, EVENTS: Events, GALLERY: Gallery, RSVP: Rsvp, FAQ: Faq },
};
