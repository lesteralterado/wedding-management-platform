import type { AuthUser, Permission, WeddingRole } from "@/types/domain";
import type { Guest, Rsvp, Wedding, WeddingStaff } from "@prisma/client";

const WEDDING_DATE = new Date("2027-06-12T16:00:00.000Z");
const CREATED_AT = new Date("2027-01-10T10:00:00.000Z");
const UPDATED_AT = new Date("2027-02-01T10:00:00.000Z");

const weddingRecord = {
  id: "mock-wedding-001",
  userId: "mock-user-001",
  brideName: "Cherilyn",
  groomName: "Lester",
  slug: "cherilyn-lester",
  date: WEDDING_DATE,
  venue: "The Golden Orchard Estate",
  venueAddress: "1200 Citrus Avenue, Laguna Beach, CA",
  theme: "Radiant Citrus",
  coverImage: "/images/cover.svg",
  galleryImages: ["/images/gallery-1.svg", "/images/gallery-2.svg", "/images/gallery-3.svg"],
  status: "CONFIRMED" as const,
  createdAt: CREATED_AT,
  updatedAt: UPDATED_AT,
};

const guestSeeds = [
  { fullName: "Lester Santos", email: "lester@example.com", phone: "555-0101", groupName: "Family", inviteCode: "love-lester-santos", seatsAllowed: 2 },
  { fullName: "Mia Santos", email: "mia@example.com", phone: "555-0102", groupName: "Family", inviteCode: "love-mia-santos", seatsAllowed: 1 },
  { fullName: "Noah Santos", email: "noah@example.com", phone: "555-0103", groupName: "Family", inviteCode: "love-noah-santos", seatsAllowed: 2 },
  { fullName: "Ava Reyes", email: "ava@example.com", phone: "555-0104", groupName: "Friends", inviteCode: "love-ava-reyes", seatsAllowed: 1 },
  { fullName: "Ethan Cruz", email: "ethan@example.com", phone: "555-0105", groupName: "Friends", inviteCode: "love-ethan-cruz", seatsAllowed: 2 },
  { fullName: "Sofia Garcia", email: "sofia@example.com", phone: "555-0106", groupName: "Friends", inviteCode: "love-sofia-garcia", seatsAllowed: 1 },
  { fullName: "Lucas Rivera", email: "lucas@example.com", phone: "555-0107", groupName: "Wedding Party", inviteCode: "love-lucas-rivera", seatsAllowed: 1 },
  { fullName: "Isabella Torres", email: "isabella@example.com", phone: "555-0108", groupName: "Wedding Party", inviteCode: "love-isabella-torres", seatsAllowed: 1 },
  { fullName: "Mateo Flores", email: "mateo@example.com", phone: "555-0109", groupName: "Colleagues", inviteCode: "love-mateo-flores", seatsAllowed: 1 },
  { fullName: "Emma Chen", email: "emma@example.com", phone: "555-0110", groupName: "Colleagues", inviteCode: "love-emma-chen", seatsAllowed: 2 },
  { fullName: "James Wilson", email: "james@example.com", phone: "555-0111", groupName: "Colleagues", inviteCode: "love-james-wilson", seatsAllowed: 1 },
  { fullName: "Olivia Brown", email: "olivia@example.com", phone: "555-0112", groupName: "Family", inviteCode: "love-olivia-brown", seatsAllowed: 2 },
];

