"use client"

import { useState, useEffect, useMemo } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData } from "@/lib/features/booking/bookingSlice"
import { getHotelOfferPromotions, applyBookingCoupon, getBookingSummary } from "@/services/api"
import { mapBookingSummaryToPricing } from "@/utils/mapBookingSummaryToPricing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BadgePercent, CheckCircle2, Loader2, AlertCircle, X,
  ChevronDown, ChevronUp, Sparkles, TicketPercent,
} from "lucide-react"
import { toast } from "sonner"

interface Coupon {
  id: number
  name: string
  coupon_code: string
  type_of_offer: "Percentage" | "Fixed"
  rate_or_percentage: number
  minimum_order_value: number
  expiry_date: string
  booking_start: string
  booking_end: string
  stay_start: string
  stay_end: string
  promotion_rooms: Array<{
    rooms: number
    room_name: string
    plans: number[]
  }>
}

const VISIBLE_COUPONS = 3

const CouponSelector = () => {
  const dispatch = useAppDispatch()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const accessToken = useAppSelector((state) => state?.auth?.accessToken ?? null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [busyAction, setBusyAction] = useState<number | "manual" | "remove" | null>(null)
  const [typedCode, setTypedCode] = useState("")
  const [inputError, setInputError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const appliedCoupon = bookingFormData.appliedCoupon
  const pricingSummary = useMemo(() => {
    if (bookingFormData.apiSummary) {
      return mapBookingSummaryToPricing(bookingFormData.apiSummary)
    }
    return bookingFormData.pricingSummary
  }, [bookingFormData.apiSummary, bookingFormData.pricingSummary])
  const bookingId = bookingFormData.bookingId
  const isBusy = busyAction !== null

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!accessToken || !bookingFormData.hotelId) {
        setCoupons([])
        return
      }

      setIsLoading(true)
      try {
        const response = await getHotelOfferPromotions(bookingFormData.hotelId)
        const data = response.data

        if (data.status === "success" && data.records) {
          setCoupons(data.records)
        } else {
          setCoupons([])
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error)
        setCoupons([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCoupons()
  }, [bookingFormData.hotelId, accessToken])

  useEffect(() => {
    if (appliedCoupon || coupons.length === 0) return

    const apiSummary = (bookingFormData as any).apiSummary
    const couponId = apiSummary?.coupon_id
    if (!couponId) return

    const matchedCoupon = coupons.find((c) => Number(c.id) === Number(couponId))
    if (!matchedCoupon) return

    dispatch(
      updateBookingFormData({
        appliedCoupon: {
          id: matchedCoupon.id,
          name: matchedCoupon.name,
          coupon_code: matchedCoupon.coupon_code.toUpperCase(),
          type_of_offer: matchedCoupon.type_of_offer,
          rate_or_percentage: matchedCoupon.rate_or_percentage,
          minimum_order_value: matchedCoupon.minimum_order_value,
          discount_amount: Number(apiSummary.coupon_promotion || 0),
        },
      })
    )
  }, [coupons, appliedCoupon, bookingFormData, dispatch])

  const couponBasePrice = useMemo(() => {
    const original = Number(pricingSummary?.originalHotelPrice || 0)
    const promo = Number(pricingSummary?.totalPromotionalDiscount || 0)
    const member = Number(pricingSummary?.memberOnlyDiscount || 0)

    if (original > 0) {
      return Math.max(0, original - promo - member)
    }

    const subtotal = Number(pricingSummary?.subtotal || 0)
    const couponDisc = Number(pricingSummary?.couponDiscount || 0)
    return Math.max(0, subtotal + (appliedCoupon ? couponDisc : 0))
  }, [pricingSummary, appliedCoupon])

  const validateCoupon = (coupon: Coupon): { isValid: boolean; message: string } => {
    const orderValue =
      couponBasePrice ||
      Number(pricingSummary?.originalHotelPrice || 0) ||
      Number(pricingSummary?.subtotal || 0)
    const selectedRooms = bookingFormData.rooms || []

    if (orderValue < coupon.minimum_order_value) {
      return {
        isValid: false,
        message: `Add ₹${Math.ceil(coupon.minimum_order_value - orderValue).toLocaleString()} more to unlock this offer`,
      }
    }

    const today = new Date().toISOString().split("T")[0]
    if (today > coupon.expiry_date) {
      return {
        isValid: false,
        message: "This coupon has expired",
      }
    }

    const couponRoomIds = coupon.promotion_rooms.map((pr) => pr.rooms)
    const hasMatchingRoom = selectedRooms.some((room: any) => {
      const roomMatches = couponRoomIds.includes(room.roomId)
      if (!roomMatches) return false

      const promotionRoom = coupon.promotion_rooms.find((pr) => pr.rooms === room.roomId)
      if (promotionRoom && room.planId) {
        return promotionRoom.plans.includes(room.planId)
      }
      return true
    })

    if (!hasMatchingRoom) {
      return {
        isValid: false,
        message: "Not applicable to your selected rooms or plans",
      }
    }

    return { isValid: true, message: "Coupon applied successfully!" }
  }

  const calculateDiscount = (coupon: Coupon): number => {
    const base = couponBasePrice

    if (coupon.type_of_offer === "Percentage") {
      return (base * coupon.rate_or_percentage) / 100
    }
    return Math.min(coupon.rate_or_percentage, base)
  }

  const sortedCoupons = useMemo(() => {
    const withMeta = coupons.map((coupon) => ({
      coupon,
      validation: validateCoupon(coupon),
      discount: calculateDiscount(coupon),
    }))
    return withMeta.sort((a, b) => {
      if (a.validation.isValid !== b.validation.isValid) {
        return a.validation.isValid ? -1 : 1
      }
      return b.discount - a.discount
    })
  }, [coupons, pricingSummary, bookingFormData.rooms, couponBasePrice])

  const bestCouponId = sortedCoupons.find((c) => c.validation.isValid)?.coupon.id ?? null
  const visibleCoupons = showAll ? sortedCoupons : sortedCoupons.slice(0, VISIBLE_COUPONS)
  const hiddenCount = sortedCoupons.length - VISIBLE_COUPONS

  const refreshBookingSummary = async () => {
    if (!bookingId) return null
    const summaryResponse = await getBookingSummary(bookingId)
    return summaryResponse.data?.records || null
  }

  const applyCoupon = async (coupon: Coupon, source: number | "manual" = coupon.id) => {
    const validation = validateCoupon(coupon)

    if (!validation.isValid) {
      if (source === "manual") {
        setInputError(validation.message)
      } else {
        toast.error(validation.message)
      }
      return
    }

    if (!bookingId) {
      toast.error("Booking not found. Please refresh and try again.")
      return
    }

    if (isBusy) return

    setBusyAction(source)
    setInputError(null)
    try {
      await applyBookingCoupon(bookingId, coupon.id)
      const summaryRecords = await refreshBookingSummary()

      if (!summaryRecords) {
        toast.error("Coupon applied, but failed to refresh pricing.")
        return
      }

      const pricing = mapBookingSummaryToPricing(summaryRecords)
      const couponDiscount = Number(pricing.couponDiscount || 0)
      const couponCodeDisplay = String(coupon.coupon_code || "").toUpperCase()

      dispatch(
        updateBookingFormData({
          appliedCoupon: {
            id: coupon.id,
            name: coupon.name,
            coupon_code: couponCodeDisplay,
            type_of_offer: coupon.type_of_offer,
            rate_or_percentage: coupon.rate_or_percentage,
            minimum_order_value: coupon.minimum_order_value,
            discount_amount: couponDiscount,
          },
          pricingSummary: pricing,
          apiSummary: summaryRecords,
        })
      )

      setTypedCode("")
      toast.success(
        <span>
          <span className="uppercase tracking-wide">{couponCodeDisplay}</span>
          {" applied"}
        </span>,
        {
          description:
            couponDiscount > 0
              ? `You saved ₹${Math.round(couponDiscount).toLocaleString()} on this booking`
              : undefined,
        }
      )
    } catch (error: any) {
      console.error("Failed to apply coupon:", error)
      const message = error?.response?.data?.message || error?.message || "Failed to apply coupon. Please try again."
      if (source === "manual") {
        setInputError(message)
      } else {
        toast.error(message)
      }
    } finally {
      setBusyAction(null)
    }
  }

  const removeCoupon = async () => {
    if (!appliedCoupon) return

    if (!bookingId) {
      toast.error("Booking not found. Please refresh and try again.")
      return
    }

    if (isBusy) return

    setBusyAction("remove")
    try {
      await applyBookingCoupon(bookingId, null)
      const summaryRecords = await refreshBookingSummary()

      if (!summaryRecords) {
        toast.error("Coupon removed, but failed to refresh pricing.")
        return
      }

      dispatch(
        updateBookingFormData({
          appliedCoupon: null,
          pricingSummary: mapBookingSummaryToPricing(summaryRecords),
          apiSummary: summaryRecords,
        })
      )
      setTypedCode("")
      setInputError(null)
      toast.info("Coupon removed.")
    } catch (error: any) {
      console.error("Failed to remove coupon:", error)
      toast.error(error?.response?.data?.message || error?.message || "Failed to remove coupon.")
    } finally {
      setBusyAction(null)
    }
  }

  const handleManualApply = () => {
    const codeToSearch = typedCode.trim().toUpperCase()
    if (!codeToSearch) {
      setInputError("Enter a coupon code to apply")
      return
    }

    const matchedCoupon = coupons.find((c) => c.coupon_code.toUpperCase() === codeToSearch)
    if (!matchedCoupon) {
      setInputError("This code isn't valid for this hotel")
      return
    }

    if (appliedCoupon?.id === matchedCoupon.id) {
      setInputError("This coupon is already applied")
      return
    }

    applyCoupon(matchedCoupon, "manual")
  }

  if (!accessToken) return null

  return (
    <section
      aria-label="Coupons and offers"
      className="border border-gray-150 mt-4 rounded-xl p-5 bg-white space-y-4 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <BadgePercent className="w-4 h-4 text-[#078ED8]" aria-hidden="true" />
        <h4 className="font-extrabold text-gray-900 text-sm tracking-wide uppercase">
          Coupons &amp; Offers
        </h4>
      </div>

      {appliedCoupon ? (
        <div
          aria-live="polite"
          className="p-3 rounded-xl border border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50/60 space-y-1.5"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span className="text-sm font-black text-emerald-900 uppercase tracking-tight break-all">
                {appliedCoupon.coupon_code.toUpperCase()}
              </span>
            </p>
            <button
              type="button"
              onClick={removeCoupon}
              disabled={isBusy}
              className="shrink-0 ml-auto flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg px-2 py-1 transition-colors disabled:opacity-50"
            >
              {busyAction === "remove" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              Remove
            </button>
          </div>
          <p className="text-[11px] font-bold text-emerald-700 leading-snug">
            {Number(appliedCoupon.discount_amount) > 0
              ? `Coupon applied — you saved ₹${Math.round(Number(appliedCoupon.discount_amount)).toLocaleString()}`
              : "Coupon applied to this booking"}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="coupon-code-input"
                name="coupon-code"
                value={typedCode}
                onChange={(e) => {
                  setTypedCode(e.target.value.toUpperCase())
                  if (inputError) setInputError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleManualApply()
                  }
                }}
                placeholder="Enter coupon code…"
                disabled={isBusy}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={!!inputError}
                className={`h-11 font-extrabold uppercase tracking-wide placeholder:normal-case placeholder:font-semibold ${
                  inputError
                    ? "border-red-300 focus-visible:ring-red-300"
                    : "border-gray-200 focus:border-[#078ED8]"
                }`}
              />
            </div>
            <Button
              onClick={handleManualApply}
              disabled={isBusy || !typedCode.trim()}
              className="h-11 px-6 bg-[#078ED8] hover:bg-[#0679b8] text-white font-bold disabled:opacity-50"
            >
              {busyAction === "manual" ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
          {inputError && (
            <p
              role="alert"
              className="flex items-center gap-1 text-[11px] font-bold text-red-500"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {inputError}
            </p>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-3.5 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedCoupons.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 py-4 text-center">
          <TicketPercent className="w-6 h-6 text-gray-300" aria-hidden="true" />
          <p className="text-xs text-gray-400 font-semibold">
            No coupons available for this hotel right now
          </p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Available coupons">
          {visibleCoupons.map(({ coupon, validation, discount }) => {
            const isApplied = appliedCoupon?.id === coupon.id
            const isBest = coupon.id === bestCouponId && !appliedCoupon
            const isThisBusy = busyAction === coupon.id
            const displayDiscount = isApplied
              ? Number(appliedCoupon?.discount_amount) || discount
              : discount

            return (
              <li key={coupon.id}>
                <div
                  className={`relative border rounded-xl p-3.5 transition-colors ${
                    isApplied
                      ? "bg-emerald-50/50 border-emerald-400"
                      : !validation.isValid
                        ? "border-gray-100 bg-gray-50/50"
                        : isBest
                          ? "border-[#078ED8]/40 bg-blue-50/30"
                          : "border-gray-150 bg-white hover:border-[#078ED8]/40"
                  }`}
                >
                  {isBest && validation.isValid && (
                    <span className="absolute -top-2 left-3 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-white bg-[#078ED8] px-2 py-0.5 rounded-full shadow-sm">
                      <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
                      Best Offer
                    </span>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`flex-1 min-w-0 ${!validation.isValid ? "opacity-60" : ""}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-black uppercase tracking-tight border border-dashed rounded px-1.5 py-0.5 ${
                            isApplied
                              ? "text-emerald-800 border-emerald-300 bg-emerald-50"
                              : "text-gray-900 border-gray-300 bg-gray-50"
                          }`}
                        >
                          {coupon.coupon_code.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-black text-[#078ED8] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {coupon.type_of_offer === "Percentage"
                            ? `${coupon.rate_or_percentage}% off`
                            : `₹${coupon.rate_or_percentage.toLocaleString()} off`}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-500 font-semibold mt-1.5 leading-relaxed line-clamp-2">
                        {coupon.name}
                      </p>

                      {validation.isValid ? (
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
                          Min. order ₹{coupon.minimum_order_value.toLocaleString()}
                        </p>
                      ) : (
                        <p className="flex items-center gap-1 mt-1.5 text-[10px] text-amber-600 font-bold">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          {validation.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className={`text-sm font-black tabular-nums ${
                          isApplied ? "text-emerald-600" : validation.isValid ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        -₹{Math.round(displayDiscount).toLocaleString()}
                      </span>

                      {isApplied ? (
                        <button
                          type="button"
                          onClick={removeCoupon}
                          disabled={isBusy}
                          className="text-[11px] font-bold text-red-500 hover:text-red-600 hover:underline"
                        >
                          {busyAction === "remove" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            "Remove"
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => applyCoupon(coupon)}
                          disabled={isBusy || !validation.isValid}
                          className="text-[11px] font-black uppercase tracking-wide text-[#078ED8] hover:text-[#0679b8] hover:underline disabled:opacity-40 disabled:no-underline"
                        >
                          {isThisBusy ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            "Apply"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}

          {hiddenCount > 0 && (
            <li>
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                className="w-full flex items-center justify-center gap-1 text-[11px] font-bold text-[#078ED8] hover:text-[#0679b8] py-1.5"
              >
                {showAll ? (
                  <>
                    Show Less
                    <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    View {hiddenCount} More Offer{hiddenCount > 1 ? "s" : ""}
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </>
                )}
              </button>
            </li>
          )}
        </ul>
      )}
    </section>
  )
}

export default CouponSelector
