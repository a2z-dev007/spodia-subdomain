"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { useMemo, useEffect, useState } from "react"
import { calculateFinalAmount } from "@/utils/taxCalculation"
import { format } from "date-fns"
import { updateBookingFormData } from "@/lib/features/booking/bookingSlice"
import { calculateRoomPlanPromotionalPricing } from "@/utils/roomPromotionalPricing"
import { useSearchParams } from "next/navigation"
import { X, ChevronDown } from "lucide-react"
import { getBookingSummary } from "@/services/api"
import { mapBookingSummaryToPricing } from "@/utils/mapBookingSummaryToPricing"

interface PriceBreakdownModalProps {
  isOpen: boolean
  onClose: () => void
  bookingData?: any
  showBookButton?: boolean
  onBookNow?: () => void
}

const PriceBreakdownModal = ({ isOpen, onClose, bookingData, showBookButton = false, onBookNow }: PriceBreakdownModalProps) => {
  const dispatch = useAppDispatch()
  const isMobileOrTablet = useMediaQuery("(max-width: 1023px)")
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const [taxDetails, setTaxDetails] = useState<Array<{ name: string; rate: number; amount: number }>>([])
  const [showDiscounts, setShowDiscounts] = useState(false)

  const [apiSummary, setApiSummary] = useState<any>(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const bookingIdFromRedux = bookingFormData.bookingId
  const bookingIdFromUrl = searchParams.get('booking_id')
  const bookingId = bookingIdFromRedux || bookingIdFromUrl || bookingData?.bookingId

  useEffect(() => {
    if (isOpen && bookingId) {
      const cachedSummary = (bookingFormData as any).apiSummary
      if (cachedSummary) {
        setApiSummary(cachedSummary)
        setTaxDetails([
          { name: "GST", rate: 0, amount: Number(cachedSummary.total_tax) },
          { name: "Platform Fee", rate: 0, amount: Number(cachedSummary.platform_fee) }
        ])
        return
      }

      const fetchSummary = async () => {
        setApiLoading(true)
        setApiError(null)
        try {
          const response = await getBookingSummary(bookingId)
          if (response?.data?.status === "success" && response?.data?.records) {
            const records = response.data.records
            setApiSummary(records)
            setTaxDetails([
              { name: "GST", rate: 0, amount: Number(records.total_tax) },
              { name: "Platform Fee", rate: 0, amount: Number(records.platform_fee) }
            ])
            dispatch(updateBookingFormData({
              apiSummary: records,
              pricingSummary: mapBookingSummaryToPricing(records),
            }))
          } else {
            setApiError("Failed to fetch booking summary")
          }
        } catch (error: any) {
          setApiError(error.message || "Error fetching booking summary")
        } finally {
          setApiLoading(false)
        }
      }
      fetchSummary()
    }
  }, [isOpen, bookingId, dispatch, bookingFormData])

  const perDatePricingData = useMemo(() => {
    return (bookingFormData as any).perDatePricing || []
  }, [(bookingFormData as any).perDatePricing])

  const promotionDetails = useMemo(() => {
    return (bookingFormData as any).promotionDetails || []
  }, [(bookingFormData as any).promotionDetails])

  const rooms = bookingFormData.rooms || []

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

  const getMealPlanId = (planName: string): number => {
    const planMap: { [key: string]: number } = {
      'EP': 2,
      'CP': 1,
      'MAP': 4,
      'AP': 3
    }
    return planMap[planName.toUpperCase()] || 1
  }

  const getPriceForDate = (roomId: number, planId: number, dateStr: string, adults: number, planName?: string) => {
    const numericRoomId = Number(roomId)
    let numericPlanId = Number(planId)
    if (numericPlanId > 10 && planName) {
      numericPlanId = getMealPlanId(planName)
    }

    const pricing = perDatePricingData.find((p: any) =>
      Number(p.room) === numericRoomId &&
      Number(p.plan) === numericPlanId &&
      p.season_start === dateStr
    )

    if (!pricing) {
      return { rate: 0, childRate: 0, originalRate: 0, hasPromotion: false, promotionDiscount: 0 }
    }

    const sbrRate = pricing.sbr_rate || 0
    const dbrRate = pricing.dbr_rate || 0
    const extraBedRate = pricing.extra_bed_rate || 0

    let rate = 0
    if (adults === 1) {
      rate = sbrRate
    } else if (adults === 2) {
      rate = dbrRate || sbrRate
    } else {
      const baseRate = dbrRate || sbrRate
      const extraAdults = adults - 2
      rate = baseRate + (extraAdults * extraBedRate)
    }

    const childRate = pricing.child_6_10_rate || 0
    const originalRate = rate
    let hasPromotion = false
    let promotionDiscount = 0

    if (promotionDetails && promotionDetails.length > 0) {
      const promotionalPricing = calculateRoomPlanPromotionalPricing(
        rate,
        numericRoomId,
        numericPlanId,
        promotionDetails,
        dateStr,
        dateStr
      )

      if (promotionalPricing.hasPromotion) {
        const currentDate = new Date(dateStr)
        const stayStart = promotionalPricing.stayStart ? new Date(promotionalPricing.stayStart) : null
        const stayEnd = promotionalPricing.stayEnd ? new Date(promotionalPricing.stayEnd) : null

        const isWithinStayPeriod = (!stayStart || currentDate >= stayStart) &&
          (!stayEnd || currentDate <= stayEnd)

        if (isWithinStayPeriod) {
          rate = promotionalPricing.discountedPrice
          hasPromotion = true
          promotionDiscount = promotionalPricing.savings
        }
      }
    }

    return { rate, childRate, originalRate, hasPromotion, promotionDiscount }
  }

  const childrenCount = bookingFormData.children || 0
  const childInfoParam = searchParams.get('childInfo') || ''
  const childrenAges = childInfoParam 
    ? childInfoParam.split(',').map(age => parseInt(age, 10)).filter(age => !isNaN(age))
    : (bookingFormData as any).childrenAges || []

  const roomsWithTax = useMemo(() => {
    const taxationDetails = (bookingFormData as any).taxationDetails || []

    return rooms.map((room: any, roomIndex: number) => {
      let roomSubtotal = 0
      let totalRoomTax = 0
      let totalPromotionDiscount = 0
      const perDateTaxes: any[] = []

      for (let dayOffset = 0; dayOffset < nights; dayOffset++) {
        const currentDate = new Date(bookingFormData.checkInDate!)
        currentDate.setDate(currentDate.getDate() + dayOffset)
        const dateStr = format(currentDate, 'yyyy-MM-dd')

        const pricingForDate = getPriceForDate(
          room.roomId,
          room.planId || 1,
          dateStr,
          room.adults || 1,
          room.planName
        )

        const roomRateForDate = pricingForDate.rate
        const childRateForDate = pricingForDate.childRate
        const hasPromotion = pricingForDate.hasPromotion
        const promotionDiscount = pricingForDate.promotionDiscount

        const taxResult = calculateFinalAmount(roomRateForDate, taxationDetails, [])

        const roomChildPrice = room.childPrice || 0
        const childAge = roomIndex < childrenAges.length ? childrenAges[roomIndex] : 0
        const hasChildInRoom = roomIndex < childrenCount && roomChildPrice > 0 && childAge >= 6
        const childPriceForDate = hasChildInRoom ? childRateForDate : 0
        const childTaxResult = childPriceForDate > 0 ? calculateFinalAmount(childPriceForDate, taxationDetails, []) : { totalTax: 0 }

        const totalTaxForDate = taxResult.totalTax + childTaxResult.totalTax
        const totalForDate = (roomRateForDate + childPriceForDate) + totalTaxForDate

        roomSubtotal += roomRateForDate + childPriceForDate
        totalRoomTax += totalTaxForDate
        totalPromotionDiscount += promotionDiscount

        perDateTaxes.push({
          date: dateStr,
          rate: roomRateForDate,
          taxes: taxResult.taxes,
          totalTax: taxResult.totalTax,
          hasPromotion,
          promotionDiscount,
          childPrice: childPriceForDate,
          childTax: childTaxResult.totalTax,
          totalForDate
        })
      }

      const totalRoomPrice = roomSubtotal + totalRoomTax

      return {
        ...room,
        subtotal: roomSubtotal,
        totalTax: totalRoomTax,
        totalPrice: totalRoomPrice,
        perDateTaxes,
        totalPromotionDiscount
      }
    })
  }, [rooms, bookingFormData.checkInDate, nights, perDatePricingData, promotionDetails, childrenCount, childrenAges])

  const dateHeaders = useMemo(() => {
    if (!bookingFormData.checkInDate) return []
    const dates = []
    for (let dayOffset = 0; dayOffset < nights; dayOffset++) {
      const currentDate = new Date(bookingFormData.checkInDate)
      currentDate.setDate(currentDate.getDate() + dayOffset)
      dates.push({
        display: format(currentDate, "dd MMM (EEE)"),
        api: format(currentDate, "yyyy-MM-dd")
      })
    }
    return dates
  }, [bookingFormData.checkInDate, nights])

  const modalPricingSummary = (bookingFormData as any).pricingSummary || {}

  const hotelPrice = useMemo(() => {
    if (apiSummary?.rooms) {
      return apiSummary.rooms.reduce((sum: number, r: any) => sum + Number(r.original_hotel_price || 0), 0)
    }
    return modalPricingSummary.originalHotelPrice || bookingFormData.originalHotelPrice || bookingFormData.hotelPrice || 0
  }, [apiSummary, modalPricingSummary, bookingFormData])

  const subtotal = useMemo(() => {
    if (apiSummary) return Number(apiSummary.total_base_price || 0)
    return modalPricingSummary.subtotal || roomsWithTax.reduce((sum, room) => sum + (room.subtotal * (room.quantity || 1)), 0)
  }, [apiSummary, modalPricingSummary, roomsWithTax])

  const total = useMemo(() => {
    if (apiSummary) return Number(apiSummary.grand_total || 0)
    return modalPricingSummary.total || bookingFormData.finalPrice || bookingFormData.totalPrice || 0
  }, [apiSummary, modalPricingSummary, bookingFormData])

  const headerTitleContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Price Breakdown</h2>
          <p className="text-xs text-gray-500 font-medium">Transparent pricing details & night-by-night rates</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )

  const mainBodyContent = (
    <>
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {apiLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-sm font-semibold text-gray-600">Loading accurate price breakdown...</p>
          </div>
        ) : apiError ? (
          <div className="text-center py-12 text-red-500">
            <p className="text-sm font-semibold mb-2">{apiError}</p>
          </div>
        ) : rooms.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="p-3 text-left font-extrabold text-gray-700 w-1/3 min-w-[140px] sticky left-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 border-r border-gray-200">
                      Room Details
                    </th>
                    {dateHeaders.map((date: any, idx: number) => (
                      <th key={idx} className="p-3 text-center font-extrabold text-gray-700 border-r border-gray-200 last:border-r-0 min-w-[120px]">
                        {date.display}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(apiSummary?.rooms || roomsWithTax).map((roomItem: any, roomIdx: number) => {
                    const isApi = !!apiSummary
                    const roomName = isApi ? roomItem.room_name : roomItem.roomName || roomItem.room
                    const planName = isApi ? roomItem.plan_name : roomItem.planName || roomItem.plan
                    const roomQty = isApi ? roomItem.qty : roomItem.quantity || 1

                    return (
                      <tr key={roomIdx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 text-left font-medium text-gray-900 border-r border-gray-200 sticky left-0 bg-white z-10">
                          <div className="space-y-1">
                            <span className="font-bold text-gray-900 text-xs sm:text-sm block">
                              {roomQty}× {roomName}
                            </span>
                            <span className="inline-block text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-orange-50 text-orange-700 rounded border border-orange-100">
                              {planName}
                            </span>
                          </div>
                        </td>
                        {dateHeaders.map((date: any, dateIdx: number) => {
                          if (isApi) {
                            const dp = roomItem.daily_prices?.find((d: any) => d.date === date.api)
                            if (!dp) return <td key={dateIdx} className="p-3 text-center text-gray-400">--</td>

                            const baseRate = Number(dp.base_price || 0)
                            const taxAmt = Number(dp.tax_amount || 0)
                            const promoDisc = Number(dp.promotional_discount || 0)
                            const childRate = Number(dp.child_price || 0)
                            const childTaxAmt = Number(dp.child_tax_amount || 0)
                            const totalPrice = Number(dp.total_price || 0)
                            const hasChild = childRate > 0

                            return (
                              <td key={dateIdx} className="p-3 text-center border-r border-gray-200 last:border-r-0 align-top">
                                <div className="space-y-1 text-[11px]">
                                  <div className="flex justify-between items-center text-gray-600">
                                    <span>Rate:</span>
                                    <span className="font-semibold text-gray-900">₹{Math.round(baseRate)}</span>
                                  </div>
                                  {promoDisc > 0 && (
                                    <div className="flex justify-between items-center text-green-600 font-medium">
                                      <span>Promo:</span>
                                      <span>-₹{Math.round(promoDisc)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between items-center text-gray-500">
                                    <span>GST:</span>
                                    <span>₹{Math.round(taxAmt)}</span>
                                  </div>
                                  {hasChild && (
                                    <>
                                      <div className="flex justify-between items-center text-blue-700">
                                        <span>Child Rate:</span>
                                        <span className="font-semibold">₹{Math.round(childRate)}</span>
                                      </div>
                                      {childTaxAmt > 0 && (
                                        <div className="flex justify-between items-center text-blue-600">
                                          <span>Child GST:</span>
                                          <span>₹{Math.round(childTaxAmt)}</span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  <div className="flex justify-between items-center pt-1 border-t border-gray-200 font-bold text-orange-600">
                                    <span>Total:</span>
                                    <span>₹{Math.round(totalPrice)}</span>
                                  </div>
                                </div>
                              </td>
                            )
                          }

                          const perDateData = roomItem.perDateTaxes?.[dateIdx]
                          if (!perDateData) return <td key={dateIdx} className="p-3 text-center text-gray-400">--</td>

                          const { rate, taxes, hasPromotion, promotionDiscount, childPrice: childPriceForDate, childTax, totalForDate } = perDateData
                          const mainTax = taxes?.[0] || { name: 'GST', rate: 0, amount: 0 }
                          const roomChildPrice = roomItem.childPrice || 0
                          const childAge = roomIdx < childrenAges.length ? childrenAges[roomIdx] : 0
                          const hasChildInRoom = roomIdx < childrenCount && roomChildPrice > 0 && childAge >= 6

                          return (
                            <td key={dateIdx} className="p-3 text-center border-r border-gray-200 last:border-r-0 align-top">
                              <div className="space-y-1 text-[11px]">
                                <div className="flex justify-between items-center text-gray-600">
                                  <span>Rate:</span>
                                  <span className="font-semibold text-gray-900">₹{Math.round(rate)}</span>
                                </div>
                                {hasPromotion && promotionDiscount > 0 && (
                                  <div className="flex justify-between items-center text-green-600 font-medium">
                                    <span>Promo:</span>
                                    <span>-₹{Math.round(promotionDiscount)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center text-gray-500">
                                  <span>GST ({mainTax.rate}%):</span>
                                  <span>₹{Math.round(mainTax.amount)}</span>
                                </div>
                                {hasChildInRoom && childPriceForDate > 0 && (
                                  <>
                                    <div className="flex justify-between items-center text-blue-700">
                                      <span>Child Rate:</span>
                                      <span className="font-semibold">₹{Math.round(childPriceForDate)}</span>
                                    </div>
                                    {childTax > 0 && (
                                      <div className="flex justify-between items-center text-blue-600">
                                        <span>Child GST:</span>
                                        <span>₹{Math.round(childTax)}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                                <div className="flex justify-between items-center pt-1 border-t border-gray-200 font-bold text-orange-600">
                                  <span>Total:</span>
                                  <span>₹{Math.round(totalForDate)}</span>
                                </div>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow-lg">
            <p className="text-lg font-semibold mb-2">No rooms selected</p>
            <p className="text-sm">Please select rooms to view the price breakdown</p>
          </div>
        )}
      </div>

      <div className="bg-white border-t-2 border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-b-lg shrink-0">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Hotel Price</span>
            <span className="font-semibold text-gray-900">₹{Math.round(hotelPrice).toLocaleString()}</span>
          </div>

          {(() => {
            const promoDiscount = Number(modalPricingSummary.totalPromotionalDiscount || 0)
            const memberDiscount = Number(modalPricingSummary.memberOnlyDiscount || 0)
            const couponDiscount = Number(modalPricingSummary.couponDiscount || 0)
            const appliedCoupon = bookingFormData?.appliedCoupon

            const modalDiscountRows = [
              { key: "promo", label: "Hotel Promotion", amount: promoDiscount },
              { key: "member", label: "Member Discount", amount: memberDiscount },
              {
                key: "coupon",
                label: appliedCoupon
                  ? `Coupon · ${appliedCoupon.coupon_code.toUpperCase()}`
                  : "Coupon Discount",
                amount: couponDiscount,
              },
            ].filter((row) => row.amount > 0)
            const modalTotalDiscount = promoDiscount + memberDiscount + couponDiscount

            if (modalDiscountRows.length === 0) return null

            return (
              <div>
                <button
                  type="button"
                  onClick={() => setShowDiscounts((s) => !s)}
                  className="w-full flex items-center justify-between text-sm focus:outline-none"
                >
                  <span className="flex items-center gap-1 text-green-600 font-bold">
                    Total Discount
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${showDiscounts ? "rotate-180" : ""}`}
                    />
                  </span>
                  <span className="font-bold text-green-600 tabular-nums">
                    -₹{Math.round(modalTotalDiscount).toLocaleString()}
                  </span>
                </button>

                {showDiscounts && (
                  <div className="space-y-1 pl-3 pt-1.5 border-l-2 border-green-100 ml-1 mt-1">
                    {modalDiscountRows.map((row) => (
                      <div key={row.key} className="flex items-center justify-between text-[13px]">
                        <span className="text-gray-600 font-semibold">{row.label}</span>
                        <span className="font-semibold text-green-600 tabular-nums">
                          -₹{Math.round(row.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          {subtotal > 0 && (
            <div className="flex items-center justify-between text-sm pt-1.5 border-t border-gray-100">
              <span className="text-gray-700">Subtotal (All Rooms)</span>
              <span className="font-semibold text-gray-900">₹{Math.round(subtotal).toLocaleString()}</span>
            </div>
          )}

          {((modalPricingSummary.taxDetails && modalPricingSummary.taxDetails.length > 0) ? modalPricingSummary.taxDetails : taxDetails).length > 0 && (
            <div className="pt-1.5 border-t border-gray-100">
              <p className="text-[10px] text-gray-500 mb-1 italic uppercase font-bold tracking-wider">Total Taxes &amp; Charges (All Rooms)</p>
              {((modalPricingSummary.taxDetails && modalPricingSummary.taxDetails.length > 0) ? modalPricingSummary.taxDetails : taxDetails).map((taxItem, index) => (
                <div key={index} className="flex items-center justify-between text-sm mb-0.5">
                  <span className="text-gray-700">{taxItem.name}</span>
                  <span className="font-semibold text-gray-900">₹{Math.round(taxItem.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t-2 border-gray-200">
            <span className="text-lg font-black text-gray-900">Total</span>
            <span className="text-xl font-black text-orange-600">
              ₹{Math.round(total).toLocaleString()}
            </span>
          </div>

          {showBookButton && onBookNow && (
            <div className="mt-2">
              <button
                onClick={onBookNow}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )

  if (isMobileOrTablet) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="bg-gradient-to-br from-white to-gray-50 p-0 gap-0 max-h-[95vh] flex flex-col z-[1001] overflow-hidden">
          <DrawerHeader className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 m-0 shadow-sm text-left shrink-0 rounded-none">
            <DrawerTitle asChild>
              {headerTitleContent}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden flex flex-col">
            {mainBodyContent}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[80%] max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-gray-50 p-0 gap-0 rounded-3xl flex flex-col z-[1001] [&>button:last-child]:hidden">
        <DialogHeader className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 rounded-t-3xl shrink-0">
          <DialogTitle asChild>
            {headerTitleContent}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          {mainBodyContent}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PriceBreakdownModal
