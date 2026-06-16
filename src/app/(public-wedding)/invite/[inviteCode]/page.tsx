import { notFound } from "next/navigation";
import { InvitationPage } from "@/components/public/invitation-page";
import { getGuestByInviteCode } from "@/features/guests/queries";

export default async function InvitePage({ params }: { params: Promise<{ inviteCode: string }> }) {
  const { inviteCode } = await params;
  const guest = await getGuestByInviteCode(inviteCode);
  if (!guest) notFound();

  return <InvitationPage guest={guest} />;
}
