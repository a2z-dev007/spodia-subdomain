import { PromotionDetail } from "@/types/roomInventory"

/**
 * Room Plan Promotional Pricing Result
 */
export interface RoomPlanPromotionalPricing {
  // Pricing
  originalPrice: number
  discountedPrice: number
  savings: number
  discountPercentage: number

  // Promotion Details
  hasPromotion: boolean
  promotionName: string
  discountText: string
  offerType: "Fixed" | "Percentage" | null

  // Dates
  bookingStart: string | null
  bookingEnd: string | null
  stayStart: string | null
  stayEnd: string | null
  formattedBookingPeriod: string | null

  // Validation
  isValidForRoom: boolean
  isValidForPlan: boolean
}

/**
 * Calculate promotional pricing for a specific room and plan
 * 
 * @param originalPrice - The original/base price (sbr_rate, dbr_rate, etc.)
 * @param roomId - The room ID
 * @param planId - The plan ID
 * @param promotionDetails - Array of promotion details from API
 * @param stayStartDate - Guest's check-in date (optional, for blackout validation)
 * @param stayEndDate - Guest's check-out date (optional, for blackout validation)
 * @returns RoomPlanPromotionalPricing object with all calculated values
 * 
 * @example
 * ```typescript
 * const pricing = calculateRoomPlanPromotionalPricing(4000, 2, 1, promotionDetails, '2025-12-01', '2025-12-03')
 * console.log(pricing.discountedPrice) // 2980
 * console.log(pricing.discountText) // "₹1,020 OFF"
 * ```
 */
