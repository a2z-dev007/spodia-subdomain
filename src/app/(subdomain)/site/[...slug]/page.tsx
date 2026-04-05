import { Metadata } from "next";
import { resolveLocationIds } from "@/lib/locationUtils";
import { searchHotelsApi, getAmenties, getCityContent } from "@/services/api";
import CityHotelsClient from "@/components/hotels/CityHotelsClient";
import { buildLocationListingMetadata } from "@/lib/seo/metadata";
import { getCountryData, getCountryName } from "@/services/countryService";
import CountryLandingPage from "./CountryLandingPage";

const StatePage = ({ slug }: { slug: string }) => (
  <div className="container mx-auto max-w-4xl px-4 pb-16 pt-24 md:pt-28">
    <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
      Discover {slug.charAt(0).toUpperCase() + slug.slice(1)}
    </h1>
    <p className="text-gray-600">Find the best cities and stays in this beautiful state.</p>
  </div>
);

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let title = "Spodia";
  let description = "Discover stays on Spodia";

  if (slug.length === 1) {
    const countryName = getCountryName(slug[0]);
    title = `Book Hotels in ${countryName} | Best Prices & Deals - Spodia`;
    description = `Explore top hotels, resorts, and unique stays across ${countryName}. Best price guaranteed!`;
  } else if (slug.length === 2) {
    title = `Hotels in ${slug[1]} - ${getCountryName(slug[0])}`;
  } else if (slug.length === 3) {
    title = `Hotels in ${slug[2]}, ${slug[1]}`;
  } else if (slug.length === 4) {
    title = `Hotels in ${slug[3]}, ${slug[2]}`;
  }

  const pathname = `/site/${slug.join("/")}`;

  return buildLocationListingMetadata({
    title,
    description,
    pathname,
  });
}

export default async function SitePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const { countryId, stateId, cityId } = await resolveLocationIds(slug);

  const depth = slug.length;

  // Country page - use new CountryLandingPage component
  // Show country page for depth === 1 regardless of API resolution (mock data fallback)
  if (depth === 1) {
    try {
      const countryData = await getCountryData(slug[0]);
      return <CountryLandingPage data={countryData} countryCode={slug[0]} />;
    } catch (error) {
      console.error("Error loading country data:", error);
      // Fallback to simple page if country data fails
      return (
        <div className="container mx-auto max-w-4xl px-4 pb-16 pt-24 md:pt-28">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Welcome to {slug[0].toUpperCase()}
          </h1>
          <p className="text-gray-600">Explore top states and destinations in {slug[0]}.</p>
        </div>
      );
    }
  }

  if (depth === 2 && stateId && countryId) {
    return <StatePage slug={slug[1]} />;
  }

  if ((depth === 3 && cityId) || (depth === 4 && cityId)) {
    const cityName = slug[2];
    const locationName = depth === 4 ? slug[3] : undefined;

    try {
      const hotelsRes = await searchHotelsApi({
        city: cityId,
        page_number: 1,
        number_of_records: 6,
        sortBy: "top_reviewed",
      });

      // @ts-ignore
      const initialHotels = hotelsRes.data?.records || [];
      // @ts-ignore
      const totalRecords = hotelsRes.data?.totalRecords || 0;

      const amenitiesRes = await getAmenties();
      const amenities = amenitiesRes?.data?.records || [];

      const cityContentRes = await getCityContent(cityName);
      const cityContent = cityContentRes?.data || [];

      const initialData = {
        cityId: cityId,
        initialHotels: initialHotels,
        totalRecords: totalRecords,
        availableRooms: [],
        restaurants: [],
        cityContent: cityContent,
        amenities: amenities,
      };

      return (
        <CityHotelsClient
          city={locationName ? `${locationName}, ${cityName}` : cityName}
          category={undefined}
          initialData={initialData}
          searchParams={resolvedSearchParams}
        />
      );
    } catch (error) {
      console.error("Error fetching city data:", error);
      return <div>Error loading city data. Please try again later.</div>;
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 pb-16 pt-24 md:pt-28">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Location Not Found</h1>
      <p className="text-gray-600">Could not resolve location for: {slug.join("/")}</p>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm">
        {JSON.stringify({ countryId, stateId, cityId, depth }, null, 2)}
      </pre>
    </div>
  );
}
