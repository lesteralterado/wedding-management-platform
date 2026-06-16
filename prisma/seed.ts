import { PrismaClient, Role, RsvpStatus, WeddingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateQrSvg } from "../src/lib/qr/generate";

const prisma = new PrismaClient();
const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
const passwordHash = await bcrypt.hash("Password123!", 12);

type DemoRsvpStatus = "PENDING" | "GOING" | "DECLINED";

function inviteCodeFor(fullName: string) {
  const normalized = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);

  return `love-${normalized}`;
}

const demoGuests = [
  ["Lester Santos", "lester@example.com", "555-0101", "Family", 2, "GOING" as const, "Excited to celebrate with you!"],
  ["Mia Santos", "mia@example.com", "555-0102", "Family", 1, "GOING" as const, "Can't wait!"],
  ["Noah Santos", "noah@example.com", "555-0103", "Family", 2, "PENDING" as const, null],
  ["Ava Reyes", "ava@example.com", "555-0104", "Friends", 1, "DECLINED" as const, "Already booked, but wishing you both the best."],
  ["Ethan Cruz", "ethan@example.com", "555-0105", "Friends", 2, "GOING" as const, "Bringing my plus one."],
  ["Sofia Garcia", "sofia@example.com", "555-0106", "Friends", 1, "PENDING" as const, null],
  ["Lucas Rivera", "lucas@example.com", "555-0107", "Wedding Party", 1, "GOING" as const, "Ready for the big day!"],
  ["Isabella Torres", "isabella@example.com", "555-0108", "Wedding Party", 1, "GOING" as const, "See you there!"],
  ["Mateo Flores", "mateo@example.com", "555-0109", "Colleagues", 1, "PENDING" as const, null],
  ["Emma Chen", "emma@example.com", "555-0110", "Colleagues", 2, "DECLINED" as const, "Sorry, I can't make it."],
  ["James Wilson", "james@example.com", "555-0111", "Colleagues", 1, "PENDING" as const, null],
  ["Olivia Brown", "olivia@example.com", "555-0112", "Family", 2, "GOING" as const, "Looking forward to it."],
] as const;

async function main() {
  await prisma.rsvp.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.wedding.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: "Cherilyn & Lester Admin",
      email: "admin@example.com",
      passwordHash,
      role: Role.COUPLE_ADMIN,
    },
  });

  const wedding = await prisma.wedding.create({
    data: {
      userId: user.id,
      brideName: "Cherilyn",
      groomName: "Lester",
      slug: "cherilyn-lester",
      date: new Date("2027-06-12T16:00:00.000Z"),
      venue: "The Golden Orchard Estate",
      venueAddress: "1200 Citrus Avenue, Laguna Beach, CA",
      theme: "Radiant Citrus",
      coverImage: "/images/cover.svg",
      galleryImages: ["/images/gallery-1.svg", "/images/gallery-2.svg", "/images/gallery-3.svg"],
      status: WeddingStatus.CONFIRMED,
    },
  });

  for (const [fullName, email, phone, groupName, seatsAllowed, status, note] of demoGuests) {
    const inviteCode = inviteCodeFor(fullName);
    const inviteUrl = `${baseUrl}/invite/${inviteCode}`;
    const qrCode = await generateQrSvg(inviteUrl);

    const guest = await prisma.guest.create({
      data: {
        weddingId: wedding.id,
        fullName,
        email,
        phone,
        groupName,
        inviteCode,
        qrCode,
        seatsAllowed,
      },
    });

    await prisma.rsvp.create({
      data: {
        guestId: guest.id,
        status: RsvpStatus[status as keyof typeof RsvpStatus],
        guestCount: status === "DECLINED" ? 0 : Math.min(seatsAllowed, 1),
        note,
        submittedAt: status === "PENDING" ? null : new Date(),
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
