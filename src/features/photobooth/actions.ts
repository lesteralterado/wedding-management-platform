"use server";

import { revalidatePath } from "next/cache";

export async function uploadMedia(
  weddingId: string,
  file: File,
  name: string,
  type: "PHOTO" | "VIDEO"
) {
  // This will be implemented after Prisma migration
  // For now, returns mock response for testing
  return {
    success: true,
    id: `mock-media-${Date.now()}`,
    url: `/mock/photobooth/${Date.now()}.jpg`,
    uploadedByName: name,
    type,
    status: "PENDING" as const,
  };
}

export async function approveMedia() {
  // Will be implemented with database
  revalidatePath(`/dashboard/photo-booth`);
  return { success: true };
}

export async function deleteMedia() {
  // Will be implemented with database
  return { success: true };
}