"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData } from "@/lib/features/booking/bookingSlice"
import { singleStepBookingSchema, type SingleStepBookingFormData } from "@/lib/validations/booking"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import PhoneNumberInput from "@/components/ui/PhoneNumberInput"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Info, Loader2, ChevronDown, ChevronUp, LogIn, MapPin, CheckCircle2, SlidersHorizontal, Sparkles } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { verifyEmail as verifyEmailAPI, getPropertyById, getRoomInventoryAndPricing, createPaymentOrder, confirmPaymentSuccess } from "@/services/api"
import { lookupLocationByPincode, findBestMatchingOption } from "@/services/pincodeService"
import { buildBookingPayload } from "@/utils/bookingPayloadBuilder"
import { mapBookingSummaryToPricing } from "@/utils/mapBookingSummaryToPricing"
import { format } from "date-fns"
import { loadRazorpayScript, openRazorpayModal, RazorpaySuccessResponse, RazorpayErrorResponse } from "@/utils/razorpay"
import { useQuery } from "@tanstack/react-query"
import Select from "react-select"
import { useCountries, useStates, useCities } from "@/hooks/useApi"
import PaymentSuccessModal from "@/components/booking/PaymentSuccessModal"
import PaymentErrorModal from "@/components/booking/PaymentErrorModal"

type SelectOption = { value: string | number; label: string }

// Light-theme react-select styles matching the booking form inputs (h-12, gray border, orange focus)
const billingSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#f97316" : "#e5e7eb",
    boxShadow: "none",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1f2937",
    "&:hover": { borderColor: "#f97316" },
  }),
  placeholder: (base: any) => ({ ...base, color: "#9ca3af", fontWeight: 500 }),
  singleValue: (base: any) => ({ ...base, color: "#1f2937" }),
  input: (base: any) => ({ ...base, color: "#1f2937", fontSize: "14px" }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: "14px",
    fontWeight: 500,
    backgroundColor: state.isSelected ? "#f97316" : state.isFocused ? "#fff7ed" : "#fff",
    color: state.isSelected ? "#fff" : "#374151",
    "&:active": { backgroundColor: "#ffedd5" },
  }),
  menu: (base: any) => ({ ...base, zIndex: 9999 }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
}

interface SingleStepBookingFormProps {
  onRequestLogin?: (email?: string) => void
}

const getNationalNumber = (phone: string | undefined, dialCode: string) => {
  const digits = (phone || "").replace(/\D/g, "")
  return digits.startsWith(dialCode) && digits.length > 10
    ? digits.slice(dialCode.length)
    : digits
}

