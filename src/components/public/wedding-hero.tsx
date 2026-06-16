"use client";

import Image from "next/image";
import { formatDateTime } from "@/lib/utils/date";

export function WeddingHero({ wedding }: { wedding: { brideName: string; groomName: string; date: Date; venue: string; coverImage?: string | null } }) {
  return (
    <section className="relative overflow-hidden px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card shadow-warm">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-80 overflow-hidden bg-gradient-to-br from-primary via-orange-200 to-white">
            {wedding.coverImage && <Image src={wedding.coverImage} alt={`${wedding.brideName} and ${wedding.groomName} cover`} fill className="object-cover" />}
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">You are invited</p>
            <h1 className="mt-4 font-display text-5xl font-black tracking-tight md:text-7xl">
              {wedding.brideName} <span className="text-accent">&</span> {wedding.groomName}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">{formatDateTime(wedding.date)}</p>
            <p className="mt-2 text-lg text-muted-foreground">{wedding.venue}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
