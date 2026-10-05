"use client";

import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import type { SectionProps } from "../registry-types";
import type { SectionContent } from "../sections";
import { PAPER, art } from "./art";
import { Floral } from "./floral";
import { SectionHeader } from "./section-header";

type Chapter = SectionContent<"STORY">["chapters"][number];

export function Story({ content }: SectionProps<"STORY">) {
  return (
    // Floral border sits along the bottom; extra bottom padding keeps the text above the flowers.
    // The gradient softens where the artwork's top edge meets the plain paper.
    <section
      id="story"
      className="relative overflow-x-clip pb-[38vw] pt-24 md:pt-32"
      style={{
        perspective: "1000px",
        backgroundColor: PAPER,
        backgroundImage: `linear-gradient(to bottom, ${PAPER}, transparent 35%), url('${art("sections/floral-border-bottom.webp")}')`,
        backgroundSize: "100% 150vw, 100% auto",
        backgroundPosition: "bottom, bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-t-accent/30 to-transparent" />

      <Floral variant="corner-left" className="absolute left-0 top-0 w-[30vw] max-w-[280px]" />
      <Floral variant="corner-right" delay={0.2} className="absolute right-0 top-0 w-[30vw] max-w-[280px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionHeader tag={content.tag} title={content.title} />

        <div className={`grid gap-12 md:gap-16 ${content.chapters.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-md"}`}>
          {content.chapters.map((chapter, index) => (
            <StoryCard key={`${chapter.label}-${index}`} chapter={chapter} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // 3D tilt following the pointer
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { damping: 20, stiffness: 300 });
  const mouseY = useSpring(y, { damping: 20, stiffness: 300 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 20);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 20);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1, delay: index * 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={index % 2 === 1 ? "md:mt-16" : ""}
      style={{ perspective: "1000px" }}
    >
      {chapter.image && (
        <motion.div
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ rotateX: mouseY, rotateY: mouseX, transformStyle: "preserve-3d" }}
          className="group relative mb-8 overflow-hidden"
        >
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }} className="relative aspect-[3/4]" style={{ transformStyle: "preserve-3d" }}>
            <Image
              src={chapter.image}
              alt={chapter.title}
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover grayscale-[20%] transition-all duration-700 group-hover:grayscale-0"
            />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-4 border border-t-accent/50 transition-all duration-500 group-hover:inset-6"
            style={{ transform: "translateZ(20px)" }}
          />
        </motion.div>
      )}

      <div className="text-center md:text-left">
        <span className="mb-2 block font-t-script text-3xl text-t-accent-text">{chapter.label}</span>
        <h3 className="mb-4 font-t-heading text-2xl md:text-3xl">{chapter.title}</h3>
        <p className="whitespace-pre-line leading-relaxed text-t-ink-soft">{chapter.text}</p>
      </div>
    </motion.div>
  );
}
