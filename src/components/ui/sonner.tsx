"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster({ richColors = true, position = "top-right" }: { richColors?: boolean; position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  return <Sonner richColors={richColors} position={position} />;
}
