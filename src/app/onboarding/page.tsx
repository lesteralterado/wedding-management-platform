import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarHeart } from "lucide-react";
import { OnboardingWizard } from "@/components/onboarding/wizard";
import { getDashboardAccess } from "@/lib/wedding/current";

export const metadata = { title: "Create your wedding website" };

export default async function OnboardingPage() {
  const access = await getDashboardAccess();
  if (!access) redirect("/login");
  if (access.wedding) redirect("/dashboard/studio");

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <Link href="/" className="mx-auto mb-8 flex max-w-6xl items-center gap-3 font-display text-xl">
        <CalendarHeart className="h-6 w-6 text-accent" aria-hidden /> WeddingFlow
      </Link>
      <OnboardingWizard />
    </main>
  );
}
