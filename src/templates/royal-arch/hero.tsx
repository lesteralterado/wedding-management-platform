"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { firstName, formatLongDate } from "../format";
import { useCountdown } from "../use-countdown";
import type { SectionProps } from "../registry-types";
import { ARCH_PAPER, CURTAIN, EASE_SOFT, art } from "./art";
import { REVEAL_DELAY, STAGE_CLASS, useIntro } from "./intro-gate";

export function Hero({ content, site }: SectionProps<"HERO">) {
  const { wedding, guest } = site;
  const countdown = useCountdown(wedding.date);
  const { revealed, done } = useIntro();
  const reduceMotion = useReducedMotion();
  const baseDelay = reduceMotion ? 0.3 : REVEAL_DELAY;
  const line = (step: number) => ({ revealed, baseDelay, step });

  return (
    <section id="hero" className="relative h-[100svh] overflow-hidden" style={{ backgroundColor: ARCH_PAPER }}>
      {/* Larger screens: blurred arch fills the space around the portrait stage */}
      <div aria-hidden className="absolute inset-0 hidden md:block">
        <Image src={art("intro/arch.webp")} alt="" fill unoptimized sizes="100vw" className="scale-110 object-cover opacity-80 blur-2xl" />
        <div className="absolute inset-0" style={{ backgroundColor: `color-mix(in srgb, ${CURTAIN} 40%, transparent)` }} />
      </div>

      <div className={`${STAGE_CLASS} overflow-hidden [container-type:size] md:shadow-[0_0_80px_rgba(59,47,32,0.25)]`}>
        {/* The arch eases back into place as the doors open, like stepping through them */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ scale: revealed && !reduceMotion ? 1 : 1.12 }}
          transition={{ duration: 3, delay: 0.45, ease: EASE_SOFT }}
        >
          <Image src={art("intro/arch.webp")} alt="" fill priority unoptimized sizes="100vw" className="object-cover" />
        </motion.div>

        {/* Invitation inside the arch */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-[12%] pb-[4cqh] pt-[6cqh] text-center">
          {guest && (
            <RevealLine {...line(-0.5)} className="mb-[1.5cqh]">
              <span className="font-t-script text-[min(7cqw,3.6cqh)] text-t-ink">Dear {firstName(guest.fullName)},</span>
            </RevealLine>
          )}

          <RevealLine {...line(0)}>
            <span className="mx-auto block max-w-[62cqw] text-balance text-[10px] uppercase tracking-[0.35em] text-t-accent-text sm:text-xs">{content.eyebrow}</span>
          </RevealLine>

          <h1 className="my-[2.5cqh] font-t-script text-[min(14cqw,7.5cqh)] font-normal leading-[1.05] text-t-ink">
            <RevealLine {...line(1)}>{wedding.brideName}</RevealLine>
            <RevealLine {...line(1.5)} className="my-1 text-[0.6em] text-t-accent">
              &amp;
            </RevealLine>
            <RevealLine {...line(2)}>{wedding.groomName}</RevealLine>
          </h1>

          <RevealLine {...line(2.6)} className="-mt-[1cqh] mb-[1.5cqh] w-[46cqw] max-w-[220px]">
            <Image src={art("floral/swag.webp")} alt="" width={640} height={170} unoptimized className="h-auto w-full" />
          </RevealLine>

          <RevealLine {...line(3)} className="mb-2 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-t-accent" />
            <span className="font-t-heading text-lg tracking-[0.2em] text-t-ink-soft">{formatLongDate(wedding.date)}</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-t-accent" />
          </RevealLine>

          <RevealLine {...line(3.4)}>
            <p className="text-[11px] tracking-wide text-t-ink-soft">{wedding.venue}</p>
          </RevealLine>

          <RevealLine {...line(4)} className="mt-[4cqh]">
            <div className="flex justify-center gap-2.5" role="timer" aria-label="Time until the wedding">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hours" },
                { value: countdown.minutes, label: "Mins" },
                { value: countdown.seconds, label: "Secs" },
              ].map((item) => (
                <div key={item.label} className="w-14 rounded-md border border-t-accent/25 bg-white/50 py-2 backdrop-blur-[2px]">
                  <span className="block font-t-heading text-2xl leading-none text-t-accent-text">{String(item.value).padStart(2, "0")}</span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-t-ink-soft">{item.label}</span>
                </div>
              ))}
            </div>
          </RevealLine>
        </div>

        {/* Scroll hint, once the doors are gone */}
        <motion.div
          initial={false}
          animate={{ opacity: done ? 1 : 0 }}
          transition={{ duration: 1, delay: done ? 0.8 : 0 }}
          className="pointer-events-none absolute inset-x-0 flex flex-col items-center gap-2"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-t-ink-soft">Scroll</span>
          <div className="flex h-8 w-5 justify-center rounded-full border border-t-accent/50 pt-2">
            <motion.div animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-2 w-1 rounded-full bg-t-accent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Each line rises into place one after another as the doors part.
function RevealLine({ step, revealed, baseDelay, children, className = "" }: {
  step: number;
  revealed: boolean;
  baseDelay: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={revealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 16, filter: "blur(6px)" }}
      transition={{ duration: 1.1, delay: revealed ? baseDelay + Math.max(0, step) * 0.3 : 0, ease: EASE_SOFT }}
    >
      {children}
    </motion.div>
  );
}
