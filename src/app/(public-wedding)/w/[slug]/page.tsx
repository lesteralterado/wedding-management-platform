import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeddingSite } from "@/templates/registry";
import { formatLongDate } from "@/templates/format";
import { getWeddingSite } from "@/templates/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getWeddingSite((await params).slug);
  if (!site) return { title: "Wedding not found" };

  const { brideName, groomName, date, venue } = site.wedding;
  return {
    title: `${brideName} & ${groomName}`,
    description: `Join us on ${formatLongDate(date)} at ${venue}.`,
  };
}

export default async function PublicWeddingPage({ params }: Props) {
  const site = await getWeddingSite((await params).slug);
  if (!site) notFound();

  return <WeddingSite site={site} />;
}