export function calculateRoomPlanPromotionalPricing(
  originalPrice: number,
  roomId: number,
  planId: number,
  promotionDetails: PromotionDetail[] | undefined,
  stayStartDate?: string | Date | null,
  stayEndDate?: string | Date | null
): RoomPlanPromotionalPricing {
  // Default result for no promotion
  const defaultResult: RoomPlanPromotionalPricing = {
    originalPrice,
    discountedPrice: originalPrice,
    savings: 0,
    discountPercentage: 0,
    hasPromotion: false,
    promotionName: "",
    discountText: "",
    offerType: null,
    bookingStart: null,
    bookingEnd: null,
    stayStart: null,
    stayEnd: null,
    formattedBookingPeriod: null,
    isValidForRoom: false,
    isValidForPlan: false
  }

  // Check if promotion details exist
  if (!promotionDetails || promotionDetails.length === 0 || originalPrice <= 0) {
    return defaultResult
  }

  // Find the first valid promotion
  const promotion = promotionDetails[0]

  // Check if promotion is active
  if (!promotion.has_promotion || !promotion.best_promotion) {
    return defaultResult
  }

  const { best_promotion, type_of_offer, promotion_discount } = promotion
  const { details } = best_promotion

  // Check if this promotion applies to the specific room and plan
  let isValidForRoom = false
  let isValidForPlan = false

  if (details?.promotion_rooms) {
    for (const promotionRoom of details.promotion_rooms) {
      // Check if room ID matches
      if (promotionRoom.rooms === roomId) {
        isValidForRoom = true
        
        // Check if plan ID is in the plans array
        if (promotionRoom.plans && promotionRoom.plans.includes(planId)) {
          isValidForPlan = true
          console.log('✅ PROMOTION APPLIES:', {
            roomId,
            planId,
            discount: promotion_discount,
            type: type_of_offer
          })
          break
        }
      }
    }
  }

  // If promotion doesn't apply to this room/plan combination, return default
  if (!isValidForRoom || !isValidForPlan) {
    return {
      ...defaultResult,
      isValidForRoom,
      isValidForPlan
    }
  }

  // Check blackout dates - skip promotion if stay dates fall within blackout period
  if (details?.back_out_start && details?.back_out_end && stayStartDate && stayEndDate) {
    const isInBlackoutPeriod = checkBlackoutPeriod(
      stayStartDate,
      stayEndDate,
      details.back_out_start,
      details.back_out_end
    )

    if (isInBlackoutPeriod) {
      console.log('🚫 PROMOTION SKIPPED - Stay dates fall within blackout period:', {
        stayStart: stayStartDate,
        stayEnd: stayEndDate,
        blackoutStart: details.back_out_start,
        blackoutEnd: details.back_out_end
      })
      
      return {
        ...defaultResult,
        isValidForRoom: true,
        isValidForPlan: true
      }
    }
  }

  // Calculate discounted price based on offer type
  let discountedPrice = originalPrice
  let savings = 0
  let discountPercentage = 0

  if (type_of_offer === "Fixed") {
    // Fixed amount discount
    savings = promotion_discount || 0
    discountedPrice = Math.max(0, originalPrice - savings)
    discountPercentage = originalPrice > 0 ? (savings / originalPrice) * 100 : 0
  } else if (type_of_offer === "Percentage") {
    // Percentage discount
    discountPercentage = promotion_discount || 0
    savings = (originalPrice * discountPercentage) / 100
    discountedPrice = Math.max(0, originalPrice - savings)
  }

  // Get promotion name
  const promotionName = details?.name || best_promotion.type || "Special Offer"

  // Generate discount text
  let discountText = ""
  if (type_of_offer === "Fixed") {
    discountText = `₹${Math.round(promotion_discount || 0).toLocaleString()} OFF`
  } else if (type_of_offer === "Percentage") {
    discountText = `${promotion_discount}% OFF`
  }

  // Format stay period (use stay dates, not booking dates)
  let formattedBookingPeriod = null
  if (details?.stay_start && details?.stay_end) {
    const startDate = formatDate(details.stay_start)
    const endDate = formatDate(details.stay_end)
    formattedBookingPeriod = `${startDate} - ${endDate}`
  }

  const result = {
    // Pricing
    originalPrice: Math.round(originalPrice),
    discountedPrice: Math.round(discountedPrice),
    savings: Math.round(savings),
    discountPercentage: Math.round(discountPercentage * 100) / 100,

    // Promotion Details
    hasPromotion: true,
    promotionName,
    discountText,
    offerType: type_of_offer as "Fixed" | "Percentage",

    // Dates
    bookingStart: details?.booking_start || null,
    bookingEnd: details?.booking_end || null,
    stayStart: details?.stay_start || null,
    stayEnd: details?.stay_end || null,
    formattedBookingPeriod,

    // Validation
    isValidForRoom: true,
    isValidForPlan: true
  }

  console.log('🎉 PROMOTIONAL PRICING RESULT:', result)

  return result
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
 * Check if promotion is currently valid for booking
 * @param bookingStart - Booking start date
 * @param bookingEnd - Booking end date
 * @returns true if current date is within booking period
 */
export function isPromotionValidForBooking(
  bookingStart: string | null,
  bookingEnd: string | null
): boolean {
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
 * Format price with currency symbol and thousand separators
 * @param price - Price amount
 * @param currency - Currency symbol (default: "₹")
 * @returns Formatted price string (e.g., "₹ 2,400")
 */
export function formatPrice(price: number, currency: string = "₹"): string {
  return `${currency} ${Math.round(price).toLocaleString('en-IN')}`
}

/**
 * Check if stay dates fall within blackout period
 * @param stayStart - Guest's check-in date
 * @param stayEnd - Guest's check-out date  
 * @param blackoutStart - Blackout period start date
 * @param blackoutEnd - Blackout period end date
 * @returns true if stay dates overlap with blackout period
 */
export function checkBlackoutPeriod(
  stayStart: string | Date,
  stayEnd: string | Date,
  blackoutStart: string,
  blackoutEnd: string
): boolean {
  try {
    // Convert all dates to Date objects for comparison
    const stayStartDate = new Date(stayStart)
    const stayEndDate = new Date(stayEnd)
    const blackoutStartDate = new Date(blackoutStart)
    const blackoutEndDate = new Date(blackoutEnd)

    // Normalize dates to remove time component
    stayStartDate.setHours(0, 0, 0, 0)
    stayEndDate.setHours(0, 0, 0, 0)
    blackoutStartDate.setHours(0, 0, 0, 0)
    blackoutEndDate.setHours(0, 0, 0, 0)

    // Check if stay period overlaps with blackout period
    // Stay overlaps if: stay_start <= blackout_end AND stay_end >= blackout_start
    // This handles both multi-day stays and single-day checks
    const overlaps = stayStartDate <= blackoutEndDate && stayEndDate >= blackoutStartDate

    console.log('🔍 BLACKOUT PERIOD CHECK:', {
      stayPeriod: `${stayStartDate.toISOString().split('T')[0]} to ${stayEndDate.toISOString().split('T')[0]}`,
      blackoutPeriod: `${blackoutStartDate.toISOString().split('T')[0]} to ${blackoutEndDate.toISOString().split('T')[0]}`,
      overlaps
    })

    return overlaps
  } catch (error) {
    console.error('Error checking blackout period:', error)
    // If there's an error parsing dates, don't block the promotion
    return false
  }
}
