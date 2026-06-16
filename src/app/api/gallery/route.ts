import { NextResponse } from "next/server";
import { requireCoupleAdmin } from "@/lib/auth/rbac";
import { saveUploadedFile } from "@/lib/upload/upload";

export async function POST(request: Request) {
  await requireCoupleAdmin();
  const formData = await request.formData();
  const files = formData.getAll("files");

  const urls: string[] = [];
  for (const file of files) {
    if (file instanceof File) urls.push(await saveUploadedFile(file, "uploads"));
  }

  return NextResponse.json({ urls });
}
