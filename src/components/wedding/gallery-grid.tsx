import Image from "next/image";

export function GalleryGrid({ images }: { images: string[] }) {
  if (!images.length) {
    return <div className="rounded-[1.5rem] border border-dashed border-border p-10 text-center text-muted-foreground">No gallery images yet.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-soft">
          <Image src={image} alt={`Wedding gallery ${index + 1}`} width={600} height={420} className="h-56 w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
