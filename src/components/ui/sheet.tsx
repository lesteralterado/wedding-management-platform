"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Sheet({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm" onClick={() => onOpenChange(false)} />}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 max-w-[86vw] translate-x-0 border-r border-border bg-background p-5 shadow-warm transition-transform duration-200",
          !open && "-translate-x-full"
        )}
      >
        <button onClick={() => onOpenChange(false)} aria-label="Close navigation" className="mb-5 rounded-full p-2 hover:bg-secondary">
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </>
  );
}
