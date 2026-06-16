import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground shadow-warm hover:bg-[#f0a020]": variant === "default",
          "bg-secondary text-secondary-foreground hover:bg-orange-100": variant === "secondary",
          "border border-border bg-background text-foreground hover:bg-secondary": variant === "outline",
          "text-foreground hover:bg-secondary/70": variant === "ghost",
          "bg-destructive text-destructive-foreground hover:bg-red-700": variant === "destructive",
          "h-8 px-3 text-xs": size === "sm",
          "h-11 px-5 text-sm": size === "md",
          "h-12 px-7 text-base": size === "lg",
          "h-10 w-10": size === "icon",
        },
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
