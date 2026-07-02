import "server-only";
import { getMockDashboardMetrics } from "@/lib/demo/demo-data";
import type { WeddingRole } from "@/types/domain";

export async function getDashboardMetrics(weddingId: string, weddingRole?: WeddingRole | null) {
  return getMockDashboardMetrics(weddingRole ?? "OWNER");
}