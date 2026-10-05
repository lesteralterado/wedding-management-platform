import type { CSSProperties, ReactNode } from "react";
import type { ThemeTokens } from "./catalog";

export type TemplateFonts = { heading: string; body: string; script?: string };

/**
 * Applies a palette to everything inside it. Sets the `--t-*` tokens templates are written against,
 * and re-points the dashboard's own tokens too, so shared UI pieces (inputs, buttons, toasts)
 * pick up the couple's colours instead of the platform's.
 */
export function ThemeScope({ tokens, fonts, className = "", children }: {
  tokens: ThemeTokens;
  fonts: TemplateFonts;
  className?: string;
  children: ReactNode;
}) {
  const border = `color-mix(in srgb, ${tokens.accent} 22%, transparent)`;
  const style = {
    "--t-bg": tokens.bg,
    "--t-surface": tokens.surface,
    "--t-ink": tokens.ink,
    "--t-ink-soft": tokens.inkSoft,
    "--t-accent": tokens.accent,
    "--t-accent-soft": tokens.accentSoft,
    "--t-accent-text": tokens.accentText,
    "--t-font-heading": fonts.heading,
    "--t-font-body": fonts.body,
    "--t-font-script": fonts.script ?? fonts.heading,

    "--background": tokens.bg,
    "--foreground": tokens.ink,
    "--card": tokens.surface,
    "--card-foreground": tokens.ink,
    "--primary": tokens.accentText,
    "--primary-foreground": tokens.bg,
    "--secondary": tokens.accentSoft,
    "--secondary-foreground": tokens.ink,
    "--muted": tokens.accentSoft,
    "--muted-foreground": tokens.inkSoft,
    "--accent": tokens.accentText,
    "--accent-foreground": tokens.bg,
    "--border": border,
    "--input": border,
    "--ring": `color-mix(in srgb, ${tokens.accent} 45%, transparent)`,
  } as CSSProperties;

  return (
    <div style={style} className={`min-h-screen bg-t-bg font-t-body text-t-ink antialiased ${className}`}>
      {children}
    </div>
  );
}
