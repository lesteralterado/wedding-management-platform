"use client";

import { ArrowLeft, ArrowRight, BookHeart, CalendarHeart, Images, LoaderCircle, MailCheck, MessageCircleQuestion, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { LookPicker } from "@/components/studio/look-picker";
import { PreviewFrame } from "@/components/studio/preview-frame";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { createSlug } from "@/lib/utils/slug";
import { DEFAULT_TEMPLATE_ID, getPalette, type TemplateId } from "@/templates/catalog";
import { buildSite, SECTION_TYPES, type SectionType } from "@/templates/sections";
import { TextField } from "@/components/studio/fields";

type Draft = {
  brideName: string;
  groomName: string;
  date: string;
  venue: string;
  venueAddress: string;
  templateId: TemplateId;
  paletteId: string;
  sections: SectionType[];
};

const OPTIONAL_SECTIONS: { type: Exclude<SectionType, "HERO">; label: string; description: string; icon: LucideIcon }[] = [
  { type: "STORY", label: "Our story", description: "How you met and the proposal, with photos.", icon: BookHeart },
  { type: "EVENTS", label: "Events", description: "Ceremony and reception times, with directions.", icon: CalendarHeart },
  { type: "GALLERY", label: "Gallery", description: "A photo wall of your favourite moments.", icon: Images },
  { type: "RSVP", label: "RSVP", description: "Guests answer on their personal invitation link.", icon: MailCheck },
  { type: "FAQ", label: "Questions", description: "Dress code, parking, plus-ones, and more.", icon: MessageCircleQuestion },
];

const STEPS = [
  { title: "The two of you", subtitle: "Let's start with the essentials. You can change any of this later." },
  { title: "Choose a look", subtitle: "Each template is designed to feel like a printed invitation." },
  { title: "Pick a colour story", subtitle: "Colours chosen to work together, and to stay easy to read." },
  { title: "What will guests see?", subtitle: "Switch on the parts you want. Empty ones stay hidden until you fill them." },
  { title: "Looks lovely", subtitle: "Create your website, then add your story and details in the Studio." },
];

const STORAGE_KEY = "weddingflow:onboarding";

const EMPTY: Draft = {
  brideName: "",
  groomName: "",
  date: "",
  venue: "",
  venueAddress: "",
  templateId: DEFAULT_TEMPLATE_ID,
  paletteId: getPalette(DEFAULT_TEMPLATE_ID, null).id,
  sections: SECTION_TYPES.filter((type) => type !== "HERO"),
};

const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

/** Placeholder date for the preview until the couple picks one: a year from today. */
function placeholderDate() {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

export function OnboardingWizard() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [step, setStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [creating, setCreating] = useState(false);

  // Keep the draft on this device so a closed tab doesn't lose it. Storage can be unavailable
  // (private browsing), in which case the wizard simply starts fresh.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setDraft({ ...EMPTY, ...(JSON.parse(stored) as Partial<Draft>) });
    } catch {
      // Storage is unavailable (e.g. private browsing); the wizard works without the saved draft.
    }
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage is unavailable (e.g. private browsing); the wizard works without the saved draft.
    }
  }, [draft]);

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const missing = {
    brideName: !draft.brideName.trim(),
    groomName: !draft.groomName.trim(),
    date: !isDate(draft.date),
    venue: !draft.venue.trim(),
  };
  const detailsComplete = !Object.values(missing).some(Boolean);

  const site = useMemo(() => {
    const date = isDate(draft.date) ? draft.date : placeholderDate();
    return buildSite({
      templateId: draft.templateId,
      paletteId: draft.paletteId,
      wedding: {
        slug: "preview",
        brideName: draft.brideName.trim() || "Bride",
        groomName: draft.groomName.trim() || "Groom",
        date: `${date}T00:00:00.000Z`,
        venue: draft.venue.trim() || "Your venue",
        venueAddress: draft.venueAddress.trim() || null,
        coverImage: null,
        galleryImages: [],
      },
      rows: SECTION_TYPES.map((type, position) => ({ type, position, enabled: type === "HERO" || draft.sections.includes(type), content: undefined })),
    });
  }, [draft]);

  function next() {
    if (step === 0 && !detailsComplete) {
      setShowErrors(true);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function create() {
    setCreating(true);
    const response = await fetch("/api/wedding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, status: "PLANNING" }),
    });
    if (!response.ok) {
      setCreating(false);
      const payload = await response.json().catch(() => ({}));
      const message = Object.values((payload.error ?? {}) as Record<string, string[]>).flat()[0];
      toast.error(message ?? "We couldn't create your website. Please try again.");
      if (response.status === 400) setStep(0);
      if (response.status === 409) router.push("/dashboard/studio");
      return;
    }
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage is unavailable (e.g. private browsing); the wizard works without the saved draft.
    }
    toast.success("Your website is ready!");
    router.push("/dashboard/studio");
    router.refresh();
  }

  const slug = createSlug(`${draft.brideName}-${draft.groomName}`);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-warm md:p-10">
        <ol className="mb-8 flex gap-2" aria-label="Progress">
          {STEPS.map((item, index) => (
            <li key={item.title} className="flex-1">
              <span className={cn("block h-1.5 rounded-full transition-colors", index <= step ? "bg-primary" : "bg-secondary")} />
              <span className="sr-only">{`${item.title}${index === step ? " (current step)" : ""}`}</span>
            </li>
          ))}
        </ol>

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Step {step + 1} of {STEPS.length}</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">{STEPS[step].title}</h1>
        <p className="mt-3 text-muted-foreground">{STEPS[step].subtitle}</p>

        <div className="mt-8">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Required show={showErrors && missing.brideName} message="Add the bride's name">
                <TextField label="Bride's name" value={draft.brideName} maxLength={60} onChange={(brideName) => set({ brideName })} />
              </Required>
              <Required show={showErrors && missing.groomName} message="Add the groom's name">
                <TextField label="Groom's name" value={draft.groomName} maxLength={60} onChange={(groomName) => set({ groomName })} />
              </Required>
              <Required show={showErrors && missing.date} message="Pick your wedding date">
                <TextField label="Wedding date" type="date" value={draft.date} onChange={(date) => set({ date })} />
              </Required>
              <Required show={showErrors && missing.venue} message="Where is it happening?">
                <TextField label="Venue" value={draft.venue} maxLength={120} placeholder="Manila Cathedral" onChange={(venue) => set({ venue })} />
              </Required>
              <div className="sm:col-span-2">
                <TextField label="Venue address (optional)" value={draft.venueAddress} maxLength={240} hint="Powers the “Get directions” link." onChange={(venueAddress) => set({ venueAddress })} />
              </div>
            </div>
          )}

          {step === 1 && <LookPicker part="template" templateId={draft.templateId} paletteId={draft.paletteId} onChange={set} />}
          {step === 2 && <LookPicker part="palette" templateId={draft.templateId} paletteId={draft.paletteId} onChange={set} />}

          {step === 3 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {OPTIONAL_SECTIONS.map((section) => {
                const on = draft.sections.includes(section.type);
                return (
                  <label
                    key={section.type}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                      on ? "border-accent bg-secondary" : "border-border hover:bg-secondary/60",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[var(--accent)]"
                      checked={on}
                      onChange={() => set({ sections: on ? draft.sections.filter((t) => t !== section.type) : [...draft.sections, section.type] })}
                    />
                    <span>
                      <span className="flex items-center gap-2 font-semibold">
                        <section.icon className="h-4 w-4 text-accent" aria-hidden /> {section.label}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{section.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-sm text-muted-foreground">Your website address</p>
                <p className="mt-1 break-all font-semibold">/w/{slug}</p>
                <p className="mt-2 text-xs text-muted-foreground">If another couple already has it, we&apos;ll add a number at the end.</p>
              </div>
              {/* Phones don't have room for the side preview, so show it here. */}
              <div className="h-[560px] lg:hidden">
                <PreviewFrame site={site} device="phone" focusId={null} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" disabled={step === 0 || creating} onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next}>
              Continue <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
            </Button>
          ) : (
            <Button type="button" size="lg" disabled={creating} onClick={create}>
              {creating && <LoaderCircle className="mr-1.5 h-4 w-4 animate-spin" aria-hidden />}
              Create my website
            </Button>
          )}
        </div>
      </section>

      <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] max-h-[860px] lg:block" aria-label="Live preview">
        <PreviewFrame site={site} device="phone" focusId={null} />
      </aside>
    </div>
  );
}

function Required({ show, message, children }: { show: boolean; message: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {show && <p className="mt-1 text-sm text-destructive">{message}</p>}
    </div>
  );
}
