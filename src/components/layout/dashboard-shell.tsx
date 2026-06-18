"use client";

import * as React from "react";
import { AppSidebar } from "./app-sidebar";
import { MobileNav } from "./mobile-nav";
import { RoleSwitcher } from "@/components/demo/role-switcher";
import type { UserRole, WeddingRole } from "@/types/domain";

export function DashboardShell({ children, userRole, weddingRole }: {
  children: React.ReactNode;
  userRole?: UserRole;
  weddingRole?: WeddingRole | null;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [isDemo, setIsDemo] = React.useState(false);
  const [demoRole, setDemoRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    function readCookies() {
      const cookies = document.cookie.split(";").reduce<Record<string, string>>((acc, raw) => {
        const [k, ...rest] = raw.trim().split("=");
        acc[k] = decodeURIComponent(rest.join("="));
        return acc;
      }, {});
      const demo = cookies["demo"] === "true";
      const role = cookies["demo-role"] || null;
      setIsDemo(demo);
      setDemoRole(role);
    }
    readCookies();
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="hidden h-screen sticky top-0 lg:flex">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} userRole={userRole} weddingRole={weddingRole} />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <MobileNav userRole={userRole} weddingRole={weddingRole} />
        </header>
        {isDemo && (
          <div className="border-b border-border bg-secondary/60 px-4 py-2">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Demo mode</span>
              <RoleSwitcher currentRole={demoRole || weddingRole || userRole || "OWNER"} />
            </div>
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
