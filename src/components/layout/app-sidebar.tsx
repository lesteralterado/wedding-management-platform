"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarHeart, GalleryVerticalEnd, Home, Mail, MapPin, Settings2, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/wedding", label: "Wedding Details", icon: CalendarHeart },
  { href: "/dashboard/guests", label: "Guests", icon: UsersRound },
  { href: "/dashboard/invitations", label: "Invitations", icon: Mail },
  { href: "/dashboard/rsvps", label: "RSVPs", icon: Mail },
  { href: "/dashboard/gallery", label: "Gallery", icon: GalleryVerticalEnd },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings2 },
];

export function AppSidebar({ collapsed, onToggle, mobile = false }: { collapsed: boolean; onToggle: () => void; mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-full flex-col", collapsed && !mobile ? "w-20" : "w-72")}>
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        {!collapsed || mobile ? (
          <Link href="/dashboard" className="min-w-0">
            <p className="font-display text-xl font-black text-foreground">Cherilyn & Lester</p>
            <p className="text-xs text-muted-foreground">Wedding SaaS</p>
          </Link>
        ) : (
          <CalendarHeart className="h-7 w-7 text-accent" />
        )}
        {!mobile && (
          <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Toggle sidebar">
            {collapsed ? "→" : "←"}
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active ? "bg-primary/20 text-amber-950" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {(!collapsed || mobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className={cn("rounded-[1.25rem] bg-secondary p-4", collapsed && !mobile && "p-3 text-center")}>
          {(!collapsed || mobile) && (
            <>
              <p className="font-display text-sm font-black">Radiant Citrus</p>
              <p className="mt-1 text-xs text-muted-foreground">Gold-orange wedding experience</p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
