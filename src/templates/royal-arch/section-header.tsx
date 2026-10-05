"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Floral } from "./floral";

export function SectionHeader({ tag, title }: { tag: string; title: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="mb-16 text-center md:mb-20"
    >
      <span className="mb-4 inline-block text-xs uppercase tracking-[0.4em] text-t-accent-text">{tag}</span>
      <h2 className="mb-5 font-t-heading text-3xl font-normal tracking-wide md:text-4xl lg:text-5xl">{title}</h2>
      <Floral variant="swag" delay={0.3} className="mx-auto w-44 md:w-56" />
    </motion.div>
  );
}
