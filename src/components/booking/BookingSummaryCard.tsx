"use client"

import { useState, useMemo } from "react"
import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, Gift, LogIn, PartyPopper, Tag, Star, TicketPercent } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import PriceBreakdownModal from "./PriceBreakdownModal"
import CouponSelector from "./CouponSelector"
import MemberOnlyPromotion from "./MemberOnlyPromotion"
import { mapBookingSummaryToPricing } from "@/utils/mapBookingSummaryToPricing"

const formatINR = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`

const BookingSummaryCard = ({ onRequestLogin }: { onRequestLogin?: () => void } = {}) => {
  const { user } = useAuth()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [showDiscounts, setShowDiscounts] = useState(false)

  // Prefer live booking-summary API data; fall back to cached pricingSummary only if needed
  const pricingSummary = useMemo(() => {
    if (bookingFormData.apiSummary) {
      return mapBookingSummaryToPricing(bookingFormData.apiSummary)
    }
    return (
      bookingFormData.pricingSummary || {
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
    )
  }, [bookingFormData.apiSummary, bookingFormData.pricingSummary])

  const basePrice = Number(pricingSummary.originalHotelPrice || 0)
  const promotionDiscount = Number(pricingSummary.totalPromotionalDiscount || 0)
  const memberOnlyDiscount = Number(pricingSummary.memberOnlyDiscount || 0)
  const couponDiscount = Number(pricingSummary.couponDiscount || 0)
  const totalDiscount = promotionDiscount + memberOnlyDiscount + couponDiscount
  // total_base_price from API = price after discounts (before tax/fees)
  const priceAfterDiscount = Number(pricingSummary.subtotal || 0)
  const totalTax = Number(pricingSummary.totalTax || 0)
  const platformFee = Number(pricingSummary.totalDeductions || 0)
  const grandTotal = Number(pricingSummary.total || 0)

  const isPricingLoading = !bookingFormData.apiSummary && (!bookingFormData.pricingSummary || Number(bookingFormData.pricingSummary.total || 0) === 0)
  const appliedCoupon = bookingFormData.appliedCoupon

  const roomsCount = useMemo(() => {
    const apiRooms = bookingFormData.apiSummary?.rooms
    if (Array.isArray(apiRooms) && apiRooms.length > 0) {
      return apiRooms.reduce((sum: number, r: any) => sum + Number(r.quantity || 1), 0) || 1
    }
    return bookingFormData.rooms?.reduce((sum, r) => sum + (r.quantity || 1), 0) || 1
  }, [bookingFormData.apiSummary, bookingFormData.rooms])

  const nights = useMemo(() => {
    if (bookingFormData.checkInDate && bookingFormData.checkOutDate) {
      const checkIn = new Date(bookingFormData.checkInDate)
      const checkOut = new Date(bookingFormData.checkOutDate)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays || 1
    }
    return 1
  }, [bookingFormData.checkInDate, bookingFormData.checkOutDate])

  const bookingData = {
    hotelName: bookingFormData.hotelName || "--",
    location: bookingFormData.hotelLocation || "--",
    images: bookingFormData.hotelImages && bookingFormData.hotelImages.length > 0
      ? bookingFormData.hotelImages
      : [],
    rating: (bookingFormData as any).hotelRating || 0,
    checkIn: bookingFormData.checkInDate || "",
    checkOut: bookingFormData.checkOutDate || "",
    adults: bookingFormData.adults || 0,
    children: bookingFormData.children || 0,
    nights: nights,
    hotelPrice: priceAfterDiscount,
    childPrice: 0,
    dayBooking: priceAfterDiscount,
    discount: bookingFormData.discount || 0,
    totalPayment: grandTotal,
  }

  const discountRows = [
    {
      key: "promotion",
      label: "Hotel Promotion",
      icon: <Tag className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />,
      amount: promotionDiscount,
    },
    {
      key: "member",
      label: "Member Discount",
      icon: <Star className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />,
      amount: memberOnlyDiscount,
    },
    {
      key: "coupon",
      label: appliedCoupon ? `Coupon · ${appliedCoupon.coupon_code.toUpperCase()}` : "Coupon Discount",
      icon: <TicketPercent className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />,
      amount: couponDiscount,
    },
  ].filter((row) => row.amount > 0)

  return (
    <>
      <Card className="sticky top-24 lg:top-32 border border-gray-200 bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm space-y-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-black text-gray-900">
              Price Summary
            </h3>
            <button
              type="button"
              onClick={() => setShowBreakdown(true)}
              className="text-[#078ED8] hover:text-[#0679b8] text-xs font-bold flex items-center gap-1 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#078ED8]/40 rounded px-1 py-0.5"
            >
              <span>View Full Breakup</span>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {isPricingLoading ? (
            <div className="p-6 space-y-4 animate-pulse" aria-label="Loading pricing summary">
              {/* Base price shimmer */}
              <div className="flex justify-between items-center">
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-150 rounded w-32" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>

              {/* Total discount shimmer */}
              <div className="flex justify-between items-center py-0.5">
                <div className="h-4 bg-gray-200 rounded w-28" />
                <div className="h-4 bg-emerald-200/60 rounded w-16" />
              </div>

              {/* Price after discount shimmer */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-36" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>

              {/* GST & Platform Fee shimmer */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-12" />
                <div className="h-4 bg-gray-200 rounded w-12" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-12" />
              </div>

              <div className="border-t border-gray-200 my-4" />

              {/* Total amount shimmer */}
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-28" />
                  <div className="h-3 bg-gray-150 rounded w-24" />
                </div>
                <div className="h-7 bg-gray-200 rounded w-24" />
              </div>

              {/* Savings banner shimmer */}
              <div className="h-9 bg-emerald-100/70 rounded-lg w-full" />
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Base Price = original_hotel_price */}
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-gray-700 block">Base Price</span>
                  <span className="text-[11px] text-gray-400 font-bold block mt-0.5">
                    {roomsCount} Room{roomsCount > 1 ? "s" : ""} × {nights} Night{nights > 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-sm font-extrabold text-gray-900 tabular-nums shrink-0">
                  {formatINR(basePrice)}
                </span>
              </div>

              {/* Total Discount row — expands smoothly to reveal each discount */}
              {discountRows.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowDiscounts((s) => !s)}
                    aria-expanded={showDiscounts}
                    aria-controls="discount-breakdown"
                    className="w-full flex justify-between items-center gap-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded"
                  >
                    <span className="flex items-center gap-1 text-gray-500 font-semibold">
                      Total Discount
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 motion-reduce:transition-none ${
                          showDiscounts ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="font-extrabold text-emerald-600 tabular-nums shrink-0">
                      -{formatINR(totalDiscount)}
                    </span>
                  </button>

                  <div
                    id="discount-breakdown"
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                      showDiscounts ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-2 pt-2.5 pl-3 border-l-2 border-gray-100 ml-0.5 mt-1">
                        {discountRows.map((row) => (
                          <div key={row.key} className="flex justify-between items-center gap-3">
                            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 min-w-0 truncate">
                              {row.icon}
                              {row.label}
                            </span>
                            <span className="text-[13px] font-extrabold text-emerald-600 tabular-nums shrink-0">
                              -{formatINR(row.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price after Discount = total_base_price */}
              {totalDiscount > 0 && (
                <div className="flex justify-between items-center gap-3 text-sm">
                  <span className="text-gray-500 font-semibold">Price after Discount</span>
                  <span className="font-extrabold text-gray-900 tabular-nums shrink-0">
                    {formatINR(priceAfterDiscount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center gap-3 text-sm">
                <span className="text-gray-500 font-semibold">GST</span>
                <span className="font-extrabold text-gray-900 tabular-nums shrink-0">
                  {formatINR(totalTax)}
                </span>
              </div>

              <div className="flex justify-between items-center gap-3 text-sm">
                <span className="text-gray-500 font-semibold">Platform Fee</span>
                <span className="font-extrabold text-gray-900 tabular-nums shrink-0">
                  {formatINR(platformFee)}
                </span>
              </div>

              <div className="border-t border-gray-200 my-4" />

              {/* Grand Total = grand_total */}
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <span className="text-base font-extrabold text-gray-900 block">Total Amount</span>
                  <span className="text-[11px] text-gray-400 font-bold block mt-0.5">Includes taxes &amp; fees</span>
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight tabular-nums shrink-0">
                  {formatINR(grandTotal)}
                </span>
              </div>

              {/* Savings celebration strip */}
              {totalDiscount > 0 && (
                <div
                  aria-live="polite"
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2.5"
                >
                  <PartyPopper className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
                  <p className="text-xs font-black text-white">
                    You&apos;re saving {formatINR(totalDiscount)} on this booking
                  </p>
                </div>
              )}

              {!user && (
                <button
                  type="button"
                  onClick={onRequestLogin}
                  className="flex items-center gap-2.5 bg-[#eaf6ff]/70 border border-dashed border-[#badaff] rounded-xl p-3.5 mt-2 w-full text-left hover:bg-[#eaf6ff] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#078ED8]/40"
                >
                  <div className="w-7 h-7 bg-[#badaff]/50 rounded-full flex items-center justify-center shrink-0">
                    <Gift className="w-4 h-4 text-[#078ED8]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-gray-800 leading-tight">
                      Unlock member prices &amp; coupons — log in first!
                    </p>
                    <p className="text-[10px] text-[#078ED8] font-semibold mt-0.5">
                      Tap to sign in
                    </p>
                  </div>
                  <LogIn className="w-4 h-4 text-[#078ED8] shrink-0" aria-hidden="true" />
                </button>
              )}

              <MemberOnlyPromotion />
              <CouponSelector />
            </div>
          )}
        </CardContent>
      </Card>

      <PriceBreakdownModal
        isOpen={showBreakdown}
        onClose={() => setShowBreakdown(false)}
        bookingData={bookingData}
      />
    </>
  )
}

export default BookingSummaryCard
