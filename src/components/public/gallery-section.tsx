"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

export function PublicGallery({ images }: { images: string[] }) {
  if (!images.length) return null;

  return (
    <section className="px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Gallery</p>
          <h2 className="mt-3 font-display text-4xl font-black">Moments we cannot wait to share</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <Reveal key={image} delay={index * 0.08}>
              <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-soft">
                <Image src={image} alt={`Gallery image ${index + 1}`} width={600} height={420} className="h-64 w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
