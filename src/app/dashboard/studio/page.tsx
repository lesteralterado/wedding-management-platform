import { Studio } from "@/components/studio/studio";
import { getStudioState } from "@/features/studio/queries";
import { requireWeddingAccess } from "@/lib/wedding/current";

export const metadata = { title: "Studio" };

export default async function StudioPage() {
  const access = await requireWeddingAccess("wedding:write");
  const initial = await getStudioState(access.wedding, access.isDemo);

  return <Studio initial={initial} canSave={!access.isDemo} />;
}
