"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setSearchFilters, searchHotels, clearFilters } from "@/lib/features/hotels/hotelSlice"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Star, Search, X, MapPin } from "lucide-react"
import { getAmenties } from "@/services/api";
import MultiSelectModal from "@/components/modals/MultiSelectModal";
import { propertyChains, propertyTypes } from "@/data/const";
import { IMAGE_BASE_URL } from "@/lib/api/apiClient"
import Image from "next/image"


interface Amenity {
    id: number
    name: string
    name_hindi: string
    parent: string | null
    amenities_tags: string[]
    image: string
    created: string
}

interface AmenitiesResponse {
    totalRecords: number
    status: string
    records: Amenity[]
}

const HotelFilters = () => {
    const dispatch = useAppDispatch()
    const { searchFilters } = useAppSelector((state) => state?.hotels ?? { searchFilters: {} })
    const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false)
    const [amenitySearchTerm, setAmenitySearchTerm] = useState("")
    const [showAllTypes, setShowAllTypes] = useState(false)
    const [showAllChains, setShowAllChains] = useState(false)
    const [showAllPropertyTypes, setShowAllPropertyTypes] = useState(false)
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(searchFilters.propertyTypes || [])
    const [isTypesModalOpen, setIsTypesModalOpen] = useState(false)
    const [isChainsModalOpen, setIsChainsModalOpen] = useState(false)
    const [showAllPropertyChains, setShowAllPropertyChains] = useState(false)
    const [selectedPropertyChains, setSelectedPropertyChains] = useState<string[]>(searchFilters.propertyChains || [])
    const [filteredPropertyTypes, setFilteredPropertyTypes] = useState(propertyTypes)
    const [filteredPropertyChains, setFilteredPropertyChains] = useState(propertyChains)

    const [tempTypes, setTempTypes] = useState<string[]>(searchFilters.propertyTypes)
    const [tempChains, setTempChains] = useState<string[]>(searchFilters.propertyChains)
    const [sliderValues, setSliderValues] = useState<[number, number]>(
        searchFilters.priceRange || [0, 20000]
    )
    // Fetch amenities using TanStack Query
    const { data: amenitiesData, isLoading: isAmenitiesLoading, error: amenitiesError } = useQuery<AmenitiesResponse>({
        queryKey: ["amenities"],
        queryFn: async () => {
            const response = await getAmenties();
            return response.data;
        },
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // retry: 3, // Retry 3 times on failure
        // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: true, // Always refetch on mount
        enabled: true, // Always enabled
    })

    const amenities = amenitiesData?.records || []

    // Filter amenities based on search term
    const filteredAmenities = amenities.filter((amenity: { name: string; name_hindi: string }) =>
        amenity.name.toLowerCase().includes(amenitySearchTerm.toLowerCase()) ||
        amenity.name_hindi.toLowerCase().includes(amenitySearchTerm.toLowerCase())
    )

    // Get first 6 amenities for sidebar display
    const sidebarAmenities = amenities.slice(0, 6)

    const starRatings = [5, 4, 3, 2, 1]
    const propertyTypesList = ["Hotels", "Resorts", "Homestays", "Apartments", "Villas", "Hostels"]

    // Budget ranges
    const budgetRanges = [
        { label: "₹0 to ₹5000", value: [0, 5000] as [number, number] },
        { label: "₹5000 to ₹10000", value: [5000, 10000] as [number, number] },
        { label: "₹10000 to ₹15000", value: [10000, 15000] as [number, number] },
        { label: "₹15000 to ₹20000", value: [15000, 20000] as [number, number] },
    ]

    // Derive selected ranges from Redux store's priceRange
    const getSelectedRangesFromPriceRange = () => {
        if (!searchFilters.priceRange) return []
        const [min, max] = searchFilters.priceRange
        return budgetRanges
            .filter(range => range.value[0] >= min && range.value[1] <= max)
            .map(range => range.value)
    }

    // Handlers
    const handleBudgetChange = (range: [number, number], checked: boolean) => {
        const currentRanges = getSelectedRangesFromPriceRange()
        let next = checked
            ? [...currentRanges, range]
            : currentRanges.filter(r => !(r[0] === range[0] && r[1] === range[1]))

        if (next.length > 0) {
            const min = Math.min(...next.map(r => r[0]))
            const max = Math.max(...next.map(r => r[1]))
            dispatch(setSearchFilters({ priceRange: [min, max] }))
            setSliderValues([min, max])
        } else {
            dispatch(setSearchFilters({ priceRange: undefined }))
            setSliderValues([200, 6000])
        }
        dispatch(searchHotels())
    }

    const handleStarRatingChange = (rating: number, checked: boolean) => {
        const next = checked
            ? [...searchFilters.starRating, rating]
            : searchFilters.starRating.filter((r) => r !== rating)
        dispatch(setSearchFilters({ starRating: next }))
        dispatch(searchHotels())
    }

    const handleAmenityChange = (amenityId: number, amenityName: string, checked: boolean) => {
        const nextAmenityIds = checked
            ? [...(searchFilters.amenities || []), amenityId]
            : (searchFilters.amenities || []).filter((id) => id !== amenityId)

        dispatch(setSearchFilters({
            amenities: nextAmenityIds,
        }))
        dispatch(searchHotels())
    }

    const handleClearFilters = () => {
        dispatch(clearFilters())
        dispatch(searchHotels())
        setAmenitySearchTerm("")
        setSliderValues([200, 6000])
    }
    const handlePropertyTypeChange = (type: string, checked: boolean) => {
        const next = checked
            ? [...(searchFilters.propertyTypes || []), type]
            : (searchFilters.propertyTypes || []).filter((t) => t !== type)

        dispatch(setSearchFilters({ propertyTypes: next }))
        dispatch(searchHotels())
    }

    const handlePropertyChainChange = (chain: string, checked: boolean) => {
        const next = checked
            ? [...(searchFilters.propertyChains || []), chain]
            : (searchFilters.propertyChains || []).filter((c) => c !== chain)

        dispatch(setSearchFilters({ propertyChains: next }))
        dispatch(searchHotels())
    }

    return (
        <div className="bg-white lg:rounded-2xl lg:p-6 lg:shadow-lg w-full lg:max-w-sm space-y-6">
            {/* Map Section */}
            

            {/* Filters Header */}
            <div className="hidden lg:flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <Button
                    variant="ghost"
                    className="text-[#FF9530] hover:text-[#e8851c] text-sm px-2"
                    onClick={handleClearFilters}
                >
                    Clear All
                </Button>
            </div>
            {/* <div className="hidden lg:block  border-storke" /> */}
            {/* Price Range */}
            <div className="space-y-4 ">
                <h4 className="font-semibold text-gray-900 text-base">Your Budget (per night)</h4>

                {/* Price Range Display */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">₹{sliderValues[0].toLocaleString()}</span>
                    <span className="text-gray-400">-</span>
                    <span className="text-gray-600">₹{sliderValues[1].toLocaleString()}+</span>
                </div>

                {/* Slider */}
                <div className="px-1">
                    <Slider
                        min={0}
                        max={20000}
                        step={100}
                        value={sliderValues}
                        onValueChange={(value) => {
                            setSliderValues(value as [number, number])
                        }}
                        onValueCommit={(value) => {
                            const [min, max] = value as [number, number]
                            dispatch(setSearchFilters({ priceRange: [min, max] }))
                            dispatch(searchHotels())
                        }}
                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-[#FF9530] [&_[role=slider]]:bg-white [&_[role=slider]]:shadow-md [&>span:first-child]:h-1.5 [&>span:first-child]:bg-gray-200 [&_[role=slider]+span]:bg-[#FF9530]"
                    />
                </div>

                {/* Checkbox Options */}
                {/* <div className="space-y-3 pt-2">
                    {budgetRanges.map((range) => {
                        const isChecked = searchFilters.priceRange
                            ? range.value[0] >= searchFilters.priceRange[0] && range.value[1] <= searchFilters.priceRange[1]
                            : false
                        return (
                            <label key={range.value.join("-")} className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => handleBudgetChange(range.value, checked as boolean)}
                                />
                                <span className="text-sm">{range.label}</span>
                            </label>
                        )
                    })}
                </div> */}
            </div>
            <div className="h-[1px] border-storke" />
            {/* Star Rating */}
            <div className="space-y-4 ">
                <h4 className="font-semibold text-gray-900 text-base">Star Rating</h4>
                <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <label key={star} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={searchFilters.starRating.includes(star)}
                                onCheckedChange={(checked) => {
                                    const newRatings = checked
                                        ? [...searchFilters.starRating, star]
                                        : searchFilters.starRating.filter(r => r !== star)
                                    dispatch(setSearchFilters({ starRating: newRatings }))
                                    dispatch(searchHotels())
                                }}
                            />
                            <span className="text-sm">{star} Star</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="h-[1px] border-storke" />
            {/* Property Types (first 6) */}
            <div className="space-y-4 ">
                <h4 className="font-semibold text-gray-900 text-base">Property Type</h4>
                <div className="space-y-3">
                    {propertyTypes.slice(0, 6).map((t) => (
                        <div key={t.id} className="flex items-center space-x-3">
                            <Checkbox
                                id={`ptype-${t.id}`}
                                checked={searchFilters.propertyTypes.includes(t.name)}
                                onCheckedChange={(c) => handlePropertyTypeChange(t.name, Boolean(c))}
                                className="data-[state=checked]:bg-[#FF9530] data-[state=checked]:border-[#FF9530]"
                            />
                            <label htmlFor={`ptype-${t.id}`} className="text-sm text-gray-700 cursor-pointer">
                                {t.name}
                            </label>
                        </div>
                    ))}
                </div>
                {propertyTypes.length > 6 && (
                    <button
                        className="text-[#FF9530] text-sm font-medium hover:underline"
                        onClick={() => setIsTypesModalOpen(true)}
                    >
                        Show All
                    </button>
                )}
            </div>
            <div className="h-[1px] border-storke" />
            {/* Property Chains */}
            <div className="space-y-4 ">
                <h4 className="font-semibold text-gray-900 text-base">Property Chains</h4>
                <div className="space-y-3">
                    {propertyChains.slice(0, 6).map((c) => (
                        <div key={c.id} className="flex items-center space-x-3">
                            <Checkbox
                                id={`pchain-${c.id}`}
                                checked={searchFilters.propertyChains.includes(c.name)}
                                onCheckedChange={(chk) => handlePropertyChainChange(c.name, Boolean(chk))}
                                className="data-[state=checked]:bg-[#FF9530] data-[state=checked]:border-[#FF9530]"
                            />
                            <label htmlFor={`pchain-${c.id}`} className="text-sm text-gray-700 cursor-pointer">
                                {c.name}
                            </label>
                        </div>
                    ))}
                </div>
                {propertyChains.length > 6 && (
                    <button
                        className="text-[#FF9530] text-sm font-medium hover:underline"
                        onClick={() => setIsChainsModalOpen(true)}
                    >
                        Show All
                    </button>
                )}
            </div>
            <div className="h-[1px] border-storke" />
            {/* Amenities */}
            <div className="space-y-4 ">
                <h4 className="font-semibold text-gray-900 text-base">Amenities</h4>
                <div className="space-y-3">
                    {isAmenitiesLoading ? (
                        <div className="space-y-2">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        sidebarAmenities.map((amenity) => (
                            <div key={amenity.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={`amenity-sidebar-${amenity.id}`}
                                    checked={searchFilters.amenities?.includes(amenity.id) || false}
                                    onCheckedChange={(checked) =>
                                        handleAmenityChange(amenity.id, amenity.name, Boolean(checked))
                                    }
                                    className="data-[state=checked]:bg-[#FF9530] data-[state=checked]:border-[#FF9530]"
                                />
                                <label
                                    htmlFor={`amenity-sidebar-${amenity.id}`}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    {amenity.image ? (
                                        <div className="w-4 h-4 flex-shrink-0">
                                            <Image
                                                src={`${IMAGE_BASE_URL}${amenity.image}`}
                                                alt={amenity.name}
                                                width={16}
                                                height={16}
                                                className="w-4 h-4 object-contain"
                                                onError={(e) => {
                                                    // Fallback to default icon if image fails to load
                                                    e.currentTarget.style.display = 'none';
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = '<svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <Star className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    )}
                                    <span className="text-sm text-gray-700">{amenity.name}</span>
                                </label>
                            </div>
                        ))
                    )}
                </div>
                {/* See all*/}
                {amenities.length > 6 && (
                    <button
                        className="text-[#FF9530] text-sm font-medium hover:underline"
                        onClick={() => setIsAmenitiesModalOpen(true)}
                    >
                        Show All
                    </button>
                )}

            </div>
            {/*Property Types Modal*/}
            <MultiSelectModal
                title="Amenities"
                items={amenities}
                isOpen={isAmenitiesModalOpen}
                onClose={() => setIsAmenitiesModalOpen(false)}
                selectedValues={searchFilters.amenities || []}        // IDs
                getLabel={(a) => a.name}
                getValue={(a) => a.id}                                 // return IDs
                onApply={(values) => {
                    // values are numbers (IDs)
                    dispatch(setSearchFilters({ amenities: values as number[] }))
                    dispatch(searchHotels())
                }}
            />

            {/* Property Types Modal (names) */}
            <MultiSelectModal
                title="Property Types"
                items={propertyTypes}
                isOpen={isTypesModalOpen}
                onClose={() => setIsTypesModalOpen(false)}
                selectedValues={searchFilters.propertyTypes}            // names
                getLabel={(t) => t.name}
                getValue={(t) => t.name}                                // return names
                onApply={(values) => {
                    dispatch(setSearchFilters({ propertyTypes: values as string[] }))
                    dispatch(searchHotels())
                }}
            />

            {/* Property Chains Modal (names) */}
            <MultiSelectModal
                title="Property Chains"
                items={propertyChains}
                isOpen={isChainsModalOpen}
                onClose={() => setIsChainsModalOpen(false)}
                selectedValues={searchFilters.propertyChains}           // names
                getLabel={(c) => c.name}
                getValue={(c) => c.name}                                // return names
                onApply={(values) => {
                    dispatch(setSearchFilters({ propertyChains: values as string[] }))
                    dispatch(searchHotels())
                }}
            />

        </div>
    )
}

export default HotelFilters