import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({ className, children, variant = "default" }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "outline" | "success" | "danger" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          "bg-primary/20 text-amber-900": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "border border-border bg-background": variant === "outline",
          "bg-emerald-100 text-emerald-800": variant === "success",
          "bg-red-100 text-red-800": variant === "danger",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
