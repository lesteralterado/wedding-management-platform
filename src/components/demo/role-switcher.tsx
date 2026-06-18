"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import type { UserRole, WeddingRole } from "@/types/domain";

const ROLE_OPTIONS: Array<{ label: string; value: UserRole | WeddingRole }> = [
  { label: "Owner", value: "OWNER" },
  { label: "Co-Organizer", value: "CO_ORGANIZER" },
  { label: "Planner", value: "PLANNER" },
  { label: "Staff", value: "STAFF" },
  { label: "Receptionist", value: "RECEPTIONIST" },
  { label: "Photographer", value: "PHOTOGRAPHER" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

export function RoleSwitcher({ currentRole }: { currentRole: string }) {
  const [open, setOpen] = React.useState(false);
  const pendingRef = React.useRef(false);

  async function setRole(role: UserRole | WeddingRole) {
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      const res = await fetch("/api/demo/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        toast.success(`Switched to ${role}`);
        window.location.reload();
      } else {
        toast.error("Unable to switch role.");
      }
    } catch {
      toast.error("Unable to switch role.");
    } finally {
      pendingRef.current = false;
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" className="gap-2" onClick={() => setOpen((v) => !v)}>
        <UserRound className="h-4 w-4" />
        <span className="hidden sm:inline">{currentRole || "Role"}</span>
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-border bg-card p-1 shadow-warm">
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setRole(option.value)}
                className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
