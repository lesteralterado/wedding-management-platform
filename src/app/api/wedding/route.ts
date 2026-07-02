import { NextResponse } from "next/server";
import { getMockWedding } from "@/lib/demo/demo-data";

export async function POST(request: Request) {
  const body = await request.json();

  // Create mock wedding response
  const wedding = {
    id: `mock-wedding-${Math.random().toString(36).slice(2, 8)}`,
    userId: "mock-user-001",
    brideName: body.brideName || "Bride",
    groomName: body.groomName || "Groom",
    slug: body.slug || `couple-${Math.random().toString(36).slice(2, 8)}`,
    date: body.date || "2027-06-12",
    venue: body.venue || "Venue",
    venueAddress: body.venueAddress || "",
    theme: body.theme || "Theme",
    coverImage: body.coverImage || "/images/cover.svg",
    galleryImages: body.galleryImages || [],
    status: body.status || "PLANNING",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return NextResponse.json({ success: true, wedding });
}

export async function PUT(request: Request) {
  const body = await request.json();

  // Mock update - just return success
  const updated = {
    ...getMockWedding(),
    ...body,
    updatedAt: new Date(),
  };

  return NextResponse.json({ success: true, wedding: updated });
}