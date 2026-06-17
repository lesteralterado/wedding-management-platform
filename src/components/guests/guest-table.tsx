"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { regenerateInviteCode } from "@/features/guests/actions";
import type { GuestWithRsvp } from "@/features/guests/types";
import { EditGuestDialog } from "./edit-guest-dialog";

export function GuestTable({ guests, groups, readOnly = false }: { guests: GuestWithRsvp[]; groups: Array<{ name: string; count: number }>; readOnly?: boolean }) {
  const [search, setSearch] = React.useState("");
  const [group, setGroup] = React.useState("all");
  const [refreshKey, setRefreshKey] = React.useState(0);

  const filtered = guests.filter((guest) => {
    const matchesSearch = guest.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = group === "all" || guest.groupName === group;
    return matchesSearch && matchesGroup;
  });

  async function regenerate(guestId: string) {
    const result = await regenerateInviteCode(guestId);
    if (!result.success) {
      toast.error("Unable to regenerate invite.");
      return;
    }
    toast.success("Invite code regenerated.");
    setRefreshKey((value) => value + 1);
  }

  async function remove(guestId: string) {
    if (!confirm("Delete this guest?")) return;
    const response = await fetch(`/api/guests/${guestId}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Unable to delete guest.");
      return;
    }
    toast.success("Guest deleted.");
    setRefreshKey((value) => value + 1);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guests..." />
        <Select value={group} onChange={(event) => setGroup(event.target.value)}>
          <option value="all">All groups</option>
          {groups.map((item) => (
            <option key={item.name} value={item.name}>{item.name} ({item.count})</option>
          ))}
        </Select>
      </div>
      <Table key={refreshKey}>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invite</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell>
                <p className="font-semibold">{guest.fullName}</p>
                <p className="text-xs text-muted-foreground">{guest.email || guest.phone || "No contact"}</p>
              </TableCell>
              <TableCell>{guest.groupName || "Ungrouped"}</TableCell>
              <TableCell>{guest.seatsAllowed}</TableCell>
              <TableCell><Status status={guest.rsvp?.status ?? "PENDING"} /></TableCell>
              <TableCell className="font-mono text-xs">{guest.inviteCode}</TableCell>
              <TableCell className="text-right">
                {readOnly ? (
                  <span className="text-xs text-muted-foreground">Read-only</span>
                ) : (
                  <div className="flex justify-end gap-2">
                    <EditGuestDialog guest={guest} onUpdated={() => setRefreshKey((value) => value + 1)} />
                    <Button variant="outline" size="sm" onClick={() => regenerate(guest.id)}>Regenerate</Button>
                    <Button variant="destructive" size="sm" onClick={() => remove(guest.id)}>Delete</Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {!filtered.length && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No guests found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const variant = status === "GOING" ? "success" : status === "DECLINED" ? "danger" : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}
