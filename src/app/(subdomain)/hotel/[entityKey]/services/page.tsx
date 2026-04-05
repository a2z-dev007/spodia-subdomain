import HotelSegmentPageShell from "@/components/hotel/HotelSegmentPageShell";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ entityKey: string }> };

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "services" });
}

export default async function Page({ params }: Props) {
  const { entityKey } = await params;
  return (
    <HotelSegmentPageShell
      entityKey={entityKey}
      title="Services"
      intro="Concierge, transfers, business services, and guest support at {hotel}."
    />
  );
}
