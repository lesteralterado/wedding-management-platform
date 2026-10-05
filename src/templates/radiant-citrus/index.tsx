import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { RsvpForm } from "@/components/rsvp/rsvp-form";
import { firstName, formatDeadline, formatLongDate } from "../format";
import type { SectionProps, TemplateDefinition, TemplateLayoutProps } from "../registry-types";

// Bright, modern template built on the platform's own type pairing (Bodoni Moda + Jost) and UI kit;
// <ThemeScope> re-points the kit's colour tokens at the couple's palette.

const SECTION = "px-6 py-20 md:px-10 lg:px-16";
const EYEBROW = "text-sm font-bold uppercase tracking-[0.35em] text-t-accent-text";

function Layout({ site, nav, children }: TemplateLayoutProps) {
  const { wedding } = site;
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-t-bg/80 px-6 py-4 backdrop-blur-xl md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="#hero" className="font-display text-xl">
            {wedding.brideName} <span className="text-t-accent-text">&amp;</span> {wedding.groomName}
          </a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-t-ink-soft md:flex">
            {nav.map((link) => (
              <a key={link.id} href={`#${link.id}`} className="hover:text-t-ink">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border px-6 py-12 text-center">
        <p className="font-display text-2xl">
          {wedding.brideName} &amp; {wedding.groomName}
        </p>
        <p className="mt-2 text-sm text-t-ink-soft">{formatLongDate(wedding.date)} · {wedding.venue}</p>
      </footer>
    </>
  );
}

function Hero({ content, site }: SectionProps<"HERO">) {
  const { wedding, guest } = site;
  return (
    <section id="hero" className="relative overflow-hidden px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-t-surface shadow-warm">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-80 overflow-hidden rounded-t-[2rem] bg-gradient-to-br from-t-accent via-t-accent-soft to-t-surface lg:rounded-l-[2rem] lg:rounded-tr-none">
            {wedding.coverImage && (
              <Image src={wedding.coverImage} alt={`${wedding.brideName} and ${wedding.groomName}`} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            )}
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            {guest && <p className="mb-3 text-lg text-t-ink-soft">Dear {firstName(guest.fullName)},</p>}
            <p className={EYEBROW}>{content.eyebrow}</p>
            <h1 className="mt-4 font-display text-5xl tracking-tight md:text-7xl">
              {wedding.brideName} <span className="text-t-accent-text">&amp;</span> {wedding.groomName}
            </h1>
            <p className="mt-6 flex items-center gap-2 text-lg text-t-ink-soft">
              <CalendarDays className="h-5 w-5 text-t-accent-text" aria-hidden /> {formatLongDate(wedding.date)}
            </p>
            <p className="mt-2 flex items-center gap-2 text-lg text-t-ink-soft">
              <MapPin className="h-5 w-5 text-t-accent-text" aria-hidden /> {wedding.venue}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Story({ content }: SectionProps<"STORY">) {
  return (
    <section id="story" className={SECTION}>
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className={EYEBROW}>{content.tag}</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">{content.title}</h2>
        </Reveal>
        <div className="mt-12 space-y-12">
          {content.chapters.map((chapter, index) => (
            <Reveal key={`${chapter.label}-${index}`} delay={index * 0.08}>
              <article className={`grid items-center gap-8 ${chapter.image ? "md:grid-cols-2" : ""}`}>
                {chapter.image && (
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-border ${index % 2 ? "md:order-2" : ""}`}>
                    <Image src={chapter.image} alt={chapter.title} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
                  </div>
                )}
                <div>
                  <p className={EYEBROW}>{chapter.label}</p>
                  <h3 className="mt-2 font-display text-3xl">{chapter.title}</h3>
                  <p className="mt-4 whitespace-pre-line text-lg leading-8 text-t-ink-soft">{chapter.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Events({ content }: SectionProps<"EVENTS">) {
  return (
    <section id="events" className={`border-y border-border bg-t-surface/40 ${SECTION}`}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className={EYEBROW}>{content.tag}</p>
          <h2 className="mt-3 font-display text-4xl">{content.title}</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.events.map((event, index) => {
            const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.venue)}`;
            return (
              <Reveal key={`${event.name}-${index}`} delay={index * 0.1}>
                <div className="h-full rounded-[1.5rem] border border-border bg-t-surface p-6 shadow-soft">
                  <p className={EYEBROW}>{event.name}</p>
                  {event.time && <p className="mt-3 font-display text-2xl">{event.time}</p>}
                  <p className="mt-2 font-semibold">{event.venue}</p>
                  {event.address && <p className="mt-1 text-sm text-t-ink-soft">{event.address}</p>}
                  <Link href={mapHref} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-bold text-t-accent-text hover:underline">
                    Open map →
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Gallery({ content, site }: SectionProps<"GALLERY">) {
  return (
    <section id="gallery" className={SECTION}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className={EYEBROW}>{content.tag}</p>
          <h2 className="mt-3 font-display text-4xl">{content.title}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.wedding.galleryImages.map((image, index) => (
            <Reveal key={`${image}-${index}`} delay={index * 0.08}>
              <div className="relative h-64 overflow-hidden rounded-[1.5rem] border border-border bg-t-surface shadow-soft">
                <Image src={image} alt={`Gallery photo ${index + 1}`} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Rsvp({ content, site }: SectionProps<"RSVP">) {
  const { guest, wedding } = site;
  return (
    <section id="rsvp" className={SECTION}>
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <p className={EYEBROW}>{content.tag}</p>
          <h2 className="mt-3 font-display text-4xl">{content.title}</h2>
          {content.deadline && <p className="mt-3 text-t-ink-soft">Kindly respond by {formatDeadline(content.deadline)}</p>}
        </Reveal>
        <div className="mt-8">
          {guest ? (
            <RsvpForm inviteCode={guest.inviteCode} seatsAllowed={guest.seatsAllowed} existingStatus={guest.rsvp?.status ?? null} />
          ) : (
            <div className="rounded-[2rem] border border-border bg-t-surface p-8 text-center shadow-warm">
              <p className="text-t-ink-soft">
                {wedding.brideName} &amp; {wedding.groomName} have sent each guest a personal invitation link. Open yours to RSVP.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Faq({ content }: SectionProps<"FAQ">) {
  return (
    <section id="faq" className={SECTION}>
      <div className="mx-auto max-w-4xl space-y-6">
        <Reveal>
          <p className={EYEBROW}>{content.tag}</p>
          <h2 className="mt-3 font-display text-4xl">{content.title}</h2>
        </Reveal>
        <div className="space-y-3">
          {content.items.map((item, index) => (
            <Reveal key={`${item.question}-${index}`}>
              <details className="rounded-[1.25rem] border border-border bg-t-surface p-5">
                <summary className="cursor-pointer font-bold">{item.question}</summary>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-t-ink-soft">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export const radiantCitrus: TemplateDefinition = {
  fonts: { heading: "var(--font-display), serif", body: "var(--font-body), sans-serif" },
  // Bodoni Moda and Jost are already loaded by the root layout.
  fontClassName: "",
  Layout,
  sections: { HERO: Hero, STORY: Story, EVENTS: Events, GALLERY: Gallery, RSVP: Rsvp, FAQ: Faq },
};
