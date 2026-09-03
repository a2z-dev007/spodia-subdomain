import type { PricingSummary } from "@/lib/features/booking/bookingSlice"

/**
 * Maps booking-summary API `records` to Redux PricingSummary.
 * Uses API values as-is — no client-side recalculation.
 */
export function mapBookingSummaryToPricing(records: any): PricingSummary {
  if (!records) {
    return {
      subtotal: 0,
      totalTax: 0,
      totalDeductions: 0,
      total: 0,
      taxDetails: [],
      totalPromotionalDiscount: 0,
      couponDiscount: 0,
      memberOnlyDiscount: 0,
      originalHotelPrice: 0,
    }
  }

  const originalHotelPrice = Number(
    records.original_hotel_price ??
      (Array.isArray(records.rooms)
        ? records.rooms.reduce(
            (sum: number, r: any) => sum + Number(r.original_hotel_price || 0),
            0
          )
        : 0)
  )

  const totalTax = Number(records.total_tax || 0)
  const platformFee = Number(records.platform_fee || 0)

  return {
    subtotal: Number(records.total_base_price || 0),
    totalTax,
    totalDeductions: platformFee,
    total: Number(records.grand_total || 0),
    taxDetails: [
      { name: "GST", rate: 0, amount: totalTax },
      { name: "Platform Fee", rate: 0, amount: platformFee },
    ],
    totalPromotionalDiscount: Number(records.promotion_discount || 0),
    couponDiscount: Number(records.coupon_promotion || 0),
    memberOnlyDiscount: Number(records.member_only_promotion || 0),
    originalHotelPrice,
  }
}
