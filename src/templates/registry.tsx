import type { ComponentType } from "react";
import type { TemplateId } from "./catalog";
import { radiantCitrus } from "./radiant-citrus";
import type { SectionProps, TemplateDefinition } from "./registry-types";
import { royalArch } from "./royal-arch";
import { SECTION_NAV, type Site, type SiteSection } from "./sections";
import { ThemeScope } from "./theme-scope";

const templates: Record<TemplateId, TemplateDefinition> = {
  "royal-arch": royalArch,
  "radiant-citrus": radiantCitrus,
};

/** Renders a wedding website (or a guest's personal invitation) with the couple's template and palette. */
export function WeddingSite({ site, preview = false }: { site: Site; preview?: boolean }) {
  const template = templates[site.templateId];
  const nav = site.sections.filter((section) => section.type !== "HERO").map((section) => SECTION_NAV[section.type]);

  return (
    <ThemeScope tokens={site.palette.tokens} fonts={template.fonts} className={template.fontClassName}>
      <template.Layout site={site} nav={nav} preview={preview}>
        {site.sections.map((section) => (
          <Section key={section.type} template={template} section={section} site={site} />
        ))}
      </template.Layout>
    </ThemeScope>
  );
}

function Section({ template, section, site }: { template: TemplateDefinition; section: SiteSection; site: Site }) {
  // `sections` is keyed by type, so the component always matches the content's shape.
  const Component = template.sections[section.type] as ComponentType<SectionProps<typeof section.type>>;
  return <Component content={section.content} site={site} />;
}
