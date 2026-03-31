import { BestPromotion } from "@/types/HotelType"

/**
 * Promotional Pricing Calculation Result
 */
export interface PromotionalPricingData {
    // Pricing
    originalPrice: number
    discountedPrice: number
    savings: number
    discountPercentage: number

    // Promotion Details
    hasPromotion: boolean
    promotionType: string
    promotionName: string
    discountText: string
    offerType: "Fixed" | "Percentage" | null

    // Dates
    bookingStart: string | null
    bookingEnd: string | null
    stayStart: string | null
    stayEnd: string | null
    formattedBookingPeriod: string | null

    // Raw Data
    bestPromotion: BestPromotion | null
}

/**
 * Calculate promotional pricing and return all relevant data
 * 
 * @param originalPrice - The original/base price (sbr_rate)
 * @param hasPromotion - Whether the hotel has an active promotion
 * @param bestPromotion - The best promotion object
 * @returns PromotionalPricingData object with all calculated values
 * 
 * @example
 * ```typescript
 * const pricingData = calculatePromotionalPricing(3420, true, hotel.best_promotion)
 * console.log(pricingData.discountedPrice) // 2400
 * console.log(pricingData.discountText) // "₹1,020 OFF"
 * ```
 */
export function calculatePromotionalPricing(
    originalPrice: number,
    hasPromotion: boolean,
    bestPromotion: BestPromotion | null
): PromotionalPricingData {
    // Default result for no promotion
    if (!hasPromotion || !bestPromotion || originalPrice <= 0) {
        return {
            originalPrice,
            discountedPrice: originalPrice,
            savings: 0,
            discountPercentage: 0,
            hasPromotion: false,
            promotionType: "",
            promotionName: "",
            discountText: "",
            offerType: null,
            bookingStart: null,
            bookingEnd: null,
            stayStart: null,
            stayEnd: null,
            formattedBookingPeriod: null,
            bestPromotion: null
        }
    }

    const { type_of_offer, rate_or_percentage, type, details } = bestPromotion

    // Calculate discounted price based on offer type
    let discountedPrice = originalPrice
    let savings = 0
    let discountPercentage = 0

    if (type_of_offer === "Fixed") {
        // Fixed amount discount
        savings = rate_or_percentage
        discountedPrice = Math.max(0, originalPrice - rate_or_percentage)
        discountPercentage = originalPrice > 0 ? (savings / originalPrice) * 100 : 0
    } else if (type_of_offer === "Percentage") {
        // Percentage discount
        discountPercentage = rate_or_percentage
        savings = (originalPrice * rate_or_percentage) / 100
        discountedPrice = Math.max(0, originalPrice - savings)
    }

    // Get promotion name (prefer details.name, fallback to type)
    const promotionName = details?.name || type || "Special Offer"
    const promotionType = type || "Promotion"

    // Generate discount text
    let discountText = ""
    if (type_of_offer === "Fixed") {
        discountText = `₹${Math.round(rate_or_percentage).toLocaleString()} OFF`
    } else if (type_of_offer === "Percentage") {
        discountText = `${rate_or_percentage}% OFF`
    }

    // Format booking period
    let formattedBookingPeriod = null
    if (details?.booking_start && details?.booking_end) {
        const startDate = formatDate(details.booking_start)
        const endDate = formatDate(details.booking_end)
        formattedBookingPeriod = `${startDate} - ${endDate}`
    }

    return {
        // Pricing
        originalPrice: Math.round(originalPrice),
        discountedPrice: Math.round(discountedPrice),
        savings: Math.round(savings),
        discountPercentage: Math.round(discountPercentage * 100) / 100,

        // Promotion Details
        hasPromotion: true,
        promotionType,
        promotionName,
        discountText,
        offerType: type_of_offer as "Fixed" | "Percentage",

        // Dates
        bookingStart: details?.booking_start || null,
        bookingEnd: details?.booking_end || null,
        stayStart: details?.stay_start || null,
        stayEnd: details?.stay_end || null,
        formattedBookingPeriod,

        // Raw Data
        bestPromotion
    }
}

/**
 * Format date for display
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "7 Nov, 2025")
 */
export function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    } catch (error) {
        return dateString
    }
}

/**
 * Format date range for display
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Formatted date range (e.g., "7 Nov - 31 Dec, 2025")
 */
export function formatDateRange(startDate: string, endDate: string): string {
    try {
        const start = new Date(startDate)
        const end = new Date(endDate)

        // If same year, show year only once
        if (start.getFullYear() === end.getFullYear()) {
            const startFormatted = start.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short'
            })
            const endFormatted = end.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
            return `${startFormatted} - ${endFormatted}`
        }

        // Different years, show both
        return `${formatDate(startDate)} - ${formatDate(endDate)}`
    } catch (error) {
        return `${startDate} - ${endDate}`
    }
}

/**
 * Check if promotion is currently valid for booking
 * @param bookingStart - Booking start date
 * @param bookingEnd - Booking end date
 * @returns true if current date is within booking period
 */
export function isPromotionValid(bookingStart: string | null, bookingEnd: string | null): boolean {
    if (!bookingStart || !bookingEnd) return true

    try {
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const start = new Date(bookingStart)
        const end = new Date(bookingEnd)

        return now >= start && now <= end
    } catch (error) {
        return true
    }
}

/**
 * Get promotion urgency level based on booking end date
 * @param bookingEnd - Booking end date
 * @returns "high" | "medium" | "low" | null
 */
export function getPromotionUrgency(bookingEnd: string | null): "high" | "medium" | "low" | null {
    if (!bookingEnd) return null

    try {
        const now = new Date()
        const end = new Date(bookingEnd)
        const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysRemaining <= 3) return "high"
        if (daysRemaining <= 7) return "medium"
        return "low"
    } catch (error) {
        return null
    }
}

/**
 * Format price with currency symbol and thousand separators
 * @param price - Price amount
 * @param currency - Currency symbol (default: "₹")
 * @returns Formatted price string (e.g., "₹ 2,400")
 */
export function formatPrice(price: number, currency: string = "₹"): string {
    return `${currency} ${Math.round(price).toLocaleString('en-IN')}`
}

/**
 * Get savings percentage as a formatted string
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Formatted percentage (e.g., "30%")
 */
export function getSavingsPercentage(originalPrice: number, discountedPrice: number): string {
    if (originalPrice <= 0) return "0%"
    const percentage = ((originalPrice - discountedPrice) / originalPrice) * 100
    return `${Math.round(percentage)}%`
}
