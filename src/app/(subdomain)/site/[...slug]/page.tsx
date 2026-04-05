import { Metadata } from "next";
import { resolveLocationIds } from "@/lib/locationUtils";
import { searchHotelsApi, getAmenties, getCityContent } from "@/services/api";
import CityHotelsClient from "@/components/hotels/CityHotelsClient";
import { buildLocationListingMetadata } from "@/lib/seo/metadata";
import { getCountryData, getCountryName } from "@/services/countryService";
import CountryLandingPage from "./CountryLandingPage";

import { getEntityLandingData } from "@/services/entityService";
import GenericLandingPage from "./GenericLandingPage";

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
  } else if (slug.length >= 2) {
    title = `Hotels in ${slug[slug.length - 1].charAt(0).toUpperCase() + slug[slug.length-1].slice(1)} - Spodia`;
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

  // Depth 1: Country Landing Page
  if (depth === 1) {
    try {
      const countryData = await getCountryData(slug[0]);
      return <CountryLandingPage data={countryData} countryCode={slug[0]} />;
    } catch (error) {
      console.error("Error loading country data:", error);
      return (
        <div className="container mx-auto px-4 pt-32">
          <h1 className="text-3xl font-bold">Country {slug[0].toUpperCase()}</h1>
        </div>
      );
    }
  }

  // Depth 2, 3, 4: State, City, Location Landing Pages
  if (depth >= 2 && depth <= 4) {
    const typeMap: Record<number, 'state' | 'city' | 'location'> = {
      2: 'state',
      3: 'city',
      4: 'location'
    };
    
    const type = typeMap[depth];
    const entitySlug = slug[depth - 1];

    try {
      const pageData = await getEntityLandingData(type, entitySlug);
      return <GenericLandingPage data={pageData} type={type} slug={entitySlug} />;
    } catch (error) {
      console.error(`Error loading ${type} data:`, error);
      return <div>Error loading page data.</div>;
    }
  }

  // Fallback for not found
  if (depth > 4 || !countryId) {
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
  
  return null;
}
