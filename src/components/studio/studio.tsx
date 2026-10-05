"use client";

import {
  BookHeart,
  CalendarHeart,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  ArrowDown,
  ArrowUp,
  Images,
  LayoutList,
  LoaderCircle,
  MailCheck,
  MessageCircleQuestion,
  Monitor,
  Palette,
  PanelTop,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { saveStudio } from "@/features/studio/actions";
import type { StudioState } from "@/features/studio/queries";
import { buildSite, hasContent, SECTION_NAV, type EditableSection, type SectionType } from "@/templates/sections";
import { isUsableImage } from "./fields";
import { LookPicker } from "./look-picker";
import { PreviewFrame, type Device } from "./preview-frame";
import { SECTION_EDITORS } from "./section-editors";

const SECTION_META: Record<SectionType, { label: string; icon: LucideIcon; emptyHint?: string }> = {
  HERO: { label: "Welcome", icon: PanelTop },
  STORY: { label: "Our story", icon: BookHeart, emptyHint: "Add a chapter to show it" },
  EVENTS: { label: "Events", icon: CalendarHeart, emptyHint: "Add an event to show it" },
  GALLERY: { label: "Gallery", icon: Images, emptyHint: "Add a photo to show it" },
  RSVP: { label: "RSVP", icon: MailCheck },
  FAQ: { label: "Questions", icon: MessageCircleQuestion, emptyHint: "Add a question to show it" },
};

type Draft = Pick<StudioState, "templateId" | "paletteId" | "galleryImages" | "sections">;

const snapshot = (draft: Draft) => JSON.stringify(draft);

/** A half-typed image link must not blank the preview, so the preview only gets usable ones. */
function previewSections(sections: EditableSection[]): EditableSection[] {
  return sections.map((section) =>
    section.type === "STORY"
      ? { ...section, content: { ...section.content, chapters: section.content.chapters.map((c) => ({ ...c, image: isUsableImage(c.image) ? c.image : undefined })) } }
      : section,
  );
}

export function Studio({ initial, canSave }: { initial: StudioState; canSave: boolean }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(() => ({
    templateId: initial.templateId,
    paletteId: initial.paletteId,
    galleryImages: initial.galleryImages,
    sections: initial.sections,
  }));
  const [saved, setSaved] = useState(() => snapshot(draft));
  const [tab, setTab] = useState<"sections" | "look">("sections");
  const [open, setOpen] = useState<SectionType | null>("HERO");
  const [device, setDevice] = useState<Device>("phone");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);

  const dirty = snapshot(draft) !== saved;

  // Don't let an unsaved afternoon of edits vanish with a stray tab close.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const site = useMemo(
    () =>
      buildSite({
        templateId: draft.templateId,
        paletteId: draft.paletteId,
        wedding: { ...initial.wedding, galleryImages: draft.galleryImages.filter((img) => img && isUsableImage(img)) },
        rows: previewSections(draft.sections).map((section, position) => ({ ...section, position })),
      }),
    [draft, initial.wedding],
  );

  const updateSection = (type: SectionType, patch: Partial<EditableSection>) =>
    setDraft((d) => ({ ...d, sections: d.sections.map((s) => (s.type === type ? ({ ...s, ...patch } as EditableSection) : s)) }));

  const moveSection = (index: number, to: number) =>
    setDraft((d) => {
      const sections = [...d.sections];
      const [item] = sections.splice(index, 1);
      sections.splice(to, 0, item);
      return { ...d, sections };
    });

  async function save() {
    setSaving(true);
    const result = await saveStudio({ ...draft, galleryImages: draft.galleryImages.filter(Boolean) });
    setSaving(false);
    if (!result.success) {
      toast.error(result.error);
      // Open the section the problem is in, e.g. ["sections", "1", "content", ...].
      const index = "path" in result && result.path?.[0] === "sections" ? Number(result.path[1]) : NaN;
      if (!Number.isNaN(index) && draft.sections[index]) {
        setTab("sections");
        setOpen(draft.sections[index].type);
      }
      return;
    }
    setSaved(snapshot(draft));
    toast.success("Saved. Your website is up to date.");
    router.refresh();
  }

  function discard() {
    setDraft(JSON.parse(saved) as Draft);
  }

  const focusId = tab === "sections" && open ? SECTION_NAV[open].id : null;

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100vh-4rem)] lg:flex-row">
      {/* Mobile: switch between editing and previewing */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-1 lg:hidden">
        {(["edit", "preview"] as const).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setMobileView(view)}
            className={cn("rounded-xl py-2 text-sm font-semibold capitalize", mobileView === view ? "bg-secondary text-foreground" : "text-muted-foreground")}
          >
            {view}
          </button>
        ))}
      </div>

      <section className={cn("flex min-h-0 flex-col rounded-[1.5rem] border border-border bg-card shadow-soft lg:w-[440px] lg:shrink-0", mobileView === "preview" && "hidden lg:flex")}>
        <div className="border-b border-border p-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Studio</p>
          <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1" role="tablist">
            {([
              { id: "sections", label: "Sections", icon: LayoutList },
              { id: "look", label: "Look", icon: Palette },
            ] as const).map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn("flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors", tab === item.id ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <item.icon className="h-4 w-4" aria-hidden /> {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {tab === "look" ? (
            <LookPicker templateId={draft.templateId} paletteId={draft.paletteId} onChange={(look) => setDraft((d) => ({ ...d, ...look }))} />
          ) : (
            <ol className="space-y-2">
              {draft.sections.map((section, index) => {
                const meta = SECTION_META[section.type];
                const isOpen = open === section.type;
                const empty = !hasContent(section, { galleryImages: draft.galleryImages.filter(Boolean) });
                const Editor = SECTION_EDITORS[section.type] as (props: Record<string, unknown>) => React.ReactNode;
                return (
                  <li key={section.type} className={cn("rounded-2xl border transition-colors", isOpen ? "border-accent/40 bg-background" : "border-border")}>
                    <div className="flex items-center gap-2 p-2 pl-3">
                      <button type="button" className="flex min-w-0 flex-1 items-center gap-3 py-1 text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : section.type)}>
                        <meta.icon className={cn("h-5 w-5 shrink-0", section.enabled ? "text-accent" : "text-muted-foreground")} aria-hidden />
                        <span className="min-w-0">
                          <span className={cn("block font-semibold", !section.enabled && "text-muted-foreground line-through decoration-1")}>{meta.label}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {!section.enabled ? "Hidden from guests" : empty && meta.emptyHint ? meta.emptyHint : "Shown on your site"}
                          </span>
                        </span>
                        <ChevronRight className={cn("ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")} aria-hidden />
                      </button>
                      {section.type !== "HERO" && (
                        <div className="flex shrink-0">
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label={`Move ${meta.label} up`} disabled={index <= 1} onClick={() => moveSection(index, index - 1)}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label={`Move ${meta.label} down`} disabled={index === draft.sections.length - 1} onClick={() => moveSection(index, index + 1)}>
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={section.enabled ? `Hide ${meta.label}` : `Show ${meta.label}`}
                            aria-pressed={!section.enabled}
                            onClick={() => updateSection(section.type, { enabled: !section.enabled })}
                          >
                            {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                        </div>
                      )}
                    </div>
                    {isOpen && (
                      <div className="border-t border-border p-4">
                        <Editor
                          content={section.content}
                          onChange={(content: unknown) => updateSection(section.type, { content } as Partial<EditableSection>)}
                          images={draft.galleryImages}
                          onImagesChange={(galleryImages: string[]) => setDraft((d) => ({ ...d, galleryImages }))}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border p-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {!canSave ? "Demo mode: changes aren't saved" : dirty ? "Unsaved changes" : "All changes saved"}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" disabled={!dirty || saving} onClick={discard}>Discard</Button>
            <Button type="button" size="sm" disabled={!dirty || saving || !canSave} onClick={save}>
              {saving && <LoaderCircle className="mr-1.5 h-4 w-4 animate-spin" aria-hidden />}
              Save changes
            </Button>
          </div>
        </div>
      </section>

      <section className={cn("flex min-h-[70vh] min-w-0 flex-1 flex-col gap-3 lg:min-h-0", mobileView === "edit" && "hidden lg:flex")}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
            {([
              { id: "phone", label: "Phone", icon: Smartphone },
              { id: "desktop", label: "Desktop", icon: Monitor },
            ] as const).map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={device === item.id}
                onClick={() => setDevice(item.id)}
                className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold", device === item.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <item.icon className="h-4 w-4" aria-hidden /> {item.label}
              </button>
            ))}
          </div>
          <a href={`/w/${initial.wedding.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
            Open live site <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
        <div className="min-h-0 flex-1">
          <PreviewFrame site={site} device={device} focusId={focusId} />
        </div>
      </section>
    </div>
  );
}
