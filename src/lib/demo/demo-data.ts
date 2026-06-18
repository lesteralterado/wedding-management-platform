import type { AuthUser, Permission, WeddingRole } from "@/types/domain";
import type { Guest, Rsvp, Wedding } from "@prisma/client";

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

function getMockWeddingStaff() {
  return [
    { id: "mock-staff-001", weddingId: "mock-wedding-001", userId: "mock-user-001", role: "OWNER" as WeddingRole, permissions: {}, createdAt: CREATED_AT, updatedAt: UPDATED_AT },
  ];
}

export function getMockWedding(): Wedding & { guests: (Guest & { rsvp: Rsvp | null })[] } {
  return mockWedding;
}

export function getMockWeddingStaffRole(_userId: string, _weddingId: string): WeddingRole | null {
  return getMockWeddingStaff()[0]?.role ?? null;
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
      return ["dashboard:read", "gallery:read"];
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
  }, {});
  return Object.entries(groups).map(([name, count]) => ({ name, count }));
}

export function getMockDashboardMetrics(role: WeddingRole | string = "OWNER") {
  const total = mockGuests.length;
  const confirmed = mockGuests.filter((g) => g.rsvp?.status === "GOING").length;
  const pending = mockGuests.filter((g) => !g.rsvp || g.rsvp.status === "PENDING").length;
  const declined = mockGuests.filter((g) => g.rsvp?.status === "DECLINED").length;
  const responded = confirmed + declined;
  const rsvpRate = total ? Math.round(((confirmed + declined) / total) * 100) : 0;
  const base = { total, confirmed, pending, declined, responded, rsvpRate };

  switch (role) {
    case "PLANNER":
      return { ...base, tasksCompleted: 18, tasksPending: 7, vendorsConfirmed: 12, timelineProgress: 78 };
    case "STAFF":
    case "RECEPTIONIST":
      return { ...base, checkedIn: 87, pendingCheckIn: 41, tablesReady: 12, lastScan: "2 min ago" };
    case "PHOTOGRAPHER":
      return { ...base, totalPhotos: 342, totalVideos: 28, storageUsed: "4.2 GB", uploadsToday: 24 };
    default:
      return { ...base, invitationsSent: 12, galleryCount: 6, budgetUsed: 65 };
  }
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
  const byGroup = mockGuests.reduce<Record<string, number>>((acc, guest) => {
    const group = guest.groupName ?? "Ungrouped";
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
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
  return { total, confirmed, pending, declined, byGroup, recentRsvps };
}

export function getMockInvitations(): (Guest & { rsvp: Rsvp | null })[] {
  return mockGuests;
}

export function getMockRecentRsvps() {
  return mockGuests
    .filter((g) => g.rsvp?.submittedAt)
    .sort((a, b) => (b.rsvp!.submittedAt!.getTime() - a.rsvp!.submittedAt!.getTime()))
    .slice(0, 5)
    .map((g, i) => ({
      id: `mock-recent-${i}`,
      name: g.fullName,
      status: g.rsvp!.status,
      count: g.rsvp!.guestCount,
      time: g.rsvp!.submittedAt!,
    }));
}

const mockUsers: Record<string, AuthUser> = {
  SUPER_ADMIN: { id: "mock-super-admin-001", name: "Platform Administrator", email: "superadmin@example.com", role: "SUPER_ADMIN" },
  CUSTOMER: { id: "mock-user-001", name: "Cherilyn & Lester Admin", email: "admin@example.com", role: "CUSTOMER" },
  STAFF: { id: "mock-staff-user-001", name: "Wedding Staff", email: "staff@example.com", role: "STAFF" },
};

export function getMockUser(role: string = "CUSTOMER"): AuthUser {
  return mockUsers[role] || mockUsers.CUSTOMER;
}

export function getMockPlatformMetrics() {
  return {
    totalWeddings: 1247,
    activeSubscriptions: 892,
    monthlyRevenue: 89450,
    totalUsers: 3412,
    newSignupsThisWeek: 48,
    churnRate: 2.1,
    avgRevenuePerUser: 89,
    supportTicketsOpen: 12,
  };
}

export function getMockPlatformUsers() {
  return [
    { id: "u1", name: "Cherilyn Santos", email: "cherilyn@example.com", role: "CUSTOMER", weddings: 1, joined: "2026-12-01", status: "Active" },
    { id: "u2", name: "Lester Santos", email: "lester@example.com", role: "CUSTOMER", weddings: 1, joined: "2026-12-01", status: "Active" },
    { id: "u3", name: "Mia Planner", email: "mia@planner.com", role: "CUSTOMER", weddings: 3, joined: "2026-10-15", status: "Active" },
    { id: "u4", name: "Eva Designer", email: "eva@designer.com", role: "CUSTOMER", weddings: 2, joined: "2026-11-20", status: "Active" },
    { id: "u5", name: "Marco Studio", email: "marco@studio.com", role: "CUSTOMER", weddings: 5, joined: "2026-09-05", status: "Active" },
    { id: "u6", name: "Luna Events", email: "luna@events.com", role: "CUSTOMER", weddings: 8, joined: "2026-08-12", status: "Active" },
    { id: "u7", name: "Paolo Santos", email: "paolo@example.com", role: "CUSTOMER", weddings: 1, joined: "2026-12-01", status: "Active" },
    { id: "u8", name: "Ivy Reyes", email: "ivy@example.com", role: "CUSTOMER", weddings: 2, joined: "2026-11-01", status: "Active" },
  ];
}

export function getMockPlatformWeddings() {
  return [
    { id: "w1", couple: "Cherilyn & Lester", date: "2027-06-12", venue: "The Golden Orchard Estate", status: "CONFIRMED", guests: 128, plan: "Premium" },
    { id: "w2", couple: "Sofia & Mateo", date: "2027-03-20", venue: "Sunset Garden Pavilion", status: "CONFIRMED", guests: 85, plan: "Standard" },
    { id: "w3", couple: "Emma & James", date: "2027-09-10", venue: "Crystal Ballroom", status: "PLANNING", guests: 210, plan: "Premium" },
    { id: "w4", couple: "Olivia & Noah", date: "2027-05-05", venue: "Beachside Resort", status: "ENGAGED", guests: 60, plan: "Basic" },
    { id: "w5", couple: "Ava & Ethan", date: "2027-12-18", venue: "Winter Wonderland Hall", status: "PLANNING", guests: 150, plan: "Premium" },
    { id: "w6", couple: "Isabella & Lucas", date: "2027-07-30", venue: "Rosewood Estate", status: "CONFIRMED", guests: 95, plan: "Standard" },
    { id: "w7", couple: "Mia & Marco", date: "2028-01-22", venue: "Grand Hyatt Manila", status: "ENGAGED", guests: 300, plan: "Enterprise" },
    { id: "w8", couple: "Luna & Dante", date: "2027-11-11", venue: "Hilltop Garden", status: "COMPLETED", guests: 180, plan: "Premium" },
  ];
}

export function getMockSubscriptions() {
  return [
    { id: "s1", name: "Basic", price: 29, users: 120, revenue: 3480, features: ["1 Wedding", "50 Guests", "QR Invites", "Basic RSVP"] },
    { id: "s2", name: "Standard", price: 79, users: 340, revenue: 26860, features: ["3 Weddings", "200 Guests", "QR + Email", "Check-in", "Basic Analytics"] },
    { id: "s3", name: "Premium", price: 149, users: 280, revenue: 41720, features: ["10 Weddings", "500 Guests", "All Features", "Priority Support", "Custom Domain"] },
    { id: "s4", name: "Enterprise", price: 299, users: 52, revenue: 15548, features: ["Unlimited", "Dedicated Support", "SLA", "Custom Branding"] },
  ];
}

export function getMockSecurityEvents() {
  return [
    { id: "e1", type: "login", user: "superadmin@example.com", ip: "192.168.1.42", time: "2 min ago", status: "Success" },
    { id: "e2", type: "login", user: "admin@example.com", ip: "10.0.0.15", time: "15 min ago", status: "Success" },
    { id: "e3", type: "failed_attempt", user: "unknown@test.com", ip: "203.0.113.42", time: "32 min ago", status: "Blocked" },
    { id: "e4", type: "password_reset", user: "user@example.com", ip: "10.0.0.22", time: "1 hour ago", status: "Completed" },
    { id: "e5", type: "role_change", user: "superadmin@example.com", ip: "192.168.1.42", time: "3 hours ago", status: "Success" },
    { id: "e6", type: "login", user: "planner@studio.com", ip: "172.16.0.8", time: "4 hours ago", status: "Success" },
    { id: "e7", type: "failed_attempt", user: "hacker@mail.com", ip: "198.51.100.7", time: "5 hours ago", status: "Blocked" },
    { id: "e8", type: "permission_change", user: "superadmin@example.com", ip: "192.168.1.42", time: "6 hours ago", status: "Success" },
  ];
}
