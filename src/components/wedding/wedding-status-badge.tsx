import { Badge } from "@/components/ui/badge";
import type { WeddingStatus } from "@/types/domain";

const labels: Record<WeddingStatus, string> = {
  PLANNING: "Planning",
  ENGAGED: "Engaged",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
};

export function WeddingStatusBadge({ status }: { status: WeddingStatus }) {
  return <Badge variant={status === "CONFIRMED" ? "success" : "default"}>{labels[status]}</Badge>;
}
