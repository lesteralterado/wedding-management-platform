"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_SOFT, art } from "./art";

// The door artwork is 736x1308; the wax seal sits on the right door at this spot.
const ART_RATIO = "736 / 1308";
const SEAL = { left: "49.7%", top: "52.75%", size: "26%" };

// Heavy, door-like ease: slow to start, glides to a stop.
const EASE_DOOR = [0.65, 0, 0.2, 1] as const;

const DOOR_DURATION = 2.4;
const SEAL_BREAK = 0.45; // pause on the seal before the doors move

/** Seconds after the tap when content behind the doors should start appearing. */
export const REVEAL_DELAY = SEAL_BREAK + 1.2;

/**
 * Shared by the doors and the Hero so the doors sit exactly over the Hero's arch:
 * full screen on phones, a phone-shaped column on tablets and desktops.
 */
export const STAGE_CLASS = "relative mx-auto h-full w-full md:w-auto md:aspect-[736/1308]";

type Phase = "loading" | "closed" | "opening";

const IntroContext = createContext({ revealed: true, done: true });

/**
 * `revealed`: the guest tapped and the doors are opening.
 * `done`: the doors are gone and the page can scroll.
 */
export const useIntro = () => useContext(IntroContext);

/** `monogram` is engraved on the wax seal, e.g. ["C", "L"]. */
export function IntroProvider({ monogram, children }: { monogram: [string, string]; children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const reveal = useCallback(() => setRevealed(true), []);
  const finish = useCallback(() => setDone(true), []);

  return (
    <IntroContext.Provider value={{ revealed, done }}>
      {children}
      {!done && <IntroGate monogram={monogram} onReveal={reveal} onFinish={finish} />}
    </IntroContext.Provider>
  );
}

function IntroGate({ monogram, onReveal, onFinish }: { monogram: [string, string]; onReveal: () => void; onFinish: () => void }) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const loaded = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const isOpening = phase === "opening";

  // Lock the page behind the doors and always start the site from the top.
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);
    const pending = timers.current;
    return () => {
      html.style.overflow = previous;
      pending.forEach(clearTimeout);
    };
  }, []);

  // Show the doors once the artwork is decoded; never leave guests on a blank screen.
  useEffect(() => {
    const fallback = setTimeout(() => setPhase((p) => (p === "loading" ? "closed" : p)), 3500);
    return () => clearTimeout(fallback);
  }, []);

  const handleLoad = () => {
    loaded.current += 1;
    if (loaded.current >= 2) setPhase((p) => (p === "loading" ? "closed" : p));
  };

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    onReveal();
    const doorsDone = (reduceMotion ? 0.8 : SEAL_BREAK + DOOR_DURATION) * 1000;
    timers.current.push(setTimeout(onFinish, doorsDone + 100));
  };

  const doorTransition = reduceMotion
    ? { duration: 0.8, ease: EASE_SOFT }
    : {
        duration: DOOR_DURATION,
        delay: SEAL_BREAK,
        ease: EASE_DOOR,
        times: [0, 0.12, 1],
        // Stay solid while swinging; only dissolve once the door is nearly edge-on.
        opacity: { duration: DOOR_DURATION, delay: SEAL_BREAK, ease: "easeIn", times: [0, 0.8, 1] },
      };

  const door = (side: "left" | "right") => {
    const dir = side === "left" ? 1 : -1;
    return (
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: `${side} center`, willChange: "transform, opacity" }}
        initial={false}
        animate={
          isOpening
            ? reduceMotion
              ? { opacity: 0 }
              : {
                  // A small push before the swing makes the doors feel weighty.
                  rotateY: [0, -1.5 * dir, 88 * dir],
                  x: ["0%", "0%", `${-4 * dir}%`],
                  opacity: [1, 1, 0],
                }
            : { rotateY: 0, x: "0%", opacity: 1 }
        }
        transition={doorTransition}
      >
        <Image
          src={art(`intro/door-${side}.webp`)}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          draggable={false}
          onLoad={handleLoad}
          className="object-cover select-none"
        />
        {/* Shade the door as it turns away from the light, masked to the door's own shape */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[#3b2f20]"
          style={{
            maskImage: `url(${art(`intro/door-${side}.webp`)})`,
            WebkitMaskImage: `url(${art(`intro/door-${side}.webp`)})`,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
          }}
          initial={false}
          animate={{ opacity: isOpening && !reduceMotion ? 0.35 : 0 }}
          transition={{ duration: DOOR_DURATION, delay: SEAL_BREAK, ease: EASE_DOOR }}
        />
        {side === "right" && <SealMonogram letters={monogram} />}
      </motion.div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation"
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      {/* Cream curtain while the artwork loads; afterwards the Hero shows around the stage */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[#f3ece1]"
        initial={false}
        animate={{ opacity: phase === "loading" ? 1 : 0 }}
        transition={{ duration: 1.2, ease: EASE_SOFT }}
      />

      <div className={`${STAGE_CLASS} [container-type:size]`}>
        {/* Warm light spilling through the gap as the doors part */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,244,214,0.95)_0%,rgba(255,236,190,0.35)_35%,transparent_70%)]"
          initial={false}
          animate={isOpening && !reduceMotion ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: DOOR_DURATION, delay: SEAL_BREAK + 0.2, ease: "easeInOut", times: [0, 0.35, 1] }}
        />

        {/* Door artwork, scaled like object-cover so the seal hotspot stays aligned */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(100cqw,calc(100cqh*736/1308))]"
          style={{ aspectRatio: ART_RATIO }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ perspective: "1400px" }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={phase === "loading" ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE_SOFT }}
          >
            {door("left")}
            {door("right")}

            {/* Seal: idle pulse, then a gold ring as it "breaks" */}
            <div
              aria-hidden
              className="absolute -translate-x-1/2 -translate-y-1/2 aspect-square pointer-events-none"
              style={{ left: SEAL.left, top: SEAL.top, width: SEAL.size }}
            >
              {phase === "closed" && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(232,213,168,0.7)_0%,rgba(232,213,168,0)_70%)]"
                  animate={{ scale: [0.9, 1.35, 0.9], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {isOpening && !reduceMotion && (
                <>
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-t-accent-soft"
                    initial={{ scale: 0.7, opacity: 0.9 }}
                    animate={{ scale: 2.6, opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,250,235,1)_0%,rgba(255,240,200,0)_65%)]"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1.8, opacity: [0, 1, 0] }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {phase === "closed" && (
            <motion.div
              className="absolute inset-x-0 flex justify-center pointer-events-none"
              style={{ bottom: "calc(env(safe-area-inset-bottom) + 2.5rem)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE_SOFT }}
            >
              <motion.span
                className="rounded-full bg-white/60 backdrop-blur-sm px-5 py-2.5 text-[10px] tracking-[0.35em] uppercase text-t-ink shadow-sm"
                animate={{ opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                Tap to open
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={open}
          aria-label="Open the invitation"
          className="absolute inset-0 z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-t-accent"
          style={{ WebkitTapHighlightColor: "transparent" }}
        />
      </div>
    </div>
  );
}

// The seal artwork carries the original couple's letters; a wax plate over just the lettering
// re-engraves it with this couple's initials while the laurel around it stays visible.
function SealMonogram({ letters: [a, b] }: { letters: [string, string] }) {
  return (
    <div
      aria-hidden
      className="absolute -translate-x-1/2 -translate-y-1/2 [container-type:inline-size]"
      style={{ left: "50%", top: SEAL.top, width: "15%", aspectRatio: "1.6" }}
    >
      <div
        className="absolute inset-0 rounded-[50%]"
        style={{
          background: "radial-gradient(ellipse at 45% 38%, #ecd7b8 0%, #e3c8a4 50%, #d8bb92 100%)",
          maskImage: "radial-gradient(closest-side, #000 72%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, #000 72%, transparent 100%)",
        }}
      />
      <span
        className="absolute inset-0 flex items-center justify-center font-t-heading font-semibold italic leading-none"
        style={{ fontSize: "40cqw", color: "#9c7b4d", textShadow: "0 0.6px 0 rgba(255,246,228,0.9), 0 -0.6px 0 rgba(110,80,40,0.45)" }}
      >
        {a}
        <span className="mx-[0.06em] text-[0.55em]">&amp;</span>
        {b}
      </span>
    </div>
  );
}
