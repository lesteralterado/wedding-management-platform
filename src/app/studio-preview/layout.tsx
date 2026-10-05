import type { Metadata } from "next";

export const metadata: Metadata = { title: "Studio preview", robots: { index: false, follow: false } };

export default function StudioPreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
