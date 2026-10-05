import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeddingSite } from "@/templates/registry";
import { getInviteSite } from "@/templates/site";

type Props = { params: Promise<{ inviteCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getInviteSite((await params).inviteCode);
  // Personal invitations must never show up in search results.
  if (!site) return { title: "Invitation not found", robots: { index: false } };

  return {
    title: `You're invited · ${site.wedding.brideName} & ${site.wedding.groomName}`,
    robots: { index: false, follow: false },
  };
}

export default async function InvitePage({ params }: Props) {
  const site = await getInviteSite((await params).inviteCode);
  if (!site) notFound();

  return <WeddingSite site={site} />;
}
