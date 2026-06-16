import { LoginForm } from "./form";
import { CalendarHeart } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
        <section className="flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <Link href="/" className="inline-flex items-center gap-3 font-display text-2xl font-black">
              <CalendarHeart className="h-8 w-8 text-accent" />
              WeddingFlow
            </Link>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Couple dashboard</p>
              <h1 className="font-display text-4xl font-black tracking-tight md:text-5xl">Welcome back, planner.</h1>
              <p className="text-muted-foreground">Sign in to manage invitations, guests, RSVPs, and your wedding website.</p>
            </div>
            <LoginForm />
            <p className="text-sm text-muted-foreground">
              New here? <Link href="/register" className="font-semibold text-accent hover:text-amber-700">Create an account</Link>
            </p>
          </div>
        </section>
        <aside className="relative hidden overflow-hidden bg-[#f5b041] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.65),transparent_28rem),linear-gradient(135deg,#f5b041,#e67e22)]" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            <div className="space-y-4">
              <p className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">EventSpark inspired</p>
              <h2 className="font-display text-5xl font-black leading-tight">Plan the celebration guests will remember.</h2>
            </div>
            <div className="space-y-4 rounded-[2rem] border border-white/30 bg-white/15 p-6 backdrop-blur">
              <p className="font-semibold">Today&apos;s focus</p>
              <div className="grid gap-3 text-sm">
                <div className="rounded-2xl bg-white/20 p-4">Guest RSVPs: 72%</div>
                <div className="rounded-2xl bg-white/20 p-4">Invitation links ready</div>
                <div className="rounded-2xl bg-white/20 p-4">QR check-in prepared</div>
              </div>
            </div>
</div>
        </aside>
      </div>
    </div>
  );
}
