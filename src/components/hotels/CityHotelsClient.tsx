"use client";

import PremiumHotelSearchBar from "@/components/home/PremiumHotelSearchBar";
import HotelFiltersClient from "@/components/hotels/HotelFiltersClient";
import MobileFiltersClient from "@/components/hotels/MobileFiltersClient";
import HotelResults from "@/components/hotels/HotelResults";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearFilters, searchHotels, setSearchFilters } from "@/lib/features/hotels/hotelSlice";
import { Button } from "@/components/ui/button";
import { X, Star, SlidersHorizontal, MapPin } from "lucide-react";
import { IMAGES } from "@/assets/images";
import { getAmenties, searchListings, searchHotelsApi } from "@/services/api";
import { useState, useRef, useEffect } from "react";
import { HotelType } from "@/types/HotelType";
import HotelBookingInterface from "@/components/hotels/HotelBookingInterface";
import { RestaurantCarousel } from "@/components/hotels/RestaurantCarousel";
import { FamousMarkets } from "@/components/hotels/FamousMarkets";
import { FilterShimmer, TextContentShimmer } from "@/components/ui/ShimmerLoader";
import { useScrollDirection } from "@/hooks/useScrollDirection";

interface CityHotelsClientProps {
    city: string;
    category?: string;
    initialData: {
        cityId: number;
        stateId?: number;
        countryId?: number;
        initialHotels: HotelType[];
        totalRecords: number;
        availableRooms?: HotelType[];
        restaurants?: HotelType[];
        cityContent: any[];
        amenities?: Amenity[];
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

interface Amenity {
    id: number;
    name: string;
    name_hindi: string;
    parent: string | null;
    amenities_tags: string[];
    image: string;
    created: string;
}

interface AmenitiesResponse {
    totalRecords: number;
    status: string;
    records: Amenity[];
}

// Helper function to convert URL category to meta_name
function categoryToMetaName(category: string): string {
    const categoryMap: Record<string, string> = {
        'budget-hotels': 'budget',
        '5-star-hotels': '5 star',
        'resorts': 'resorts',
        'homestays': 'homestays',
        'hotels': 'hotels',
        'luxury-hotels': 'luxury',
        'cheap-hotels': 'cheap',
        'boutique-hotels': 'boutique',
        'family-hotels': 'family',
    };
    return categoryMap[category] || category.replace(/-/g, ' ');
}

// Fetch hotels with category and multi-level location support
async function fetchHotels(
    cityId: number | null, 
    stateId: number | null,
    countryId: number | null,
    category: string | undefined, 
    sortBy: string, 
    page: number, 
    recordsPerPage: number
) {
    const params: any = {
        page_number: page,
        number_of_records: recordsPerPage,
        sortBy: sortBy,
        noOfAdult: 1,
        childInfo: ""
    };

    if (cityId && cityId !== 0) params.city = cityId;
    else if (stateId && stateId !== 0) params.state = stateId;
    else if (countryId && countryId !== 0) params.country = countryId;

    if (category) {
        const metaName = categoryToMetaName(category);
        const { searchListings } = await import("@/services/api");
        const res = await searchListings({
            ...params,
            meta_name: metaName
        } as any);
        return {
            records: Array.isArray(res.data?.records) ? res.data.records : [],
            totalRecords: res.data?.totalRecords || 0,
            status: res.data?.status || 'success'
        };
    } else {
        const { searchHotelsApi } = await import("@/services/api");
        const res = await searchHotelsApi(params);
        return res.data;
    }
}

export default function CityHotelsClient({ city, category, initialData, searchParams }: CityHotelsClientProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { searchFilters } = useAppSelector((state) => state?.hotels ?? { searchFilters: {} });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const hotelListRef = useRef<HTMLDivElement>(null);
    const isButtonsVisible = useScrollDirection();
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 6;
    
    // Use ref to store random selection - persists across re-renders
    const randomSelectionRef = useRef<any[] | null>(null);
    const hasInitializedRef = useRef(false);
    
    // Read search parameters from URL
    const urlStartDate = typeof searchParams.start_date === 'string' ? searchParams.start_date : "";
    const urlEndDate = typeof searchParams.end_date === 'string' ? searchParams.end_date : "";
    const urlAdults = Number(searchParams.no_of_adult || 1);
    const urlChildren = Number(searchParams.no_of_child || 0);
    const urlRooms = Number(searchParams.rooms || 1);
    const urlChildInfo = typeof searchParams.childInfo === 'string' ? searchParams.childInfo : "";
    
    // Read IDs from URL query params
    const urlCityId = typeof searchParams.city_id === 'string' ? searchParams.city_id : undefined;
    const urlStateId = typeof searchParams.state_id === 'string' ? searchParams.state_id : undefined;
    const urlCountryId = typeof searchParams.country_id === 'string' ? searchParams.country_id : undefined;
    
    // Parse children ages from URL
    const urlChildrenAges = urlChildInfo ? urlChildInfo.split(',').map(Number) : [];
    
    const { cityId } = initialData;
    const sortBy = searchFilters.sortBy || "top_reviewed";
    
    // Query for amenities
    const { data: amenitiesData } = useQuery<AmenitiesResponse>({
        queryKey: ["amenities"],
        queryFn: async () => {
            const response = await getAmenties();
            return response.data;
        },
    });

    // Query for hotels with client-side filtering
    const { data: hotelsData, isLoading: hotelsLoading, isFetching: hotelsFetching } = useQuery({
        queryKey: [
            "hotels", 
            initialData.cityId, 
            initialData.stateId, 
            initialData.countryId, 
            category,
            urlStartDate, 
            urlEndDate, 
            urlAdults, 
            urlChildren, 
            urlChildInfo, 
            searchFilters.priceRange, 
            searchFilters.starRating, 
            searchFilters.amenities, 
            searchFilters.propertyTypes, 
            searchFilters.propertyChains, 
            sortBy,
            currentPage
        ],
        queryFn: () => fetchHotels(
            initialData.cityId || null, 
            initialData.stateId || null, 
            initialData.countryId || null, 
            category, 
            sortBy, 
            currentPage, 
            recordsPerPage
        ),
        enabled: !!(initialData.cityId || initialData.stateId || initialData.countryId),
        placeholderData: (previousData) => previousData,
        initialData: currentPage === 1 && !searchFilters.priceRange && searchFilters.starRating.length === 0 && searchFilters.amenities.length === 0 && searchFilters.propertyTypes.length === 0 && searchFilters.propertyChains.length === 0
            ? { records: initialData.initialHotels, totalRecords: initialData.totalRecords, status: 'success' }
            : undefined,
    });

    const hotels = hotelsData?.records || initialData.initialHotels;
    const totalRecords = hotelsData?.totalRecords || initialData.totalRecords;
    const availableRooms: HotelType[] = initialData.availableRooms || [];
    const restaurants: HotelType[] = initialData.restaurants || [];

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [
        cityId,
        category,
        urlStartDate,
        urlEndDate,
        searchFilters.priceRange,
        searchFilters.starRating,
        searchFilters.amenities,
        searchFilters.propertyTypes,
        searchFilters.propertyChains,
        sortBy
    ]);

    // Scroll to top when page changes
    useEffect(() => {
        if (currentPage > 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage]);

    // Get random 2 items from city content array - ONCE per city, stored in ref
    useEffect(() => {
        const cityContentData = initialData.cityContent;
        if (cityContentData && Array.isArray(cityContentData) && cityContentData.length > 0 && !hasInitializedRef.current) {
            const contentArray = cityContentData;
            
            if (contentArray.length === 1) {
                randomSelectionRef.current = [contentArray[0]];
            } else if (contentArray.length === 2) {
                randomSelectionRef.current = contentArray;
            } else {
                const shuffled = [...contentArray].sort(() => 0.5 - Math.random());
                randomSelectionRef.current = shuffled.slice(0, 2);
            }
            
            hasInitializedRef.current = true;
        }
    }, [initialData.cityContent]);
    
    // Reset when city changes
    useEffect(() => {
        hasInitializedRef.current = false;
        randomSelectionRef.current = null;
    }, [city]);
    
    const randomCityContent = randomSelectionRef.current || [];

    // Prefill search bar from URL params
    const initialGuests = { adults: urlAdults || 1, children: urlChildren || 0 };

    const handleSearch = (params: {
        location: string;
        cityId: string | number | null;
        checkIn: Date | null;
        checkOut: Date | null;
        guests: { adults: number; children: number };
        rooms: number;
        childrenAges: number[];
    }) => {
        const currentParams = new URLSearchParams();
        if (params.checkIn) {
            const year = params.checkIn.getFullYear();
            const month = String(params.checkIn.getMonth() + 1).padStart(2, '0');
            const day = String(params.checkIn.getDate()).padStart(2, '0');
            currentParams.set("start_date", `${year}-${month}-${day}`);
        }
        if (params.checkOut) {
            const year = params.checkOut.getFullYear();
            const month = String(params.checkOut.getMonth() + 1).padStart(2, '0');
            const day = String(params.checkOut.getDate()).padStart(2, '0');
            currentParams.set("end_date", `${year}-${month}-${day}`);
        }
        if (params.guests.adults) currentParams.set("no_of_adult", String(params.guests.adults));
        if (params.guests.children) currentParams.set("no_of_child", String(params.guests.children));
        if (params.rooms) currentParams.set("rooms", String(params.rooms));
        if (params.childrenAges && params.childrenAges.length > 0) {
            currentParams.set("childInfo", params.childrenAges.join(','));
        }

        const newCitySlug = params.location.toLowerCase().replace(/\s+/g, '-');
        const targetUrl = category 
            ? `/in/hotels/${newCitySlug}/${category}?${currentParams.toString()}`
            : `/in/hotels/${newCitySlug}?${currentParams.toString()}`;
        router.push(targetUrl);
    };

    const handleClearAllFilters = () => {
        dispatch(clearFilters());
        dispatch(searchHotels());
    };

    // Check if any filters are active
    const hasActiveFilters =
        searchFilters.priceRange ||
        searchFilters.starRating.length > 0 ||
        searchFilters.amenities.length > 0 ||
        searchFilters.propertyChains?.length > 0 ||
        searchFilters.propertyTypes.length > 0;

    // Scroll to hotel list when filters change
    useEffect(() => {
        if (hasActiveFilters && hotelListRef.current) {
            hotelListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [searchFilters.priceRange, searchFilters.starRating, searchFilters.amenities, searchFilters.propertyChains, searchFilters.propertyTypes]);

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero with Search Bar */}
            <div
                className="w-full bg-cover bg-center bg-no-repeat flex items-center justify-center pt-28 pb-8 md:pt-36 px-4 md:px-8 relative z-10"
                style={{
                    backgroundImage: `url(${IMAGES.listingHeroBg.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                }}
            >
                <div className="max-w-7xl w-full md:px-8 lg:px-8 px-2">
                    <PremiumHotelSearchBar
                        callingFrom="meta"
                        initialLocation={
                            cityId
                                ? { id: cityId, name: city }
                                : null
                        }
                        initialCheckIn={urlStartDate ? new Date(urlStartDate) : null}
                        initialCheckOut={urlEndDate ? new Date(urlEndDate) : null}
                        initialGuests={initialGuests}
                        initialRooms={urlRooms}
                        initialChildrenAges={urlChildrenAges}
                        onSearch={handleSearch}
                        metaName={category}
                    />
                </div>
            </div>

            <div ref={hotelListRef} className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                {hasActiveFilters && (
                    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Applied Filters:
                            </span>

                            <div className="flex flex-wrap items-center gap-2 flex-1">
                                {searchFilters.priceRange && (
                                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-200">
                                        <span className="whitespace-nowrap">₹{searchFilters.priceRange[0].toLocaleString()} - ₹{searchFilters.priceRange[1].toLocaleString()}</span>
                                        <button
                                            onClick={() => {
                                                dispatch(setSearchFilters({ priceRange: undefined }))
                                                dispatch(searchHotels())
                                            }}
                                            className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors flex-shrink-0"
                                            aria-label="Remove price filter"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}

                                {searchFilters.starRating.map((star) => (
                                    <div key={star} className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm border border-yellow-200">
                                        <div className="flex items-center gap-1">
                                            <span className="whitespace-nowrap">{star}</span>
                                            <Star className="h-3 w-3 fill-current" />
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newRatings = searchFilters.starRating.filter(r => r !== star)
                                                dispatch(setSearchFilters({ starRating: newRatings }))
                                                dispatch(searchHotels())
                                            }}
                                            className="ml-1 hover:bg-yellow-100 rounded-full p-0.5 transition-colors flex-shrink-0"
                                            aria-label={`Remove ${star} star filter`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {searchFilters.propertyTypes.map((type) => (
                                    <div key={type} className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm border border-green-200">
                                        <span className="whitespace-nowrap">{type}</span>
                                        <button
                                            onClick={() => {
                                                const newTypes = searchFilters.propertyTypes.filter(t => t !== type)
                                                dispatch(setSearchFilters({ propertyTypes: newTypes }))
                                                dispatch(searchHotels())
                                            }}
                                            className="ml-1 hover:bg-green-100 rounded-full p-0.5 transition-colors flex-shrink-0"
                                            aria-label={`Remove ${type} filter`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {searchFilters.propertyChains.map((chain) => (
                                    <div key={chain} className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm border border-purple-200">
                                        <span className="whitespace-nowrap">{chain}</span>
                                        <button
                                            onClick={() => {
                                                const newChains = searchFilters.propertyChains.filter(c => c !== chain)
                                                dispatch(setSearchFilters({ propertyChains: newChains }))
                                                dispatch(searchHotels())
                                            }}
                                            className="ml-1 hover:bg-purple-100 rounded-full p-0.5 transition-colors flex-shrink-0"
                                            aria-label={`Remove ${chain} filter`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {searchFilters.amenities.map((id) => {
                                    const amenity = amenitiesData?.records?.find((a: any) => a.id === id)
                                    return (
                                        <div key={id} className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-3 py-1.5 rounded-full text-sm border border-pink-200">
                                            <span className="whitespace-nowrap">{amenity?.name || `Amenity ${id}`}</span>
                                            <button
                                                onClick={() => {
                                                    const newAmenities = searchFilters.amenities.filter(a => a !== id)
                                                    dispatch(setSearchFilters({ amenities: newAmenities }))
                                                    dispatch(searchHotels())
                                                }}
                                                className="ml-1 hover:bg-pink-100 rounded-full p-0.5 transition-colors flex-shrink-0"
                                                aria-label={`Remove ${amenity?.name || 'amenity'} filter`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )
                                })}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAllFilters}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 whitespace-nowrap flex-shrink-0"
                                >
                                    Clear All
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Action Buttons */}
                <div className={`lg:hidden fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col gap-3 transition-all duration-300 ${isButtonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
                    <button
                        onClick={() => router.push(`/hotels-on-map/hotels/${city}`)}
                        className="bg-white hover:bg-gray-50 text-orange-500 border-2 border-orange-500 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm sm:text-base">Map</span>
                    </button>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="bg-[#FF9530] hover:bg-[#e8851c] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-all active:scale-95"
                    >
                        <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Filters</span>
                        {hasActiveFilters && (
                            <span className="bg-white text-[#FF9530] rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">
                                {(searchFilters.priceRange ? 1 : 0) +
                                    searchFilters.starRating.length +
                                    searchFilters.propertyTypes.length +
                                    searchFilters.propertyChains.length +
                                    searchFilters.amenities.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile Filter Drawer */}
                {isFilterOpen && (
                    <div className="lg:hidden fixed inset-0 z-[99] bg-black/50" onClick={() => setIsFilterOpen(false)}>
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between z-10">
                                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 py-4">
                                <MobileFiltersClient initialAmenities={initialData.amenities || []} onClose={() => setIsFilterOpen(false)} />
                            </div>

                            <div className="sticky bottom-0 bg-white border-t px-4 py-4 flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleClearAllFilters}
                                    className="flex-1 border-[#FF9530] text-[#FF9530] hover:bg-[#FF9530]/10"
                                >
                                    Clear All
                                </Button>
                                <Button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="flex-1 bg-[#FF9530] hover:bg-[#e8851c] text-white"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mt-6 sm:mt-8">
                    <div className="hidden lg:block lg:col-span-1">
                        {hotelsLoading ? (
                            <FilterShimmer />
                        ) : (
                            <>
                                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-100 mb-3">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 object-cover to-gray-300" style={{background:"url(/map.jpg)",backgroundSize:'cover'}}></div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <button onClick={() => router.push(`/hotels-on-map/hotels/${city}`)} className="bg-[#FF9530] hover:bg-[#e8851c] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105">
                                            <MapPin size={20} />
                                            <span>Show on Map</span>
                                        </button>
                                    </div>
                                </div>
                                <HotelFiltersClient initialAmenities={initialData.amenities || []} />
                            </>
                        )}
                    </div>
                    <div className="lg:col-span-3">
                        <HotelResults
                            hotels={hotels}
                            totalHotels={totalRecords}
                            isLoading={hotelsLoading || hotelsFetching}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            recordsPerPage={recordsPerPage}
                        />
                    </div>
                </div>

                {/* City Content */}
                <div className="py-4 mt-8 sm:mt-10">
                    {randomCityContent.length > 0 ? (
                        <>
                            {randomCityContent[0] && (
                                <div>
                                    <h3 className="heading-color text-xl sm:text-2xl md:text-3xl font-bold">
                                        {randomCityContent[0].content_name || `Book Best Hotels`} in <span className="capitalize">{city}</span>
                                    </h3>
                                    <div className="text-gray-600 text-sm sm:text-base mt-4 sm:mt-6">
                                        <p>{randomCityContent[0].message?.replace(/\n/g, ' ')}</p>
                                    </div>
                                </div>
                            )}
                            {randomCityContent[1] && (
                                <div className="mt-8 sm:mt-12">
                                    <h3 className="heading-color text-xl sm:text-2xl md:text-3xl font-bold">
                                        {randomCityContent[1].content_name || `Book Best Hotels`} in <span className="capitalize">{city}</span>
                                    </h3>
                                    <div className="text-gray-600 text-sm sm:text-base mt-4 sm:mt-6">
                                        <p>{randomCityContent[1].message?.replace(/\n/g, ' ')}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>

                {/* Additional Sections for Category Pages */}
                {category && availableRooms.length > 0 && (
                    <HotelBookingInterface 
                        hotels={availableRooms} 
                        isLoading={false} 
                        title={`Top Rated ${category.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())} in ${city.replace(/\b\w/g, (char) => char.toUpperCase())}`}
                    />
                )}
                
                {category && restaurants.length > 0 && (
                    <div className="mt-8 sm:mt-12">
                        <RestaurantCarousel 
                            hotels={restaurants} 
                            isLoading={false}
                            title={`5 Stars ${category.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())} in ${city.replace(/\b\w/g, (char) => char.toUpperCase())}`}
                        />
                    </div>
                )}

                {!category && (
                    <>
                        <HotelBookingInterface />
                        <div className="mt-8 sm:mt-12">
                            <RestaurantCarousel />
                        </div>
                        {/* <div className="mt-8 sm:mt-12">
                            <FamousMarkets />
                        </div> */}
                    </>
                )}

                <div>
                    {/* FAQSection and HotelSections moved to server component for SSR */}
                </div>
            </div>
        </main>
    );
}
