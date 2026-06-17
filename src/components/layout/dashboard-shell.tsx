"use client";

import * as React from "react";
import { AppSidebar } from "./app-sidebar";
import { MobileNav } from "./mobile-nav";
import type { UserRole, WeddingRole } from "@/types/domain";

export function DashboardShell({ children, userRole, weddingRole }: {
  children: React.ReactNode;
  userRole?: UserRole;
  weddingRole?: WeddingRole | null;
}) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="hidden h-screen sticky top-0 lg:flex">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} userRole={userRole} weddingRole={weddingRole} />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <MobileNav userRole={userRole} weddingRole={weddingRole} />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
