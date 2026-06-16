"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GuestForm } from "./guest-form";
import type { GuestWithRsvp } from "@/features/guests/types";

export function EditGuestDialog({ guest, onUpdated }: { guest: GuestWithRsvp; onUpdated: () => void }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Edit</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Edit guest">
        <DialogContent>
          <GuestForm weddingId={guest.weddingId} guest={guest} onSuccess={() => { setOpen(false); onUpdated(); }} />
        </DialogContent>
      </Dialog>
    </>
  );
}
