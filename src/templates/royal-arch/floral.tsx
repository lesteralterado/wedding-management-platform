"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Target, type TargetAndTransition } from "framer-motion";
import { EASE_SOFT, art } from "./art";



const ART = {
  swag: { src: art("floral/swag.webp"), width: 640, height: 170 },
  wreath: { src: art("floral/wreath.webp"), width: 640, height: 640 },
  "corner-left": { src: art("floral/corner-left.webp"), width: 461, height: 640 },
  "corner-right": { src: art("floral/corner-right.webp"), width: 461, height: 640 },
  bouquet: { src: art("floral/bouquet.webp"), width: 439, height: 640 },
  "oval-frame": { src: art("floral/oval-frame.webp"), width: 480, height: 640 },
} as const;

export type FloralVariant = keyof typeof ART;

// How each piece enters when scrolled into view, then how it moves while idle.
const MOTION: Record<
  FloralVariant,
  { origin: string; hidden: Target; idle?: TargetAndTransition; idleDuration?: number }
> = {
  // Unfurls from the centre outwards
  swag: {
    origin: "center",
    hidden: { opacity: 0, clipPath: "inset(0% 50% 0% 50%)", scale: 0.96 },
  },
  // Turns into place, then breathes
  wreath: {
    origin: "center",
    hidden: { opacity: 0, scale: 0.7, rotate: -30 },
    idle: { scale: [1, 1.035, 1] },
    idleDuration: 6,
  },
  // Corner sprays grow out of their corner and sway as if in a breeze
  "corner-left": {
    origin: "top left",
    hidden: { opacity: 0, scale: 0.75, rotate: -10, filter: "blur(4px)" },
    idle: { rotate: [0, 1.6, 0] },
    idleDuration: 7,
  },
  "corner-right": {
    origin: "top right",
    hidden: { opacity: 0, scale: 0.75, rotate: 10, filter: "blur(4px)" },
    idle: { rotate: [0, -1.6, 0] },
    idleDuration: 7.5,
  },
  // Rises and settles, swaying from the stems
  bouquet: {
    origin: "bottom center",
    hidden: { opacity: 0, y: 30, rotate: -5 },
    idle: { rotate: [0, 1.5, 0, -1.5, 0] },
    idleDuration: 8,
  },
  "oval-frame": {
    origin: "center",
    hidden: { opacity: 0, scale: 0.94, filter: "blur(4px)" },
  },
};

const SHOWN: Target = {
  opacity: 1,
  scale: 1,
  rotate: 0,
  y: 0,
  filter: "blur(0px)",
  clipPath: "inset(0% 0% 0% 0%)",
};

interface FloralProps {
  variant: FloralVariant;
  /** Positioning and sizing classes, e.g. "absolute top-0 left-0 w-[30vw]". */
  className?: string;
  /** Seconds to wait after the piece scrolls into view. */
  delay?: number;
}

/** Decorative flower artwork that eases in when it scrolls into view. */
export function Floral({ variant, className = "", delay = 0 }: FloralProps) {
  const reduceMotion = useReducedMotion();
  const art = ART[variant];
  const { origin, hidden, idle, idleDuration } = MOTION[variant];
  const entrance = 1.6;

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      style={{ transformOrigin: origin }}
      initial={reduceMotion ? { opacity: 0 } : hidden}
      whileInView={reduceMotion ? { opacity: 1 } : SHOWN}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: entrance, delay, ease: EASE_SOFT }}
    >
      <motion.div
        style={{ transformOrigin: origin }}
        animate={idle && !reduceMotion ? idle : undefined}
        transition={{
          duration: idleDuration,
          delay: delay + entrance,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={art.src}
          alt=""
          width={art.width}
          height={art.height}
          unoptimized
          draggable={false}
          className="w-full h-auto"
        />
      </motion.div>
    </motion.div>
  );
}
