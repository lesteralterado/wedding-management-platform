"use client";

import { motion, useInView } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.65, ease: "easeOut", delay }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
