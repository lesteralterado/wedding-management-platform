# Customer Portal Plan: from sign-up to venue QR

## 1. Where we are today

Short answer to "do we have a customer portal?": **the screens exist, but the system behind them doesn't yet.**

| Area | What exists | Gap |
| --- | --- | --- |
| Auth | NextAuth login/register, roles (`CUSTOMER`, `STAFF`, `SUPER_ADMIN`) and per-wedding roles (`OWNER`, `PLANNER`, `RECEPTIONIST`, `PHOTOGRAPHER`…) | Dashboard always resolves to the mock wedding (`src/lib/wedding/current.ts`), and `getWeddingStaffRole()` always returns `OWNER` |
| Wedding details | Form + `Wedding` model | `theme` is a free-text string. No template, palette or feature selection |
| Guests | CSV import, groups, seats allowed, invite codes | Queries read mock data (`src/features/guests/queries.ts`) |
| Invitations / RSVP | `/invite/[inviteCode]` page + RSVP form | `submitRsvp` doesn't write to the DB (`src/features/rsvp/actions.ts`) |
| QR | Per-guest QR that encodes the invite URL | It only reopens the invite. No check-in and no day-of view |
| Subscriptions | Admin page | Mock numbers. No plans, payments or feature gating |
| Seating, menu, program, check-in | Receptionist demo card with hardcoded tables | No models and no screens |
| Public site | `/w/[slug]` with one fixed layout | Single design, no templates |

**Bottom line:** Phase 0 below (making it real) has to come before the new features. Otherwise each new feature gets built on mock data twice.

---

## 2. The one idea that keeps this simple

> **One guest = one personal link = one QR. What it shows depends on *when* it's opened and *what the guest answered*.**

```
                 ┌──────────── same link: /i/{token} ────────────┐
 Before RSVP  →  Invitation (doors intro) → RSVP form
 RSVP = Going →  "You're on the list" + Digital Pass (QR) + Add to calendar
 RSVP = No    →  Thank-you note (+ change answer until deadline)
 Event day    →  Guest Hub: my table · menu · program · upload photos
 After event  →  Gallery + thank-you message from the couple
```

The guest never has to choose between "the invitation link", "the RSVP link" and "the venue link". There's only one link, sent once.

**At the venue there are two kinds of QR:**

1. **Guest's personal QR (the Digital Pass):** the receptionist scans it to check the guest in. The screen shows name, party size and table, and one tap marks them arrived. This is the anti-gate-crasher check.
2. **Venue/table QR (printed on table cards and signage):** opens `/w/{slug}/live`. If the phone already opened its invite, a cookie identifies the guest and the hub opens straight away. If not, the guest types their name and the last 4 digits of their phone to find themselves. The hub only unlocks for guests with RSVP = Going.

---

## 3. The couple's journey (the customer portal)

Goal: **a published, shareable wedding site in under 10 minutes**, with everything else added later.

```
Landing ─► Pick plan ─► Sign up ─► Onboarding wizard (5 steps) ─► Studio ─► Publish ─► Guests ─► Send ─► Track ─► Day-of
```

### 3.1 Onboarding wizard: one question per screen, live preview always visible

| Step | Asks | Notes |
| --- | --- | --- |
| 1. The two of you | Names, date, city | Preview immediately shows *their* names in the template |
| 2. Choose a look | Template gallery | Cards show real previews with their names, not stock "Jane & John" |
| 3. Colour story | 4–6 curated palettes per template + "custom accent" | See §5 for why palettes are curated |
| 4. What your guests will see | Feature cards (toggle on/off) | Locked cards show which plan unlocks them |
| 5. Preview & publish | Phone + desktop preview, choose URL slug | Publishing is the payment moment (see §8) |

Everything is saved as a draft after each step, so they can leave and return. *(As built: the draft is kept on the couple’s device until they press “Create my website”; the wedding is created in one step at the end.)*

### 3.2 Studio (the main editor after onboarding)

- **Left:** list of sections (drag to reorder, eye icon to hide). Click one to edit its content.
- **Right:** live preview in a phone frame, with a toggle for desktop.
- **Top:** Template · Colours · Fonts · **Publish** button.
- This replaces the current "Wedding Details" form as the main place the couple works.

### 3.3 Feature catalogue (what couples toggle)

