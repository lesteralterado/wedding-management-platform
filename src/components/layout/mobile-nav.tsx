"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { AppSidebar } from "./app-sidebar";
import type { UserRole, WeddingRole } from "@/types/domain";

export function MobileNav({ userRole, weddingRole }: { userRole?: UserRole; weddingRole?: WeddingRole | null }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <AppSidebar collapsed={false} onToggle={() => setOpen(false)} mobile userRole={userRole} weddingRole={weddingRole} />
      </Sheet>
    </>
  );
}
