import type { ComponentType, ReactNode } from "react";
import type { SectionContent, SectionType, Site } from "./sections";
import type { TemplateFonts } from "./theme-scope";

export type SectionProps<T extends SectionType> = { content: SectionContent<T>; site: Site };

export type NavLink = { id: string; label: string };

export type TemplateLayoutProps = { site: Site; nav: NavLink[]; children: ReactNode };

/** The React side of a template. Every template renders every section type. */
export type TemplateDefinition = {
  fonts: TemplateFonts;
  /** next/font variable classes that make `fonts` resolvable. */
  fontClassName: string;
  Layout: ComponentType<TemplateLayoutProps>;
  sections: { [T in SectionType]: ComponentType<SectionProps<T>> };
};
