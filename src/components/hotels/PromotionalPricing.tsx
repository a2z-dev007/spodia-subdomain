"use client"

import { calculatePromotionalPricing } from "@/utils/promotionalPricing"
import { BestPromotion } from "@/types/HotelType"

interface PromotionalPricingProps {
    originalPrice: number
    hasPromotion: boolean
    bestPromotion: BestPromotion | null
    className?: string
    type?: string
}

export default function PromotionalPricing({
    originalPrice,
    hasPromotion,
    type,
    bestPromotion,
    className = ""
}: PromotionalPricingProps) {
    // Use the reusable utility function to calculate pricing
    const pricingData = calculatePromotionalPricing(originalPrice, hasPromotion, bestPromotion)

    // If no promotion, show regular price
    if (!pricingData.hasPromotion) {
        return (
            <div className={className}>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                    ₹{pricingData.originalPrice.toLocaleString()}
                </span>
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            {/* Promotion Type Badge */}
            <div className={`flex items-center gap-2 mb-2 flex-wrap ${type === "list" ? 'justify-end' : 'justify-start'}`}>
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    <span className="text-[10px]">🎉</span>
                    {pricingData.discountText && <span>{pricingData.discountText}</span>}
                </div>
            </div>

            {/* Pricing with strikethrough */}
            <div className={`flex items-center gap-2 mb-1 flex-wrap ${type === "list" ? 'justify-end' : 'justify-start'}`}>
                <span className="text-red-500 line-through text-sm font-medium">
                    ₹ {pricingData.originalPrice.toLocaleString()}
                </span>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                    ₹ {pricingData.discountedPrice.toLocaleString()}
                </span>
            </div>
        </div>
    )
}
