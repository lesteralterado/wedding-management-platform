"use client";

import * as React from "react";
import { Copy, QrCode, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateGuestQr, sendSingleInvite, sendBulkInvitesAction } from "@/features/invitations/actions";
import type { GuestWithRsvp } from "@/features/guests/types";

export function InvitationList({ guests, weddingId, readOnly = false }: { guests: GuestWithRsvp[]; weddingId: string; readOnly?: boolean }) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState<string | null>(null);
  const [bulkSending, setBulkSending] = React.useState(false);

  async function generate(guestId: string) {
    const result = await generateGuestQr(guestId);
    if (result.error) {
      toast.error(result.error.guestId?.[0] ?? "Unable to generate QR.");
      return;
    }
    setSelected(result.qrCode);
    toast.success("QR code generated.");
  }

  async function sendEmail(guestId: string) {
    setSending(guestId);
    const result = await sendSingleInvite(guestId);
    if (result.success) {
      toast.success("Invitation email sent.");
    } else {
      toast.error(result.error ?? "Failed to send email.");
    }
    setSending(null);
  }

  async function sendAll() {
    if (!weddingId) return;
    setBulkSending(true);
    const result = await sendBulkInvitesAction(weddingId);
    if (result.failed === 0) {
      toast.success(`Sent ${result.success} invitation emails.`);
    } else {
      toast.warning(`Sent ${result.success}, failed ${result.failed}.`);
    }
    setBulkSending(false);
  }

  function copyInvite(guest: GuestWithRsvp) {
    const url = `${window.location.origin}/invite/${guest.inviteCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Invitation link copied.");
  }

  return (
    <>
      {!readOnly && (
        <div className="mb-4 flex justify-end">
          <Button onClick={sendAll} disabled={bulkSending || guests.length === 0}>
            <Send className="mr-2 h-4 w-4" />
            {bulkSending ? "Sending..." : "Send All Invitations"}
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Invite Code</TableHead>
            <TableHead>QR</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell>
                <p className="font-semibold">{guest.fullName}</p>
                <p className="text-xs text-muted-foreground">{guest.groupName || "Ungrouped"}</p>
              </TableCell>
              <TableCell className="font-mono text-xs">{guest.inviteCode}</TableCell>
              <TableCell>{guest.qrCode ? <QrCode className="h-5 w-5 text-accent" /> : <span className="text-sm text-muted-foreground">Not generated</span>}</TableCell>
              <TableCell className="text-xs">{guest.email || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyInvite(guest)}><Copy className="mr-2 h-4 w-4" />Copy</Button>
                  {!readOnly && (
                    <>
                      <Button size="sm" onClick={() => generate(guest.id)}>Generate QR</Button>
                      {guest.email && (
                        <Button variant="secondary" size="sm" onClick={() => sendEmail(guest.id)} disabled={sending === guest.id}>
                          <Mail className="mr-2 h-4 w-4" />
                          {sending === guest.id ? "Sending..." : "Email"}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} title="QR code">
        <DialogContent>
          {selected && <div className="rounded-[1.5rem] bg-background p-6 text-center"><div dangerouslySetInnerHTML={{ __html: selected }} /></div>}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function InvitationHero({ weddingSlug }: { weddingSlug: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation links</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Share this public wedding website: <code className="rounded bg-secondary px-2 py-1">{`${typeof window === "undefined" ? "" : window.location.origin}/w/${weddingSlug}`}</code></p>
      </CardContent>
    </Card>
  );
}
