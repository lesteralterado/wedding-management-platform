"use client";

import { motion, useInView } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function AnimatedCounter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    let frame = 0;
    const start = performance.now();
    const duration = 900;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <motion.span ref={ref} className={cn("font-display font-black tracking-tight", className)}>
      {display}
      {suffix}
    </motion.span>
  );
}
