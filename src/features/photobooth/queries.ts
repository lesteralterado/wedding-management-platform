import "server-only";

const mockMedia = [
  {
    id: "mock-media-1",
    weddingId: "mock-wedding-001",
    uploadedByGuestId: null,
    uploadedByName: "Ava Reyes",
    type: "PHOTO",
    url: "/images/gallery-1.svg",
    thumbnail: "/images/gallery-1.svg",
    status: "APPROVED",
    uploadedAt: new Date("2027-06-12T14:30:00Z"),
  },
  {
    id: "mock-media-2",
    weddingId: "mock-wedding-001",
    uploadedByGuestId: null,
    uploadedByName: "Ethan Cruz",
    type: "PHOTO",
    url: "/images/gallery-2.svg",
    thumbnail: "/images/gallery-2.svg",
    status: "PENDING",
    uploadedAt: new Date("2027-06-12T15:45:00Z"),
  },
];

export async function getMediaByWedding(status?: "PENDING" | "APPROVED") {
  // Mock implementation - will use Prisma after migration
  return status 
    ? mockMedia.filter((m) => m.status === status)
    : mockMedia;
}

export async function getPhotoBoothStats() {
  const photos = mockMedia.filter((m) => m.type === "PHOTO").length;
  const videos = mockMedia.filter((m) => m.type === "VIDEO").length || 0;
  const pending = mockMedia.filter((m) => m.status === "PENDING").length;
  const approved = mockMedia.filter((m) => m.status === "APPROVED").length;

  return {
    totalPhotos: photos,
    totalVideos: videos,
    pendingApprovals: pending,
    approvedUploads: approved,
  };
}