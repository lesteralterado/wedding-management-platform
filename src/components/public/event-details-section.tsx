import Link from "next/link";
import { formatDateTime } from "@/lib/utils/date";
import { Reveal } from "@/components/motion/reveal";

export function EventDetailsSection({ wedding }: { wedding: { date: Date; venue: string; venueAddress?: string | null; theme: string } }) {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.venueAddress ?? wedding.venue)}`;

  return (
    <section className="border-y border-border bg-white/35 px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        <Reveal>
          <DetailCard title="When" value={formatDateTime(wedding.date)} />
        </Reveal>
        <Reveal delay={0.1}>
          <DetailCard title="Where" value={wedding.venue} subtitle={wedding.venueAddress ?? "Map link available soon"} />
          {wedding.venueAddress && (
            <Link href={mapHref} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-bold text-accent hover:text-amber-700">
              Open map →
            </Link>
          )}
        </Reveal>
        <Reveal delay={0.2}>
          <DetailCard title="Theme" value={wedding.theme} subtitle="Radiant Citrus palette" />
        </Reveal>
      </div>
    </section>
  );
}

function DetailCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-soft">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">{title}</p>
      <p className="mt-3 font-display text-2xl font-black">{value}</p>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
