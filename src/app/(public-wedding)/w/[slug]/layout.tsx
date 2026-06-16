import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replaceAll("-", " ")} Wedding`,
    description: "A personalized wedding website with event details, gallery, FAQ, and RSVP.",
  };
}

export default function PublicWeddingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
