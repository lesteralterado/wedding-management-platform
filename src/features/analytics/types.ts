export interface AnalyticsSnapshot {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  rsvpRate: number;
  byGroup: Record<string, number>;
  recentRsvps: Array<{
    id: string;
    fullName: string;
    groupName?: string | null;
    status: string;
    submittedAt?: Date | null;
  }>;
}
