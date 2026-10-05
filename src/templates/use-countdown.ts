"use client";

import { useEffect, useState } from "react";

export type Countdown = { days: number; hours: number; minutes: number; seconds: number };

/** Live countdown to `target`. Starts at zero so server and client render the same markup. */
export function useCountdown(target: string): Countdown {
  const [left, setLeft] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return left;
}
