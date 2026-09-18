"use client"

import PremiumHotelSearchBar from "@/components/home/PremiumHotelSearchBar";
import HotelFiltersClient from "@/components/hotels/HotelFiltersClient";
import MobileFiltersClient from "@/components/hotels/MobileFiltersClient";
import HotelResults from "@/components/hotels/HotelResults";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchHotelsApi, searchListings } from "@/services/api";
import { format } from "date-fns";
import { IMAGES } from "@/assets/images"
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setSearchFilters, searchHotels, clearFilters } from "@/lib/features/hotels/hotelSlice";
import { Button } from "@/components/ui/button";
import { X, Star, SlidersHorizontal, MapPin } from "lucide-react";
import { HotelType } from "@/types/HotelType";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { FilterShimmer } from "@/components/ui/ShimmerLoader";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import Header from "@/components/layout/Header";
import { SearchResultsMetaTags } from "@/components/seo/SearchResultsMetaTags";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";

interface Amenity {
    id: number
    name: string
    name_hindi: string
    parent: string | null
    amenities_tags: string[]
    image: string
    created: string
}

export interface AmenitiesResponse {
    totalRecords: number
    status: string
    records: Amenity[]
}

type SearchHotelRes = {
    status: string
    totalRecords: number;
    records: HotelType[];
}

interface InitialData {
    initialHotels: HotelType[];
    totalRecords: number;
    amenities: Amenity[];
    cityId: number | null;
}

interface SearchResultsClientProps {
    initialData: InitialData;
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function SearchResultsClient({ initialData, searchParams: searchParamsObj }: SearchResultsClientProps) {
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const { searchFilters } = useAppSelector((state) => state?.hotels ?? { searchFilters: {} });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const router = useRouter();
    const hotelListRef = useRef<HTMLDivElement>(null);
    const isButtonsVisible = useScrollDirection();

    useLockBodyScroll(isFilterOpen);

    const city = searchParams.get("city") || "";
    const cityName = searchParams.get("cityName") || "";
    const start_date = searchParams.get("start_date") || "";
    const end_date = searchParams.get("end_date") || "";
    const no_of_adult = Number(searchParams.get("no_of_adult") || 2);
    const no_of_child = Number(searchParams.get("no_of_child") || 0);
    const rooms = Number(searchParams.get("rooms") || 1);
    const childInfo = searchParams.get("childInfo") || "";
    const show_popular = searchParams.get("show_popular") === "true";
    const show_top_rated = searchParams.get("show_top_rated") === "true";

    // Get current date for section-based queries
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const currentDate = getCurrentDate();

    // Parse children ages from URL
    const childrenAgesFromUrl = childInfo ? childInfo.split(',').map(Number) : [];

    // Validate dates from URL
    useEffect(() => {
        if (start_date && end_date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const checkIn = new Date(start_date);
            const checkOut = new Date(end_date);

            // Check if check-in is in the past
            if (checkIn < today) {
                toast.error('Check-in date cannot be in the past. Please select valid dates.', {
                    position: "top-center",
                    autoClose: 5000,
                });
                return;
            }

            // Check if check-out is not after check-in
            if (checkOut <= checkIn) {
                toast.error('Check-out date must be at least one day after check-in date.', {
                    position: "top-center",
                    autoClose: 5000,
                });
                return;
            }

            // Check if dates are valid
            if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
                toast.error('Invalid date format in URL. Please search again.', {
                    position: "top-center",
                    autoClose: 5000,
                });
                return;
            }
        }
    }, [start_date, end_date]);

    // Fetch amenities on client if not provided by server
    const { data: clientAmenitiesData } = useQuery<AmenitiesResponse>({
        queryKey: ["amenities"],
        queryFn: async () => {
            const { getAmenties } = await import("@/services/api");
            const response = await getAmenties();
            return response.data;
        },
        enabled: !initialData.amenities || initialData.amenities.length === 0,
        staleTime: Infinity,
    });

    // Use server amenities if available, otherwise use client-fetched amenities
    const amenitiesData = {
        records: initialData.amenities && initialData.amenities.length > 0
            ? initialData.amenities
            : (clientAmenitiesData?.records || []),
        totalRecords: initialData.amenities && initialData.amenities.length > 0
            ? initialData.amenities.length
            : (clientAmenitiesData?.totalRecords || 0),
        status: 'success'
    };

    const hasSearchParams = city && start_date && end_date;

    // Get sortBy from searchFilters or default to "top_reviewed"
    const sortBy = searchFilters.sortBy || "top_reviewed";

    // Add pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 12;

