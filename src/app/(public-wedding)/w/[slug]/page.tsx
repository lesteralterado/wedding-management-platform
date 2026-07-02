import { notFound } from "next/navigation";
import { EventDetailsSection } from "@/components/public/event-details-section";
import { FaqSection } from "@/components/public/faq-section";
import { PublicGallery } from "@/components/public/gallery-section";
import { StorySection } from "@/components/public/story-section";
import { WeddingHero } from "@/components/public/wedding-hero";
import { getWeddingBySlug } from "@/features/wedding/queries";

export default async function PublicWeddingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wedding = await getWeddingBySlug(slug);
  if (!wedding) notFound();

  const galleryImages = Array.isArray(wedding.galleryImages)
    ? (wedding.galleryImages.filter((img): img is string => typeof img === "string"))
    : [];

  return (
    <main>
      <WeddingHero wedding={wedding} />
      <StorySection names={`${wedding.brideName} & ${wedding.groomName}`} />
      <EventDetailsSection wedding={wedding} />
      <PublicGallery images={galleryImages} />
      <FaqSection />
      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-card p-8 text-center shadow-warm">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">RSVP</p>
          <h2 className="mt-3 font-display text-4xl font-black">Can&apos;t wait to celebrate with you</h2>
          <p className="mt-4 text-muted-foreground">Use your personalized invitation link to submit your RSVP.</p>
        </div>
      </section>
    </main>
  );
}