| Feature | Guest-facing before event | Day-of hub | Plan |
| --- | --- | --- | --- |
| Hero + countdown | ✓ | | All |
| Our story / timeline | ✓ | | All |
| Event details (ceremony, reception, maps) | ✓ | ✓ | All |
| RSVP (+ meal choice, +1s, notes) | ✓ | | All |
| Photo gallery (couple's photos) | ✓ | ✓ | All |
| Dress code / colour motif | ✓ | | All |
| FAQ, travel & accommodation | ✓ | | Signature+ |
| Gift registry / cash gift (GCash QR) | ✓ | | Signature+ |
| **Menu** | (preview) | ✓ | Signature+ |
| **Program / order of events** | | ✓ | Signature+ |
| **Seating arrangement** | | ✓ "Your table" | Grand |
| **QR check-in** (receptionist app) | | ✓ | Grand |
| Live guest photo upload / photo wall | | ✓ | Grand |
| Custom domain, remove branding | ✓ | ✓ | Grand |

---

## 4. Architecture

### 4.1 Templates are code; content is data

Templates are designed pieces of art (the door intro in `wedding-template-2` is a good example), so they should stay as **React code in the repo**, not something couples assemble. Couples only control **content, palette, fonts and which sections are on**.

```
src/templates/
  types.ts              // TemplateDefinition contract
  registry.ts           // { "royal-arch": royalArch, "citrus-garden": ..., ... }
  shared/               // fallback sections any template can reuse (FAQ, Menu, Program…)
  royal-arch/           // ported from wedding-template-2
    index.ts            // the definition below
    intro.tsx           // IntroGate (doors + wax seal)
    hero.tsx, story.tsx, events.tsx, gallery.tsx, rsvp.tsx, floral.tsx
public/templates/royal-arch/   // arch.webp, door-*.webp, floral/*, rsvp/*
```

```ts
// src/templates/types.ts
export type SectionType =
  | "hero" | "story" | "events" | "gallery" | "rsvp" | "dressCode"
  | "faq" | "travel" | "registry" | "menu" | "program" | "seating";

export type ThemeTokens = {
  bg: string; surface: string; ink: string; inkSoft: string;
  accent: string; accentSoft: string;
};

export type TemplateDefinition = {
  id: string;
  name: string;
  previewImage: string;
  intro?: React.ComponentType<IntroProps>;            // optional opening animation
  sections: Partial<Record<SectionType, React.ComponentType<SectionProps>>>;
  palettes: { id: string; name: string; tokens: ThemeTokens }[];  // curated colourways
  fonts: { heading: string; body: string; script?: string };
  minPlan: PlanTier;
};
```

The public page becomes one generic renderer:

```tsx
// /w/[slug]/page.tsx (sketch)
const t = templates[wedding.templateId];
return (
  <ThemeScope tokens={wedding.theme}>               {/* sets --t-* CSS vars */}
    {t.intro && <t.intro wedding={wedding} />}
    {wedding.sections.filter(s => s.enabled).map(s => {
      const Section = t.sections[s.type] ?? shared[s.type];
      return <Section key={s.id} wedding={wedding} content={s.content} />;
    })}
  </ThemeScope>
);
```

### 4.2 Data model additions (Prisma)

```prisma
enum PlanTier      { ESSENTIALS SIGNATURE GRAND }
enum SectionType   { HERO STORY EVENTS GALLERY RSVP DRESS_CODE FAQ TRAVEL REGISTRY MENU PROGRAM SEATING }
enum WeddingPhase  { DRAFT PUBLISHED LIVE ARCHIVED }

model Wedding {
  // existing fields…
  templateId   String        @default("royal-arch")
  paletteId    String?
  themeTokens  Json?         // only set when the couple customises the accent
  phase        WeddingPhase  @default(DRAFT)
  rsvpDeadline DateTime?
  sections     WeddingSection[]
  events       WeddingEvent[]
  tables       Table[]
  menuItems    MenuItem[]
  program      ProgramItem[]
  subscription Subscription?
}

model WeddingSection {           // one row per section; order + toggle + content
  id        String      @id @default(cuid())
  weddingId String
  type      SectionType
  enabled   Boolean     @default(true)
  position  Int
  content   Json        // validated per type by a zod schema
  @@unique([weddingId, type])
}

model WeddingEvent { id String @id @default(cuid()); weddingId String; name String; startsAt DateTime; venue String; address String?; mapUrl String? }

model Table       { id String @id @default(cuid()); weddingId String; name String; capacity Int; shape String @default("round"); x Float?; y Float?; guests Guest[] }
model MenuItem    { id String @id @default(cuid()); weddingId String; course String; name String; description String?; isChoice Boolean @default(false); position Int }
model ProgramItem { id String @id @default(cuid()); weddingId String; time DateTime; title String; note String?; position Int }

model Guest {
  // existing fields…
  accessToken String   @unique   // 128-bit random; used in /i/{token} and the QR
  tableId     String?
  table       Table?   @relation(fields: [tableId], references: [id])
  checkIn     CheckIn?
}

model Rsvp {
  // existing fields…
  mealChoiceId String?
  plusOneNames Json    @default("[]")
}

model CheckIn {
  id          String   @id @default(cuid())
  guestId     String   @unique
  partySize   Int
  checkedInAt DateTime @default(now())
  byUserId    String   // receptionist
}

enum BillingInterval    { ONE_TIME MONTHLY }
enum PaymentProviderId  { PAYMONGO STRIPE }
enum SubscriptionStatus { PENDING ACTIVE PAST_DUE CANCELLED EXPIRED }

model Plan {                     // see §8: prices live here, editable by the admin
  id        String          @id @default(cuid())
  tier      PlanTier
  interval  BillingInterval
  currency  String          // "PHP", "USD"
  amount    Int             // minor units (centavos/cents)
  active    Boolean         @default(true)
  @@unique([tier, interval, currency])
}

model Subscription {             // one per wedding, covers both one-time and monthly
  id                     String             @id @default(cuid())
  weddingId              String             @unique
  planId                 String
  provider               PaymentProviderId
  providerCustomerId     String?
  providerSubscriptionId String?            @unique  // null for one-time
  status                 SubscriptionStatus @default(PENDING)
  currentPeriodEnd       DateTime?          // monthly: next renewal; one-time: wedding date + 12 months
  graceUntil             DateTime?          // set on PAYMENT_FAILED (+14 days)
  cancelAt               DateTime?
  payments               Payment[]
}

model Payment {                  // every charge, from either provider, for receipts and admin revenue
  id             String            @id @default(cuid())
  subscriptionId String
  provider       PaymentProviderId
  providerRef    String            @unique  // makes webhook handling idempotent
  amount         Int
  currency       String
  method         String?           // "card", "gcash", "maya"
  status         String
  paidAt         DateTime?
}
```

Feature gating is one function used everywhere (Studio toggles, server actions and public rendering):

```ts
canUse(wedding, "SEATING")  // → tier check + section enabled
```

### 4.3 Routes

| Route | Who | Purpose |
| --- | --- | --- |
| `/onboarding/[step]` | Couple | 5-step wizard |
| `/dashboard/studio` | Couple | Template, colours, sections, live preview |
| `/dashboard/guests` · `/invitations` · `/rsvps` | Couple | Exist already, need wiring to the DB |
| `/dashboard/seating` | Couple/Planner | Drag guests onto tables |
| `/dashboard/menu` · `/dashboard/program` | Couple/Planner | Simple ordered lists |
| `/dashboard/checkin` | Receptionist | Camera scanner + search fallback |
| `/dashboard/billing` | Owner | Plan, interval, receipts, upgrade, switch monthly → one-time, cancel |
| `/api/billing/paymongo` · `/api/billing/stripe` | Providers | Webhooks → shared billing handler |
| `/w/[slug]` | Public | Wedding site (no personal data) |
| `/i/[token]` | Guest | Personal invite → RSVP → pass → hub (§2) |
| `/w/[slug]/live` | Guest at venue | Day-of hub via table QR (identifies the guest) |

Keep `/invite/[inviteCode]` as a redirect to `/i/[token]` so already-sent links keep working.

---

## 5. Design direction

### 5.1 Principles

1. **The couple's site is the star; the portal is the stationery desk.** Dashboard chrome stays quiet: ivory, ink and one accent, with no gradients competing with their preview. Save the drama (doors opening, pass reveal) for guest moments.
2. **Curated over infinite.** Couples shouldn't get a free hex picker for six colours, because that's how sites end up ugly. Each template ships 4–6 tested palettes, and a "custom accent" option changes only the accent, with an automatic contrast check (≥ 4.5:1 for text on bg).
3. **Design for the phone in Messenger first.** Most guests will open the invite from a chat app on a phone. Every guest screen is designed at 375px first, with thumb-reachable buttons and no hover-only actions.
4. **One primary action per screen.** Invite → "RSVP". Pass → "Show at the entrance". Hub → "Find my table".
5. **Warm microcopy.** "Kindly respond by May 1" instead of "Submit form". "You're seated at Table 4 — Sampaguita" instead of "Table assignment: 4".

### 5.2 Porting `wedding-template-2` ("Royal Arch")

Its tokens map straight onto `ThemeTokens` as the default "Champagne & Ivory" palette:

| Token | Value | Source |
| --- | --- | --- |
| `bg` | `#f8f6f3` | `background` |
| `surface` | `#ffffff` | `card-bg` |
| `ink` | `#2d2a26` | `text-primary` |
| `inkSoft` | `#6b6560` | `text-secondary` |
| `accent` | `#b8963a` | `accent` |
| `accentSoft` | `#e8d5a8` | `accent-light` |
| Fonts | Cormorant Garamond / Montserrat / Great Vibes (names) | `layout.tsx` |

Suggested extra colourways for this template: **Sage & Linen**, **Dusty Rose**, **Midnight & Gold** (the navy palette in its `SPEC.md`) and **Terracotta**.

Things to know before porting:

- **The SVGs aren't real vectors.** `rsvp/frame.svg` (620 KB) and `rsvp/flower.svg` (487 KB) wrap base64 PNGs plus a luminance mask, so changing `fill` won't recolour them. Use them as a CSS `mask-image` over a `background: var(--t-accent)` box, which makes the frame follow any palette for free. Better still, have the frame re-traced as a true vector (a few KB). The floral `.webp` art is full-colour, so give each palette a matching floral set or keep florals neutral.
- **Everything is hardcoded.** Names, venue and the countdown date need to come from props. The countdown currently targets `2027-07-15` while the hero says `February 07, 2027`. Making it data-driven fixes that bug too.
- **Version gap.** The template uses Next 16 / React 18 / Tailwind 3, and this repo uses Next 15 / React 19 / Tailwind 4. `Image`'s `preload` prop becomes `priority`, and the `tailwind.config.ts` colours become `--t-*` CSS variables referenced from Tailwind 4 `@theme`.
- **Scope the fonts.** Load template fonts only on the public wedding routes, not in the root layout, so the dashboard doesn't download Great Vibes.

**As built in Phase 1** (where it differs from the notes above):

- **Paper stays ivory.** The arch photo and the two section borders are opaque, painted on ivory paper. So Royal Arch colourways change the accent, ribbons and ink, and keep an ivory background (Champagne & Ivory, Sage & Linen, Dusty Rose, Terracotta). **Midnight & Gold is dropped for this template**; a dark palette fights the ivory artwork. It belongs to a future dark template.
- **The RSVP frame isn't recoloured.** Extracted, `frame.svg` turned out to be a cream paper card and `flower.svg` white blossoms, both neutral. They're now transparent WebPs (620 KB → 40 KB and 487 KB → 58 KB) in their natural colours.
- **Two accent tokens.** The template gold (`#b8963a`) is only ~2.6:1 on ivory, too faint for small text. Every palette has `accent` (decoration) and a deeper `accentText` (small text, buttons). A test enforces WCAG AA on all palettes.
- **Wax seal monogram.** The door artwork has the letters "SLY" baked into its seal. A wax plate engraved with the couple's own initials now covers the lettering and swings with the door.
- **Events live in section content.** `WeddingEvent` isn't a separate table yet: ceremony and reception are part of the `EVENTS` section's JSON. Move them to a table when the day-of program (Phase 4) needs to query them.
- **The personal invitation uses the template too.** `/invite/[code]` renders the couple's site addressed to the guest ("Dear Mia,"), with their RSVP form and seat count built in.

### 5.3 Key guest screens to design first

1. **Invite (closed doors) → open → RSVP**: already prototyped in the template.
2. **Digital Pass**: a ticket-shaped card in the template's palette with the couple's names in script, the guest's name, party size, a large QR (min 240px, high-contrast, dark-on-light even in dark palettes so scanners read it), and "Add to Wallet / Save image".
3. **Day-of Hub**: a big "Your table" card at the top, then tabs for Program · Menu · Photos. It has to stay readable in a dim reception hall, so add a high-contrast mode.
4. **Receptionist scanner**: a full-screen camera, then a big green "✓ Welcome, Ava Reyes, party of 2, Table 4" card or a red "Not on the list / already checked in at 4:12 PM" card. It needs to be usable one-handed.

---

## 6. Sending invitations: email + Messenger

Decided: **email and Messenger share links.**

### 6.1 Email
- Sent from the Invitations page, either to everyone, by group, or only to people who haven't responded.
- The email has the couple's names in the template's palette, one button ("Open your invitation") and the personal `/i/{token}` link. Keep it image-light so it doesn't land in spam.
- An automatic reminder before the RSVP deadline goes only to guests with no answer. The couple can switch it off.
- The existing SendGrid helper (`src/lib/email/sendgrid.ts`) is the starting point.

### 6.2 Messenger share links
Most Filipino guests will get their invite this way, so the link preview matters as much as the page.

- Each guest row has a **"Send via Messenger"** button. On phones it opens Messenger with the guest's personal link ready to send. On desktop it falls back to **"Copy link + message"**, with a pre-written message in the couple's voice that they can edit once and reuse.
- **Link preview card:** every `/i/{token}` page renders Open Graph tags with a generated image (couple names, date and template artwork via `next/og`), so the chat shows a beautiful card instead of a bare URL. This is the single biggest quality signal on the guest side.
- Because the couple sends these manually, the dashboard tracks status as: **Not sent → Shared (button clicked) → Opened (first visit to the link) → Responded**. "Opened" works for both channels, since it's recorded when the link is first visited.
- The personal link is private to that guest, so the share message should say "This invitation is just for you", which discourages forwarding.

---

## 7. Day-of operations: the details that bite

- **Venue Wi-Fi is usually bad.** The check-in screen downloads the guest list when opened, works offline, and queues check-ins to sync later.
- **Not every phone can scan in the browser.** `BarcodeDetector` isn't available on iOS Safari, so use a small QR scanner library and always offer a name-search fallback.
- **Duplicate scans.** Show "already checked in at 4:12 PM by Maria" instead of an error.
- **Walk-ins and unconfirmed guests.** The receptionist can "admit anyway", which is logged and shown to the couple later.
- **Printed QR for elderly guests.** Allow exporting each pass as a printable card (PDF), plus table cards with the venue QR.

---

## 8. Billing

Decided: **both one-time and monthly**, through **both PayMongo and Stripe**.

### 8.1 Two ways to pay, same tiers

Every tier (**Essentials / Signature / Grand**, see §3.3) can be bought either way:

| | One-time package | Monthly |
| --- | --- | --- |
| Who it suits | Couples with a long engagement | Couples whose wedding is soon, or who want a low first payment |
| Access | Until 12 months after the wedding date | While the subscription is active |
| Pricing guidance | Set it at about 4–5× the monthly price, so it's clearly better value for anyone planning more than 5 months ahead | — |
| Upgrade | Pay the difference | Prorated by the provider |
| Ends | Archive 12 months after the wedding | Couple cancels after the wedding, or it ends when they switch to one-time |

The plan picker shows both side by side with a "you'd save ₱X with one-time" hint based on their wedding date.

- **Build free, pay to publish** still applies. Onboarding and the Studio need no card, and payment happens at "Publish & send invitations".
- A couple on monthly can switch to one-time at any point. The one-time price minus what they've already paid this cycle is a good goodwill rule.

### 8.2 When a monthly payment fails or is cancelled

Guests must never hit a dead invite link a week before the wedding, so a lapse degrades gently:

1. **Day 0:** payment fails. Email the couple, show a banner in the dashboard, and retry automatically if the provider supports it.
2. **Days 0–14 (grace):** everything keeps working.
3. **After 14 days:** the Studio is locked and paid features (seating, check-in, menu…) are switched off. The site, invitations and RSVP stay live on Essentials features. Nothing is deleted, so paying again restores everything instantly.

### 8.3 Two providers behind one interface

```ts
// src/lib/billing/provider.ts
interface PaymentProvider {
  createCheckout(input: { weddingId: string; tier: PlanTier; interval: BillingInterval; customerEmail: string }): Promise<{ url: string }>;
  cancel(providerSubscriptionId: string): Promise<void>;
  parseWebhook(req: Request): Promise<BillingEvent>;  // verifies signature, normalises to our events
}
// src/lib/billing/paymongo.ts, src/lib/billing/stripe.ts implement it
```

- **Which provider:** PHP prices go through PayMongo (GCash, Maya, cards), and other currencies go through Stripe. The checkout page offers both where it makes sense ("Pay with GCash / Maya" or "Pay with card").
- **One webhook route per provider** (`/api/billing/paymongo`, `/api/billing/stripe`). Both translate the provider's event into the same `BillingEvent` (`PAID`, `RENEWED`, `PAYMENT_FAILED`, `CANCELLED`) and call one shared handler that updates `Subscription` and the wedding's phase. Handlers must be idempotent, because providers resend webhooks.
- **To check before building:** e-wallets like GCash and Maya generally don't support automatic recurring charges the way cards do. Confirm PayMongo's current subscription support. If e-wallet monthly isn't supported, monthly e-wallet payers get an email with a "pay next month" link a few days before each renewal, and the same grace rules apply.
- Store prices in our DB (`Plan` table), not hardcoded per provider, so the admin's Subscriptions page can show real revenue from both providers.

---

## 9. Phased roadmap

Each phase ships something usable on its own.

| Phase | Deliverable | Key tasks |
| --- | --- | --- |
| **0. Make it real** ✅ done 2026-10-06 | Dashboard runs on Postgres, and demo mode is just a seeded wedding | Replace `getMock*` reads with Prisma queries scoped to the logged-in user's wedding; real `getWeddingStaffRole`; RSVP writes to the DB; add `Guest.accessToken`; tests for RSVP + permissions |
| **1. Template engine** ✅ done 2026-10-06 (see "As built" in §5.2) | `/w/[slug]` rendered by Royal Arch, driven by data | `TemplateDefinition` + registry; `WeddingSection` model; port template-2 with props + `--t-*` tokens; mask-based frame recolouring; 4 palettes; current design becomes a second template ("Radiant Citrus") |
| **2. Onboarding + Studio** ✅ done 2026-10-06 | A new couple can sign up and see their own site | 5-step wizard with autosave; Studio with section list + live phone preview; feature toggles; slug picker |
| **3. Publish + invitations + billing** | Couple pays, publishes and sends links | `Plan`/`Subscription`/`Payment` models; PayMongo + Stripe checkout and webhooks (one-time + monthly); grace-period handling; `canUse()` gating; personal `/i/[token]` flow; email sending + Messenger share button + OG link-preview image + sent/opened tracking; RSVP v2 (meal choice, +1 names, deadline); Digital Pass |
| **4. Seating, menu, program** | Planning tools | Table CRUD + drag-and-drop seating (auto-group by `groupName`); menu courses linked to RSVP meal choice; program timeline; printable seating chart |
| **5. Day-of** | Works at the venue | Receptionist scanner with offline queue; `CheckIn` model; Guest Hub at `/i/[token]` and `/w/[slug]/live`; live check-in counter on the couple's dashboard; printable table QR cards |
| **6. After & polish** | Retention and word of mouth | Guest photo upload + moderation; photo wall; thank-you message; archive/export; "Made with WeddingFlow" footer link (referral loop) |

Phases 0 and 1 are the foundation. Phases 4 and 5 can run in parallel once Phase 3 is done.

---

## 10. Security & privacy checklist

- Guest tokens are random (≥ 128 bits) and never sequential or guessable. The short `inviteCode` is only for typing.
- The public `/w/[slug]` never lists guest names. Seating and the hub are only visible through the guest's own token.
- Check-in endpoints require a `RECEPTIONIST`/`STAFF` role on *that* wedding.
- Rate-limit RSVP and the "find yourself" lookup.
- Validate `WeddingSection.content` with a zod schema per section type before saving.
- Uploaded photos: size/type limits, couple moderation before they reach the shared wall.

---

## 11. Decisions (agreed 2026-10-06)

| # | Topic | Decision | Where it's covered |
| --- | --- | --- | --- |
| 1 | Pricing | **Both one-time and monthly**, for every tier | §8.1, §8.2 |
| 2 | Payments | **Both PayMongo and Stripe**, behind one provider interface | §8.3 |
| 3 | Venue QR | **Both:** personal pass for check-in + table/venue QR for the day-of hub | §2, §7 |
| 4 | Invitations | **Email + Messenger share links** (no SMS/Viber for now) | §6 |
| 5 | Templates | **Couples choose only from templates we provide**: no free-form layout builder | §4.1 |

Still open (doesn't block Phases 0–2):
- Actual prices per tier, both intervals, in PHP and USD.
- Whether PayMongo supports automatic monthly renewal for GCash/Maya today (see §8.3).
- A Facebook App ID, if we want the native Messenger "Send" dialog on desktop (otherwise copy-link is used).
