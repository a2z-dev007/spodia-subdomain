"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData, previousStep } from "@/lib/features/booking/bookingSlice"
import { paymentInfoSchema, type PaymentInfoFormData } from "@/lib/validations/booking"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Select from "react-select"
import { useCountries, useStates, useCities } from "@/hooks/useApi"
import { profileSelectStyles } from "@/components/select/profileSelectStyles"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { getPropertyById, getRoomInventoryAndPricing, createPaymentOrder, confirmPaymentSuccess } from "@/services/api"
import { lookupLocationByPincode, findBestMatchingOption } from "@/services/pincodeService"
import { buildBookingPayload } from "@/utils/bookingPayloadBuilder"
import { format } from "date-fns"
import { loadRazorpayScript, openRazorpayModal, RazorpaySuccessResponse, RazorpayErrorResponse } from "@/utils/razorpay"
import { useAuth } from "@/contexts/AuthContext"
import PaymentSuccessModal from "@/components/booking/PaymentSuccessModal"
import PaymentErrorModal from "@/components/booking/PaymentErrorModal"

const PaymentInformationStep = () => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gstPhoneCountryCode, setGstPhoneCountryCode] = useState(
    bookingFormData.gstPhoneCountryCode || "91"
  )
  const [fullGstPhone, setFullGstPhone] = useState(bookingFormData.gstPhoneWithCountryCode || "")
  const [selectedCountryId, setSelectedCountryId] = useState(bookingFormData.countryId || "")
  const [selectedStateId, setSelectedStateId] = useState(bookingFormData.stateId || "")
  const [paymentOrderData, setPaymentOrderData] = useState<any>(null)
  const [bookingResponse, setBookingResponse] = useState<any>(null)
  const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false)
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("")
  const [isBookingOnHold, setIsBookingOnHold] = useState(false)
  const [razorpayPaymentData, setRazorpayPaymentData] = useState<RazorpaySuccessResponse | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const childrenAges = bookingFormData.childrenAges || []

  const { data: countries, isLoading: isLoadingCountries } = useCountries()
  const { data: states, isLoading: isLoadingStates } = useStates(selectedCountryId)
  const { data: cities, isLoading: isLoadingCities } = useCities(selectedStateId)

  const { data: hotelResponse } = useQuery({
    queryKey: ['hotel', bookingFormData.hotelId],
    queryFn: () => getPropertyById(bookingFormData.hotelId!),
    enabled: !!bookingFormData.hotelId,
  })

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

  const [isPincodeLoading, setIsPincodeLoading] = useState(false)
  const [pincodeStatus, setPincodeStatus] = useState<{
    success: boolean
    country: string
    state: string
    city: string
    message?: string
  } | null>(null)
  const pendingLocationRef = useRef<{ country: string; state: string; city: string } | null>(null)

  const handlePincodeChange = useCallback(async (pincodeVal: string) => {
    const cleanPin = pincodeVal.trim().replace(/\s+/g, "")
    if (cleanPin.length < 6) {
      setPincodeStatus(null)
      return
    }

    setIsPincodeLoading(true)
    try {
      const res = await lookupLocationByPincode(cleanPin)
      if (res.success) {
        setPincodeStatus({
          success: true,
          country: res.country,
          state: res.state,
          city: res.city,
        })
        pendingLocationRef.current = {
          country: res.country,
          state: res.state,
          city: res.city,
        }

        if (countryOptions.length > 0) {
          const matchedCountry = findBestMatchingOption(countryOptions, res.country) || countryOptions.find((opt: any) => String(opt.label).toLowerCase() === "india") || countryOptions[0]
          if (matchedCountry) {
            const countryId = String(matchedCountry.value)
            setValue("countryId", countryId, { shouldValidate: true })
            setValue("stateId", "")
            setValue("cityId", "")
            setSelectedCountryId(countryId)
            setSelectedStateId("")
          }
        }
      } else {
        setPincodeStatus({
          success: false,
          country: "",
          state: "",
          city: "",
          message: res.message || "Pincode not identified",
        })
      }
    } catch (err) {
      console.error("Pincode lookup failed:", err)
    } finally {
      setIsPincodeLoading(false)
    }
  }, [countryOptions, setValue])

  useEffect(() => {
    if (!pendingLocationRef.current?.state || !stateOptions.length) return
    const matchedState = findBestMatchingOption(stateOptions, pendingLocationRef.current.state)
    if (matchedState) {
      const stateId = String(matchedState.value)
      setValue("stateId", stateId, { shouldValidate: true })
      setValue("cityId", "")
      setSelectedStateId(stateId)
    } else {
      pendingLocationRef.current = null
    }
  }, [stateOptions, setValue])

  useEffect(() => {
    if (!pendingLocationRef.current?.city || !cityOptions.length) return
    const matchedCity = findBestMatchingOption(cityOptions, pendingLocationRef.current.city)
    if (matchedCity) {
      setValue("cityId", String(matchedCity.value), { shouldValidate: true })
    }
    pendingLocationRef.current = null
  }, [cityOptions, setValue])

  const handlePaymentSuccess = async (razorpayResponse: RazorpaySuccessResponse) => {
    setRazorpayPaymentData(razorpayResponse)
    setIsProcessingPayment(true)
    setShowSuccessModal(true)

    try {
      const storedPayload = sessionStorage.getItem('bookingPayload')
      if (!storedPayload) {
        toast.error("Booking data not found. Please try again.")
        setShowSuccessModal(false)
        setIsProcessingPayment(false)
        setIsSubmitting(false)
        return
      }

      const bookingPayload = JSON.parse(storedPayload)

      const finalPayload = {
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        booking_id: bookingPayload.booking_id,
        fname: bookingPayload.fname,
        lname: bookingPayload.lname,
        email: bookingPayload.email || bookingFormData.email || user?.email || '',
        mobile: bookingPayload.mobile,
        childInfo: bookingPayload.childInfo,
        listingid: bookingPayload.listingid,
        no_of_guests: bookingPayload.no_of_guests,
        houseNumber: bookingPayload.houseNumber,
        street: bookingPayload.street,
        city: bookingPayload.city,
        state: bookingPayload.state,
        country: bookingPayload.country,
        gst: bookingPayload.gst,
        gst_number: bookingPayload.gst_number,
        gst_company_name: bookingPayload.gst_company_name,
        gst_phone_number: bookingPayload.gst_phone_number,
        gst_address: bookingPayload.gst_address,
        booking_type: bookingPayload.booking_type,
        cancellation_policy: bookingPayload.cancellation_policy,
      }

      const response = await confirmPaymentSuccess(finalPayload)
      setBookingResponse(response)

      if (response.status === 200 || response.status === 201) {
        sessionStorage.setItem('bookingResponse', JSON.stringify(response.data))
        sessionStorage.removeItem('bookingPayload')
        setIsProcessingPayment(false)
      } else {
        setShowSuccessModal(false)
        setIsProcessingPayment(false)
        setIsBookingOnHold(true)
        const errorMsg = response?.data?.message || "Payment received but booking verification failed."
        setPaymentErrorMessage(errorMsg)
        setShowPaymentErrorModal(true)
      }
    } catch (error: any) {
      console.error("Payment success API error:", error)
      setShowSuccessModal(false)
      setIsProcessingPayment(false)
      setIsBookingOnHold(true)
      const errorMsg = error?.response?.data?.message || "Payment received but booking verification failed."
      setPaymentErrorMessage(errorMsg)
      setShowPaymentErrorModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPayment = bookingFormData.pricingSummary?.total || 0

  const onSubmit = async (data: PaymentInfoFormData) => {
    try {
      setIsSubmitting(true)

      const accessToken = typeof window !== "undefined" ? localStorage.getItem("spodia_access_token") : null

      if (!accessToken || !user) {
        toast.error("Please complete guest information first. You must be logged in to proceed with payment.")
        setIsSubmitting(false)
        dispatch(previousStep())
        dispatch(previousStep())
        return
      }

      if ((bookingFormData.children || 0) > 0 && (!childrenAges || childrenAges.length === 0 || childrenAges.some(age => age === 0))) {
        toast.error("Children ages are missing. Please go back and select ages for all children.")
        setIsSubmitting(false)
        return
      }

      const updatedBookingData = {
        ...bookingFormData,
        ...data,
        gstPhoneCountryCode,
        gstPhoneWithCountryCode: fullGstPhone,
      }
      dispatch(updateBookingFormData(updatedBookingData))

      if (!hotelData || !roomPricing.length) {
        toast.error("Unable to fetch hotel data. Please try again.")
        setIsSubmitting(false)
        return
      }

      const bookingPayload = buildBookingPayload(
        updatedBookingData as any,
        hotelData,
        roomPricing,
        childrenAges
      )

      const pricingSummary = bookingFormData.pricingSummary
      if (pricingSummary) {
        const gstAmount = pricingSummary.totalTax || 0
        const serviceChargeAmount = pricingSummary.totalDeductions || 0
        const roomPromoDiscount = pricingSummary.totalPromotionalDiscount || 0
        const couponDiscount = pricingSummary.couponDiscount || 0
        const memberOnlyDiscount = pricingSummary.memberOnlyDiscount || 0

        const originalSubtotal = pricingSummary.subtotal + roomPromoDiscount
        const totalDiscount = roomPromoDiscount + couponDiscount + memberOnlyDiscount

        bookingPayload.price_sum = originalSubtotal
        bookingPayload.price = originalSubtotal
        bookingPayload.book_price_sum = originalSubtotal
        bookingPayload.price_sum_without_child_price = originalSubtotal
        bookingPayload.gst_sum = gstAmount
        bookingPayload.tax = gstAmount
        bookingPayload.serviceCharge = serviceChargeAmount
        bookingPayload.total_without_service_charge = (originalSubtotal + gstAmount).toFixed(2)
        bookingPayload.total_price_sum = originalSubtotal + gstAmount
        bookingPayload.discount = totalDiscount.toFixed(2)
        bookingPayload.discount_sum = totalDiscount
        bookingPayload.total = totalPayment.toFixed(2)

        bookingPayload.coupon_code = bookingFormData.appliedCoupon?.coupon_code || ''
        bookingPayload.coupon_id = bookingFormData.appliedCoupon?.id || null
        bookingPayload.member_only_promotion_id = bookingFormData.memberOnlyPromotion?.id || null
      }

      sessionStorage.setItem('bookingPayload', JSON.stringify(bookingPayload))

      const totalAmount = Math.round(totalPayment)

      const orderResponse = await createPaymentOrder(totalAmount.toString())

      if (!orderResponse.data || !orderResponse.data.id) {
        toast.error("Failed to create payment order. Please try again.")
        setIsSubmitting(false)
        return
      }

      setPaymentOrderData(orderResponse.data)

      const isScriptLoaded = await loadRazorpayScript()

      if (!isScriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.")
        setIsSubmitting(false)
        return
      }

      const razorpayKey =
        orderResponse.data?.key ||
        orderResponse.data?.key_id ||
        orderResponse.data?.razorpay_key ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      if (!razorpayKey) {
        toast.error("Payment configuration error: Razorpay Key ID missing.")
        setIsSubmitting(false)
        return
      }

      let isPaymentResolved = false
      let safetyTimer: NodeJS.Timeout | null = null

      const cleanupSafety = () => {
        isPaymentResolved = true
        if (safetyTimer) clearTimeout(safetyTimer)
        window.removeEventListener('focus', handleWindowFocus)
      }

      const handleWindowFocus = () => {
        setTimeout(() => {
          if (!isPaymentResolved) {
            cleanupSafety()
            setIsSubmitting(false)
          }
        }, 1500)
      }

      window.addEventListener('focus', handleWindowFocus)

      safetyTimer = setTimeout(() => {
        if (!isPaymentResolved) {
          cleanupSafety()
          setIsSubmitting(false)
        }
      }, 30000)

      try {
        openRazorpayModal({
          key: razorpayKey,
          amount: orderResponse.data.amount,
          currency: orderResponse.data.currency || "INR",
          name: "Spodia.com \n Unit of Homocation Asia Pvt. Ltd",
          description: `Booking for ${(bookingFormData.rooms || []).length} room(s)`,
          image: hotelData.listing_images?.[0]?.image || "",
          order_id: orderResponse.data.id,
          handler: (resp: RazorpaySuccessResponse) => {
            cleanupSafety()
            handlePaymentSuccess(resp)
          },
          onPaymentFailed: (errorResponse: RazorpayErrorResponse) => {
            cleanupSafety()
            setIsSubmitting(false)
            const errObj = errorResponse?.error
            const description = errObj?.description || ''

            let errorMsg = "Payment could not be completed. Please try again."
            if (description) {
              errorMsg = `Payment Failed: ${description}`
            }

            toast.error(errorMsg)
          },
          prefill: {
            name: `${bookingFormData.firstName || ''} ${bookingFormData.lastName || ''}`,
            email: bookingFormData.email || '',
            contact: bookingFormData.mobileWithCountryCode || bookingFormData.mobile || bookingFormData.phone || ''
          },
          theme: { color: "#078ED8" },
          modal: {
            ondismiss: () => {
              cleanupSafety()
              setIsSubmitting(false)
              toast.warning("Payment cancelled. Please try again.")
            },
            escape: true,
            backdropclose: true,
            confirm_close: false,
          }
        })
      } catch {
        cleanupSafety()
        toast.error("Failed to launch payment window. Please try again.")
        setIsSubmitting(false)
      }

    } catch (error: any) {
      console.error("Booking error:", error)
      toast.error(error?.response?.data?.message || "Failed to initiate payment. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    dispatch(previousStep())
  }

  return (
    <>
      {showSuccessModal && (
        <PaymentSuccessModal
          bookingResponse={bookingResponse}
          razorpayPaymentData={razorpayPaymentData}
          hotelName={bookingFormData.hotelName}
          hotelLocation={bookingFormData.hotelLocation}
          checkInDate={bookingFormData.checkInDate}
          checkOutDate={bookingFormData.checkOutDate}
          totalAmount={totalPayment}
          guestEmail={bookingFormData.email || user?.email}
          isGuest={!user}
          redirectPath={user ? "/dashboard" : "/"}
          isProcessing={isProcessingPayment}
        />
      )}

      {showPaymentErrorModal && (
        <PaymentErrorModal
          isBookingOnHold={isBookingOnHold}
          paymentErrorMessage={paymentErrorMessage}
          razorpayPaymentData={razorpayPaymentData}
          onClose={() => {
            setShowPaymentErrorModal(false)
            setIsBookingOnHold(false)
          }}
        />
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
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            autoComplete="off"
          >
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    House Number / Pincode <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      {...register("houseNumber")}
                      placeholder="House Number or Pincode"
                      className={`h-11 sm:h-12 ${errors.houseNumber ? "border-red-500" : isValidField("houseNumber") ? "border-green-500 pr-10" : ""}`}
                      onChange={(e) => {
                        register("houseNumber").onChange(e)
                        trigger("houseNumber")
                        if (e.target.value.length === 6) {
                          handlePincodeChange(e.target.value)
                        }
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
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

              {hasGST && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4">GST Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
