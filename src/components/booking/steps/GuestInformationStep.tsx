"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData, nextStep } from "@/lib/features/booking/bookingSlice"
import { guestInfoSchema, type GuestInfoFormData } from "@/lib/validations/booking"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { User as UserIcon, Mail, Phone, MessageSquare, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { updateUser, setTokens } from "@/lib/features/auth/authSlice"
import type { User } from "@/lib/features/auth/authSlice"
import { verifyEmail as verifyEmailAPI, addGuestUser } from "@/services/api"

const GuestInformationStep = () => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })


  

  const [emailVerification, setEmailVerification] = useState<{
    isChecking: boolean
    isValid: boolean | null
    message: string
  }>({
    isChecking: false,
    isValid: null,
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    setError,
    clearErrors,
    trigger,
  } = useForm<GuestInfoFormData>({
    resolver: zodResolver(guestInfoSchema),
    mode: "onChange", // Enable real-time validation
    reValidateMode: "onChange",
    defaultValues: {
      firstName: bookingFormData.firstName || user?.first_name || "",
      lastName: bookingFormData.lastName || user?.last_name || "",
      email: bookingFormData.email || user?.email || "",
      mobile: bookingFormData.mobile || user?.mobile || "",
      notes: bookingFormData.notes || "",
    },
  })

  // Real-time validation states derived from hook-form
  const formValues = watch()
  const isValidField = (fieldName: keyof GuestInfoFormData) => {
    const isTouched = touchedFields[fieldName]
    const hasValue = !!formValues[fieldName]
    const hasError = !!errors[fieldName]
    return isTouched && hasValue && !hasError
  }

  // Email verification function - UPDATED TO ALLOW DUPLICATES AND AUTO-FETCH USER DATA
  const verifyEmail = useCallback(
    async (email: string) => {
      if (!email || !email.includes("@")) {
        setEmailVerification({
          isChecking: false,
          isValid: null,
          message: "",
        })
        return
      }

      setEmailVerification({
        isChecking: true,
        isValid: null,
        message: "",
      })

      try {
        const response = await verifyEmailAPI(email)

        // NEW RULE: Allow duplicate emails - always mark as valid
        if (response.data.status === "success" && response.data.message === "Email is new.") {
          // New email - mark as valid
          setEmailVerification({
            isChecking: false,
            isValid: true,
            message: "Email is available",
          })
          clearErrors("email")
        } else if (response.data.userdetail) {
          // Existing user found - auto-fetch and populate user details
          setEmailVerification({
            isChecking: false,
            isValid: true,
            message: "Welcome back! Your details have been loaded.",
          })
          clearErrors("email")
          
          // Auto-populate form with existing user data
          const userData = response.data.userdetail
          if (userData.first_name) {
            document.querySelector<HTMLInputElement>('input[name="firstName"]')!.value = userData.first_name
          }
          if (userData.last_name) {
            document.querySelector<HTMLInputElement>('input[name="lastName"]')!.value = userData.last_name
          }
          if (userData.mobile) {
            document.querySelector<HTMLInputElement>('input[name="mobile"]')!.value = userData.mobile
          }
          
          toast.success("Welcome back!", {
            description: "Your profile details have been loaded automatically."
          })
        } else {
          // Allow booking even if email exists but no user details returned
          setEmailVerification({
            isChecking: false,
            isValid: true,
            message: "Email verified. You can proceed with booking.",
          })
          clearErrors("email")
        }
      } catch (error: any) {
        console.error("Email verification error:", error)
        // Even on error, allow user to proceed
        const errorMessage = error?.message || "Unable to verify email"
        setEmailVerification({
          isChecking: false,
          isValid: true,
          message: "Email verification skipped. You can proceed with booking.",
        })
        clearErrors("email")
        
        // Log error but don't block user
        console.warn("Email verification failed, allowing user to proceed:", errorMessage)
      }
    },
    [setError, clearErrors]
  )

  // Debounce email verification
  const [emailTimeout, setEmailTimeout] = useState<NodeJS.Timeout | null>(null)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    if (emailTimeout) clearTimeout(emailTimeout)
    setEmailVerification({ isChecking: false, isValid: null, message: "" })
    const newTimeout = setTimeout(() => {
      verifyEmail(email)
    }, 1000)
    setEmailTimeout(newTimeout)
  }

  useEffect(() => {
    return () => {
      if (emailTimeout) clearTimeout(emailTimeout)
    }
  }, [emailTimeout])

  const onSubmit = async (data: GuestInfoFormData) => {
    // Check email verification before proceeding
    if (emailVerification.isValid === false) {
      return
    }

    // If email hasn't been verified yet, verify it now
    if (emailVerification.isValid === null && data.email) {
      await verifyEmail(data.email)
      if (emailVerification.isValid === false) {
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Call add-guest-user API
      const response = await addGuestUser({
        first_name: data.firstName,
        last_name: data.lastName,
        mobile: data.mobile,
        email: data.email,
        user_type: "Customers",
        country_code: "91",
      })

      // Check if status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        const responseData = response.data
        
        console.log('=== ADD GUEST USER RESPONSE ===')
        console.log(JSON.stringify(responseData, null, 2))
        console.log('===============================')

        // Check if response has the expected structure
        if (responseData.status === "success" && responseData.userdetail && responseData.access && responseData.refresh) {
          // Log in the user automatically with the response data
          const userData: User = responseData.userdetail
          const accessToken = responseData.access
          const refreshToken = responseData.refresh

          // Store tokens in localStorage (similar to login)
          if (typeof window !== "undefined") {
            localStorage.setItem("spodia_access_token", accessToken)
            localStorage.setItem("spodia_refresh_token", refreshToken)
            localStorage.setItem("spodia_user", JSON.stringify(userData))
          }

          // Update Redux state
          dispatch(updateUser(userData))
          dispatch(setTokens({ accessToken, refreshToken }))

          console.log('✅ Guest user logged in successfully')
          
          // Save booking form data and move to next step
          dispatch(updateBookingFormData(data))
          dispatch(nextStep())
          
          // toast.success("Welcome! Your information has been saved.", {
          //   description: "You're now logged in and ready to continue booking."
          // })
        } else {
          // Success but no login data - just proceed
          dispatch(updateBookingFormData(data))
          dispatch(nextStep())
          // toast.success("Guest information saved successfully")
        }
      } else {
        // Error - show toast
        toast.error(response.data?.message || "Something went wrong. Please try again.")
      }
    } catch (error: any) {
      console.error("Add guest user error:", error)
      toast.error(error?.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Begin Your Booking</h2>
          <p className="text-sm text-gray-600">Step 1 of 3</p>
          {user && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Welcome Back!</span> {user.full_name}
              </p>
              <p className="text-xs text-blue-600 mt-1">Signed in as: {user.email}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  {...register("firstName")}
                  placeholder="First Name"
                  className={`pl-10 pr-10 h-12 ${errors.firstName ? "border-red-500" : isValidField("firstName") ? "border-green-500" : ""}`}
                  onChange={(e) => {
                    register("firstName").onChange(e)
                    trigger("firstName")
                  }}
                />
                {isValidField("firstName") && (
                  <div className="absolute right-3 top-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  {...register("lastName")}
                  placeholder="Last Name"
                  className={`pl-10 pr-10 h-12 ${errors.lastName ? "border-red-500" : isValidField("lastName") ? "border-green-500" : ""}`}
                  onChange={(e) => {
                    register("lastName").onChange(e)
                    trigger("lastName")
                  }}
                />
                {isValidField("lastName") && (
                  <div className="absolute right-3 top-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Please enter your email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("email", { onChange: handleEmailChange })}
                type="email"
                placeholder="Please enter your email"
                className={`pl-10 pr-10 h-12 ${
                  errors.email || emailVerification.isValid === false
                    ? "border-red-500"
                    : emailVerification.isValid === true
                    ? "border-green-500"
                    : ""
                }`}
              />
              <div className="absolute right-3 top-3">
                {emailVerification.isChecking ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : emailVerification.isValid === true ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : emailVerification.isValid === false ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            </div>
            {emailVerification.message && (
              <div
                className={`flex items-start space-x-2 mt-2 ${
                  emailVerification.isValid === false
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {emailVerification.isValid === false ? (
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-xs leading-tight">
                  {emailVerification.message}
                </p>
              </div>
            )}
            {errors.email && !emailVerification.message && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Please enter your mobile number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                {...register("mobile")}
                type="tel"
                placeholder="Please enter your mobile number"
                className={`pl-10 pr-10 h-12 ${errors.mobile ? "border-red-500" : isValidField("mobile") ? "border-green-500" : ""}`}
                onChange={(e) => {
                  register("mobile").onChange(e)
                  trigger("mobile") // Trigger validation on change
                }}
              />
              {isValidField("mobile") && (
                <div className="absolute right-3 top-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Textarea
                {...register("notes")}
                placeholder="Write your message"
                className="pl-10 min-h-32"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 sm:pt-6">
            <Button
              type="submit"
              disabled={emailVerification.isChecking || emailVerification.isValid === false || isSubmitting}
              className="w-full sm:w-auto bg-[#078ED8] hover:bg-[#0679b8] text-white px-6 sm:px-8 h-11 sm:h-12 rounded-full disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {emailVerification.isChecking ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Email...</span>
                </div>
              ) : isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Agree & Continue"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default GuestInformationStep
