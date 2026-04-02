"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData, previousStep, resetBookingForm } from "@/lib/features/booking/bookingSlice"
import { paymentInfoSchema, type PaymentInfoFormData } from "@/lib/validations/booking"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Select from "react-select"
import { useCountries, useStates, useCities } from "@/hooks/useApi"
import { profileSelectStyles } from "@/components/select/profileSelectStyles"
import { toast } from "react-toastify"
import { useQuery } from "@tanstack/react-query"
import { getPropertyById, getRoomInventoryAndPricing, createPaymentOrder, confirmPaymentSuccess } from "@/services/api"
import { buildBookingPayload } from "@/utils/bookingPayloadBuilder"
import { format } from "date-fns"
import { loadRazorpayScript, openRazorpayModal, RazorpaySuccessResponse } from "@/utils/razorpay"
import { useAuth } from "@/contexts/AuthContext"

const PaymentInformationStep = () => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCountryId, setSelectedCountryId] = useState(bookingFormData.countryId || "")
  const [selectedStateId, setSelectedStateId] = useState(bookingFormData.stateId || "")
  const [paymentOrderData, setPaymentOrderData] = useState<any>(null)
  const [bookingResponse, setBookingResponse] = useState<any>(null)
  const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false)
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("")
  const [isBookingOnHold, setIsBookingOnHold] = useState(false)
  const [razorpayPaymentData, setRazorpayPaymentData] = useState<RazorpaySuccessResponse | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Get children ages from Redux (already selected on hotel details page)
  const childrenAges = bookingFormData.childrenAges || []

  // API hooks for location data
  const { data: countries, isLoading: isLoadingCountries } = useCountries()
  const { data: states, isLoading: isLoadingStates } = useStates(selectedCountryId)
  const { data: cities, isLoading: isLoadingCities } = useCities(selectedStateId)

  // Fetch hotel data
  const { data: hotelResponse } = useQuery({
    queryKey: ['hotel', bookingFormData.hotelId],
    queryFn: () => getPropertyById(bookingFormData.hotelId!),
    enabled: !!bookingFormData.hotelId,
  })

  // Fetch room pricing data
  const { data: pricingResponse } = useQuery({
    queryKey: ['roomPricing', bookingFormData.hotelId, bookingFormData.checkInDate, bookingFormData.checkOutDate],
    queryFn: () => getRoomInventoryAndPricing({
      propertyId: bookingFormData.hotelId!,
      customerType: null,
      startDate: bookingFormData.checkInDate ? format(new Date(bookingFormData.checkInDate), 'yyyy-MM-dd') : '',
      endDate: bookingFormData.checkOutDate ? format(new Date(bookingFormData.checkOutDate), 'yyyy-MM-dd') : ''
    }),
    enabled: !!bookingFormData.hotelId && !!bookingFormData.checkInDate && !!bookingFormData.checkOutDate,
  })

  const hotelData = hotelResponse?.data?.listing_detail
  const roomPricing = pricingResponse?.data?.price_detail || []

  // Options for react-select
  const countryOptions = countries?.records?.map((c: { id: number; name: string }) => ({
    value: c.id.toString(),
    label: c.name
  })) || []

  const stateOptions = states?.records?.map((s: { id: number; name: string }) => ({
    value: s.id.toString(),
    label: s.name
  })) || []

  const cityOptions = cities?.records?.map((ct: { id: number; name: string }) => ({
    value: ct.id.toString(),
    label: ct.name
  })) || []

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    watch,
    trigger,
  } = useForm<PaymentInfoFormData>({
    resolver: zodResolver(paymentInfoSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      houseNumber: bookingFormData.houseNumber || "",
      street: bookingFormData.street || "",
      countryId: bookingFormData.countryId || "",
      stateId: bookingFormData.stateId || "",
      cityId: bookingFormData.cityId || "",
      hasGST: bookingFormData.hasGST || false,
      gstNumber: bookingFormData.gstNumber || "",
      companyName: bookingFormData.companyName || "",
      gstPhone: bookingFormData.gstPhone || "",
      gstAddress: bookingFormData.gstAddress || "",
    },
  })

  const formValues = watch()
  const isValidField = (fieldName: keyof PaymentInfoFormData) => {
    const isTouched = touchedFields[fieldName]
    const hasValue = !!formValues[fieldName]
    const hasError = !!errors[fieldName]
    return isTouched && hasValue && !hasError
  }

  const watchedCountryId = watch("countryId")
  const watchedStateId = watch("stateId")
  const watchedCityId = watch("cityId")
  const hasGST = watch("hasGST")

  const handlePaymentSuccess = async (razorpayResponse: RazorpaySuccessResponse) => {
    try {
      console.log('=== RAZORPAY SUCCESS RESPONSE ===')
      console.log(JSON.stringify(razorpayResponse, null, 2))
      console.log('=================================')

      // Store Razorpay payment data (payment was successful on Razorpay)
      setRazorpayPaymentData(razorpayResponse)

      // Get the stored booking payload
      const storedPayload = sessionStorage.getItem('bookingPayload')
      if (!storedPayload) {
        toast.error("Booking data not found. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        })
        setIsSubmitting(false)
        return
      }

      const bookingPayload = JSON.parse(storedPayload)

      // Add Razorpay details to the payload
      const finalPayload = {
        ...bookingPayload,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature
      }

      console.log('=== FINAL PAYMENT SUCCESS PAYLOAD ===')
      console.log(JSON.stringify(finalPayload, null, 2))
      console.log('======================================')

      // Call payment success API
      const response = await confirmPaymentSuccess(finalPayload)

      console.log('=== PAYMENT SUCCESS API RESPONSE ===')
      console.log(JSON.stringify(response, null, 2))
      console.log('====================================')

      // Store the response
      setBookingResponse(response)

      // Check if success (status 200 or 201)
      if (response.status === 200 || response.status === 201) {
        // Both Razorpay and API succeeded - booking complete
        // Store response for success page
        sessionStorage.setItem('bookingResponse', JSON.stringify(response.data))

        // Clear booking payload
        sessionStorage.removeItem('bookingPayload')

        // Show success modal BEFORE resetting form
        setShowSuccessModal(true)

        // Redirect to my-bookings page after delay
        setTimeout(() => {
          // Reset the booking form data in Redux just before redirect
          // dispatch(resetBookingForm())
          window.location.href = "/my-bookings"
        }, 7000)
      } else {
        // Razorpay succeeded but API failed - booking on hold
        setIsBookingOnHold(true)
        const errorMsg = response?.data?.message || "Payment received but booking verification failed."
        setPaymentErrorMessage(errorMsg)
        setShowPaymentErrorModal(true)
      }
    } catch (error: any) {
      console.error("Payment success API error:", error)
      // Razorpay succeeded but API failed - booking on hold
      setIsBookingOnHold(true)
      const errorMsg = error?.response?.data?.message || "Payment received but booking verification failed."
      setPaymentErrorMessage(errorMsg)
      setShowPaymentErrorModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (data: PaymentInfoFormData) => {
    console.log('🔵 Form submitted - onSubmit called')
    console.log('Form data:', data)
    console.log('Form errors:', errors)
    
    try {
      setIsSubmitting(true)
      console.log('🔵 isSubmitting set to true')

      // Check if user is logged in (required for payment order creation)
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("spodia_access_token") : null

      if (!accessToken || !user) {
        console.log('❌ User not authenticated')
        toast.error("Please complete guest information first. You must be logged in to proceed with payment.", {
          position: "top-right",
          autoClose: 5000,
        })
        setIsSubmitting(false)
        // Go back to step 1
        dispatch(previousStep())
        dispatch(previousStep())
        return
      }

      console.log('✅ User authenticated - Access token available')
      console.log('User:', user.email)

      // Validate children ages if children are present
      if ((bookingFormData.children || 0) > 0 && (!childrenAges || childrenAges.length === 0 || childrenAges.some(age => age === 0))) {
        toast.error("Children ages are missing. Please go back and select ages for all children.", {
          position: "top-right",
          autoClose: 5000,
        })
        setIsSubmitting(false)
        return
      }

      // Update booking form data with payment info
      const updatedBookingData = {
        ...bookingFormData,
        ...data
      }
      dispatch(updateBookingFormData(data))

      // Build the complete booking payload
      if (!hotelData || !roomPricing.length) {
        toast.error("Unable to fetch hotel data. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        })
        setIsSubmitting(false)
        return
      }

      const bookingPayload = buildBookingPayload(
        updatedBookingData as any,
        hotelData,
        roomPricing,
        childrenAges
      )

      // Override all pricing values with correct amounts from pricingSummary
      const pricingSummary = bookingFormData.pricingSummary
      if (pricingSummary) {
        // Find GST and Service Charge from taxDetails
        const gstDetail = pricingSummary.taxDetails.find(t => t.name.toLowerCase().includes('gst'))
        const serviceChargeDetail = pricingSummary.taxDetails.find(t => t.name.toLowerCase().includes('service'))
        
        const gstAmount = gstDetail ? gstDetail.amount : 0
        const serviceChargeAmount = serviceChargeDetail ? serviceChargeDetail.amount : 0
        const subtotalAmount = pricingSummary.subtotal
        
        // Update all pricing fields in the payload
        bookingPayload.price_sum = subtotalAmount
        bookingPayload.price = subtotalAmount
        bookingPayload.book_price_sum = subtotalAmount
        bookingPayload.price_sum_without_child_price = subtotalAmount
        bookingPayload.gst_sum = gstAmount
        bookingPayload.tax = gstAmount
        bookingPayload.serviceCharge = serviceChargeAmount
        bookingPayload.total_without_service_charge = (subtotalAmount + gstAmount).toFixed(2)
        bookingPayload.total_price_sum = subtotalAmount + gstAmount
        bookingPayload.total = totalPayment.toFixed(2)
        
        // NOW FIX THE PRICE_INFO ARRAY - Use actual per-date pricing from modal
        // Get per-date pricing data from Redux (same data used by PriceBreakdownModal)
        const perDatePricingData = (bookingFormData as any).perDatePricing || []
        const promotionDetails = (bookingFormData as any).promotionDetails || []
        const taxationDetails = (bookingFormData as any).taxationDetails || []
        
        // Helper function to get price for a specific room, plan, and date (same logic as modal)
        const getPriceForDate = (roomId: number, planId: number, dateStr: string, adults: number) => {
          const numericRoomId = Number(roomId)
          let numericPlanId = Number(planId)
          
          // Find matching pricing entry
          const pricing = perDatePricingData.find((p: any) =>
            Number(p.room) === numericRoomId &&
            Number(p.plan) === numericPlanId &&
            p.season_start === dateStr
          )
          
          if (!pricing) {
            return { rate: 0, childRate: 0, originalRate: 0, hasPromotion: false, promotionDiscount: 0, gstAmount: 0, gstPercentage: 0 }
          }
          
          // Calculate base rate based on adults
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
          
          // Apply promotional pricing if available
          let hasPromotion = false
          let promotionDiscount = 0
          
          if (promotionDetails && promotionDetails.length > 0) {
            const { calculateRoomPlanPromotionalPricing } = require('@/utils/roomPromotionalPricing')
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
          
          // Calculate tax for this rate
          const { calculateFinalAmount } = require('@/utils/taxCalculation')
          const taxResult = calculateFinalAmount(rate, taxationDetails, [])
          const gstAmount = taxResult.totalTax
          const gstPercentage = taxResult.taxes[0]?.rate || 0
          
          return { rate, childRate, originalRate, hasPromotion, promotionDiscount, gstAmount, gstPercentage }
        }
        
        // Update price_info for each room and plan
        if (bookingPayload.rooms && Array.isArray(bookingPayload.rooms)) {
          bookingPayload.rooms.forEach((room: any) => {
            if (room.plans && Array.isArray(room.plans)) {
              room.plans.forEach((plan: any) => {
                if (plan.adults_info && Array.isArray(plan.adults_info)) {
                  plan.adults_info.forEach((adultInfo: any) => {
                    if (adultInfo.price_info && Array.isArray(adultInfo.price_info)) {
                      // Update each date's pricing with actual values from modal
                      adultInfo.price_info.forEach((priceInfo: any) => {
                        const dateStr = priceInfo.dateS
                        const adults = adultInfo.no_of_adults
                        const noOfRooms = adultInfo.selectedItem
                        
                        // Get actual pricing for this date
                        const pricingForDate = getPriceForDate(room.id, plan.plan, dateStr, adults)
                        
                        // Update price_info with correct values (promotional discount already applied to rate)
                        priceInfo.price_per_qty = pricingForDate.rate
                        priceInfo.price_per_day_with_out_child = pricingForDate.rate * noOfRooms
                        priceInfo.gross_price = pricingForDate.rate * noOfRooms
                        priceInfo.price_per_day = pricingForDate.rate * noOfRooms
                        priceInfo.gst_percentage = pricingForDate.gstPercentage
                        priceInfo.gst_per_day = pricingForDate.gstAmount * noOfRooms
                        priceInfo.total_price = (pricingForDate.rate + pricingForDate.gstAmount) * noOfRooms
                        
                        // Keep discount fields as originally set by buildBookingPayload
                        // (discount is separate from promotional/coupon/member-only discounts)
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }

      console.log('=== COMPLETE BOOKING PAYLOAD ===')
      console.log(JSON.stringify(bookingPayload, null, 2))
      console.log('================================')

      // Store payload for payment success callback
      sessionStorage.setItem('bookingPayload', JSON.stringify(bookingPayload))

      // Use the correct total amount from pricingSummary (same as sidebar and top display)
      const totalAmount = totalPayment

      // Step 1: Create payment order
      // toast.info("Creating payment order...", {
      //   position: "top-right",
      //   autoClose: 2000,
      // })

      const orderResponse = await createPaymentOrder(totalAmount.toFixed(2))

      console.log('=== PAYMENT ORDER RESPONSE ===')
      console.log(JSON.stringify(orderResponse, null, 2))
      console.log('==============================')

      if (!orderResponse.data || !orderResponse.data.id) {
        toast.error("Failed to create payment order. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        })
        setIsSubmitting(false)
        return
      }

      // Store order data
      setPaymentOrderData(orderResponse.data)

      // Step 2: Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript()

      if (!isScriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        })
        setIsSubmitting(false)
        return
      }

      // Step 3: Open Razorpay payment modal
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      console.log('Razorpay Key:', razorpayKey ? `${razorpayKey.substring(0, 10)}...` : 'NOT FOUND')

      if (!razorpayKey) {
        toast.error("Payment configuration error. Please contact support.", {
          position: "top-right",
          autoClose: 5000,
        })
        setIsSubmitting(false)
        return
      }

      // Create a ref to track if modal was dismissed
      let modalDismissed = false

      const razorpayInstance = openRazorpayModal({
        key: razorpayKey,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "Spodia.com \n Unit of Homocation Asia Pvt. Ltd",
        description: `Booking for ${(bookingFormData.rooms || []).length} room(s)`,
        image: hotelData.listing_images?.[0]?.image || "",
        order_id: orderResponse.data.id,
        handler: handlePaymentSuccess,
        prefill: {
          name: `${bookingFormData.firstName || ''} ${bookingFormData.lastName || ''}`,
          email: bookingFormData.email || '',
          contact: bookingFormData.phone || ''
        },
        theme: {
          color: "#078ED8"
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal dismissed')
            modalDismissed = true
            setIsSubmitting(false)
            toast.warning("Payment cancelled. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            })
          },
          escape: true,
          backdropclose: true,
          confirm_close: false,
          handleback: true
        }
      })

      // Fallback: Reset button state after 2 seconds if modal was closed
      setTimeout(() => {
        if (modalDismissed) {
          console.log('Fallback: Ensuring button state is reset')
          setIsSubmitting(false)
        }
      }, 2000)

    } catch (error: any) {
      console.error("Booking error:", error)
      toast.error(error?.response?.data?.message || "Failed to initiate payment. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      })
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    dispatch(previousStep())
  }

  // Calculate total payment from Redux state - use pricingSummary (same as sidebar)
  const totalPayment = bookingFormData.pricingSummary?.total || 0

  return (
    <>
      {/* Payment Success Modal */}
      {showSuccessModal && bookingResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Success Message */}
              <h3 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">Your booking has been confirmed successfully.</p>

              {/* Booking Details */}
              <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-left">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Booking Details:</h4>
                <div className="space-y-2 text-sm">
                  {bookingResponse.data?.booking_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-medium text-gray-900">{bookingResponse.data.booking_id}</span>
                    </div>
                  )}
                  {bookingResponse.data?.reservation_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reservation ID:</span>
                      <span className="font-medium text-gray-900">{bookingResponse.data.reservation_id}</span>
                    </div>
                  )}
                  {razorpayPaymentData && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-xs text-gray-900">{razorpayPaymentData.razorpay_payment_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono text-xs text-gray-900">{razorpayPaymentData.razorpay_order_id}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between pt-2 border-t border-green-200">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-bold text-green-600">₹{totalPayment.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Redirect Message */}
              <p className="text-sm text-gray-500 mb-4">
                Redirecting to your bookings...
              </p>

              {/* Loading Spinner */}
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Error Modal */}
      {showPaymentErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              {/* Icon - Warning for on hold, Error for failed */}
              <div className={`w-16 h-16 ${isBookingOnHold ? 'bg-yellow-100' : 'bg-red-100'} rounded-full flex items-center justify-center mb-4`}>
                {isBookingOnHold ? (
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              {/* Title and Message */}
              <h3 className={`text-xl font-bold mb-2 ${isBookingOnHold ? 'text-yellow-800' : 'text-gray-900'}`}>
                {isBookingOnHold ? 'Booking On Hold' : 'Payment Failed'}
              </h3>
              <p className="text-gray-600 mb-4">{paymentErrorMessage}</p>

              {/* Additional info for on-hold bookings */}
              {isBookingOnHold && razorpayPaymentData && (
                <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                  <p className="text-sm text-yellow-800 mb-3">
                    <strong>Your payment was successful</strong> but we couldn't confirm your booking immediately. 
                    Please contact support with the following details:
                  </p>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium">Payment ID:</span>
                      <span className="font-mono">{razorpayPaymentData.razorpay_payment_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order ID:</span>
                      <span className="font-mono">{razorpayPaymentData.razorpay_order_id}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={() => {
                  setShowPaymentErrorModal(false)
                  setIsBookingOnHold(false)
                }}
                className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-8 h-12 rounded-full font-semibold w-full"
              >
                {isBookingOnHold ? 'Close' : 'Try Again'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Enter Payment Information</h2>
              <p className="text-sm text-gray-600">Step 3 of 3</p>
              {user && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-green-700">
                    Logged in as: <span className="font-medium">{user.email}</span>
                  </p>
                </div>
              )}
            </div>
            <div className="sm:text-right bg-blue-50 sm:bg-transparent p-4 sm:p-0 rounded-lg sm:rounded-none border sm:border-0 border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Your Payment is</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#078ED8]">₹{totalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        <form 
          onSubmit={(e) => {
            console.log('📝 Form onSubmit event triggered')
            console.log('Event:', e)
            handleSubmit(onSubmit)(e)
          }} 
          className="space-y-6"
        >
          {/* Billing Address */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* House Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  House Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register("houseNumber")}
                    placeholder="House Number"
                    className={`h-11 sm:h-12 ${errors.houseNumber ? "border-red-500" : isValidField("houseNumber") ? "border-green-500 pr-10" : ""}`}
                    onChange={(e) => {
                      register("houseNumber").onChange(e)
                      trigger("houseNumber")
                    }}
                  />
                  {isValidField("houseNumber") && (
                    <div className="absolute right-3 top-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
                {errors.houseNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.houseNumber.message}</p>
                )}
              </div>

              {/* Street */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Street <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register("street")}
                    placeholder="Street"
                    className={`h-11 sm:h-12 ${errors.street ? "border-red-500" : isValidField("street") ? "border-green-500 pr-10" : ""}`}
                    onChange={(e) => {
                      register("street").onChange(e)
                      trigger("street")
                    }}
                  />
                  {isValidField("street") && (
                    <div className="absolute right-3 top-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
                {errors.street && (
                  <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>
                )}
              </div>
            </div>

            {/* Country, State, City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <Select
                  instanceId="payment-country-select"
                  options={countryOptions}
                  value={countryOptions.find((opt: any) => opt.value === watchedCountryId)}
                  onChange={(selectedOption) => {
                    const countryId = selectedOption?.value || ""
                    setValue("countryId", countryId)
                    setValue("stateId", "")
                    setValue("cityId", "")
                    setSelectedCountryId(countryId)
                    setSelectedStateId("")
                  }}
                  styles={profileSelectStyles}
                  placeholder="Country"
                  isSearchable
                  isLoading={isLoadingCountries}
                  className="text-black"
                />
                {errors.countryId && (
                  <p className="text-red-500 text-xs mt-1">{errors.countryId.message}</p>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <Select
                  instanceId="payment-state-select"
                  options={stateOptions}
                  value={stateOptions.find((opt: any) => opt.value === watchedStateId)}
                  onChange={(selectedOption) => {
                    const stateId = selectedOption?.value || ""
                    setValue("stateId", stateId)
                    setValue("cityId", "")
                    setSelectedStateId(stateId)
                  }}
                  styles={profileSelectStyles}
                  placeholder="State"
                  isDisabled={!watchedCountryId}
                  isSearchable
                  isLoading={isLoadingStates}
                  className="text-black"
                />
                {errors.stateId && (
                  <p className="text-red-500 text-xs mt-1">{errors.stateId.message}</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <Select
                  instanceId="payment-city-select"
                  options={cityOptions}
                  value={cityOptions.find((opt: any) => opt.value === watchedCityId)}
                  onChange={(selectedOption) => {
                    setValue("cityId", selectedOption?.value || "")
                  }}
                  styles={profileSelectStyles}
                  placeholder="City"
                  isDisabled={!watchedStateId}
                  isSearchable
                  isLoading={isLoadingCities}
                  className="text-black"
                />
                {errors.cityId && (
                  <p className="text-red-500 text-xs mt-1">{errors.cityId.message}</p>
                )}
              </div>
            </div>

            {/* Children Ages Summary - Display only (already selected on hotel page) */}
            {/* {(bookingFormData.children || 0) > 0 && childrenAges.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Children Information
                </h4>
                <div className="flex flex-wrap gap-2">
                  {childrenAges.map((age, index) => (
                    <div key={index} className="bg-white px-3 py-2 rounded-lg border border-blue-300">
                      <span className="text-xs font-medium text-gray-700">
                        Child {index + 1}: <span className="text-blue-600">{age} {age === 1 ? 'year' : 'years'}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ Children ages were selected on the previous page
                </p>
              </div>
            )} */}

            {/* GST Checkbox */}
            <div className="flex items-center gap-3 mt-6">
              <Checkbox
                id="hasGST"
                checked={hasGST}
                onCheckedChange={(checked) => setValue("hasGST", checked as boolean)}
              />
              <label htmlFor="hasGST" className="text-sm text-gray-700 cursor-pointer">
                Do you have GST?
              </label>
            </div>

            {/* GST Fields - Show only when hasGST is true */}
            {hasGST && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4">GST Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* GST Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      GST Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...register("gstNumber")}
                        placeholder="GST Number"
                        className={`h-11 sm:h-12 ${errors.gstNumber ? "border-red-500" : isValidField("gstNumber") ? "border-green-500 pr-10" : ""}`}
                        onChange={(e) => {
                          register("gstNumber").onChange(e)
                          trigger("gstNumber")
                        }}
                      />
                      {isValidField("gstNumber") && (
                        <div className="absolute right-3 top-3">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                    {errors.gstNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.gstNumber.message}</p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...register("companyName")}
                        placeholder="Company Name"
                        className={`h-11 sm:h-12 ${errors.companyName ? "border-red-500" : isValidField("companyName") ? "border-green-500 pr-10" : ""}`}
                        onChange={(e) => {
                          register("companyName").onChange(e)
                          trigger("companyName")
                        }}
                      />
                      {isValidField("companyName") && (
                        <div className="absolute right-3 top-3">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                    {errors.companyName && (
                      <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...register("gstPhone")}
                        placeholder="Phone Number"
                        className={`h-11 sm:h-12 ${errors.gstPhone ? "border-red-500" : isValidField("gstPhone") ? "border-green-500 pr-10" : ""}`}
                        onChange={(e) => {
                          register("gstPhone").onChange(e)
                          trigger("gstPhone")
                        }}
                      />
                      {isValidField("gstPhone") && (
                        <div className="absolute right-3 top-3">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                    {errors.gstPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.gstPhone.message}</p>
                    )}
                  </div>

                  {/* GST Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      GST Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...register("gstAddress")}
                        placeholder="GST Address"
                        className={`h-11 sm:h-12 ${errors.gstAddress ? "border-red-500" : isValidField("gstAddress") ? "border-green-500 pr-10" : ""}`}
                        onChange={(e) => {
                          register("gstAddress").onChange(e)
                          trigger("gstAddress")
                        }}
                      />
                      {isValidField("gstAddress") && (
                        <div className="absolute right-3 top-3">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                    {errors.gstAddress && (
                      <p className="text-red-500 text-xs mt-1">{errors.gstAddress.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex items-center justify-center gap-2 h-11 sm:h-12 order-2 sm:order-1"
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              type="submit"
              className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-6 sm:px-8 h-11 sm:h-12 rounded-full font-semibold order-1 sm:order-2"
              disabled={isSubmitting}
              onClick={(e) => {
                console.log('🔴 Button clicked')
                console.log('Button type:', e.currentTarget.type)
                console.log('isSubmitting:', isSubmitting)
                console.log('Form errors:', errors)
              }}
            >
              {isSubmitting ? "Processing..." : "Pay & Book Now"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  )
}

export default PaymentInformationStep
