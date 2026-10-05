"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Site } from "@/templates/sections";
import { PREVIEW_MESSAGES } from "./preview-messages";

export type Device = "phone" | "desktop";

const DEVICES: Record<Device, { width: number; height: number }> = {
  phone: { width: 390, height: 844 },
  desktop: { width: 1280, height: 800 },
};

/**
 * The couple's site in an iframe at a real device size, scaled down to fit the panel, so fixed
 * navigation and full-screen sections behave exactly as they will for guests.
 */
export function PreviewFrame({ site, device, focusId }: { site: Site; device: Device; focusId: string | null }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);
  const size = DEVICES[device];

  const post = useCallback((message: object) => {
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin === window.location.origin && event.source === frameRef.current?.contentWindow && event.data?.type === PREVIEW_MESSAGES.ready) {
        setReady(true);
      }
    }
    window.addEventListener("message", onMessage);
    // The preview may have loaded (and announced itself) before this listener existed.
    post({ type: PREVIEW_MESSAGES.ping });
    return () => window.removeEventListener("message", onMessage);
  }, [post]);

  // Send edits after a short pause so typing stays smooth.
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => post({ type: PREVIEW_MESSAGES.site, site }), 150);
    return () => clearTimeout(timer);
  }, [ready, site, post]);

  useEffect(() => {
    if (ready && focusId) post({ type: PREVIEW_MESSAGES.scrollTo, id: focusId });
  }, [ready, focusId, post]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const bezel = 12;
      setScale(Math.max(0.1, Math.min(1, (width - bezel) / size.width, (height - bezel) / size.height)));
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [size.width, size.height]);

  return (
    <div ref={boxRef} className="flex h-full min-h-0 w-full items-start justify-center overflow-hidden">
      <div
        className="shrink-0 overflow-hidden rounded-[1.75rem] border-[6px] border-neutral-900 bg-white shadow-2xl"
        style={{ width: size.width * scale + 12, height: size.height * scale + 12 }}
      >
        <iframe
          ref={frameRef}
          src="/studio-preview"
          // Also ask once the document has loaded, in case the first ping reached an empty frame.
          onLoad={() => post({ type: PREVIEW_MESSAGES.ping })}
          title="Live preview of your wedding website"
          className="origin-top-left border-0"
          style={{ width: size.width, height: size.height, transform: `scale(${scale})` }}
        />
      </div>
    </div>
  );
}
