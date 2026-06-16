import Link from "next/link";
import { CalendarHeart } from "lucide-react";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/75 px-6 py-4 backdrop-blur-xl md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-display text-xl font-black">
            <CalendarHeart className="h-6 w-6 text-accent" />
            WeddingFlow
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/login" className="text-muted-foreground hover:text-foreground">Login</Link>
            <Link href="/register" className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground shadow-soft">Start planning</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
