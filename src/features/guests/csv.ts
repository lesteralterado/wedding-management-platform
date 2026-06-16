import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { ImportGuestRow } from "./schemas";

export function parseGuestCsv(content: string) {
  const parsed = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
  });

  return normalizeRows(parsed.data);
}

export async function parseGuestFile(file: File) {
  const bytes = await file.arrayBuffer();

  if (file.name.toLowerCase().endsWith(".csv")) {
    const text = new TextDecoder().decode(bytes);
    return parseGuestCsv(text);
  }

  const workbook = XLSX.read(bytes, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet, { header: 1 }) as unknown as Array<Array<string | number>>;
  const headers = rows[0]?.map((header) => String(header)) ?? [];
  const data = rows.slice(1).map((row) => {
    const entry: Record<string, string | number> = {};
    headers.forEach((header, index) => {
      entry[header] = row[index] ?? "";
    });
    return entry;
  });

  return normalizeRows(data as Record<string, string>[]);
}

function normalizeRows(rows: Array<Record<string, string>>): ImportGuestRow[] {
  return rows.map((row) => ({
    fullName: String(row.fullName || row.name || ""),
    email: String(row.email || ""),
    phone: String(row.phone || ""),
    groupName: String(row.groupName || row.group || ""),
    seatsAllowed: Number(row.seatsAllowed || row.seats || 1),
  }));
}
