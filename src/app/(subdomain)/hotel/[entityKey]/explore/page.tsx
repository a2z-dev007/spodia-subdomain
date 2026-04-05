import HotelSegmentPageShell from "@/components/hotel/HotelSegmentPageShell";
import NearbyPlaces from "@/components/hotel/sections/NearbyPlaces";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ entityKey: string }> };

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "explore" });
}

export default async function Page({ params }: Props) {
  const { entityKey } = await params;
  return (
    <div className="space-y-10 px-4 py-10 md:py-14">
      <HotelSegmentPageShell
        entityKey={entityKey}
        title="Explore"
        intro="Neighbourhood guides and experiences around {hotel}."
      />
      <div className="mx-auto max-w-7xl">
        <NearbyPlaces />
      </div>
    </div>
  );
}
