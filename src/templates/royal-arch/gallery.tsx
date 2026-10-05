"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SectionProps } from "../registry-types";
import { Floral } from "./floral";
import { SectionHeader } from "./section-header";

export function Gallery({ content, site }: SectionProps<"GALLERY">) {
  const images = site.wedding.galleryImages;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<number | null>(null);

  const close = useCallback(() => setSelected(null), []);
  const step = useCallback(
    (by: number) => setSelected((current) => (current === null ? null : (current + by + images.length) % images.length)),
    [images.length],
  );

  // Lock the page behind the lightbox and let the keyboard drive it.
  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, step, close]);

  return (
    <section id="gallery" className="relative overflow-x-clip py-24 md:py-32" style={{ perspective: "1000px" }}>
      <Floral variant="corner-left" className="absolute left-0 top-0 w-[30vw] max-w-[280px]" />
      <Floral variant="corner-right" delay={0.2} className="absolute right-0 top-0 w-[30vw] max-w-[280px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionHeader tag={content.tag} title={content.title} />

        <div ref={ref} className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {images.map((src, index) => (
            <GalleryItem key={`${src}-${index}`} src={src} index={index} isInView={isInView} onOpen={() => setSelected(index)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${selected + 1} of ${images.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
            onClick={close}
          >
            <LightboxButton label="Close" className="right-6 top-6" onClick={close}>
              <X size={24} />
            </LightboxButton>
            {images.length > 1 && (
              <>
                <LightboxButton label="Previous photo" className="left-4 md:left-8" onClick={() => step(-1)}>
                  <ChevronLeft size={28} />
                </LightboxButton>
                <LightboxButton label="Next photo" className="right-4 md:right-8" onClick={() => step(1)}>
                  <ChevronRight size={28} />
                </LightboxButton>
              </>
            )}

            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative mx-20 max-h-[80vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selected]}
                alt={`Wedding photo ${selected + 1}`}
                width={1200}
                height={1200}
                className="h-auto max-h-[80vh] w-full object-contain"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
                {selected + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function LightboxButton({ label, className, onClick, children }: { label: string; className: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 ${className}`}
    >
      {children}
    </button>
  );
}

function GalleryItem({ src, index, isInView, onOpen }: { src: string; index: number; isInView: boolean; onOpen: () => void }) {
  const itemRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { damping: 20, stiffness: 300 });
  const mouseY = useSpring(y, { damping: 20, stiffness: 300 });

  function onMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = itemRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 15);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 15);
  }

  return (
    <motion.button
      type="button"
      ref={itemRef}
      aria-label={`Open photo ${index + 1}`}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onOpen}
      style={{ rotateX: mouseY, rotateY: mouseX, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
      className="group relative aspect-square cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-t-accent"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 768px) 25vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-t-accent/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-2 border border-white/30" style={{ transform: "translateZ(20px)" }} />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md">
          <ZoomIn size={24} strokeWidth={1.5} aria-hidden />
        </span>
      </div>
    </motion.button>
  );
}
