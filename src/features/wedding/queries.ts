import "server-only";
import { getMockWedding } from "@/lib/demo/demo-data";

export async function getWeddingBySlug(slug: string) {
  // Only return mock wedding for known slug
  if (slug === "cherilyn-lester") {
    return getMockWedding();
  }
  return null;
}

export async function getWeddingById() {
  // Return mock wedding
  return getMockWedding();
}

export async function getWeddingsForUser() {
  // Return mock weddings array
  return [getMockWedding()];
}