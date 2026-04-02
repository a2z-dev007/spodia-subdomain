"use client"

/**
 * Example components showing how to use the promotional pricing utility
 * in different UI designs
 */

import { calculatePromotionalPricing, formatPrice } from "@/utils/promotionalPricing"
import { BestPromotion } from "@/types/HotelType"
import { Tag, TrendingDown, Calendar } from "lucide-react"

// Example 1: Compact Badge Style
export function CompactPromotionalBadge({
    originalPrice,
    hasPromotion,
    bestPromotion
}: {
    originalPrice: number
    hasPromotion: boolean
    bestPromotion: BestPromotion | null
}) {
    const pricing = calculatePromotionalPricing(originalPrice, hasPromotion, bestPromotion)

    if (!pricing.hasPromotion) {
        return <span className="font-bold text-lg">₹{pricing.originalPrice.toLocaleString()}</span>
    }

    return (
        <div className="inline-flex items-center gap-2">
            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                {pricing.discountText}
            </span>
            <span className="text-gray-500 line-through text-sm">
                ₹{pricing.originalPrice.toLocaleString()}
            </span>
            <span className="font-bold text-lg text-green-600">
                ₹{pricing.discountedPrice.toLocaleString()}
            </span>
        </div>
    )
}

// Example 2: Card Style with Icon
export function CardPromotionalPricing({
    originalPrice,
    hasPromotion,
    bestPromotion
}: {
    originalPrice: number
    hasPromotion: boolean
    bestPromotion: BestPromotion | null
}) {
    const pricing = calculatePromotionalPricing(originalPrice, hasPromotion, bestPromotion)

    if (!pricing.hasPromotion) {
        return (
            <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-2xl font-bold">₹{pricing.originalPrice.toLocaleString()}</div>
                <div className="text-xs text-gray-600">per night</div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-3 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-semibold text-orange-600">{pricing.promotionName}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-gray-500 line-through text-sm">
                    ₹{pricing.originalPrice.toLocaleString()}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                    ₹{pricing.discountedPrice.toLocaleString()}
                </span>
            </div>
            <div className="text-xs text-green-600 font-medium mt-1">
                Save ₹{pricing.savings.toLocaleString()} ({pricing.discountPercentage.toFixed(0)}%)
            </div>
        </div>
    )
}

// Example 3: Minimal Style
export function MinimalPromotionalPricing({
    originalPrice,
    hasPromotion,
    bestPromotion
}: {
    originalPrice: number
    hasPromotion: boolean
    bestPromotion: BestPromotion | null
}) {
    const pricing = calculatePromotionalPricing(originalPrice, hasPromotion, bestPromotion)

    if (!pricing.hasPromotion) {
        return <span className="text-xl font-bold">₹{pricing.originalPrice.toLocaleString()}</span>
    }

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 line-through">
                    ₹{pricing.originalPrice.toLocaleString()}
                </span>
                <span className="text-xl font-bold">₹{pricing.discountedPrice.toLocaleString()}</span>
            </div>
            <div className="text-xs text-orange-600 font-medium">
                {pricing.discountText} • {pricing.promotionName}
            </div>
        </div>
    )
}

// Example 4: Detailed Style with Dates
export function DetailedPromotionalPricing({
    originalPrice,
    hasPromotion,
    bestPromotion
}: {
    originalPrice: number
    hasPromotion: boolean
    bestPromotion: BestPromotion | null
}) {
    const pricing = calculatePromotionalPricing(originalPrice, hasPromotion, bestPromotion)

    if (!pricing.hasPromotion) {
        return (
            <div className="p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold">₹{pricing.originalPrice.toLocaleString()}</div>
            </div>
        )
    }

    return (
        <div className="p-4 bg-white rounded-lg border border-orange-200 space-y-3">
            {/* Promotion Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                <TrendingDown className="w-4 h-4" />
                <span>{pricing.promotionName}</span>
            </div>

            {/* Pricing */}
            <div>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-gray-500 line-through">
                        ₹{pricing.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-3xl font-bold text-gray-900">
                        ₹{pricing.discountedPrice.toLocaleString()}
                    </span>
                </div>
                <div className="text-sm text-green-600 font-medium">
                    You save ₹{pricing.savings.toLocaleString()} ({pricing.discountPercentage.toFixed(0)}% off)
                </div>
            </div>

            {/* Booking Period */}
            {pricing.formattedBookingPeriod && (
                <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t">
                    <Calendar className="w-3 h-3" />
                    <span>Book by: {pricing.formattedBookingPeriod}</span>
                </div>
            )}
        </div>
    )
}

// Example 5: List Item Style
export function ListItemPromotionalPricing({
    originalPrice,
    hasPromotion,
    bestPromotion
}: {
    originalPrice: number
    hasPromotion: boolean
    bestPromotion: BestPromotion | null
}) {
    const pricing = calculatePromotionalPricing(originalPrice, hasPromotion, bestPromotion)

    if (!pricing.hasPromotion) {
        return (
            <div className="flex items-center justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="text-xl font-bold">₹{pricing.originalPrice.toLocaleString()}</span>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-gray-600">Original Price:</span>
                <span className="text-gray-500 line-through">
                    ₹{pricing.originalPrice.toLocaleString()}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-green-600 font-medium">Discount ({pricing.discountText}):</span>
                <span className="text-green-600 font-medium">
                    - ₹{pricing.savings.toLocaleString()}
                </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-semibold">Final Price:</span>
                <span className="text-2xl font-bold text-orange-600">
                    ₹{pricing.discountedPrice.toLocaleString()}
                </span>
            </div>
        </div>
    )
}

// Example 6: Banner Style
export function BannerPromotionalPricing({
    originalPrice,
    hasPromotion,
    bestPromotion
}: {
    originalPrice: number
    hasPromotion: boolean
    bestPromotion: BestPromotion | null
}) {
    const pricing = calculatePromotionalPricing(originalPrice, hasPromotion, bestPromotion)

    if (!pricing.hasPromotion) return null

    return (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium opacity-90">🎉 {pricing.promotionName}</div>
                    <div className="text-2xl font-bold mt-1">
                        {pricing.discountText}
                    </div>
                    <div className="text-sm opacity-90 mt-1">
                        Save ₹{pricing.savings.toLocaleString()} on this booking
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm opacity-90 line-through">
                        ₹{pricing.originalPrice.toLocaleString()}
                    </div>
                    <div className="text-3xl font-bold">
                        ₹{pricing.discountedPrice.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    )
}
