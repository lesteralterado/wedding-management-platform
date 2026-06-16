import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryGrid } from "@/components/wedding/gallery-grid";
import { WeddingForm } from "@/components/wedding/wedding-form";
import { WeddingStatusBadge } from "@/components/wedding/wedding-status-badge";
import { getCurrentWeddingOrRedirect } from "@/lib/wedding/current";

export default async function WeddingPage() {
  const wedding = await getCurrentWeddingOrRedirect();
  if (!wedding) {
    return (
      <Card>
        <CardHeader><CardTitle>Create your wedding</CardTitle><CardDescription>Add the first wedding to unlock the dashboard.</CardDescription></CardHeader>
        <CardContent><WeddingForm /></CardContent>
      </Card>
    );
  }

  const galleryImages = (wedding.galleryImages as unknown as string[]) || [];

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-warm md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Wedding Details</p>
          <h1 className="mt-2 font-display text-4xl font-black">Manage your celebration</h1>
          <p className="mt-2 text-muted-foreground"><WeddingStatusBadge status={wedding.status} /> · Slug: {wedding.slug}</p>
        </div>
        <Link href={`/w/${wedding.slug}`}><Button variant="outline">Preview public website</Button></Link>
      </section>
      <Card>
        <CardHeader><CardTitle>Details</CardTitle><CardDescription>These fields power the dashboard, invitations, and public microsite.</CardDescription></CardHeader>
        <CardContent><WeddingForm wedding={wedding} /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Gallery</CardTitle><CardDescription>Cover and gallery image URLs are displayed on the public website.</CardDescription></CardHeader>
        <CardContent><GalleryGrid images={galleryImages} /></CardContent>
      </Card>
    </div>
  );
}
