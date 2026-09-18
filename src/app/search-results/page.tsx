import { Metadata } from "next";
import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";
import { HotelSectionsContainer } from "@/components/hotels/HotelSectionsContainer";
import FAQSectionSSR from "@/components/common/FAQSectionSSR";
import { getCachedSearchHotelsApi, getCachedAmenities } from "@/lib/api/cachedApi";
import { SearchListingShimmer } from "@/components/ui/ShimmerLoader";

// Dynamic rendering for search results - always fresh data
export const dynamic = 'force-dynamic';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const cityName = typeof resolvedParams.cityName === 'string' ? resolvedParams.cityName : '';
    const startDate = typeof resolvedParams.start_date === 'string' ? resolvedParams.start_date : '';
    const endDate = typeof resolvedParams.end_date === 'string' ? resolvedParams.end_date : '';

    const title = cityName
        ? `Hotels in ${cityName} - Search Results | Spodia`
        : 'Search Hotels - Find Best Deals | Spodia';

    const description = cityName && startDate && endDate
        ? `Find and book hotels in ${cityName} from ${startDate} to ${endDate}. Compare prices and get the best deals.`
        : 'Search and compare hotels across India. Find the best deals on hotel bookings with Spodia.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
    };
}

// Fetch initial data on the server
async function getInitialData(searchParams: { [key: string]: string | string[] | undefined }) {
    try {
        const city = typeof searchParams.city === 'string' ? searchParams.city : '';
        const cityName = typeof searchParams.cityName === 'string' ? searchParams.cityName : '';
        const start_date = typeof searchParams.start_date === 'string' ? searchParams.start_date : '';
        const end_date = typeof searchParams.end_date === 'string' ? searchParams.end_date : '';
        const no_of_adult = typeof searchParams.no_of_adult === 'string' ? Number(searchParams.no_of_adult) : 2;
        const no_of_child = typeof searchParams.no_of_child === 'string' ? Number(searchParams.no_of_child) : 0;
        const childInfo = typeof searchParams.childInfo === 'string' ? searchParams.childInfo : '';

        // Parallel fetch for amenities and initial hotels (if search params exist)
        const fetchPromises: any[] = [getCachedAmenities()];

        const hasSearchParams = city && start_date && end_date;
        if (hasSearchParams) {
            fetchPromises.push(getCachedSearchHotelsApi({
                city,
                cityName,
                checkIn: start_date,
                checkOut: end_date,
                noOfAdult: no_of_adult,
                noOfChild: no_of_child,
                childInfo,
                page_number: 1,
                number_of_records: 12,
            }));
        }

        const [amenitiesRes, hotelsRes] = await Promise.all(fetchPromises);

        const hotelsData = hotelsRes?.data || hotelsRes || {};
        const amenitiesData = amenitiesRes?.data || amenitiesRes || {};

        return {
            initialHotels: hotelsData?.records || [],
            totalRecords: hotelsData?.totalRecords || 0,
            amenities: amenitiesData?.records || [],
            cityId: city ? Number(city) : null,
        };
    } catch (error) {
        console.error('Error fetching initial data:', error);
        return {
            initialHotels: [],
            totalRecords: 0,
            amenities: [],
            cityId: null,
        };
    }
}

async function SearchResultsContent({ resolvedSearchParams }: { resolvedSearchParams: { [key: string]: string | string[] | undefined } }) {
    let initialData;
    try {
        initialData = await getInitialData(resolvedSearchParams);
    } catch (error) {
        console.error('Critical error in SearchResultsPage:', error);
        initialData = {
            initialHotels: [],
            totalRecords: 0,
            amenities: [],
            cityId: null,
        };
    }

    return (
        <SearchResultsClient
            initialData={initialData as any}
            searchParams={resolvedSearchParams}
        />
    );
}

export default async function SearchResultsPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    const cityName = typeof resolvedSearchParams.cityName === 'string' ? resolvedSearchParams.cityName : '';
    const city = typeof resolvedSearchParams.city === 'string' ? resolvedSearchParams.city : '';
    const startDate = typeof resolvedSearchParams.start_date === 'string' ? resolvedSearchParams.start_date : '';
    const endDate = typeof resolvedSearchParams.end_date === 'string' ? resolvedSearchParams.end_date : '';
    const searchKey = `${city}-${cityName}-${startDate}-${endDate}`;

    return (
        <>
            <Suspense key={searchKey} fallback={<SearchListingShimmer />}>
                <SearchResultsContent resolvedSearchParams={resolvedSearchParams} />
            </Suspense>

            {/* SSR FAQ Section - rendered on server for better SEO */}
            {cityName && city && (
                <div className="max-w-7xl mx-auto px-4 mt-12">
                    <Suspense fallback={<div className="py-12" />}>
                        <FAQSectionSSR
                            cityId={Number(city)}
                            title={`${cityName} Travel FAQs`}
                        />
                    </Suspense>
                </div>
            )}

            {/* SSR Hotel Sections - rendered on server for better SEO */}
            <Suspense fallback={<div className="py-8 sm:py-12 lg:py-16" />}>
                <HotelSectionsContainer />
            </Suspense>
        </>
    );
}
