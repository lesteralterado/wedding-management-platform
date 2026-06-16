"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { AppSidebar } from "./app-sidebar";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <AppSidebar collapsed={false} onToggle={() => setOpen(false)} mobile />
      </Sheet>
    </>
  );
}
