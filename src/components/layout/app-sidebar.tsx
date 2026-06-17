"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, CalendarHeart, GalleryVerticalEnd, Home, Mail, Settings2, ShieldCheck, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { UserRole, WeddingRole } from "@/types/domain";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: WeddingRole[];
};

const weddingNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home, roles: ["OWNER", "CO_ORGANIZER", "PLANNER", "STAFF", "RECEPTIONIST"] },
  { href: "/dashboard/wedding", label: "Wedding Details", icon: CalendarHeart, roles: ["OWNER", "CO_ORGANIZER"] },
  { href: "/dashboard/guests", label: "Guests", icon: UsersRound, roles: ["OWNER", "CO_ORGANIZER", "PLANNER", "STAFF", "RECEPTIONIST"] },
  { href: "/dashboard/invitations", label: "Invitations", icon: Mail, roles: ["OWNER", "CO_ORGANIZER"] },
  { href: "/dashboard/rsvps", label: "RSVPs", icon: Mail, roles: ["OWNER", "CO_ORGANIZER", "PLANNER", "STAFF", "RECEPTIONIST"] },
  { href: "/dashboard/gallery", label: "Gallery", icon: GalleryVerticalEnd, roles: ["OWNER", "CO_ORGANIZER", "PHOTOGRAPHER"] },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, roles: ["OWNER", "CO_ORGANIZER", "PLANNER"] },
  { href: "/dashboard/settings", label: "Settings", icon: Settings2, roles: ["OWNER"] },
];

const platformNav: NavItem[] = [
  { href: "/platform", label: "Platform Dashboard", icon: Home },
  { href: "/platform/users", label: "Users Mgmt", icon: UsersRound },
  { href: "/platform/weddings", label: "Weddings Mgmt", icon: CalendarHeart },
  { href: "/platform/subscriptions", label: "Subscriptions", icon: Building2 },
  { href: "/platform/security", label: "Security", icon: ShieldCheck },
];

export function AppSidebar({ collapsed, onToggle, mobile = false, userRole, weddingRole }: {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
  userRole?: UserRole;
  weddingRole?: WeddingRole | null;
}) {
  const pathname = usePathname();
  const nav = userRole === "SUPER_ADMIN" ? platformNav : weddingNav.filter((item) => !item.roles || item.roles.includes(weddingRole as WeddingRole));

  return (
    <aside className={cn("flex h-full flex-col", collapsed && !mobile ? "w-20" : "w-72")}>
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        {!collapsed || mobile ? (
          <Link href={userRole === "SUPER_ADMIN" ? "/platform" : "/dashboard"} className="min-w-0">
            <p className="font-display text-xl font-black text-foreground">{userRole === "SUPER_ADMIN" ? "WeddingFlow" : "Cherilyn & Lester"}</p>
            <p className="text-xs text-muted-foreground">{userRole === "SUPER_ADMIN" ? "Platform Console" : "Wedding SaaS"}</p>
          </Link>
        ) : (
          userRole === "SUPER_ADMIN" ? <ShieldCheck className="h-7 w-7 text-accent" /> : <CalendarHeart className="h-7 w-7 text-accent" />
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
          const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/platform" && pathname.startsWith(item.href));
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
              <p className="font-display text-sm font-black">{userRole === "SUPER_ADMIN" ? "Platform access" : "Radiant Citrus"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{userRole === "SUPER_ADMIN" ? "Manage tenants, users, and plans." : "Gold-orange wedding experience"}</p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
