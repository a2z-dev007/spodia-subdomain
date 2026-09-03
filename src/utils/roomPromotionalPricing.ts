import { PromotionDetail } from "@/types/roomInventory"

export interface RoomPlanPromotionalPricing {
  originalPrice: number
  discountedPrice: number
  savings: number
  discountPercentage: number
  hasPromotion: boolean
  promotionName: string
  discountText: string
  offerType: "Fixed" | "Percentage" | null
  bookingStart: string | null
  bookingEnd: string | null
  stayStart: string | null
  stayEnd: string | null
  formattedBookingPeriod: string | null
  isValidForRoom: boolean
  isValidForPlan: boolean
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

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
  } catch {
    return true
  }
}

export function formatPrice(price: number, currency: string = "₹"): string {
  return `${currency} ${Math.round(price).toLocaleString('en-IN')}`
}

export function checkBlackoutPeriod(
  stayStart: string | Date,
  stayEnd: string | Date,
  blackoutStart: string,
  blackoutEnd: string
): boolean {
  try {
    const stayStartDate = new Date(stayStart)
    const stayEndDate = new Date(stayEnd)
    const blackoutStartDate = new Date(blackoutStart)
    const blackoutEndDate = new Date(blackoutEnd)

    stayStartDate.setHours(0, 0, 0, 0)
    stayEndDate.setHours(0, 0, 0, 0)
    blackoutStartDate.setHours(0, 0, 0, 0)
    blackoutEndDate.setHours(0, 0, 0, 0)

    return stayStartDate <= blackoutEndDate && stayEndDate >= blackoutStartDate
  } catch {
    return false
  }
}

export function calculateRoomPlanPromotionalPricing(
  originalPrice: number,
  roomId: number,
  planId: number,
  promotionDetails: PromotionDetail[] | undefined,
  stayStartDate?: string | Date | null,
  stayEndDate?: string | Date | null
): RoomPlanPromotionalPricing {
  const defaultResult: RoomPlanPromotionalPricing = {
    originalPrice: Math.round(originalPrice),
    discountedPrice: Math.round(originalPrice),
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

  if (!promotionDetails || promotionDetails.length === 0 || originalPrice <= 0) {
    return defaultResult
  }

  const promotion = promotionDetails[0]

  if (!promotion.has_promotion || !promotion.best_promotion) {
    return defaultResult
  }

  const { best_promotion, type_of_offer, promotion_discount } = promotion
  const { details } = best_promotion

  let isValidForRoom = false
  let isValidForPlan = false

  if (details?.promotion_rooms) {
    for (const promotionRoom of details.promotion_rooms) {
      if (promotionRoom.rooms === roomId) {
        isValidForRoom = true
        if (promotionRoom.plans && promotionRoom.plans.includes(planId)) {
          isValidForPlan = true
          break
        }
      }
    }
  }

  if (!isValidForRoom || !isValidForPlan) {
    return {
      ...defaultResult,
      isValidForRoom,
      isValidForPlan
    }
  }

  if (details?.back_out_start && details?.back_out_end && stayStartDate && stayEndDate) {
    const isInBlackoutPeriod = checkBlackoutPeriod(
      stayStartDate,
      stayEndDate,
      details.back_out_start,
      details.back_out_end
    )

    if (isInBlackoutPeriod) {
      return {
        ...defaultResult,
        isValidForRoom: true,
        isValidForPlan: true
      }
    }
  }

  let discountedPrice = originalPrice
  let savings = 0
  let discountPercentage = 0

  if (type_of_offer === "Fixed") {
    savings = promotion_discount || 0
    discountedPrice = Math.max(0, originalPrice - savings)
    discountPercentage = originalPrice > 0 ? (savings / originalPrice) * 100 : 0
  } else if (type_of_offer === "Percentage") {
    discountPercentage = promotion_discount || 0
    savings = (originalPrice * discountPercentage) / 100
    discountedPrice = Math.max(0, originalPrice - savings)
  }

  const promotionName = details?.name || best_promotion.type || "Special Offer"

  let discountText = ""
  if (type_of_offer === "Fixed") {
    discountText = `₹${Math.round(promotion_discount || 0).toLocaleString()} OFF`
  } else if (type_of_offer === "Percentage") {
    discountText = `${promotion_discount}% OFF`
  }

  let formattedBookingPeriod = null
  if (details?.stay_start && details?.stay_end) {
    const startDate = formatDate(details.stay_start)
    const endDate = formatDate(details.stay_end)
    formattedBookingPeriod = `${startDate} - ${endDate}`
  }

  return {
    originalPrice: Math.round(originalPrice),
    discountedPrice: Math.round(discountedPrice),
    savings: Math.round(savings),
    discountPercentage: Math.round(discountPercentage * 100) / 100,
    hasPromotion: true,
    promotionName,
    discountText,
    offerType: type_of_offer as "Fixed" | "Percentage",
    bookingStart: details?.booking_start || null,
    bookingEnd: details?.booking_end || null,
    stayStart: details?.stay_start || null,
    stayEnd: details?.stay_end || null,
    formattedBookingPeriod,
    isValidForRoom: true,
    isValidForPlan: true
  }
}
