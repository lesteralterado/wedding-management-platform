import Link from "next/link";
import { CalendarHeart } from "lucide-react";

export default function PublicWeddingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/75 px-6 py-4 backdrop-blur-xl md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-display text-xl font-black">
            <CalendarHeart className="h-6 w-6 text-accent" />
            WeddingFlow
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/login" className="hover:text-foreground">Dashboard</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
