"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseGuestFile } from "@/features/guests/csv";
import type { ImportGuestRow } from "@/features/guests/schemas";

export function CsvImportDialog({ weddingId, onImported }: { weddingId: string; onImported: () => void }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [rows, setRows] = React.useState<ImportGuestRow[]>([]);
  const [pending, setPending] = React.useState(false);

  async function parseFile() {
    if (!file) return;
    const parsed = await parseGuestFile(file);
    setRows(parsed);
    toast.success(`Previewed ${parsed.length} rows.`);
  }

  async function commit() {
    if (!rows.length) return;
    setPending(true);
    const response = await fetch("/api/guests/import-commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weddingId, rows }),
    });
    setPending(false);

    if (!response.ok) {
      toast.error("Unable to import guests.");
      return;
    }

    toast.success("Guests imported.");
    setOpen(false);
    setRows([]);
    onImported();
    router.refresh();
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Import CSV</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Import guests from CSV">
        <DialogContent>
          <div className="space-y-4">
            <div>
              <Label>CSV file</Label>
              <Input type="file" accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
              <p className="mt-2 text-sm text-muted-foreground">Expected columns: fullName, email, phone, groupName, seatsAllowed. CSV and Excel files are supported.</p>
            </div>
            <Button type="button" variant="outline" onClick={parseFile} disabled={!file}>Parse and preview</Button>
            {rows.length > 0 && (
              <div className="max-h-72 overflow-auto rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Seats</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={`${row.fullName}-${index}`}>
                        <TableCell>{row.fullName}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.groupName || "Ungrouped"}</TableCell>
                        <TableCell>{row.seatsAllowed}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={commit} disabled={!rows.length || pending}>{pending ? "Importing..." : "Commit import"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
