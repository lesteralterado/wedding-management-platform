"use client";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { SectionContent, SectionType } from "@/templates/sections";
import { AreaField, ImageField, ListEditor, TextField, isUsableImage } from "./fields";

type EditorProps<T extends SectionType> = { content: SectionContent<T>; onChange: (content: SectionContent<T>) => void };

function Heading<T extends { tag: string; title: string }>({ content, onChange }: { content: T; onChange: (content: T) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextField label="Small heading" value={content.tag} maxLength={40} onChange={(tag) => onChange({ ...content, tag })} />
      <TextField label="Title" value={content.title} maxLength={80} onChange={(title) => onChange({ ...content, title })} />
    </div>
  );
}

function HeroEditor({ content, onChange }: EditorProps<"HERO">) {
  return (
    <TextField
      label="Invitation line"
      value={content.eyebrow}
      maxLength={80}
      hint="Shown above your names. Your names, date and venue come from Wedding Details."
      onChange={(eyebrow) => onChange({ ...content, eyebrow })}
    />
  );
}

function StoryEditor({ content, onChange }: EditorProps<"STORY">) {
  return (
    <div className="space-y-4">
      <Heading content={content} onChange={onChange} />
      <ListEditor
        items={content.chapters}
        onChange={(chapters) => onChange({ ...content, chapters })}
        newItem={() => ({ label: "", title: "", text: "", image: undefined })}
        itemLabel={(chapter, i) => chapter.title || `Chapter ${i + 1}`}
        addLabel="Add a chapter"
        max={6}
        emptyText="Tell guests how it all began: add your first chapter."
      >
        {(chapter, update) => (
          <>
            <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
              <TextField label="Year or date" value={chapter.label} maxLength={24} placeholder="2020" onChange={(label) => update({ label })} />
              <TextField label="Title" value={chapter.title} maxLength={80} placeholder="First meeting" onChange={(title) => update({ title })} />
            </div>
            <AreaField label="Story" value={chapter.text} maxLength={1200} onChange={(text) => update({ text })} />
            <ImageField label="Photo (optional)" value={chapter.image ?? ""} onChange={(image) => update({ image })} />
          </>
        )}
      </ListEditor>
    </div>
  );
}

function EventsEditor({ content, onChange }: EditorProps<"EVENTS">) {
  return (
    <div className="space-y-4">
      <Heading content={content} onChange={onChange} />
      <ListEditor
        items={content.events}
        onChange={(events) => onChange({ ...content, events })}
        newItem={() => ({ kind: "other" as const, name: "", time: "", venue: "", address: "" })}
        itemLabel={(event, i) => event.name || `Event ${i + 1}`}
        addLabel="Add an event"
        max={6}
        emptyText="Add the ceremony, reception, or any other part of the day."
      >
        {(event, update) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Name" value={event.name} maxLength={60} placeholder="Reception" onChange={(name) => update({ name })} />
              <div className="space-y-1.5">
                <Label>Icon</Label>
                <Select value={event.kind} onChange={(e) => update({ kind: e.target.value as typeof event.kind })}>
                  <option value="ceremony">Ceremony</option>
                  <option value="reception">Reception</option>
                  <option value="other">Other</option>
                </Select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-[130px_1fr]">
              <TextField label="Time" value={event.time} maxLength={40} placeholder="3:00 PM" onChange={(time) => update({ time })} />
              <TextField label="Venue" value={event.venue} maxLength={120} onChange={(venue) => update({ venue })} />
            </div>
            <TextField label="Address" value={event.address} maxLength={240} hint="Used for the “Get directions” link." onChange={(address) => update({ address })} />
          </>
        )}
      </ListEditor>
    </div>
  );
}

function GalleryEditor({ content, onChange, images, onImagesChange }: EditorProps<"GALLERY"> & { images: string[]; onImagesChange: (images: string[]) => void }) {
  return (
    <div className="space-y-4">
      <Heading content={content} onChange={onChange} />
      <ListEditor
        items={images}
        onChange={onImagesChange}
        newItem={() => ""}
        itemLabel={(image, i) => (isUsableImage(image) && image ? `Photo ${i + 1}` : `Photo ${i + 1} (needs a valid link)`)}
        addLabel="Add a photo"
        max={24}
        emptyText="The gallery stays hidden until you add a photo."
      >
        {(image, _update, replace) => <ImageField label="Photo link" value={image} onChange={replace} />}
      </ListEditor>
    </div>
  );
}

function RsvpEditor({ content, onChange }: EditorProps<"RSVP">) {
  return (
    <div className="space-y-4">
      <Heading content={content} onChange={onChange} />
      <TextField
        label="Reply by (optional)"
        type="date"
        value={content.deadline ?? ""}
        hint="Guests see “Kindly respond by …”. Each guest answers on their personal invitation link."
        onChange={(deadline) => onChange({ ...content, deadline: deadline || undefined })}
      />
    </div>
  );
}

function FaqEditor({ content, onChange }: EditorProps<"FAQ">) {
  return (
    <div className="space-y-4">
      <Heading content={content} onChange={onChange} />
      <ListEditor
        items={content.items}
        onChange={(items) => onChange({ ...content, items })}
        newItem={() => ({ question: "", answer: "" })}
        itemLabel={(item, i) => item.question || `Question ${i + 1}`}
        addLabel="Add a question"
        max={12}
        emptyText="Answer what guests always ask: dress code, parking, plus-ones."
      >
        {(item, update) => (
          <>
            <TextField label="Question" value={item.question} maxLength={160} placeholder="What should I wear?" onChange={(question) => update({ question })} />
            <AreaField label="Answer" value={item.answer} maxLength={1200} rows={3} onChange={(answer) => update({ answer })} />
          </>
        )}
      </ListEditor>
    </div>
  );
}

export const SECTION_EDITORS = {
  HERO: HeroEditor,
  STORY: StoryEditor,
  EVENTS: EventsEditor,
  GALLERY: GalleryEditor,
  RSVP: RsvpEditor,
  FAQ: FaqEditor,
};
