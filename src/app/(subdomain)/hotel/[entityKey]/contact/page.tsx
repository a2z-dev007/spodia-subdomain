import HotelSegmentPageShell from "@/components/hotel/HotelSegmentPageShell";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ entityKey: string }> };

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "contact" });
}

export default async function Page({ params }: Props) {
  const { entityKey } = await params;
  return (
    <HotelSegmentPageShell entityKey={entityKey} title="Contact" intro="Reach {hotel} — phone, email, and enquiry form will map here.">
      <address className="not-italic text-gray-600">
        <p>Contact channels will be populated from listing data.</p>
      </address>
    </HotelSegmentPageShell>
  );
}