const rsvpEntries = new Map<string, Rsvp>([
  ["love-lester-santos", { id: "mock-rsvp-0", guestId: "mock-000", status: "GOING", guestCount: 2, note: "Excited to celebrate with you!", submittedAt: new Date("2027-01-15T10:00:00.000Z"), createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-mia-santos", { id: "mock-rsvp-1", guestId: "mock-001", status: "GOING", guestCount: 1, note: "Can't wait!", submittedAt: new Date("2027-01-16T11:30:00.000Z"), createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-noah-santos", { id: "mock-rsvp-2", guestId: "mock-002", status: "PENDING", guestCount: 0, note: null, submittedAt: null, createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-ava-reyes", { id: "mock-rsvp-3", guestId: "mock-003", status: "DECLINED", guestCount: 0, note: "Already booked, but wishing you both the best.", submittedAt: new Date("2027-01-18T09:15:00.000Z"), createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-ethan-cruz", { id: "mock-rsvp-4", guestId: "mock-004", status: "GOING", guestCount: 2, note: "Bringing my plus one.", submittedAt: new Date("2027-01-19T14:20:00.000Z"), createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-sofia-garcia", { id: "mock-rsvp-5", guestId: "mock-005", status: "PENDING", guestCount: 0, note: null, submittedAt: null, createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-lucas-rivera", { id: "mock-rsvp-6", guestId: "mock-006", status: "GOING", guestCount: 1, note: "Ready for the big day!", submittedAt: new Date("2027-01-20T16:45:00.000Z"), createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-isabella-torres", { id: "mock-rsvp-7", guestId: "mock-007", status: "GOING", guestCount: 1, note: "See you there!", submittedAt: new Date("2027-01-21T08:30:00.000Z"), createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-mateo-flores", { id: "mock-rsvp-8", guestId: "mock-008", status: "PENDING", guestCount: 0, note: null, submittedAt: null, createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-emma-chen", { id: "mock-rsvp-9", guestId: "mock-009", status: "DECLINED", guestCount: 0, note: "Sorry, I can't make it.", submittedAt: new Date("2027-01-22T12:00:00.000Z"), createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-james-wilson", { id: "mock-rsvp-10", guestId: "mock-010", status: "PENDING", guestCount: 0, note: null, submittedAt: null, createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
  ["love-olivia-brown", { id: "mock-rsvp-11", guestId: "mock-011", status: "GOING", guestCount: 2, note: "Looking forward to it.", submittedAt: new Date("2027-01-23T13:10:00.000Z"), createdAt: CREATED_AT, updatedAt: UPDATED_AT }],
]);

function uid(index: number): string {
  return `mock-${String(index).padStart(3, "0")}`;
}

const mockGuests: (Guest & { rsvp: Rsvp | null })[] = guestSeeds.map((seed, index) => {
  const rsvp: Rsvp | null = rsvpEntries.get(seed.inviteCode) ?? null;
  return {
    id: uid(index),
    weddingId: "mock-wedding-001",
    fullName: seed.fullName,
    email: seed.email,
    phone: seed.phone,
    groupName: seed.groupName,
    inviteCode: seed.inviteCode,
    seatsAllowed: seed.seatsAllowed,
    qrCode: `<svg>mock-qr-${seed.inviteCode}</svg>`,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
    rsvp,
  };
});

const mockWedding: Wedding & { guests: (Guest & { rsvp: Rsvp | null })[] } = {
  ...weddingRecord,
  guests: mockGuests,
} as Wedding & { guests: (Guest & { rsvp: Rsvp | null })[] };

const mockWeddingStaff: WeddingStaff[] = [
  {
    id: "mock-staff-001",
    weddingId: "mock-wedding-001",
    userId: "mock-user-001",
    role: "OWNER",
    permissions: {},
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
];

export function getMockWedding(): Wedding & { guests: (Guest & { rsvp: Rsvp | null })[] } {
  return mockWedding;
}

export function getMockWeddingStaffRole(userId: string, weddingId: string): WeddingRole | null {
  return mockWeddingStaff.find((staff) => staff.userId === userId && staff.weddingId === weddingId)?.role ?? null;
}

export function getMockPermissions(weddingRole: WeddingRole | null): Permission[] {
  switch (weddingRole) {
    case "OWNER":
    case "CO_ORGANIZER":
      return ["dashboard:read", "wedding:read", "wedding:write", "guests:read", "guests:write", "invitations:read", "invitations:write", "rsvps:read", "gallery:read", "gallery:write", "analytics:read", "settings:write", "checkin:read"];
    case "PLANNER":
      return ["dashboard:read", "wedding:read", "guests:read", "guests:write", "rsvps:read", "analytics:read"];
    case "STAFF":
    case "RECEPTIONIST":
      return ["dashboard:read", "guests:read", "rsvps:read", "checkin:read"];
    case "PHOTOGRAPHER":
      return ["gallery:read"];
    default:
      return [];
  }
}

export function getMockGuests(): (Guest & { rsvp: Rsvp | null })[] {
  return mockGuests;
}

export function getMockGuestGroups(): Array<{ name: string; count: number }> {
  const groups = mockGuests.reduce<Record<string, number>>((acc, guest) => {
    const group = guest.groupName ?? "Ungrouped";
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(groups).map(([name, count]) => ({ name, count }));
}

export function getMockDashboardMetrics() {
  const total = mockGuests.length;
  const confirmed = mockGuests.filter((guest) => guest.rsvp?.status === "GOING").length;
  const pending = mockGuests.filter((guest) => !guest.rsvp || guest.rsvp.status === "PENDING").length;
  const declined = mockGuests.filter((guest) => guest.rsvp?.status === "DECLINED").length;
  const responded = confirmed + declined;

  return {
    total,
    confirmed,
    pending,
    declined,
    responded,
    rsvpRate: total ? Math.round((responded / total) * 100) : 0,
  };
}

export function getMockRsvps() {
  return mockGuests
    .filter((guest) => guest.rsvp?.submittedAt)
    .sort((a, b) => (b.rsvp!.submittedAt!.getTime() - a.rsvp!.submittedAt!.getTime()))
    .slice(0, 10)
    .map((guest, index) => ({
      id: `mock-rsvp-recent-${index}`,
      guest,
      status: guest.rsvp!.status,
      guestCount: guest.rsvp!.guestCount,
      note: guest.rsvp!.note,
      submittedAt: guest.rsvp!.submittedAt!,
    }));
}

export function getMockAnalytics() {
  const total = mockGuests.length;
  const confirmed = mockGuests.filter((guest) => guest.rsvp?.status === "GOING").length;
  const pending = mockGuests.filter((guest) => !guest.rsvp || guest.rsvp.status === "PENDING").length;
  const declined = mockGuests.filter((guest) => guest.rsvp?.status === "DECLINED").length;
  const rsvpRate = total ? Math.round(((confirmed + declined) / total) * 100) : 0;

  const byGroup = mockGuests.reduce<Record<string, number>>((acc, guest) => {
    const group = guest.groupName ?? "Ungrouped";
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentRsvps = mockGuests
    .filter((guest) => guest.rsvp?.submittedAt)
    .sort((a, b) => (b.rsvp!.submittedAt!.getTime() - a.rsvp!.submittedAt!.getTime()))
    .slice(0, 5)
    .map((guest) => ({
      id: guest.id,
      fullName: guest.fullName,
      groupName: guest.groupName,
      status: guest.rsvp!.status,
      submittedAt: guest.rsvp!.submittedAt!,
    }));

  return { total, confirmed, pending, declined, rsvpRate, byGroup, recentRsvps };
}

export function getMockInvitations(): (Guest & { rsvp: Rsvp | null })[] {
  return mockGuests;
}

const mockUsers: Record<UserRole, AuthUser> = {
  SUPER_ADMIN: {
    id: "mock-super-admin-001",
    name: "Platform Administrator",
    email: "superadmin@example.com",
    role: "SUPER_ADMIN",
  },
  CUSTOMER: {
    id: "mock-user-001",
    name: "Cherilyn & Lester Admin",
    email: "admin@example.com",
    role: "CUSTOMER",
  },
  STAFF: {
    id: "mock-staff-user-001",
    name: "Wedding Staff",
    email: "staff@example.com",
    role: "STAFF",
  },
};

export function getMockUser(role: UserRole = "CUSTOMER"): AuthUser {
  return mockUsers[role];
}
