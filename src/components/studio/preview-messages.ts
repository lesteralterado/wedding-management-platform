import type { Site } from "@/templates/sections";

// postMessage protocol between the Studio and its preview iframe.
export const PREVIEW_MESSAGES = {
  /** Sent by the Studio once it is listening; the preview answers with `ready`. */
  ping: "studio-preview:ping",
  ready: "studio-preview:ready",
  site: "studio-preview:site",
  scrollTo: "studio-preview:scroll-to",
} as const;

export type PreviewMessage =
  | { type: typeof PREVIEW_MESSAGES.ping }
  | { type: typeof PREVIEW_MESSAGES.ready }
  | { type: typeof PREVIEW_MESSAGES.site; site: Site }
  | { type: typeof PREVIEW_MESSAGES.scrollTo; id: string };
