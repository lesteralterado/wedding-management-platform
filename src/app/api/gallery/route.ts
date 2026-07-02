import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const weddingId = formData.get("weddingId");

  if (typeof weddingId !== "string") {
    return NextResponse.json({ error: "Wedding ID is required." }, { status: 400 });
  }

  // Mock file upload - return placeholder URLs
  const files = formData.getAll("files");
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    if (files[i] instanceof File) {
      urls.push(`/mock/gallery/image-${Date.now()}-${i}.jpg`);
    }
  }

  return NextResponse.json({ urls });
}