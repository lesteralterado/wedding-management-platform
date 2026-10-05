"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { submitRsvp } from "@/features/rsvp/actions";
import { firstName, formatDeadline } from "../format";
import type { SectionProps } from "../registry-types";
import type { SiteGuest } from "../sections";
import { art } from "./art";
import { Floral } from "./floral";
import { SectionHeader } from "./section-header";

type Answer = { status: "GOING" | "DECLINED"; guestCount: number };

export function Rsvp({ content, site }: SectionProps<"RSVP">) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const couple = `${site.wedding.brideName} & ${site.wedding.groomName}`;

  return (
    <section id="rsvp" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <SectionHeader tag={content.tag} title={content.title} />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative px-[13%] pb-[12%] pt-[24%] md:pt-[20%]"
        >
          {/* Paper card frame, stretched to fit whatever is inside */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-no-repeat" style={{ backgroundImage: `url('${art("rsvp/frame.webp")}')`, backgroundSize: "100% 100%" }} />
          {/* Blossom overlapping the top-left corner; % margins keep it proportional to the card */}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative art that must scale with the card */}
          <img src={art("rsvp/flower.webp")} alt="" aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 -ml-[9%] -mt-[5%] w-[26%] select-none" />

          <div className="relative">
            {content.deadline && (
              <p className="mb-6 text-balance text-center text-xs uppercase tracking-[0.25em] text-t-ink-soft">
                Kindly respond by {formatDeadline(content.deadline)}
              </p>
            )}
            {site.guest ? (
              <GuestRsvp guest={site.guest} couple={couple} />
            ) : (
              <div className="py-6 text-center">
                <h3 className="mb-4 font-t-heading text-2xl md:text-3xl">Your RSVP is waiting for you</h3>
                <p className="text-t-ink-soft">
                  {couple} have sent each guest a personal invitation link. Open yours to let them know if you can come.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GuestRsvp({ guest, couple }: { guest: SiteGuest; couple: string }) {
  const previous = guest.rsvp?.submittedAt && guest.rsvp.status !== "PENDING" ? (guest.rsvp as Answer) : null;
  const [answer, setAnswer] = useState<Answer | null>(previous);
  const [editing, setEditing] = useState(!previous);

  return (
    <AnimatePresence mode="wait">
      {editing ? (
        <RsvpForm
          key="form"
          guest={guest}
          initial={answer}
          onSaved={(saved) => {
            setAnswer(saved);
            setEditing(false);
          }}
        />
      ) : (
        answer && (
          <motion.div key="thanks" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-4 text-center">
            <Floral variant="bouquet" delay={0.2} className="mx-auto mb-6 w-24" />
            {answer.status === "GOING" ? (
              <>
                <h3 className="mb-3 font-t-heading text-3xl">See you there, {firstName(guest.fullName)}!</h3>
                <p className="text-t-ink-soft">
                  You&apos;re confirmed for {answer.guestCount} {answer.guestCount === 1 ? "seat" : "seats"}. {couple} can&apos;t wait to celebrate with you.
                </p>
              </>
            ) : (
              <>
                <h3 className="mb-3 font-t-heading text-3xl">You&apos;ll be missed</h3>
                <p className="text-t-ink-soft">Thank you for letting {couple} know. Your kind wishes mean a lot.</p>
              </>
            )}
            <button type="button" onClick={() => setEditing(true)} className="mt-6 text-xs uppercase tracking-[0.2em] text-t-accent-text underline-offset-4 hover:underline">
              Change my response
            </button>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}

function RsvpForm({ guest, initial, onSaved }: { guest: SiteGuest; initial: Answer | null; onSaved: (answer: Answer) => void }) {
  const [status, setStatus] = useState<Answer["status"] | null>(initial?.status ?? null);
  const [guestCount, setGuestCount] = useState(Math.max(1, initial?.guestCount ?? guest.seatsAllowed));
  const [note, setNote] = useState(guest.rsvp?.note ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!status) return;
    setPending(true);
    setError(null);
    const count = status === "GOING" ? guestCount : 0;
    const result = await submitRsvp(guest.inviteCode, { status, guestCount: count, note });
    setPending(false);
    if (result.error) {
      setError(Object.values(result.error).flat()[0] ?? "We couldn't save your response. Please try again.");
      return;
    }
    onSaved({ status, guestCount: count });
  }

  const field = "w-full border border-t-accent/25 bg-t-bg/60 px-5 py-4 text-t-ink transition-colors focus:border-t-accent focus:outline-none focus:ring-2 focus:ring-t-accent/20";
  const label = "mb-3 block text-xs uppercase tracking-[0.2em] text-t-ink-soft";

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} className="space-y-6">
      <p className="text-center font-t-heading text-xl">
        {guest.fullName}
        <span className="mt-1 block text-sm font-normal text-t-ink-soft">
          {guest.seatsAllowed === 1 ? "We have reserved a seat for you" : `We have reserved ${guest.seatsAllowed} seats in your name`}
        </span>
      </p>

      <fieldset>
        <legend className={label}>Will you attend?</legend>
        <div className="flex flex-col gap-4 sm:flex-row">
          {([
            { value: "GOING", label: "Joyfully accept" },
            { value: "DECLINED", label: "Regretfully decline" },
          ] as const).map((option) => {
            const checked = status === option.value;
            return (
              <label key={option.value} className="flex-1 cursor-pointer">
                <input type="radio" name="attendance" value={option.value} checked={checked} onChange={() => setStatus(option.value)} required className="peer sr-only" />
                <span
                  className={`flex items-center justify-center gap-3 rounded-lg border px-5 py-4 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-t-accent ${
                    checked ? "border-t-accent bg-t-accent/10 text-t-accent-text" : "border-t-accent/25 text-t-ink-soft hover:border-t-accent/50"
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${checked ? "border-t-accent-text bg-t-accent-text" : "border-t-accent/40"}`}>
                    {checked && <span className="h-2 w-2 rounded-full bg-t-bg" />}
                  </span>
                  <span className="text-sm">{option.label}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {status === "GOING" && guest.seatsAllowed > 1 && (
        <div>
          <label htmlFor="rsvp-count" className={label}>How many of you will come?</label>
          <select id="rsvp-count" value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className={`${field} cursor-pointer`}>
            {Array.from({ length: guest.seatsAllowed }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="rsvp-note" className={label}>A note for the couple (optional)</label>
        <textarea
          id="rsvp-note"
          rows={3}
          maxLength={600}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Dietary needs, a song request, or a sweet message"
          className={`${field} resize-none placeholder:text-t-ink-soft/60`}
        />
      </div>

      {error && <p role="alert" className="text-center text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={pending || !status}
        className="flex w-full items-center justify-center gap-2 bg-t-accent-text py-4 text-sm font-medium uppercase tracking-[0.2em] text-t-bg transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? "Sending..." : (
          <>
            Send response <ArrowRight size={18} aria-hidden />
          </>
        )}
      </button>
    </motion.form>
  );
}
