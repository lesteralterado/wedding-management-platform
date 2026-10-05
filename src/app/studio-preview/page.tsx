"use client";

import { useEffect, useState } from "react";
import { WeddingSite } from "@/templates/registry";
import type { Site } from "@/templates/sections";
import { PREVIEW_MESSAGES, type PreviewMessage } from "@/components/studio/preview-messages";

/**
 * Rendered inside the Studio's iframe. It shows whatever unsaved site the Studio sends, so the
 * couple sees each edit exactly as guests will, isolated from the dashboard's own layout.
 */
export default function StudioPreviewPage() {
  const [site, setSite] = useState<Site | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent<PreviewMessage>) {
      // Only the Studio that embeds this page may drive it.
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === PREVIEW_MESSAGES.ping) window.parent.postMessage({ type: PREVIEW_MESSAGES.ready }, window.location.origin);
      if (event.data?.type === PREVIEW_MESSAGES.site) setSite(event.data.site);
      if (event.data?.type === PREVIEW_MESSAGES.scrollTo) {
        const target = document.getElementById(event.data.id);
        if (target) window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
      }
    }
    window.addEventListener("message", onMessage);
    // Whichever side loads last starts the conversation: announce readiness now, and answer pings.
    window.parent.postMessage({ type: PREVIEW_MESSAGES.ready }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!site) return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading preview…</div>;
  return <WeddingSite site={site} preview />;
}
