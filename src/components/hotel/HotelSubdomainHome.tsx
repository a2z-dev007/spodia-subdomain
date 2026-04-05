import BookingEngine from "@/components/hotel/sections/BookingEngine";
import HotelDescription from "@/components/hotel/sections/HotelDescription";
import RatesCalendar from "@/components/hotel/sections/RatesCalendar";
import ImageGallery from "@/components/hotel/sections/ImageGallery";
import Reviews from "@/components/hotel/sections/Reviews";
import Map from "@/components/hotel/sections/Map";
import NearbyPlaces from "@/components/hotel/sections/NearbyPlaces";
import DiningSpaEvents from "@/components/hotel/sections/DiningSpaEvents";
import { getRequestHost } from "@/lib/seo/metadata";
import { hotelJsonLd } from "@/lib/seo/schema";
import { parseSubdomain } from "@/lib/resolver/parseSubdomain";

type Props = { entityKey: string };

function displayName(entityKey: string) {
  return entityKey
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function HotelSubdomainHome({ entityKey }: Props) {
  const host = await getRequestHost();
  const protocol = host.includes("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/hotel/${entityKey}`;
  const parsed = parseSubdomain(entityKey);
  const name = displayName(parsed.slug || entityKey);
  const jsonLd = hotelJsonLd({
    name,
    url,
    description: `Book ${name} on Spodia — official subdomain experience.`,
    parsed,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gradient-to-b from-slate-50 to-white pb-16 pt-6 md:pb-24 md:pt-10">
        <div className="mx-auto max-w-7xl space-y-12 px-4 md:space-y-16 md:px-6">
          <header className="text-center md:text-left">
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Spodia hotel site</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              {name}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-gray-600 md:mx-0">
              Premium multi-section landing — optimized for Core Web Vitals with server components and ISR-friendly
              shells.
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <HotelDescription entityKey={entityKey} />
            <BookingEngine entityKey={entityKey} />
          </div>

          <RatesCalendar />
          <ImageGallery />
          <Map />
          <div className="grid gap-10 lg:grid-cols-2">
            <Reviews />
            <NearbyPlaces />
          </div>
          <DiningSpaEvents />
        </div>
      </div>
    </>
  );
}
