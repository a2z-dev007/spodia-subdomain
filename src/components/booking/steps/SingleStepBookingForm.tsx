"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData, resetBookingForm } from "@/lib/features/booking/bookingSlice"
import { singleStepBookingSchema, type SingleStepBookingFormData } from "@/lib/validations/booking"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Info, User as UserIcon, Mail, Phone, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { updateUser, setTokens } from "@/lib/features/auth/authSlice"
import type { User } from "@/lib/features/auth/authSlice"
import { verifyEmail as verifyEmailAPI, addGuestUser, getPropertyById, getRoomInventoryAndPricing, createPaymentOrder, confirmPaymentSuccess } from "@/services/api"
import { buildBookingPayload } from "@/utils/bookingPayloadBuilder"
import { format } from "date-fns"
import { loadRazorpayScript, openRazorpayModal, RazorpaySuccessResponse } from "@/utils/razorpay"
import { useQuery } from "@tanstack/react-query"

const SingleStepBookingForm = () => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })
  const [isSubmitting, setIsSubmitting] = useState(false)
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
  const [bookingResponse, setBookingResponse] = useState<any>(null)
  const [razorpayPaymentData, setRazorpayPaymentData] = useState<RazorpaySuccessResponse | null>(null)
  const [isBookingOnHold, setIsBookingOnHold] = useState(false)
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("")
  const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false)
  const [isPolicyOpen, setIsPolicyOpen] = useState(false)

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
      mobile: bookingFormData.mobile || user?.mobile || "",
      hasGST: bookingFormData.hasGST || false,
      gstNumber: bookingFormData.gstNumber || "",
      companyName: bookingFormData.companyName || "",
      gstPhone: bookingFormData.gstPhone || "",
      gstAddress: bookingFormData.gstAddress || "",
      agreeToCancellationPolicy: false,
      agreeToTerms: false,
    },
  })

  const formValues = watch()
  const hasGST = watch("hasGST")

  const isValidField = (fieldName: keyof SingleStepBookingFormData) => {
    const isTouched = touchedFields[fieldName]
    const hasValue = !!formValues[fieldName]
    const hasError = !!errors[fieldName]
    return isTouched && hasValue && !hasError
  }

  // Email verification logic
  const verifyEmail = useCallback(
    async (email: string) => {
      if (!email || !email.includes("@")) {
        setEmailVerification({ isChecking: false, isValid: null, message: "" })
        return
      }

      setEmailVerification({ isChecking: true, isValid: null, message: "" })

      try {
        const response = await verifyEmailAPI(email)
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
          if (userData.first_name) setValue("firstName", userData.first_name)
          if (userData.last_name) setValue("lastName", userData.last_name)
          if (userData.mobile) setValue("mobile", userData.mobile)
          toast.success("Welcome back!", { description: "Your profile details have been loaded automatically." })
        } else {
          setEmailVerification({ isChecking: false, isValid: true, message: "Email verified." })
          clearErrors("email")
        }
      } catch (error) {
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
    try {
      setRazorpayPaymentData(razorpayResponse)
      const storedPayload = sessionStorage.getItem('bookingPayload')
      if (!storedPayload) {
        toast.error("Booking data not found. Please try again.")
        setIsSubmitting(false)
        return
      }

      const bookingPayload = JSON.parse(storedPayload)
      const finalPayload = {
        ...bookingPayload,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature
      }

      const response = await confirmPaymentSuccess(finalPayload)
      setBookingResponse(response)

      if (response.status === 200 || response.status === 201) {
        sessionStorage.setItem('bookingResponse', JSON.stringify(response.data))
        sessionStorage.removeItem('bookingPayload')
        setShowSuccessModal(true)
        setTimeout(() => {
          window.location.href = "/my-bookings"
        }, 5000)
      } else {
        setIsBookingOnHold(true)
        setPaymentErrorMessage(response?.data?.message || "Payment received but booking verification failed.")
        setShowPaymentErrorModal(true)
      }
    } catch (error: any) {
      setIsBookingOnHold(true)
      setPaymentErrorMessage(error?.response?.data?.message || "Payment received but booking verification failed.")
      setShowPaymentErrorModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (data: SingleStepBookingFormData) => {
    setIsSubmitting(true)
    try {
      // 1. Ensure user is logged in or create guest user
      let currentUser = user
      if (!currentUser) {
        const guestResponse = await addGuestUser({
          first_name: data.firstName,
          last_name: data.lastName,
          mobile: data.mobile,
          email: data.email,
          user_type: "Customers",
          country_code: "91",
        })

        if (guestResponse.status === 200 || guestResponse.status === 201) {
          const responseData = guestResponse.data
          if (responseData.status === "success" && responseData.userdetail && responseData.access && responseData.refresh) {
            currentUser = responseData.userdetail
            const accessToken = responseData.access
            const refreshToken = responseData.refresh
            if (typeof window !== "undefined") {
              localStorage.setItem("spodia_access_token", accessToken)
              localStorage.setItem("spodia_refresh_token", refreshToken)
              localStorage.setItem("spodia_user", JSON.stringify(currentUser))
            }
            dispatch(updateUser(currentUser as User))
            dispatch(setTokens({ accessToken, refreshToken }))
          }
        } else {
          toast.error(guestResponse.data?.message || "Failed to save guest information")
          setIsSubmitting(false)
          return
        }
      }

      // 2. Build Payload
      if (!hotelData || !roomPricing.length) {
        toast.error("Unable to fetch hotel data. Please try again.")
        setIsSubmitting(false)
        return
      }

      const childrenAges = bookingFormData.childrenAges || []
      const cancellationPolicyId = cancellationPolicies.length > 0 ? cancellationPolicies[0]?.cancellation_policy : null

      const updatedBookingData = {
        ...bookingFormData,
        ...data,
        cancellationPolicyId
      }
      
      // Update redux with what we have
      dispatch(updateBookingFormData(updatedBookingData))

      const bookingPayload = buildBookingPayload(
        updatedBookingData as any,
        hotelData,
        roomPricing,
        childrenAges
      )

      // Apply pricing from summary if exists
      const pricingSummary = bookingFormData.pricingSummary
      if (pricingSummary) {
        bookingPayload.total = pricingSummary.total.toFixed(2)
      }

      sessionStorage.setItem('bookingPayload', JSON.stringify(bookingPayload))

      // 3. Create Payment Order
      const totalAmount = pricingSummary?.total || 0
      const orderResponse = await createPaymentOrder(totalAmount.toFixed(2))

      if (!orderResponse.data || !orderResponse.data.id) {
        toast.error("Failed to create payment order. Please try again.")
        setIsSubmitting(false)
        return
      }

      // 4. Load Razorpay and open modal
      const isScriptLoaded = await loadRazorpayScript()
      if (!isScriptLoaded) {
        toast.error("Failed to load payment gateway.")
        setIsSubmitting(false)
        return
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!razorpayKey) {
        toast.error("Payment configuration error.")
        setIsSubmitting(false)
        return
      }

      openRazorpayModal({
        key: razorpayKey,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "Spodia.com",
        description: `Booking for ${(bookingFormData.rooms || []).length} room(s)`,
        image: hotelData.listing_images?.[0]?.image || "",
        order_id: orderResponse.data.id,
        handler: handlePaymentSuccess,
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.mobile
        },
        theme: { color: "#078ED8" },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false)
            toast.warning("Payment cancelled.")
          }
        }
      })
    } catch (error: any) {
      console.error("Booking error:", error)
      toast.error(error?.message || "Something went wrong.")
      setIsSubmitting(false)
    }
  }

  const totalPayment = bookingFormData.pricingSummary?.total || 0

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">Your booking has been confirmed successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mt-4"></div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showPaymentErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className={`w-16 h-16 ${isBookingOnHold ? 'bg-yellow-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <AlertCircle className={`w-8 h-8 ${isBookingOnHold ? 'text-yellow-600' : 'text-red-600'}`} />
            </div>
            <h3 className="text-xl font-bold mb-2">{isBookingOnHold ? 'Booking On Hold' : 'Payment Failed'}</h3>
            <p className="text-gray-600 mb-4">{paymentErrorMessage}</p>
            <Button onClick={() => setShowPaymentErrorModal(false)} className="bg-[#078ED8] w-full">Close</Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Complete Your Booking</h2>
            <p className="text-sm text-gray-600">Enter your details to confirm your reservation.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    {...register("firstName")}
                    placeholder="First Name"
                    className={`pl-10 h-12 ${errors.firstName ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    {...register("lastName")}
                    placeholder="Last Name"
                    className={`pl-10 h-12 ${errors.lastName ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Id <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="Email Id"
                    onChange={handleEmailChange}
                    className={`pl-10 h-12 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {emailVerification.message && <p className="text-xs text-blue-600 mt-1">{emailVerification.message}</p>}
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    {...register("mobile")}
                    type="tel"
                    placeholder="Mobile Number"
                    className={`pl-10 h-12 ${errors.mobile ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
              </div>
            </div>

            {/* GST Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Checkbox
                  id="hasGST"
                  checked={hasGST}
                  onCheckedChange={(checked) => setValue("hasGST", checked as boolean)}
                />
                <label htmlFor="hasGST" className="text-sm text-gray-700 cursor-pointer">Do you have GST?</label>
              </div>

              {hasGST && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">GST Number <span className="text-red-500">*</span></label>
                    <Input {...register("gstNumber")} placeholder="GST Number" className="h-11" />
                    {errors.gstNumber && <p className="text-red-500 text-xs">{errors.gstNumber.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company Name <span className="text-red-500">*</span></label>
                    <Input {...register("companyName")} placeholder="Company Name" className="h-11" />
                    {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                    <Input {...register("gstPhone")} placeholder="Phone Number" className="h-11" />
                    {errors.gstPhone && <p className="text-red-500 text-xs">{errors.gstPhone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">GST Address <span className="text-red-500">*</span></label>
                    <Input {...register("gstAddress")} placeholder="GST Address" className="h-11" />
                    {errors.gstAddress && <p className="text-red-500 text-xs">{errors.gstAddress.message}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Policies Section */}
            <div className="space-y-6 pt-6 border-t">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="agreeToCancellationPolicy"
                    onCheckedChange={(checked) => setValue("agreeToCancellationPolicy", checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex items-center gap-2">
                    <label htmlFor="agreeToCancellationPolicy" className="text-sm font-medium leading-none cursor-pointer">
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
                </div>
                {errors.agreeToCancellationPolicy && <p className="text-red-500 text-[10px] ml-9">{errors.agreeToCancellationPolicy.message}</p>}

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="agreeToTerms"
                    onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean)}
                    className="mt-1"
                  />
                  <div className="">
                    <label htmlFor="agreeToTerms" className="text-sm font-medium leading-none cursor-pointer">
                      I accept <a href="/terms-conditions" target="_blank" className="text-[#078ED8] hover:underline font-semibold">Terms & Condition</a> and <a href="/privacy-policy" target="_blank" className="text-[#078ED8] hover:underline font-semibold">Privacy Policy</a>
                    </label>
                    {errors.agreeToTerms && <p className="text-red-500 text-[10px]">{errors.agreeToTerms.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Final Amount and Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t font-semibold">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl text-[#078ED8]">₹{totalPayment.toLocaleString('en-IN')}</p>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#078ED8] hover:bg-[#0679b8] text-white px-12 h-12 rounded-full text-lg"
              >
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Pay & Book Now"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default SingleStepBookingForm
