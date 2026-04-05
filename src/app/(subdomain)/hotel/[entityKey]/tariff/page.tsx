import HotelSegmentPageShell from "@/components/hotel/HotelSegmentPageShell";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

/** PRD: tariff / availability — prefer no-store data fetching when wiring APIs (segment is dynamic via metadata headers). */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ entityKey: string }> };

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "tariff" });
}

export default async function Page({ params }: Props) {
  const { entityKey } = await params;
  return (
    <HotelSegmentPageShell
      entityKey={entityKey}
      title="Tariff"
      intro="Live tariffs and packages for {hotel} — wired for server-rendered inventory when APIs are connected."
    />
  );
}
