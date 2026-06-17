"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryGrid } from "@/components/wedding/gallery-grid";

export default function GalleryPage() {
  const [images, setImages] = React.useState<string[]>([]);
  const [pending, setPending] = React.useState(false);
  const [weddingId, setWeddingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadWedding() {
      const response = await fetch("/api/guests");
      if (!response.ok) return;
      const payload = await response.json();
      setWeddingId(payload.weddings?.[0]?.id ?? null);
    }
    loadWedding();
  }, []);

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setPending(true);
    const formData = new FormData();
    if (weddingId) formData.append("weddingId", weddingId);
    files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/gallery", { method: "POST", body: formData });
    setPending(false);

    if (!response.ok) {
      toast.error("Unable to upload images.");
      return;
    }

    const payload = await response.json();
    setImages((current) => [...current, ...payload.urls]);
    toast.success(`${payload.urls.length} image${payload.urls.length === 1 ? "" : "s"} uploaded.`);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-warm">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Gallery</p>
        <h1 className="mt-2 font-display text-4xl font-black">Wedding memories</h1>
        <p className="mt-2 text-muted-foreground">Upload cover and gallery images for the public microsite.</p>
      </section>
      <Card>
        <CardHeader><CardTitle>Image uploader</CardTitle><CardDescription>Images are stored locally for development and can be moved to S3/Supabase later.</CardDescription></CardHeader>
        <CardContent>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-secondary p-10 text-center">
            <Upload className="mb-3 h-8 w-8 text-accent" />
            <span className="font-bold">Choose images</span>
            <span className="text-sm text-muted-foreground">PNG, JPG, or WebP</span>
            <input className="sr-only" type="file" multiple accept="image/*" onChange={upload} disabled={pending} />
          </label>
          {pending && <p className="mt-4 text-sm text-muted-foreground">Uploading...</p>}
          <div className="mt-6"><GalleryGrid images={images} /></div>
        </CardContent>
      </Card>
    </div>
  );
}
