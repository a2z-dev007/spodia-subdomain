import { Metadata } from 'next'
import { resolveLocationIds } from '@/lib/locationUtils';
import {
    searchHotelsApi,
    getAmenties,
    getCityContent,
    searchListings,
    getStates,
    getCities
} from '@/services/api';
import CityHotelsClient from '@/components/hotels/CityHotelsClient';
import { notFound } from 'next/navigation';

// Placeholder components for Country/State pages (to be replaced with actual components)
const CountryPage = ({ countryId, slug }: { countryId: number, slug: string }) => (
    <div className="container mx-auto p-8 mt-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to {slug.toUpperCase()}</h1>
        <p>Explore top states and destinations in {slug}.</p>
        {/* Add State Carousel/List here */}
    </div>
);

const StatePage = ({ stateId, countryId, slug }: { stateId: number, countryId: number, slug: string }) => (
    <div className="container mx-auto p-8 mt-20">
        <h1 className="text-4xl font-bold mb-4">Discover {slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>
        <p>Find the best cities and stays in this beautiful state.</p>
        {/* Add City Carousel/List here */}
    </div>
);

type Props = {
    params: Promise<{ slug: string[] }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    // Dynamic Title based on slug depth
    let title = 'Spodia'

    if (slug.length === 1) title = `Hotels in ${slug[0].toUpperCase()}`
    else if (slug.length === 2) title = `Hotels in ${slug[1]} - ${slug[0].toUpperCase()}`
    else if (slug.length === 3) title = `Hotels in ${slug[2]}, ${slug[1]}`
    else if (slug.length === 4) title = `Hotels in ${slug[3]}, ${slug[2]}`

    return {
        title,
    }
}

export default async function SitePage({ params, searchParams }: Props) {
    const { slug } = await params
    const resolvedSearchParams = await searchParams

    const { countryId, stateId, cityId } = await resolveLocationIds(slug);

    const depth = slug.length;

    // 1. Country Page
    if (depth === 1 && countryId) {
        return <CountryPage countryId={countryId} slug={slug[0]} />;
    }

    // 2. State Page
    if (depth === 2 && stateId && countryId) {
        return <StatePage stateId={stateId} countryId={countryId} slug={slug[1]} />;
    }

    // 3. City Page
    // 4. Location Page (Treating as City page with location filter/context for now)
    if ((depth === 3 && cityId) || (depth === 4 && cityId)) {
        const cityName = slug[2]; // City name is always at index 2 for depth 3 & 4
        const locationName = depth === 4 ? slug[3] : undefined;

        // Fetch initial data for CityHotelsClient
        try {
            // 1. Fetch Hotels
            // If it's a location page, we might want to filter by text or proximity?
            // For now, fetching city hotels.
            const hotelsRes = await searchHotelsApi({
                city: cityId,
                page_number: 1,
                number_of_records: 6,
                sortBy: 'top_reviewed'
            });

            // @ts-ignore
            const initialHotels = hotelsRes.data?.records || [];
            // @ts-ignore
            const totalRecords = hotelsRes.data?.totalRecords || 0;

            // API response might be wrapped or flat array depending on which function called.
            // searchHotelsApi in hotelSlice returns response?.data?.records.
            // Let's retry: searchHotelsApi in hotelSlice is valid.

            // Fetch amenities
            const amenitiesRes = await getAmenties();
            const amenities = amenitiesRes?.data?.records || [];

            // Fetch City Content
            const cityContentRes = await getCityContent(cityName);
            const cityContent = cityContentRes?.data || [];

            // Prepare Initial Data
            const initialData = {
                cityId: cityId,
                initialHotels: initialHotels,
                totalRecords: totalRecords,
                availableRooms: [], // Can fetch "best deals" or similar
                restaurants: [], // Can fetch restaurants
                cityContent: cityContent,
                amenities: amenities
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

    // If IDs not resolved or invalid depth
    // return notFound();

    // Fallback / Debug
    return (
        <div className="container mx-auto p-4 mt-20">
            <h1 className="text-2xl font-bold mb-4">Location Not Found</h1>
            <p>Could not resolve location for: {slug.join('/')}</p>
            <pre>{JSON.stringify({ countryId, stateId, cityId, depth }, null, 2)}</pre>
        </div>
    )
}