const SingleStepBookingForm = ({ onRequestLogin }: SingleStepBookingFormProps = {}) => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  
  // Prefer live booking-summary API data (apiSummary); fall back to cached pricingSummary
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

  const totalPayment = pricingSummary?.total || 0

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mobileCountryCode, setMobileCountryCode] = useState(
    bookingFormData.mobileCountryCode || String(user?.country_code || "91")
  )
  const [gstPhoneCountryCode, setGstPhoneCountryCode] = useState(
    bookingFormData.gstPhoneCountryCode || "91"
  )
  const [fullMobile, setFullMobile] = useState(bookingFormData.mobileWithCountryCode || "")
  const [fullGstPhone, setFullGstPhone] = useState(bookingFormData.gstPhoneWithCountryCode || "")
  const [emailVerification, setEmailVerification] = useState<{
    isChecking: boolean
    isValid: boolean | null
    message: string
  }>({
    isChecking: false,
    isValid: null,
    message: "",
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [bookingResponse, setBookingResponse] = useState<any>(null)
  const [razorpayPaymentData, setRazorpayPaymentData] = useState<RazorpaySuccessResponse | null>(null)
  const [isBookingOnHold, setIsBookingOnHold] = useState(false)
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("")
  const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false)
  const [isPolicyOpen, setIsPolicyOpen] = useState(false)
  const [isGuestCollapsed, setIsGuestCollapsed] = useState(false)
  const lastSubmittedFormRef = useRef<SingleStepBookingFormData | null>(null)

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
  const cancellationPolicies = bookingFormData.cancellationPolicies || []


  useEffect(() => {
    if (hotelData || roomPricing.length > 0) {
      console.log("=== BOOKING PAGE API DATA ===", {
        hotelData,
        roomPricing,
        cancellationPolicies
      })
    }
  }, [hotelData, roomPricing, cancellationPolicies])

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    setValue,
    trigger,
    clearErrors,
  } = useForm<SingleStepBookingFormData>({
    resolver: zodResolver(singleStepBookingSchema),
    mode: "onChange",
    defaultValues: {
      firstName: bookingFormData.firstName || user?.first_name || "",
      lastName: bookingFormData.lastName || user?.last_name || "",
      email: bookingFormData.email || user?.email || "",
      mobile:
        bookingFormData.mobile ||
        getNationalNumber(user?.mobile, String(user?.country_code || "91")),
      hasGST: bookingFormData.hasGST || false,
      gstNumber: bookingFormData.gstNumber || "",
      companyName: bookingFormData.companyName || "",
      gstPhone: bookingFormData.gstPhone || "",
      gstAddress: bookingFormData.gstAddress || "",
      street: bookingFormData.street || "",
      houseNumber: bookingFormData.houseNumber || "",
      countryId: bookingFormData.countryId || "",
      stateId: bookingFormData.stateId || "",
      cityId: bookingFormData.cityId || "",
      agreeToCancellationPolicy: false,
      agreeToTerms: false,
    },
  })

  const formValues = watch()
  const hasGST = watch("hasGST")
  const guestEmail = watch("email")

  // Country -> State -> City cascading dropdowns (same flow as the list-property form)
  const selectedCountryId = watch("countryId")
  const selectedStateId = watch("stateId")
  const selectedCityId = watch("cityId")

  const { data: countriesData, isLoading: isLoadingCountries } = useCountries()
  const { data: statesData, isLoading: isLoadingStates } = useStates(selectedCountryId || "")
  const { data: citiesData, isLoading: isLoadingCities } = useCities(selectedStateId || "")

  const countryOptions: SelectOption[] =
    countriesData?.records?.map((c: any) => ({ value: String(c.id), label: c.name })) ?? []
  const stateOptions: SelectOption[] =
    statesData?.records?.map((s: any) => ({ value: String(s.id), label: s.name })) ?? []
  const cityOptions: SelectOption[] =
    citiesData?.records?.map((ct: any) => ({ value: String(ct.id), label: ct.name })) ?? []

  // Pincode auto-lookup & location cascade state
  const [isPincodeLoading, setIsPincodeLoading] = useState(false)
  const [pincodeStatus, setPincodeStatus] = useState<{
    success: boolean
    country: string
    state: string
    city: string
    message?: string
  } | null>(null)
  const [showManualLocation, setShowManualLocation] = useState(false)
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

        // Match country (e.g. India)
        if (countryOptions.length > 0) {
          const matchedCountry = findBestMatchingOption(countryOptions, res.country) || countryOptions.find(opt => String(opt.label).toLowerCase() === "india") || countryOptions[0]
          if (matchedCountry) {
            setValue("countryId", String(matchedCountry.value), { shouldValidate: true })
            setValue("stateId", "")
            setValue("cityId", "")
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
        setShowManualLocation(true)
      }
    } catch (err) {
      console.error("Pincode lookup failed:", err)
      setPincodeStatus({
        success: false,
        country: "",
        state: "",
        city: "",
        message: "Failed to fetch pincode location",
      })
      setShowManualLocation(true)
    } finally {
      setIsPincodeLoading(false)
    }
  }, [countryOptions, setValue])

  // Step 2 of Cascade: When statesData options arrive for selected country, match state
  useEffect(() => {
    if (!pendingLocationRef.current?.state || !stateOptions.length) return
    const matchedState = findBestMatchingOption(stateOptions, pendingLocationRef.current.state)
    if (matchedState) {
      setValue("stateId", String(matchedState.value), { shouldValidate: true })
      setValue("cityId", "")
    } else {
      pendingLocationRef.current = null
    }
  }, [stateOptions, setValue])

  // Step 3 of Cascade: When citiesData options arrive for selected state, match city
  useEffect(() => {
    if (!pendingLocationRef.current?.city || !cityOptions.length) return
    const matchedCity = findBestMatchingOption(cityOptions, pendingLocationRef.current.city)
    if (matchedCity) {
      setValue("cityId", String(matchedCity.value), { shouldValidate: true })
    }
    // Always clear pending location ref after city cascade attempt
    pendingLocationRef.current = null
  }, [cityOptions, setValue])

  // Auto-trigger pincode lookup if houseNumber is prefilled on mount with a 6-digit pin
  useEffect(() => {
    const existingPin = formValues.houseNumber
    if (existingPin && existingPin.length === 6 && !pincodeStatus && !isPincodeLoading && countryOptions.length > 0) {
      handlePincodeChange(existingPin)
    }
  }, [countryOptions.length])

  // Buttons enable only when every required field + both policy checkboxes pass the schema.
  // safeParse (instead of formState.isValid) avoids flashing errors on untouched fields at mount.
  const canSubmit = singleStepBookingSchema.safeParse(formValues).success

  // Prefill guest details when user logs in (without overwriting filled fields)
  useEffect(() => {
    if (!user) return
    if (!formValues.firstName && user.first_name) setValue("firstName", user.first_name)
    if (!formValues.lastName && user.last_name) setValue("lastName", user.last_name)
    if (!formValues.email && user.email) setValue("email", user.email)
    if (!formValues.mobile && user.mobile) {
      const dialCode = String(user.country_code || "91")
      setMobileCountryCode(dialCode)
      setValue("mobile", getNationalNumber(user.mobile, dialCode))
    }
  }, [user, formValues.firstName, formValues.lastName, formValues.email, formValues.mobile, setValue])

  const openLogin = () => {
    onRequestLogin?.(guestEmail || undefined)
  }

  const isValidField = (fieldName: keyof SingleStepBookingFormData) => {
    const isTouched = touchedFields[fieldName]
    const hasValue = !!formValues[fieldName]
    const hasError = !!errors[fieldName]
    return isTouched && hasValue && !hasError
  }

  // Email verification logic
  const verifyEmail = useCallback(
    async (email: string) => {
      console.log('🔍 [CheckoutForm] Verifying email address:', email)
      if (!email || !email.includes("@")) {
        setEmailVerification({ isChecking: false, isValid: null, message: "" })
        return
      }

      setEmailVerification({ isChecking: true, isValid: null, message: "" })

      try {
        const response = await verifyEmailAPI(email)
        console.log('🔍 [CheckoutForm] Email verification response:', response.data)
        if (response.data.status === "success" && response.data.message === "Email is new.") {
          setEmailVerification({ isChecking: false, isValid: true, message: "Email is available" })
          clearErrors("email")
        } else if (response.data.userdetail) {
          setEmailVerification({
            isChecking: false,
            isValid: true,
            message: "Welcome back! Your details have been loaded.",
          })
          clearErrors("email")
          const userData = response.data.userdetail
          console.log('👤 [CheckoutForm] Auto-filling profile for existing user:', userData)
          if (userData.first_name) setValue("firstName", userData.first_name)
          if (userData.last_name) setValue("lastName", userData.last_name)
          if (userData.mobile) {
            const dialCode = String(userData.country_code || "91")
            setMobileCountryCode(dialCode)
            setValue("mobile", getNationalNumber(userData.mobile, dialCode))
          }
          toast.success("Welcome back!", { description: "Your profile details have been loaded automatically." })
        } else {
          setEmailVerification({ isChecking: false, isValid: true, message: "Email verified." })
          clearErrors("email")
        }
      } catch (error) {
        console.error('⚠️ [CheckoutForm] Email verification failed or skipped:', error)
        setEmailVerification({ isChecking: false, isValid: true, message: "Email verification skipped." })
        clearErrors("email")
      }
    },
    [clearErrors, setValue]
  )

  const [emailTimeout, setEmailTimeout] = useState<NodeJS.Timeout | null>(null)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    if (emailTimeout) clearTimeout(emailTimeout)
    setEmailVerification({ isChecking: false, isValid: null, message: "" })
    const newTimeout = setTimeout(() => verifyEmail(email), 1000)
    setEmailTimeout(newTimeout)
  }

  useEffect(() => {
    return () => { if (emailTimeout) clearTimeout(emailTimeout) }
  }, [emailTimeout])

  const handlePaymentSuccess = async (razorpayResponse: RazorpaySuccessResponse) => {
    console.log('💳 [CheckoutForm] Razorpay payment successful! Response data:', razorpayResponse)
    setRazorpayPaymentData(razorpayResponse)
    setIsProcessingPayment(true)
    setShowSuccessModal(true)

    try {
      const storedPayload = sessionStorage.getItem('bookingPayload')
      if (!storedPayload) {
        console.error('⚠️ [CheckoutForm] bookingPayload not found in sessionStorage!')
        toast.error("Booking data not found. Please try again.")
        setShowSuccessModal(false)
        setIsProcessingPayment(false)
        setIsSubmitting(false)
        return
      }

      const bookingPayload = JSON.parse(storedPayload)
      console.log("OLD payload", bookingPayload)
      /*
      const finalPayload = {
        ...bookingPayload,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature
      }
      */
      const finalPayload = {
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        booking_id: bookingPayload.booking_id,
        fname: bookingPayload.fname,
        lname: bookingPayload.lname,
        email: bookingPayload.email || formValues.email || user?.email || '',
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

        // coupon_code: bookingPayload.coupon_code,
        // coupon_id: bookingPayload.coupon_id,
        // member_only_promotion: bookingPayload.member_only_promotion,
        // member_only_discount: bookingPayload.member_only_discount,
      }

      console.log('💳 [CheckoutForm] Confirming payment with backend. Final payload:')
      console.log(JSON.stringify(finalPayload, null, 2))

      const response = await confirmPaymentSuccess(finalPayload)
      console.log('💳 [CheckoutForm] Backend confirmPaymentSuccess API response:', response)
      setBookingResponse(response)

      if (response.status === 200 || response.status === 201) {
        console.log('✅ [CheckoutForm] Booking completed successfully!')
        sessionStorage.setItem('bookingResponse', JSON.stringify(response.data))
        sessionStorage.removeItem('bookingPayload')
        setIsProcessingPayment(false)
      } else {
        console.error('⚠️ [CheckoutForm] Backend payment confirmation returned error status:', response.status, response.data)
        setShowSuccessModal(false)
        setIsProcessingPayment(false)
        setIsBookingOnHold(true)
        setPaymentErrorMessage(response?.data?.message || "Payment received but booking verification failed.")
        setShowPaymentErrorModal(true)
      }
    } catch (error: any) {
      console.error('❌ [CheckoutForm] Exception in handlePaymentSuccess handler:', error)
      setShowSuccessModal(false)
      setIsProcessingPayment(false)
      setIsBookingOnHold(true)
      setPaymentErrorMessage(error?.response?.data?.message || "Payment received but booking verification failed.")
      setShowPaymentErrorModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (data: SingleStepBookingFormData) => {
    lastSubmittedFormRef.current = data
    setIsSubmitting(true)
    console.log('🚀 [CheckoutForm] User triggered Pay & Book. Form validation passed. Form data:', data)
    try {
      console.log('👤 [CheckoutForm] Using active authenticated user session:', user)

      // 1. Build Payload
      if (!hotelData || !roomPricing.length) {
        console.error('⚠️ [CheckoutForm] Cannot build payload. Missing hotelData or roomPricing:', { hotelData, roomPricing })
        toast.error("Unable to fetch hotel data. Please try again.")
        setIsSubmitting(false)
        return
      }

      const childrenAges = bookingFormData.childrenAges || []
      const cancellationPolicyId = cancellationPolicies.length > 0 ? cancellationPolicies[0]?.cancellation_policy : null

      const updatedBookingData = {
        ...bookingFormData,
        ...data,
        mobileCountryCode,
        mobileWithCountryCode: fullMobile,
        gstPhoneCountryCode,
        gstPhoneWithCountryCode: fullGstPhone,
        cancellationPolicyId,
        // Resolved names of the selected billing location (IDs live in countryId/stateId/cityId)
        countryName: countryOptions.find((opt) => opt.value === data.countryId)?.label || "",
        stateName: stateOptions.find((opt) => opt.value === data.stateId)?.label || "",
        cityName: cityOptions.find((opt) => opt.value === data.cityId)?.label || "",
      }

      console.log('📦 [CheckoutForm] Updating Redux bookingFormData state:', updatedBookingData)
      // Update redux with what we have
      dispatch(updateBookingFormData(updatedBookingData))

      const bookingPayload = buildBookingPayload(
        updatedBookingData as any,
        hotelData,
        roomPricing,
        childrenAges
      )

      // Override all top-level pricing fields with correct amounts from pricingSummary
      // (same source as the PriceBreakdownModal and sidebar display)
      if (pricingSummary) {
        console.log('💰 [CheckoutForm] Applying pricingSummary overrides:', pricingSummary)
        const gstAmount = pricingSummary.totalTax || 0
        const serviceChargeAmount = pricingSummary.totalDeductions || 0
        const roomPromoDiscount = pricingSummary.totalPromotionalDiscount || 0
        const couponDiscount = pricingSummary.couponDiscount || 0
        const memberOnlyDiscount = pricingSummary.memberOnlyDiscount || 0

        // Original subtotal before room promotions
        const originalSubtotal = pricingSummary.subtotal + roomPromoDiscount
        // Total discount is room promotions + coupon + member discounts
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
        bookingPayload.total = pricingSummary.total.toFixed(2)

        // Add coupon & member-only promotion details directly
        bookingPayload.coupon_code = bookingFormData.appliedCoupon?.coupon_code || ''
        bookingPayload.coupon_id = bookingFormData.appliedCoupon?.id || null
        bookingPayload.member_only_promotion_id = bookingFormData.memberOnlyPromotion?.id || null
      }

      sessionStorage.setItem('bookingPayload', JSON.stringify(bookingPayload))
      console.log('📦 [CheckoutForm] Serialized booking payload to sessionStorage.')

      // 3. Create Payment Order
      const totalAmount = Math.round(pricingSummary?.total || 0)
      console.log('💳 [CheckoutForm] Generating backend Razorpay order for amount:', totalAmount)
      const orderResponse = await createPaymentOrder(totalAmount.toString())
      console.log('💳 [CheckoutForm] createPaymentOrder response:', orderResponse)

      if (!orderResponse.data || !orderResponse.data.id) {
        console.error('💳 [CheckoutForm] order_id generation failed from backend:', orderResponse)
        toast.error("Failed to create payment order. Please try again.")
        setIsSubmitting(false)
        return
      }

      // 4. Load Razorpay and open modal
      console.log('💳 [CheckoutForm] Loading Razorpay script dynamically...')
      const isScriptLoaded = await loadRazorpayScript()
      if (!isScriptLoaded) {
        console.error('💳 [CheckoutForm] Razorpay SDK script tag execution failed.')
        toast.error("Failed to load payment gateway.")
        setIsSubmitting(false)
        return
      }

      // Key resolution: prioritize backend order key if returned, fallback to environment variable
      const razorpayKey =
        orderResponse.data?.key ||
        orderResponse.data?.key_id ||
        orderResponse.data?.razorpay_key ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      if (!razorpayKey) {
        console.error('💳 [CheckoutForm] Razorpay Key ID is undefined!')
        toast.error("Payment configuration error: Razorpay Key ID is missing.")
        setIsSubmitting(false)
        return
      }

      console.log('💳 [CheckoutForm] Presenting Razorpay overlay modal. Key:', `${razorpayKey.substring(0, 10)}...`)

      let isPaymentResolved = false
      let safetyTimer: NodeJS.Timeout | null = null

      const cleanupSafety = () => {
        isPaymentResolved = true
        if (safetyTimer) clearTimeout(safetyTimer)
        window.removeEventListener('focus', handleWindowFocus)
      }

      const handleWindowFocus = () => {
        // When window regains focus, check if modal failed asynchronously without firing callbacks
        setTimeout(() => {
          if (!isPaymentResolved) {
            console.warn('💳 [CheckoutForm] Window focused without payment resolution. Unlocking loading state.')
            cleanupSafety()
            setIsSubmitting(false)
          }
        }, 1500)
      }

      window.addEventListener('focus', handleWindowFocus)

      // Fallback timer (30s max wait time if Razorpay iframe hangs or fails silently)
      safetyTimer = setTimeout(() => {
        if (!isPaymentResolved) {
          console.warn('💳 [CheckoutForm] Safety timeout reached. Unlocking loading state.')
          cleanupSafety()
          setIsSubmitting(false)
        }
      }, 30000)

      try {
        openRazorpayModal({
          key: razorpayKey,
          amount: orderResponse.data.amount,
          currency: orderResponse.data.currency || "INR",
          name: "Spodia.com",
          description: `Booking for ${(bookingFormData.rooms || []).length} room(s)`,
          image: hotelData.listing_images?.[0]?.image || "",
          order_id: orderResponse.data.id,
          handler: (response: RazorpaySuccessResponse) => {
            cleanupSafety()
            handlePaymentSuccess(response)
          },
          onPaymentFailed: (errorResponse: RazorpayErrorResponse) => {
            cleanupSafety()
            console.error('💳 [CheckoutForm] Razorpay payment.failed handler triggered:', errorResponse)
            setIsSubmitting(false)
            setIsBookingOnHold(false)

            const errObj = errorResponse?.error
            const code = errObj?.code || ''
            const description = errObj?.description || ''

            let errorMsg = "Payment was not completed. Please try again or choose another payment method."
            if (code === "BAD_REQUEST_ERROR" || description.toLowerCase().includes("unauthorized") || description.toLowerCase().includes("key")) {
              errorMsg = "Payment Gateway Unauthorized (401). Invalid or mismatched Razorpay Key. Please contact support."
            } else if (description) {
              errorMsg = `Payment Failed: ${description}`
            }

            toast.error(errorMsg)
            setPaymentErrorMessage(errorMsg)
            setShowPaymentErrorModal(true)
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: fullMobile
          },
          theme: { color: "#078ED8" },
          modal: {
            ondismiss: () => {
              cleanupSafety()
              console.log('💳 [CheckoutForm] User closed the Razorpay modal.')
              setIsSubmitting(false)
              setIsBookingOnHold(false)
              setPaymentErrorMessage("Payment was cancelled. You can try again when ready.")
              setShowPaymentErrorModal(true)
            }
          }
        })
      } catch (modalErr: any) {
        cleanupSafety()
        console.error("💳 [CheckoutForm] Error executing openRazorpayModal:", modalErr)
        toast.error("Failed to launch payment window. Please try again.")
        setIsSubmitting(false)
      }
    } catch (error: any) {
      console.error("❌ [CheckoutForm] Exception caught in onSubmit:", error)
      toast.error(error?.message || "Something went wrong.")
      setIsSubmitting(false)
    }
  }

  const handleRetryPayment = () => {
    setShowPaymentErrorModal(false)
    setIsBookingOnHold(false)
    setPaymentErrorMessage("")
    setIsSubmitting(false)
    const lastData = lastSubmittedFormRef.current
    if (lastData) {
      onSubmit(lastData)
    }
  }

  return (
    <>
      {showSuccessModal && (
        <PaymentSuccessModal
          bookingResponse={bookingResponse}
          razorpayPaymentData={razorpayPaymentData}
          hotelName={bookingFormData.hotelName || hotelData?.name}
          hotelLocation={bookingFormData.hotelLocation}
          checkInDate={bookingFormData.checkInDate}
          checkOutDate={bookingFormData.checkOutDate}
          totalAmount={totalPayment}
          guestEmail={lastSubmittedFormRef.current?.email || guestEmail}
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
            setPaymentErrorMessage("")
          }}
          onRetry={!isBookingOnHold ? handleRetryPayment : undefined}
          isRetrying={isSubmitting}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
        {/* GUEST DETAILS Card */}
        <Card className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
          <div
            onClick={() => setIsGuestCollapsed(!isGuestCollapsed)}
            className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer select-none bg-white hover:bg-gray-50/50 transition-colors"
          >
            <h3 className="text-base font-extrabold text-gray-900 tracking-wide uppercase">
              GUEST DETAILS
            </h3>
            <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
              {isGuestCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>

          {!isGuestCollapsed && (
            <CardContent className="p-6 space-y-6">
              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name <span className="text-red-500">*</span></label>
                  <Input
                    {...register("firstName")}
                    autoComplete="off"
                    placeholder="Enter First Name"
                    className={`h-12 border-gray-200 focus:border-orange-500 font-semibold ${errors.firstName ? "border-red-500" : ""}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name <span className="text-red-500">*</span></label>
                  <Input
                    {...register("lastName")}
                    autoComplete="off"
                    placeholder="Enter Last Name"
                    className={`h-12 border-gray-200 focus:border-orange-500 font-semibold ${errors.lastName ? "border-red-500" : ""}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email & Phone Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("email", { onChange: handleEmailChange })}
                    type="email"
                    autoComplete="off"
                    placeholder="Enter Email Address"
                    className={`h-12 border-gray-200 focus:border-orange-500 font-semibold ${errors.email ? "border-red-500" : ""}`}
                  />
                  <span className="text-[10px] text-gray-400 font-bold block leading-normal mt-1">
                    Your booking voucher will be sent to this email address.
                  </span>
                  {emailVerification.message && <p className="text-xs text-blue-600 mt-1">{emailVerification.message}</p>}
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <PhoneNumberInput
                    value={formValues.mobile || ""}
                    countryCode={mobileCountryCode}
                    onChange={(phone, meta) => {
                      setValue("mobile", phone, { shouldValidate: true, shouldTouch: true })
                      setMobileCountryCode(meta.dialCode)
                      setFullMobile(meta.fullNumber)
                    }}
                    onMount={(meta) => setFullMobile(meta.fullNumber)}
                    error={!!errors.mobile}
                    valid={isValidField("mobile")}
                    placeholder="Enter Phone Number"
                    name="mobile"
                  />
                  <span className="text-[10px] text-gray-400 font-bold block leading-normal mt-1">
                    Used for urgent booking updates.
                  </span>
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                </div>
              </div>

              {/* GST Checkbox & Fields */}
              <div className="pt-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="hasGST"
                    checked={hasGST}
                    onCheckedChange={(checked) => setValue("hasGST", checked as boolean)}
                  />
                  <label htmlFor="hasGST" className="text-sm text-gray-700 font-bold cursor-pointer select-none">
                    Enter GST Details (Optional)
                  </label>
                </div>

                {hasGST && (
                  <div className="mt-4 p-5 bg-blue-50/55 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">GST Number <span className="text-red-500">*</span></label>
                      <Input {...register("gstNumber")} autoComplete="off" placeholder="GST Number" className="h-11 font-semibold" />
                      {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name <span className="text-red-500">*</span></label>
                      <Input {...register("companyName")} autoComplete="off" placeholder="Company Name" className="h-11 font-semibold" />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label>
                      <PhoneNumberInput
                        value={formValues.gstPhone || ""}
                        countryCode={gstPhoneCountryCode}
                        onChange={(phone, meta) => {
                          setValue("gstPhone", phone, { shouldValidate: true, shouldTouch: true })
                          setGstPhoneCountryCode(meta.dialCode)
                          setFullGstPhone(meta.fullNumber)
                        }}
                        onMount={(meta) => setFullGstPhone(meta.fullNumber)}
                        error={!!errors.gstPhone}
                        size="md"
                        placeholder="Phone Number"
                        name="gstPhone"
                      />
                      {errors.gstPhone && <p className="text-red-500 text-xs mt-1">{errors.gstPhone.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">GST Address <span className="text-red-500">*</span></label>
                      <Input {...register("gstAddress")} autoComplete="off" placeholder="GST Address" className="h-11 font-semibold" />
                      {errors.gstAddress && <p className="text-red-500 text-xs mt-1">{errors.gstAddress.message}</p>}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* YOUR ADDRESS DETAILS Card */}
        <Card className="border border-gray-200 bg-white rounded-xl overflow-visible shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 tracking-wide uppercase">
                YOUR ADDRESS DETAILS
              </h3>
            </div>
          </div>

          <CardContent className="p-6 space-y-5">
            {/* Field 1: PIN CODE / ZIP CODE (PLACED IN FIRST PLACE) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  PIN Code / ZIP Code <span className="text-red-500">*</span>
                </label>
                {pincodeStatus?.success && (
                  <button
                    type="button"
                    onClick={() => setShowManualLocation(!showManualLocation)}
                    className="text-xs text-[#078ED8] font-bold hover:underline flex items-center gap-1"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {showManualLocation ? "Hide Manual Selection" : "Edit Location Manually"}
                  </button>
                )}
              </div>

              <div className="relative">
                <Input
                  {...register("houseNumber", {
                    onChange: (e) => {
                      const val = e.target.value
                      if (val.length === 6) {
                        handlePincodeChange(val)
                      }
                    }
                  })}
                  autoComplete="off"
                  maxLength={10}
                  placeholder="Enter 6-Digit PIN Code (e.g. 110001)"
                  className={`h-12 font-semibold border-gray-200 focus:border-orange-500 pr-10 ${
                    errors.houseNumber ? "border-red-500" : pincodeStatus?.success ? "border-green-500" : ""
                  }`}
                />
                <div className="absolute right-3 top-3 flex items-center">
                  {isPincodeLoading ? (
                    <Loader2 className="w-5 h-5 text-[#078ED8] animate-spin" />
                  ) : pincodeStatus?.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : null}
                </div>
              </div>

              {/* Status Indicator below Pincode input */}
              {isPincodeLoading && (
                <p className="text-xs text-blue-600 font-semibold flex items-center gap-1.5 mt-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching location via Google Maps...
                </p>
              )}



              {pincodeStatus?.success === false && (
                <p className="text-xs text-amber-600 font-semibold mt-1">
                  {pincodeStatus.message || "Pincode location not auto-detected. Please select Country, State, and City manually below."}
                </p>
              )}

              {errors.houseNumber && <p className="text-red-500 text-xs mt-1">{errors.houseNumber.message}</p>}
            </div>

            {/* Field 2: Country, State, City (Always visible & manually editable) */}
            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Location Details (Country, State & City)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country</label>
                  <Select
                    instanceId="booking-billing-country-select"
                    options={countryOptions}
                    value={countryOptions.find((opt) => opt.value === selectedCountryId) || null}
                    styles={billingSelectStyles}
                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                    onChange={(val: SelectOption | null) => {
                      pendingLocationRef.current = null
                      setPincodeStatus(null)
                      setValue("houseNumber", "")
                      setValue("countryId", val ? String(val.value) : "", { shouldValidate: true })
                      setValue("stateId", "")
                      setValue("cityId", "")
                    }}
                    isSearchable
                    isClearable
                    isLoading={isPincodeLoading || isLoadingCountries}
                    placeholder="Select Country"
                  />
                  {errors.countryId && <p className="text-red-500 text-xs mt-1">{errors.countryId.message}</p>}
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                  <Select
                    instanceId="booking-billing-state-select"
                    options={stateOptions}
                    value={stateOptions.find((opt) => opt.value === selectedStateId) || null}
                    styles={billingSelectStyles}
                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                    onChange={(val: SelectOption | null) => {
                      pendingLocationRef.current = null
                      setPincodeStatus(null)
                      setValue("houseNumber", "")
                      setValue("stateId", val ? String(val.value) : "", { shouldValidate: true })
                      setValue("cityId", "")
                    }}
                    isSearchable
                    isClearable
                    isDisabled={!selectedCountryId}
                    isLoading={isPincodeLoading || isLoadingStates}
                    placeholder="Select State"
                  />
                  {errors.stateId && <p className="text-red-500 text-xs mt-1">{errors.stateId.message}</p>}
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                  <Select
                    instanceId="booking-billing-city-select"
                    options={cityOptions}
                    value={cityOptions.find((opt) => opt.value === selectedCityId) || null}
                    styles={billingSelectStyles}
                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                    onChange={(val: SelectOption | null) => {
                      pendingLocationRef.current = null
                      setPincodeStatus(null)
                      setValue("houseNumber", "")
                      setValue("cityId", val ? String(val.value) : "", { shouldValidate: true })
                    }}
                    isSearchable
                    isClearable
                    isDisabled={!selectedStateId}
                    isLoading={isPincodeLoading || isLoadingCities}
                    placeholder="Select City"
                  />
                  {errors.cityId && <p className="text-red-500 text-xs mt-1">{errors.cityId.message}</p>}
                </div>
              </div>
            </div>

            {/* Field 3: Billing Address Textarea */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Billing Address / Street
              </label>
              <textarea
                {...register("street")}
                autoComplete="off"
                placeholder="Enter house/flat number, street name, area details"
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 resize-none transition-colors"
              />
              {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Policies & Action Card */}
        <Card className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Policies Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="agreeToCancellationPolicy"
                  checked={!!formValues.agreeToCancellationPolicy}
                  onCheckedChange={(checked) => setValue("agreeToCancellationPolicy", checked as boolean, { shouldValidate: true })}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="agreeToCancellationPolicy" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                      I accept the Cancellation Policy
                    </label>
                    {cancellationPolicies.length > 0 && (
                      <div className="flex items-center">
                        <Popover open={isPolicyOpen} onOpenChange={setIsPolicyOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-[#078ED8] transition-colors focus:outline-none"
                              onMouseEnter={() => setIsPolicyOpen(true)}
                              onMouseLeave={() => setIsPolicyOpen(false)}
                              onClick={() => setIsPolicyOpen(!isPolicyOpen)}
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[320px] p-4 bg-white border shadow-xl z-[60] pointer-events-none"
                            side="right"
                            align="start"
                            onMouseEnter={() => setIsPolicyOpen(true)}
                            onMouseLeave={() => setIsPolicyOpen(false)}
                          >
                            <div className="space-y-3">
                              <h4 className="text-sm font-bold text-gray-900 border-b pb-2">Policy Details</h4>
                              {cancellationPolicies.map((policy: any, index: number) => (
                                <div key={index} className="space-y-1">
                                  <p className="text-xs font-bold text-[#078ED8]">{policy.policy_name}</p>
                                  {policy.policy_description && (
                                    <div
                                      className="text-[10px] text-gray-600 leading-relaxed"
                                      dangerouslySetInnerHTML={{ __html: policy.policy_description }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                  {errors.agreeToCancellationPolicy && <p className="text-red-500 text-[10px] font-semibold">{errors.agreeToCancellationPolicy.message}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={!!formValues.agreeToTerms}
                  onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean, { shouldValidate: true })}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="agreeToTerms" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                    I accept <a href="/terms-conditions" target="_blank" className="text-[#078ED8] hover:underline font-extrabold">Terms & Condition</a> and <a href="/privacy-policy" target="_blank" className="text-[#078ED8] hover:underline font-extrabold">Privacy Policy</a>
                  </label>
                  {errors.agreeToTerms && <p className="text-red-500 text-[10px] font-semibold">{errors.agreeToTerms.message}</p>}
                </div>
              </div>
            </div>

            {/* Final Amount and Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Amount</p>
                <p className="text-2xl font-black text-orange-600 tracking-tight">₹{Math.round(totalPayment).toLocaleString('en-IN')}</p>
              </div>
              <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-1.5">
                <Button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className="w-full sm:w-auto bg-[#078ED8] hover:bg-[#0679b8] text-white px-12 h-12 rounded-full text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Pay & Book Now"
                  )}
                </Button>
                {!user && (
                  <button
                    type="button"
                    onClick={openLogin}
                    className="text-[11px] text-[#078ED8] font-semibold hover:underline flex items-center gap-1"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Log in for member discounts &amp; coupons
                  </button>
                )}
                {!canSubmit && (
                  <p className="text-[10px] text-gray-400 font-semibold text-center sm:text-right">
                    Fill in all required details &amp; accept the policies to continue
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  )
}

export default SingleStepBookingForm