    const isDefaultFilterState =
        currentPage === 1 &&
        (!searchFilters.sortBy || searchFilters.sortBy === "top_reviewed") &&
        !searchFilters.priceRange &&
        searchFilters.starRating.length === 0 &&
        searchFilters.amenities.length === 0 &&
        searchFilters.propertyTypes.length === 0 &&
        (searchFilters.propertyChains?.length || 0) === 0;

    const { data, isLoading, isFetching } = useQuery<SearchHotelRes>({
        queryKey: [
            "hotels",
            city,
            cityName,
            start_date,
            end_date,
            no_of_adult,
            no_of_child,
            childInfo,
            searchFilters.priceRange,
            searchFilters.starRating,
            searchFilters.amenities,
            searchFilters.propertyTypes,
            searchFilters.propertyChains,
            sortBy,
            hasSearchParams,
            show_popular,
            show_top_rated,
            currentPage, // Add currentPage to queryKey
        ],
        queryFn: async () => {
            if (hasSearchParams) {
                const response = await searchHotelsApi({
                    ...searchFilters,
                    sortBy: sortBy,
                    city,
                    cityName,
                    checkIn: start_date,
                    checkOut: end_date,
                    noOfAdult: no_of_adult,
                    noOfChild: no_of_child,
                    childInfo,
                    page_number: currentPage,
                    number_of_records: recordsPerPage,
                });
                return response.data;
            } else {
                const response = await searchListings({
                    page_number: currentPage,
                    number_of_records: recordsPerPage,
                    show_landing: !show_popular && !show_top_rated,
                    show_popular: show_popular,
                    show_top_rated: show_top_rated,
                    start_date: (show_popular || show_top_rated) ? currentDate : undefined,
                    end_date: (show_popular || show_top_rated) ? currentDate : undefined,
                    sortBy: sortBy
                });
                return {
                    status: response.data.status || "success",
                    totalRecords: response.data.totalRecords || response.data.records?.length || 0,
                    records: response.data.records || []
                };
            }
        },
        enabled: true,
        placeholderData: (previousData) => previousData,
        initialData: isDefaultFilterState && Array.isArray(initialData?.initialHotels) && initialData.initialHotels.length > 0
            ? { records: initialData.initialHotels, totalRecords: initialData.totalRecords, status: 'success' }
            : undefined,
        initialDataUpdatedAt: Date.now(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const hotels = data?.records || [];
    const totalRecords = data?.totalRecords || 0;
    const initialGuests = { adults: no_of_adult || 2, children: no_of_child || 0 };
    const initialRooms = rooms || 1;

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [
        city,
        start_date,
        end_date,
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

    const handleClearAllFilters = () => {
        dispatch(clearFilters());
        dispatch(searchHotels());
    };

    const handleSearch = (params: {
        location: string
        checkIn: Date | null
        checkOut: Date | null
        guests: { adults: number; children: number }
        cityId: string | number | null
        rooms: number
        childrenAges: number[]
    }) => {
        const currentParams = new URLSearchParams()
        if (params.cityId !== null) {
            currentParams.set("city", String(params.cityId))
        }
        if (params.location) {
            currentParams.set("cityName", params.location)
        }
        if (params.checkIn) {
            currentParams.set("start_date", format(params.checkIn, "yyyy-MM-dd"))
        }
        if (params.checkOut) {
            currentParams.set("end_date", format(params.checkOut, "yyyy-MM-dd"))
        }
        if (params.guests.adults) {
            currentParams.set("no_of_adult", String(params.guests.adults))
        }
        if (params.guests.children) {
            currentParams.set("no_of_child", String(params.guests.children))
        }
        if (params.rooms) {
            currentParams.set("rooms", String(params.rooms))
        }
        if (params.childrenAges && params.childrenAges.length > 0) {
            currentParams.set("childInfo", params.childrenAges.join(','))
        }
        router.push(`/search-results?${currentParams.toString()}`)
    }

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

    const { headerHeight } = useHeaderHeight();
    const heroSpacing = 28;
    const paddingTop = headerHeight ? `${headerHeight + heroSpacing}px` : "136px";
    const paddingBottom = `${heroSpacing}px`;

    return (
        <main className="min-h-screen bg-gray-50">
            <SearchResultsMetaTags />
            <Header />
            <ToastContainer />
            <div
                className="w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 md:px-8 relative z-10 transition-all duration-200"
                style={{
                    backgroundImage: `url(${IMAGES.listingHeroBg.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    paddingTop,
                    paddingBottom,
                }}>
                <div className="max-w-7xl w-full md:px-8 lg:px-8 px-2">
                    <PremiumHotelSearchBar
                        callingFrom="search"
                        initialLocation={
                            cityName && city
                                ? {
                                    id: Number(city),
                                    name: cityName,
                                    country_name: "",
                                    country: 0,
                                    state_name: "",
                                    state: 0
                                }
                                : null
                        }
                        initialCheckIn={start_date ? new Date(start_date) : null}
                        initialCheckOut={end_date ? new Date(end_date) : null}
                        initialGuests={initialGuests}
                        initialRooms={initialRooms}
                        initialChildrenAges={childrenAgesFromUrl}
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <div ref={hotelListRef} className="max-w-7xl mx-auto px-4 py-4 sm:py-4">
                {/* <div className="mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {hasSearchParams
                            ? `Hotels in ${cityName || 'Your Destination'}`
                            : show_top_rated
                                ? 'Top Rated Hotels'
                                : show_popular
                                    ? 'Popular Nearby Hotels'
                                    : 'Discover Amazing Hotels'
                        }
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        {hasSearchParams
                            ? `${totalRecords} properties found`
                            : show_top_rated
                                ? `${totalRecords} top rated properties`
                                : show_popular
                                    ? `${totalRecords} popular properties`
                                    : 'Explore our curated collection of premium hotels and resorts'
                        }
                    </p>
                </div> */}

                {hasActiveFilters && (
                    <div className="bg-white rounded-lg p-4 mb-6 mt-4 shadow-sm border">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Applied Filters:
                            </span>

                            <div className="flex flex-wrap items-center gap-2 flex-1">
                                {searchFilters.priceRange && (
                                    <div
                                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-200">
                                        <span
                                            className="whitespace-nowrap">₹{searchFilters.priceRange[0].toLocaleString()} - ₹{searchFilters.priceRange[1].toLocaleString()}</span>
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
                                    <div key={star}
                                        className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm border border-yellow-200">
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
                                    <div key={type}
                                        className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm border border-green-200">
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
                                    <div key={chain}
                                        className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm border border-purple-200">
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
                                        <div key={id}
                                            className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-3 py-1.5 rounded-full text-sm border border-pink-200">
                                            <span
                                                className="whitespace-nowrap">{amenity?.name || `Amenity ${id}`}</span>
                                            <button
                                                onClick={() => {
                                                    const newAmenities = searchFilters.amenities.filter((a: any) => a !== id)
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
                    {cityName && (
                        <button
                            onClick={() => router.push(`/hotels-on-map/hotels/${cityName?.toLowerCase()}`)}
                            className="bg-white hover:bg-gray-50 text-orange-500 border-2 border-orange-500 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-all active:scale-95"
                        >
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-sm sm:text-base">Map</span>
                        </button>
                    )}
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
                    <div
                        className="lg:hidden fixed inset-0 z-[10000] bg-black/50 overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        onClick={() => setIsFilterOpen(false)}
                    >
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col min-h-0 animate-slide-up"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drawer Header */}
                            <div className="shrink-0 rounded-t-3xl bg-white border-b px-4 py-4 flex items-center justify-between z-10">
                                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Filter Content */}
                            <div
                                className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4"
                                data-lenis-prevent="true"
                            >
                                <MobileFiltersClient initialAmenities={amenitiesData.records || []} onClose={() => setIsFilterOpen(false)} />
                            </div>

                            {/* Drawer Footer */}
                            <div className="shrink-0 bg-white border-t px-4 py-4 flex gap-3">
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

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mt-6 sm:mt-4">
                    {/* Desktop Filters - Hidden on mobile/tablet */}
                    <div className="hidden lg:block lg:col-span-1 sticky top-20 self-start">
                        {cityName && (
                            <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-100 mb-3">
                                {/* Map placeholder */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 object-cover to-gray-300" style={{ background: "url(/map.jpg)", backgroundSize: 'cover' }}>
                                </div>

                                {/* Show on Map Button */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <button onClick={() => router.push(`/hotels-on-map/hotels/${cityName?.toLowerCase()}`)} className="bg-[#FF9530] hover:bg-[#e8851c] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105">
                                        <MapPin size={20} />
                                        <span>Show on Map</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <HotelFiltersClient initialAmenities={amenitiesData.records || []} />
                    </div>
                    <div className="lg:col-span-3">
                        <HotelResults
                            hotels={hotels}
                            totalHotels={totalRecords}
                            isLoading={isLoading || isFetching}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            recordsPerPage={recordsPerPage}
                            cityName={cityName || city}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
