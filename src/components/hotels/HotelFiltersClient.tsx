"use client"

import { useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setSearchFilters, searchHotels, clearFilters } from "@/lib/features/hotels/hotelSlice"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Star } from "lucide-react"
import MultiSelectModal from "@/components/modals/MultiSelectModal"
import { propertyChains, propertyTypes } from "@/data/const"
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

interface HotelFiltersClientProps {
    initialAmenities: Amenity[]
}

const HotelFiltersClient = ({ initialAmenities }: HotelFiltersClientProps) => {
    const dispatch = useAppDispatch()
    const { searchFilters } = useAppSelector((state) => state?.hotels ?? { searchFilters: {} })
    const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false)
    const [isTypesModalOpen, setIsTypesModalOpen] = useState(false)
    const [isChainsModalOpen, setIsChainsModalOpen] = useState(false)
    const [sliderValues, setSliderValues] = useState<[number, number]>(
        searchFilters.priceRange || [0, 20000]
    )

    const amenities = initialAmenities || []
    const sidebarAmenities = amenities.slice(0, 6)

    // Handlers
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
        setSliderValues([0, 20000])
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

            {/* Price Range */}
            <div className="space-y-4">
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
            </div>
            <div className="h-[1px] border-storke" />

            {/* Star Rating */}
            <div className="space-y-4">
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

            {/* Property Types */}
            <div className="space-y-4">
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
            <div className="space-y-4">
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
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-base">Amenities</h4>
                <div className="space-y-3">
                    {sidebarAmenities.map((amenity) => (
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
                    ))}
                </div>
                {amenities.length > 6 && (
                    <button
                        className="text-[#FF9530] text-sm font-medium hover:underline"
                        onClick={() => setIsAmenitiesModalOpen(true)}
                    >
                        Show All
                    </button>
                )}
            </div>

            {/* Modals */}
            <MultiSelectModal
                title="Amenities"
                items={amenities}
                isOpen={isAmenitiesModalOpen}
                onClose={() => setIsAmenitiesModalOpen(false)}
                selectedValues={searchFilters.amenities || []}
                getLabel={(a) => a.name}
                getValue={(a) => a.id}
                onApply={(values) => {
                    dispatch(setSearchFilters({ amenities: values as number[] }))
                    dispatch(searchHotels())
                }}
            />

            <MultiSelectModal
                title="Property Types"
                items={propertyTypes}
                isOpen={isTypesModalOpen}
                onClose={() => setIsTypesModalOpen(false)}
                selectedValues={searchFilters.propertyTypes}
                getLabel={(t) => t.name}
                getValue={(t) => t.name}
                onApply={(values) => {
                    dispatch(setSearchFilters({ propertyTypes: values as string[] }))
                    dispatch(searchHotels())
                }}
            />

            <MultiSelectModal
                title="Property Chains"
                items={propertyChains}
                isOpen={isChainsModalOpen}
                onClose={() => setIsChainsModalOpen(false)}
                selectedValues={searchFilters.propertyChains}
                getLabel={(c) => c.name}
                getValue={(c) => c.name}
                onApply={(values) => {
                    dispatch(setSearchFilters({ propertyChains: values as string[] }))
                    dispatch(searchHotels())
                }}
            />
        </div>
    )
}

export default HotelFiltersClient
