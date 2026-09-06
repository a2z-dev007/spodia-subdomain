"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { useMemo, useEffect, useState, useRef } from "react"
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
  const poppedRef = useRef(false)

  const [apiSummary, setApiSummary] = useState<any>(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const bookingIdFromRedux = bookingFormData.bookingId
  const bookingIdFromUrl = searchParams.get('booking_id')
  const bookingId = bookingIdFromRedux || bookingIdFromUrl || bookingData?.bookingId

  useEffect(() => {
    if (isOpen && bookingId) {
      // Use cached booking summary from Redux if present
      const cachedSummary = (bookingFormData as any).apiSummary
      if (cachedSummary) {
        console.log("Using cached booking summary from Redux:", cachedSummary)
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
          console.log("Fetching booking summary from API for booking ID:", bookingId)
          const response = await getBookingSummary(bookingId)
          if (response?.data?.status === "success" && response?.data?.records) {
            const records = response.data.records
            console.log("Fetched booking summary successfully:", records)
            setApiSummary(records)

            // Set taxDetails state directly from API summary records
            setTaxDetails([
              { name: "GST", rate: 0, amount: Number(records.total_tax) },
              { name: "Platform Fee", rate: 0, amount: Number(records.platform_fee) }
            ])

            // Sync this back to Redux so the rest of the application (sidebar, etc.)
            // uses the exact same API summary values!
            dispatch(updateBookingFormData({
              apiSummary: records, // Cache in Redux
              pricingSummary: mapBookingSummaryToPricing(records),
            }))
          } else {
            setApiError("Failed to fetch booking summary")
          }
        } catch (error: any) {
          console.error("Error fetching booking summary:", error)
          setApiError(error.message || "Error fetching booking summary")
        } finally {
          setApiLoading(false)
        }
      }
      fetchSummary()
    }
  }, [isOpen, bookingId, dispatch])

  // Get per-date pricing directly from Redux - NO API CALL
  const perDatePricingData = useMemo(() => {
    const pricing = (bookingFormData as any).perDatePricing || []
    return pricing
  }, [(bookingFormData as any).perDatePricing])

  // Get promotion details from Redux
  const promotionDetails = useMemo(() => {
    return (bookingFormData as any).promotionDetails || []
  }, [(bookingFormData as any).promotionDetails])

  // Get rooms from Redux state
  const rooms = bookingFormData.rooms || []

  // Calculate nights
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

  // Helper function to map plan name to meal plan ID
  const getMealPlanId = (planName: string): number => {
    const planMap: { [key: string]: number } = {
      'EP': 2,  // European Plan (Room Only)
      'CP': 1,  // Continental Plan (Room + Breakfast)
      'MAP': 4, // Modified American Plan (Room + Breakfast + Dinner)
      'AP': 3   // American Plan (Room + All Meals)
    }
    return planMap[planName.toUpperCase()] || 1 // Default to CP if not found
  }

  // Helper function to get price for a specific room, plan, and date
  const getPriceForDate = (roomId: number, planId: number, dateStr: string, adults: number, planName?: string) => {
    // Convert to numbers
    const numericRoomId = Number(roomId)

    // If planId is large (like 1482), it's a rate plan ID, not a meal plan ID
    // Use planName to get the correct meal plan ID
    let numericPlanId = Number(planId)
    if (numericPlanId > 10 && planName) {
      numericPlanId = getMealPlanId(planName)
    }

    // Find matching pricing entry
    const pricing = perDatePricingData.find((p: any) =>
      Number(p.room) === numericRoomId &&
      Number(p.plan) === numericPlanId &&
      p.season_start === dateStr
    )

    if (!pricing) {
      return { rate: 0, childRate: 0, originalRate: 0, hasPromotion: false, promotionDiscount: 0 }
    }

    // Calculate base rate based on adults
    const sbrRate = pricing.sbr_rate || 0
    const dbrRate = pricing.dbr_rate || 0
    const extraBedRate = pricing.extra_bed_rate || 0

    // Calculate rate for the specific number of adults
    let rate = 0
    if (adults === 1) {
      rate = sbrRate
    } else if (adults === 2) {
      rate = dbrRate || sbrRate
    } else {
      // For 3+ adults, use DBR rate as base and add extra bed rate per additional adult
      const baseRate = dbrRate || sbrRate
      const extraAdults = adults - 2
      rate = baseRate + (extraAdults * extraBedRate)
    }

    const childRate = pricing.child_6_10_rate || 0
    // Original rate should be the calculated rate for the specific adult count BEFORE promotion
    const originalRate = rate

    // Apply promotional pricing if available
    let hasPromotion = false
    let promotionDiscount = 0

    if (promotionDetails && promotionDetails.length > 0) {
      // Pass the current date as both stayStart and stayEnd to check if THIS specific date
      // falls within the blackout period
      const promotionalPricing = calculateRoomPlanPromotionalPricing(
        rate,
        numericRoomId,
        numericPlanId,
        promotionDetails,
        dateStr, // Pass current date as stay start
        dateStr  // Pass current date as stay end (single day check)
      )

      if (promotionalPricing.hasPromotion) {
        // Check if the current date is within the promotion STAY period (not booking period)
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

  // Get children count and ages from URL
  const childrenCount = bookingFormData.children || 0

  // Parse children ages from URL parameter 'childInfo' (comma-separated ages)
  const childInfoParam = searchParams.get('childInfo') || ''
  const childrenAges = childInfoParam
    ? childInfoParam.split(',').map(age => parseInt(age, 10)).filter(age => !isNaN(age))
    : (bookingFormData as any).childrenAges || []

  // Calculate TAXES per room per date but DEDUCTIONS on total
  const roomsWithTax = useMemo(() => {
    const taxationDetails = (bookingFormData as any).taxationDetails || []

    return rooms.map((room: any) => {
      // Calculate per-date pricing for this room
      let roomSubtotal = 0
      let totalRoomTax = 0
      let totalPromotionDiscount = 0
      const perDateTaxes: any[] = []

      // Loop through each night to calculate pricing
      for (let dayOffset = 0; dayOffset < nights; dayOffset++) {
        const currentDate = new Date(bookingFormData.checkInDate!)
        currentDate.setDate(currentDate.getDate() + dayOffset)
        const dateStr = format(currentDate, 'yyyy-MM-dd')

        // Get pricing for this specific date (default planId to 1 if not provided)
        const pricingForDate = getPriceForDate(
          room.roomId,
          room.planId || 1,
          dateStr,
          room.adults || 1,
          room.planName // Pass plan name for conversion
        )

        const roomRateForDate = pricingForDate.rate
        const childRateForDate = pricingForDate.childRate
        const originalRateForDate = pricingForDate.originalRate
        const hasPromotion = pricingForDate.hasPromotion
        const promotionDiscount = pricingForDate.promotionDiscount

        // Calculate tax for this specific date's rate using slab-based taxation
        const taxResult = calculateFinalAmount(roomRateForDate, taxationDetails, [])

        // Calculate child pricing and tax for this date - CHECK CHILD AGE
        const roomIndex = rooms.indexOf(room)
        const roomChildPrice = room.childPrice || 0
        // Only charge if: 1) room has a child assigned, 2) child price exists, 3) child is 6+ years old
        const childAge = roomIndex < childrenAges.length ? childrenAges[roomIndex] : 0
        const hasChildInRoom = roomIndex < childrenCount && roomChildPrice > 0 && childAge >= 6
        const childPriceForDate = hasChildInRoom ? childRateForDate : 0
        const childTaxResult = childPriceForDate > 0 ? calculateFinalAmount(childPriceForDate, taxationDetails, []) : { totalTax: 0 }

        // Add room rate, child rate, room tax, and child tax to subtotal
        roomSubtotal += (roomRateForDate + childPriceForDate) * room.quantity
        totalRoomTax += (taxResult.totalTax + childTaxResult.totalTax) * room.quantity
        totalPromotionDiscount += promotionDiscount * room.quantity

        perDateTaxes.push({
          date: dateStr,
          rate: roomRateForDate,
          originalRate: originalRateForDate,
          hasPromotion,
          promotionDiscount,
          tax: taxResult.totalTax,
          childTax: childTaxResult.totalTax, // Add child tax to per-date tracking
          taxRate: taxResult.taxes[0]?.rate || 0,
          taxCategory: taxationDetails[0]?.tax_entries?.find(
            (entry: any) => roomRateForDate >= entry.amount_from && roomRateForDate <= entry.amount_to
          )?.tax_category || 'percentage'
        })
      }



      // Aggregate taxes for this room (sum across all dates)
      const aggregatedTaxes: { [key: string]: { name: string; rate: number; amount: number; type?: string } } = {}

      perDateTaxes.forEach(dayTax => {
        const taxName = 'GST' // Assuming GST for now
        const totalDayTax = dayTax.tax + (dayTax.childTax || 0) // Include both room tax and child tax
        if (aggregatedTaxes[taxName]) {
          aggregatedTaxes[taxName].amount += totalDayTax * room.quantity
        } else {
          aggregatedTaxes[taxName] = {
            name: taxName,
            rate: dayTax.taxRate,
            amount: totalDayTax * room.quantity,
            type: dayTax.taxCategory
          }
        }
      })

      return {
        ...room,
        roomSubtotal,
        totalTax: totalRoomTax,
        totalPromotionDiscount,
        taxes: Object.values(aggregatedTaxes), // Add taxes array
        perDateTaxes,
        roomTotal: roomSubtotal + totalRoomTax
      }
    })
  }, [rooms, nights, bookingFormData, perDatePricingData, promotionDetails, childrenCount, childrenAges])

  // Calculate total tax amount across all rooms
  const totalTaxAmount = useMemo(() =>
    roomsWithTax.reduce((sum, room) => sum + room.totalTax, 0),
    [roomsWithTax]
  )

  // Calculate total promotional discount across all rooms
  const totalPromotionalDiscount = useMemo(() => {
    if (apiSummary) {
      return Number(apiSummary.promotion_discount || 0)
    }
    return roomsWithTax.reduce((sum, room) => sum + (room.totalPromotionDiscount || 0), 0)
  }, [roomsWithTax, apiSummary])

  // Calculate total subtotal for all rooms
  const totalRoomSubtotal = useMemo(() =>
    roomsWithTax.reduce((sum, room) => sum + room.roomSubtotal, 0),
    [roomsWithTax]
  )

  // Calculate deductions on TOTAL subtotal (not per room)
  const totalDeductionsResult = useMemo(() => {
    const deductionDetails = (bookingFormData as any).deductionDetails || []
    return calculateFinalAmount(totalRoomSubtotal, [], deductionDetails)
  }, [totalRoomSubtotal, bookingFormData])

  const totalDeductionAmount = useMemo(() =>
    totalDeductionsResult.totalDeductions,
    [totalDeductionsResult]
  )

  // Combine taxes (aggregated from rooms) and deductions (calculated on total)
  const aggregatedTaxDetails = useMemo(() => {
    const combinedTaxes: { [key: string]: { name: string; rate: number; amount: number; type?: string } } = {}

    // Add taxes from all rooms
    roomsWithTax.forEach(room => {
      // Safety check: ensure room.taxes exists and is an array
      if (room.taxes && Array.isArray(room.taxes)) {
        room.taxes.forEach((tax: any) => {
          if (combinedTaxes[tax.name]) {
            combinedTaxes[tax.name].amount += tax.amount
          } else {
            combinedTaxes[tax.name] = { ...tax }
          }
        })
      }
    })

    // Add deductions calculated on total
    if (totalDeductionsResult.deductions && Array.isArray(totalDeductionsResult.deductions)) {
      totalDeductionsResult.deductions.forEach((deduction: any) => {
        combinedTaxes[deduction.name] = deduction
      })
    }
    return Object.values(combinedTaxes)
  }, [roomsWithTax])

  // Get dates for column headers with both display and API formats
  const dateHeaders = useMemo(() => {
    // 1. Try to get dates from Redux bookingFormData
    if (bookingFormData.checkInDate && bookingFormData.checkOutDate) {
      const checkIn = new Date(bookingFormData.checkInDate)
      const dates = []

      for (let i = 0; i < nights; i++) {
        const date = new Date(checkIn)
        date.setDate(date.getDate() + i)
        dates.push({
          display: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
          api: format(date, 'yyyy-MM-dd')
        })
      }
      return dates
    }

    // 2. Fallback: get dates from apiSummary (backend response) if Redux is empty
    if (apiSummary?.rooms && apiSummary.rooms.length > 0) {
      const firstRoom = apiSummary.rooms[0]
      if (firstRoom.daily_prices && firstRoom.daily_prices.length > 0) {
        return firstRoom.daily_prices.map((dp: any) => {
          const date = new Date(dp.date)
          return {
            display: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
            api: dp.date
          }
        })
      }
    }

    return []
  }, [bookingFormData.checkInDate, bookingFormData.checkOutDate, nights, apiSummary])

  // Use actual pricing from Redux with separate hotel and child pricing
  // const discount = bookingFormData.discount || 0 // COMMENTED: Not using fake discounts
  // const originalHotelPrice = (bookingFormData as any).originalHotelPrice || 0 // COMMENTED: Not using fake original prices
  // const discountPercentage = (bookingFormData as any).discountPercentage || 0 // COMMENTED

  // Derived pricing summary from API records (or Redux state), matching sidebar exactly
  const modalPricingSummary = useMemo(() => {
    if (apiSummary) {
      return mapBookingSummaryToPricing(apiSummary)
    }
    if (bookingFormData.pricingSummary) {
      return bookingFormData.pricingSummary
    }
    return {
      subtotal: totalRoomSubtotal,
      totalTax: totalTaxAmount,
      totalDeductions: totalDeductionAmount,
      total: Math.round(totalRoomSubtotal + totalTaxAmount + totalDeductionAmount),
      taxDetails: aggregatedTaxDetails,
      totalPromotionalDiscount: totalPromotionalDiscount,
      couponDiscount: Number(bookingFormData?.appliedCoupon?.discount_amount || 0),
      memberOnlyDiscount: Number(bookingFormData?.memberOnlyPromotion?.discount_amount || 0),
      originalHotelPrice: totalRoomSubtotal + totalPromotionalDiscount,
    }
  }, [apiSummary, bookingFormData.pricingSummary, bookingFormData.appliedCoupon, bookingFormData.memberOnlyPromotion, totalRoomSubtotal, totalTaxAmount, totalDeductionAmount, aggregatedTaxDetails, totalPromotionalDiscount])

  const originalHotelPrice = Number(modalPricingSummary.originalHotelPrice || 0)
  const subtotal = Number(modalPricingSummary.subtotal || 0)
  const hotelPrice = originalHotelPrice > 0 ? originalHotelPrice : (subtotal + Number(modalPricingSummary.totalPromotionalDiscount || 0) + Number(modalPricingSummary.memberOnlyDiscount || 0) + Number(modalPricingSummary.couponDiscount || 0))
  const total = Number(modalPricingSummary.total || 0)

  // Track if we've already dispatched to prevent infinite loops
  const lastDispatchedTotal = useRef<number | null>(null)
  const lastDispatchedTaxDetails = useRef<string | null>(null)

  // Update state with aggregated tax details and store in Redux
  useEffect(() => {
    if (apiSummary) return; // Skip updating from client calculations if we have API summary

    const calculatedTotal = Math.round(totalRoomSubtotal + totalTaxAmount + totalDeductionAmount)
    const taxDetailsString = JSON.stringify(aggregatedTaxDetails)

    // Only update if the total or tax details have changed (to prevent infinite loops)
    if (lastDispatchedTotal.current !== calculatedTotal || lastDispatchedTaxDetails.current !== taxDetailsString) {
      lastDispatchedTotal.current = calculatedTotal
      lastDispatchedTaxDetails.current = taxDetailsString

      setTaxDetails(aggregatedTaxDetails)

      // Store pricing summary in Redux for sidebar to use
      dispatch(updateBookingFormData({
        pricingSummary: {
          subtotal: totalRoomSubtotal,
          totalTax: totalTaxAmount,
          totalDeductions: totalDeductionAmount,
          total: calculatedTotal, // Already rounded
          taxDetails: aggregatedTaxDetails,
          totalPromotionalDiscount: totalPromotionalDiscount // Add promotional discount
        }
      }))
    }
  }, [aggregatedTaxDetails, totalTaxAmount, totalDeductionAmount, totalRoomSubtotal, dispatch, apiSummary])

  useEffect(() => {
    if (isOpen) {
      console.log("=== PRICING MODAL DATA ===", {
        bookingFormData,
        rooms,
        nights,
        perDatePricingData,
        promotionDetails,
        roomsWithTax,
        totalTaxAmount,
        totalPromotionalDiscount,
        totalRoomSubtotal,
        totalDeductionAmount,
        aggregatedTaxDetails,
        subtotal,
        hotelPrice,
        total
      })
    }
  }, [
    isOpen,
    bookingFormData,
    rooms,
    nights,
    perDatePricingData,
    promotionDetails,
    roomsWithTax,
    totalTaxAmount,
    totalPromotionalDiscount,
    totalRoomSubtotal,
    totalDeductionAmount,
    aggregatedTaxDetails,
    subtotal,
    hotelPrice,
    total
  ])

  // Handle back button on mobile
  useEffect(() => {
    if (!isMobileOrTablet || !isOpen) return

    poppedRef.current = false
    // Push a state when modal opens
    window.history.pushState({ modalOpen: true }, "")

    const handlePopState = (e: PopStateEvent) => {
      // If user presses back, close the modal
      poppedRef.current = true
      onClose()
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
      // Check if the current state is the one we pushed, then go back to clean history
      if (!poppedRef.current && window.history.state?.modalOpen) {
        window.history.back()
      }
    }
  }, [isOpen, isMobileOrTablet, onClose])

  const headerTitleContent = (
    <div className="flex items-center justify-between gap-3 w-full text-left">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="truncate text-lg sm:text-xl font-bold text-gray-900 leading-tight">Price Summary</div>
          <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-0.5 truncate">
            Detailed breakdown of your booking
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  )

  const mainBodyContent = (
    <>
      <div className="overflow-y-auto max-h-[calc(95vh-250px)] lg:max-h-[calc(85vh-250px)] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 scrollbar-hide hide-scrollbar overscroll-contain">
        {/* Content */}
        {apiLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading booking summary...</p>
            </div>
          </div>
        ) : (apiSummary ? apiSummary.rooms?.length > 0 : (perDatePricingData.length > 0 && rooms.length > 0)) ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-1 sm:mx-0">
            <div
              className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              onWheel={(e) => {
                if (e.deltaY && !e.shiftKey) {
                  const parent = e.currentTarget.closest('.overflow-y-auto')
                  if (parent) {
                    parent.scrollTop += e.deltaY
                  }
                }
              }}
            >
              <table className="w-full text-xs sm:text-[11px] border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-orange-200">
                    <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 border-r border-gray-200 min-w-[140px] sm:min-w-[160px] sticky left-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Room Details
                      </div>
                    </th>
                    {dateHeaders.map((date: any, idx: number) => (
                      <th key={idx} className="text-center p-2 sm:p-3 font-semibold text-gray-700 border-r border-gray-200 min-w-[110px] sm:min-w-[130px]">
                        <div className="flex  justify-center items-center gap-1">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{date.display}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(apiSummary ? apiSummary.rooms : roomsWithTax).map((room: any, idx: number) => {
                    const roomChildPrice = room.childPrice || 0
                    const childAge = idx < childrenAges.length ? childrenAges[idx] : 0
                    const hasChildInRoom = idx < childrenCount && roomChildPrice > 0 && childAge >= 6
                    const roomQuantity = room.quantity || room.qty || 1
                    const taxationDetails = (bookingFormData as any).taxationDetails || []

                    const resolveRoomName = (r: any, index: number): string => {
                      const selectedRooms = bookingFormData.rooms || []
                      const roomIdCandidate = Number(r.roomId || r.room_id || r.room || r.id)
                      const candidates = [
                        r.room_name,
                        r.roomName,
                        r.room_type_name,
                        r.costume_room_name,
                        r.room_type,
                        r.room
                      ]
                      for (const c of candidates) {
                        if (c && typeof c === 'string' && isNaN(Number(c.trim()))) {
                          return c.trim()
                        }
                      }
                      if (!isNaN(roomIdCandidate) && roomIdCandidate > 0) {
                        const matched = selectedRooms.find((sr: any) => Number(sr.roomId || sr.id) === roomIdCandidate)
                        if (matched?.roomName) return matched.roomName
                      }
                      if (selectedRooms[index]?.roomName) {
                        return selectedRooms[index].roomName
                      }
                      return 'Deluxe Room'
                    }

                    const resolvePlanName = (r: any, index: number): string => {
                      const selectedRooms = bookingFormData.rooms || []
                      const candidates = [
                        r.plan_name,
                        r.planName,
                        r.plan_type,
                        r.plan
                      ]
                      for (const c of candidates) {
                        if (c && typeof c === 'string' && isNaN(Number(c.trim()))) {
                          return c.trim()
                        }
                      }
                      const roomIdCandidate = Number(r.roomId || r.room_id || r.room || r.id)
                      if (!isNaN(roomIdCandidate) && roomIdCandidate > 0) {
                        const matched = selectedRooms.find((sr: any) => Number(sr.roomId || sr.id) === roomIdCandidate)
                        if (matched?.planName) return matched.planName
                      }
                      if (selectedRooms[index]?.planName) {
                        return selectedRooms[index].planName
                      }
                      return 'CP'
                    }

                    const planName = resolvePlanName(room, idx)
                    const roomName = resolveRoomName(room, idx)

                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
                        <td className="p-2 sm:p-3 border-r border-gray-200 bg-gradient-to-r from-gray-50 to-white sticky left-0 z-10">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${planName === 'EP' ? 'bg-green-100 text-green-700' :
                                planName === 'CP' ? 'bg-blue-100 text-blue-700' :
                                  planName === 'MAP' ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                {planName}
                              </span>
                            </div>
                            <div className="font-semibold text-gray-900 text-xs">
                              {roomName}
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 text-[10px] text-gray-600">
                              <div>Rooms: {roomQuantity}</div>
                              <div>Adults: {room.adults || 0}</div>
                              <div>Childs: {apiSummary ? room.children || 0 : (hasChildInRoom ? 1 : 0)}</div>
                            </div>
                          </div>
                        </td>
                        {dateHeaders.map((date: any, dateIdx: number) => {
                          if (apiSummary) {
                            const pricingForDate = room.daily_prices?.find((dp: any) => dp.date === date.api)
                            const roomRateForDate = pricingForDate ? Number(pricingForDate.room_rate) : 0
                            const promoDiscountForDate = pricingForDate ? Number(pricingForDate.promotion_discount || 0) : 0
                            const finalBasePriceForDate = pricingForDate ? Number(pricingForDate.final_base_price || pricingForDate.room_rate) : 0
                            const gstAmount = pricingForDate ? Number(pricingForDate.tax_amount) : 0
                            const totalForDate = pricingForDate ? Number(pricingForDate.total_price) : 0

                            return (
                              <td key={dateIdx} className="p-2 sm:p-3 border-r border-gray-200 bg-white">
                                <div className="space-y-1">
                                  {promoDiscountForDate > 0 ? (
                                    <>
                                      <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                        <span className="text-gray-600">Original Rate:</span>
                                        <span className="text-gray-500">₹{Math.round(roomRateForDate)}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                        <span className="text-green-600 font-semibold">Promo Discount:</span>
                                        <span className="font-semibold text-green-600">-₹{Math.round(promoDiscountForDate)}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                        <span className="text-gray-600">Room Rate:</span>
                                        <span className="font-semibold text-gray-900">₹{Math.round(finalBasePriceForDate)}</span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                      <span className="text-gray-600">Room Rate:</span>
                                      <span className="font-semibold text-gray-900">₹{Math.round(roomRateForDate)}</span>
                                    </div>
                                  )}
                                  {gstAmount > 0 && (
                                    <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                      <span className="text-gray-600">GST:</span>
                                      <span className="font-medium text-gray-800">₹{Math.round(gstAmount)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between items-center pt-1 border-t border-gray-200 text-[10px] sm:text-[11px]">
                                    <span className="text-gray-700 font-semibold">Total:</span>
                                    <span className="font-bold text-orange-600">₹{Math.round(totalForDate)}</span>
                                  </div>
                                </div>
                              </td>
                            )
                          }

                          const pricingForDate = getPriceForDate(
                            room.roomId,
                            room.planId || 1,
                            date.api,
                            room.adults || 1,
                            room.planName
                          )
                          const roomRateForDate = pricingForDate.rate
                          const childRateForDate = pricingForDate.childRate
                          const taxResult = calculateFinalAmount(roomRateForDate, taxationDetails, [])
                          const gstAmount = taxResult.totalTax
                          const gstRate = taxResult.taxes[0]?.rate || 0
                          const taxEntry = taxationDetails[0]?.tax_entries?.find(
                            (entry: any) => roomRateForDate >= entry.amount_from && roomRateForDate <= entry.amount_to
                          )
                          const taxCategory = taxEntry?.tax_category || 'percentage'
                          const isPercentage = taxCategory === 'percentage'
                          const childPriceForDate = hasChildInRoom ? childRateForDate : 0
                          const childTaxResult = childPriceForDate > 0 ? calculateFinalAmount(childPriceForDate, taxationDetails, []) : { totalTax: 0, taxes: [] }
                          const childGstAmount = childTaxResult.totalTax
                          const childGstRate = childTaxResult.taxes[0]?.rate || 0
                          const childTaxEntry = taxationDetails[0]?.tax_entries?.find(
                            (entry: any) => childPriceForDate >= entry.amount_from && childPriceForDate <= entry.amount_to
                          )
                          const childTaxCategory = childTaxEntry?.tax_category || 'percentage'
                          const isChildPercentage = childTaxCategory === 'percentage'
                          const totalForDate = roomRateForDate + gstAmount + childPriceForDate + childGstAmount

                          return (
                            <td key={dateIdx} className="p-2 sm:p-3 border-r border-gray-200 bg-white">
                              <div className="space-y-1">
                                {pricingForDate.hasPromotion ? (
                                  <>
                                    <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                      <span className="text-gray-600">Original Rate:</span>
                                      <span className=" text-gray-500">₹{Math.round(pricingForDate.originalRate)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                      <span className="text-green-600 font-semibold">Promo Discount:</span>
                                      <span className="font-semibold text-green-600">-₹{Math.round(pricingForDate.promotionDiscount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                      <span className="text-gray-600">Room Rate:</span>
                                      <span className="font-semibold text-gray-900">₹{Math.round(roomRateForDate)}</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                    <span className="text-gray-600">Room Rate:</span>
                                    <span className="font-semibold text-gray-900">₹{Math.round(roomRateForDate)}</span>
                                  </div>
                                )}
                                {gstAmount > 0 && (
                                  <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                    <span className="text-gray-600">
                                      GST ({isPercentage ? `${gstRate}%` : `₹${gstRate}`}):
                                    </span>
                                    <span className="font-medium text-gray-800">₹{Math.round(gstAmount)}</span>
                                  </div>
                                )}
                                {hasChildInRoom && childPriceForDate > 0 && (
                                  <>
                                    <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                      <span className="text-blue-700">Child Rate:</span>
                                      <span className="font-semibold text-blue-700">₹{Math.round(childPriceForDate)}</span>
                                    </div>
                                    {childGstAmount > 0 && (
                                      <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
                                        <span className="text-blue-600">
                                          Child GST ({isChildPercentage ? `${childGstRate}%` : `₹${childGstRate}`}):
                                        </span>
                                        <span className="font-medium text-blue-700">₹{Math.round(childGstAmount)}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                                <div className="flex justify-between items-center pt-1 border-t border-gray-200 text-[10px] sm:text-[11px]">
                                  <span className="text-gray-700 font-semibold">Total:</span>
                                  <span className="font-bold text-orange-600">₹{Math.round(totalForDate)}</span>
                                </div>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                  <tr className="bg-gradient-to-r from-orange-50 to-orange-100 border-t-2 border-orange-300">
                    <td className="p-2 sm:p-3 text-center font-bold text-gray-900 border-r border-orange-200 sticky left-0 bg-gradient-to-r from-orange-50 to-orange-100 z-10">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Daily Total
                      </div>
                    </td>
                    {dateHeaders.map((date: any, idx: number) => {
                      let dailyTotal = 0
                      if (apiSummary) {
                        dailyTotal = apiSummary.rooms.reduce((sum: number, r: any) => {
                          const dp = r.daily_prices?.find((d: any) => d.date === date.api)
                          return sum + (dp ? Number(dp.total_price) : 0)
                        }, 0)
                      } else {
                        const taxationDetails = (bookingFormData as any).taxationDetails || []
                        dailyTotal = roomsWithTax.reduce((sum: number, room: any, roomIdx: number) => {
                          const roomQuantity = room.quantity || 1
                          const pricingForDate = getPriceForDate(
                            room.roomId,
                            room.planId || 1,
                            date.api,
                            room.adults || 1,
                            room.planName
                          )
                          const roomRateForDate = pricingForDate.rate
                          const childRateForDate = pricingForDate.childRate
                          const taxResult = calculateFinalAmount(roomRateForDate, taxationDetails, [])
                          const roomChildPrice = room.childPrice || 0
                          const childAge = roomIdx < childrenAges.length ? childrenAges[roomIdx] : 0
                          const hasChildInRoom = roomIdx < childrenCount && roomChildPrice > 0 && childAge >= 6
                          const childPriceForDate = hasChildInRoom ? childRateForDate : 0
                          const childTaxResult = childPriceForDate > 0 ? calculateFinalAmount(childPriceForDate, taxationDetails, []) : { totalTax: 0 }
                          const unitTotal = roomRateForDate + taxResult.totalTax + childPriceForDate + childTaxResult.totalTax
                          return sum + (unitTotal * roomQuantity)
                        }, 0)
                      }
                      return (
                        <td key={idx} className="p-2 sm:p-3 text-center font-bold text-orange-600 border-r border-orange-200 text-xs sm:text-sm">
                          ₹{Math.round(dailyTotal).toLocaleString()}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow-lg mx-1 sm:mx-0">
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
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
                  aria-expanded={showDiscounts}
                  aria-controls="modal-discount-breakdown"
                  className="w-full flex items-center justify-between text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50 rounded"
                >
                  <span className="flex items-center gap-1 text-green-600 font-bold">
                    Total Discount
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 motion-reduce:transition-none ${showDiscounts ? "rotate-180" : ""
                        }`}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="font-bold text-green-600 tabular-nums">
                    -₹{Math.round(modalTotalDiscount).toLocaleString()}
                  </span>
                </button>

                <div
                  id="modal-discount-breakdown"
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${showDiscounts ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                >
                  <div className="overflow-hidden">
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
                  </div>
                </div>
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
                  <span className="text-gray-700">{taxItem.name} {taxItem.name?.toLowerCase() !== "gst" && taxItem.rate > 0 &&
                    <span className="text-gray-500">
                      {(taxItem as any).type === 'fixed' ? `(₹${taxItem.rate})` : `(${taxItem.rate}%)`}
                    </span>
                  } </span>
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

          <div className="mt-2">
            {showBookButton && onBookNow && (
              <div className="flex gap-2 w-full">
                <button
                  onClick={onBookNow}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Book Now
                </button>
                {isMobileOrTablet && (
                  <button
                    onClick={onClose}
                    className="aspect-square bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center rounded-xl p-3 transition-colors shadow-sm"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            )}

            {showBookButton && onBookNow && (
              <p className="text-[10px] text-center text-gray-500 mt-1">
                You won't be charged yet
              </p>
            )}
          </div>
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
        {/* Header with clean border-b */}
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
