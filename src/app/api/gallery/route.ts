import { NextResponse } from "next/server";
import { requireWeddingAccess } from "@/lib/wedding/current";
import { saveUploadedFile } from "@/lib/upload/upload";

export async function POST(request: Request) {
  const formData = await request.formData();
  const weddingId = formData.get("weddingId");

  if (typeof weddingId !== "string") {
    return NextResponse.json({ error: "Wedding ID is required." }, { status: 400 });
  }

  await requireWeddingAccess(weddingId, "gallery:write");

  const files = formData.getAll("files");
  const urls: string[] = [];
  for (const file of files) {
    if (file instanceof File) urls.push(await saveUploadedFile(file, "uploads"));
  }

  return NextResponse.json({ urls });
}
