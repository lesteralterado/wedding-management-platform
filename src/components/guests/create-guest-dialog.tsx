"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GuestForm } from "./guest-form";

export function CreateGuestDialog({ weddingId, onCreated }: { weddingId: string; onCreated: () => void }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Guest</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Create guest">
        <DialogContent>
          <GuestForm weddingId={weddingId} onSuccess={() => { setOpen(false); onCreated(); router.refresh(); }} />
        </DialogContent>
      </Dialog>
    </>
  );
}
