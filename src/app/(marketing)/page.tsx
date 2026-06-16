import Link from "next/link";
import { CalendarHeart, MailCheck, QrCode, UsersRound } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export default function MarketingPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate px-6 pt-20 pb-24 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-7">
              <span className="inline-flex rounded-full border border-border bg-secondary px-4 py-2 text-sm font-bold text-accent">Radiant Citrus wedding platform</span>
              <h1 className="font-display text-5xl font-black tracking-tight md:text-7xl">
                Wedding websites, invitations, guests, and RSVPs in one joyful dashboard.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Give couples a modern SaaS experience inspired by EventSpark and Pinpost: elegant microsites, personalized invite links, QR-ready guests, and real-time RSVP analytics.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-warm transition hover:bg-[#f0a020]">
                  Start planning free
                </Link>
                <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-6 font-bold hover:bg-secondary">
                  Open dashboard
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="rounded-[2rem] border border-border bg-card p-4 shadow-warm">
              <div className="rounded-[1.6rem] bg-[radial-gradient(circle_at_top_left,#fff7df,transparent_18rem),linear-gradient(135deg,#f5b041,#e67e22)] p-6 text-white">
                <div className="flex items-center justify-between">
                  <CalendarHeart className="h-10 w-10" />
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">RSVP 72%</span>
                </div>
                <p className="mt-12 font-display text-5xl font-black">Cherilyn & Lester</p>
                <p className="mt-2 text-white/80">June 12, 2027 · The Golden Orchard Estate</p>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  <Metric value="128" label="Guests" />
                  <Metric value="92" label="Confirmed" />
                  <Metric value="24" label="Pending" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-white/35 px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MailCheck, title: "Personal invitations", text: "Unique invite codes create warm personalized RSVP pages." },
            { icon: QrCode, title: "QR-ready guests", text: "Generate a scannable code for every guest and future check-in." },
            { icon: UsersRound, title: "Guest intelligence", text: "Search, group, import, and filter guests from the dashboard." },
            { icon: CalendarHeart, title: "Live analytics", text: "Track confirmed, pending, declined, and RSVP rate instantly." },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <FeatureCard {...item} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card p-6 shadow-warm md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Public microsite</p>
                <h2 className="mt-3 font-display text-4xl font-black md:text-5xl">A wedding website guests actually enjoy.</h2>
                <p className="mt-4 text-muted-foreground">Full-width stacked sections, warm gold dividers, countdowns, gallery, event details, FAQ, and RSVP CTAs built for mobile first.</p>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="grid gap-4 sm:grid-cols-2">
                <PreviewCard title="Our Story" text="A lovable narrative section for the couple journey." />
                <PreviewCard title="Event Details" text="Date, time, venue, map link, and ceremony notes." />
                <PreviewCard title="Gallery" text="Soft cards for engagement and celebration memories." />
                <PreviewCard title="FAQ" text="Clear answers that reduce guest questions." />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-warm">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-accent">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-xl font-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-4">
      <p className="font-display text-2xl font-black">{value}</p>
      <p className="text-xs text-white/75">{label}</p>
    </div>
  );
}

function PreviewCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] bg-secondary p-6">
      <div className="h-28 rounded-[1.25rem] bg-gradient-to-br from-primary via-orange-200 to-white/70" />
      <h3 className="mt-5 font-display text-2xl font-black">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
