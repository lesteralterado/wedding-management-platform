"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Church, MapPin, Sparkles, Wine, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import type { SectionProps } from "../registry-types";
import type { SectionContent } from "../sections";
import { PAPER, art } from "./art";
import { Floral } from "./floral";
import { SectionHeader } from "./section-header";

type WeddingEvent = SectionContent<"EVENTS">["events"][number];

const ICONS: Record<WeddingEvent["kind"], LucideIcon> = { ceremony: Church, reception: Wine, other: Sparkles };

export function Events({ content }: SectionProps<"EVENTS">) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    // Garland hangs from the top; the header sits in the open space beneath its centre.
    <section
      id="events"
      className="relative pb-24 pt-[34vw] md:pb-32"
      style={{
        perspective: "1000px",
        backgroundColor: PAPER,
        backgroundImage:
          // The top layer fades into the page background so the next section starts seamlessly.
          `linear-gradient(to bottom, transparent, var(--t-bg)), linear-gradient(to top, ${PAPER}, transparent 35%), url('${art("sections/floral-garland-top.webp")}')`,
        backgroundSize: "100% 10rem, 100% 150vw, 100% auto",
        backgroundPosition: "bottom, top, top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader tag={content.tag} title={content.title} />

        <div ref={ref} className={`grid gap-8 ${content.events.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-md"}`}>
          {content.events.map((event, index) => (
            <EventCard key={`${event.name}-${index}`} event={event} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, index, isInView }: { event: WeddingEvent; index: number; isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = ICONS[event.kind];
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.venue)}`;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { damping: 20, stiffness: 300 });
  const mouseY = useSpring(y, { damping: 20, stiffness: 300 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 15);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 15);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: mouseY, rotateY: mouseX, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 1, delay: index * 0.2, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -10 }}
      className="relative overflow-hidden border border-t-accent/15 bg-t-surface/70 p-10 text-center backdrop-blur-sm"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-transparent via-t-accent to-transparent"
      />

      <motion.div style={{ transform: "translateZ(30px)" }} className="mb-6 flex justify-center text-t-accent-text">
        {/* Icon sits inside a flower wreath */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          <Floral variant="wreath" delay={index * 0.2 + 0.2} className="absolute inset-0" />
          <Icon size={36} strokeWidth={1.5} className="relative" aria-hidden />
        </div>
      </motion.div>

      <motion.h3 style={{ transform: "translateZ(20px)" }} className="mb-4 font-t-heading text-2xl tracking-wide md:text-3xl">
        {event.name}
      </motion.h3>

      <motion.div style={{ transform: "translateZ(10px)" }} className="space-y-2">
        {event.time && <p className="text-xl font-medium text-t-accent-text">{event.time}</p>}
        <p className="font-t-heading text-lg">{event.venue}</p>
        {event.address && <p className="text-sm text-t-ink-soft">{event.address}</p>}
        <a
          href={mapHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-t-accent-text underline-offset-4 hover:underline"
        >
          <MapPin size={14} aria-hidden /> Get directions
        </a>
      </motion.div>
    </motion.div>
  );
}
