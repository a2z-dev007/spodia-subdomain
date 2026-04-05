import HotelSegmentPageShell from "@/components/hotel/HotelSegmentPageShell";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ entityKey: string }> };

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "about" });
}

export default async function Page({ params }: Props) {
  const { entityKey } = await params;
  return (
    <HotelSegmentPageShell
      entityKey={entityKey}
      title="About"
      intro="Heritage, team, and values behind {hotel}."
    />
  );
}
