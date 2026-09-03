"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateBookingFormData, nextStep } from "@/lib/features/booking/bookingSlice"
import { guestInfoSchema, type GuestInfoFormData } from "@/lib/validations/booking"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import PhoneNumberInput from "@/components/ui/PhoneNumberInput"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { User as UserIcon, Mail, Phone, MessageSquare, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { updateUser, setTokens } from "@/lib/features/auth/authSlice"
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
  const [mobileCountryCode, setMobileCountryCode] = useState("91")
  const [fullMobile, setFullMobile] = useState(bookingFormData.mobileWithCountryCode || "")

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm<GuestInfoFormData>({
    resolver: zodResolver(guestInfoSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: bookingFormData.firstName || user?.first_name || "",
      lastName: bookingFormData.lastName || user?.last_name || "",
      email: bookingFormData.email || user?.email || "",
      mobile: bookingFormData.mobile || user?.mobile || "",
      notes: bookingFormData.notes || "",
    },
  })

  const formValues = watch()
  const isValidField = (fieldName: keyof GuestInfoFormData) => {
    const isTouched = touchedFields[fieldName]
    const hasValue = !!formValues[fieldName]
    const hasError = !!errors[fieldName]
    return isTouched && hasValue && !hasError
  }

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

        if (response.data.status === "success" && response.data.message === "Email is new.") {
          setEmailVerification({
            isChecking: false,
            isValid: true,
            message: "Email is available",
          })
          clearErrors("email")
        } else if (response.data.userdetail) {
          setEmailVerification({
            isChecking: false,
            isValid: true,
            message: "Welcome back! Your details have been loaded.",
          })
          clearErrors("email")
          
          const userData = response.data.userdetail
          if (userData.first_name) {
            setValue("firstName", userData.first_name)
          }
          if (userData.last_name) {
            setValue("lastName", userData.last_name)
          }
          if (userData.mobile) {
            setValue("mobile", userData.mobile)
          }
          
          toast.success("Welcome back!", {
            description: "Your profile details have been loaded automatically."
          })
        } else {
          setEmailVerification({
            isChecking: false,
            isValid: true,
            message: "Email verified. You can proceed with booking.",
          })
          clearErrors("email")
        }
      } catch (error: any) {
        setEmailVerification({
          isChecking: false,
          isValid: true,
          message: "Email verification skipped. You can proceed with booking.",
        })
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
    if (emailVerification.isValid === false) {
      return
    }

    if (emailVerification.isValid === null && data.email) {
      await verifyEmail(data.email)
      if (emailVerification.isValid === false) {
        return
      }
    }

    setIsSubmitting(true)

    try {
      const response = await addGuestUser({
        first_name: data.firstName,
        last_name: data.lastName,
        mobile: data.mobile,
        email: data.email,
        user_type: "Customers",
        country_code: mobileCountryCode,
      })

      if (response.status === 200 || response.status === 201) {
        const responseData = response.data
        
        if (responseData.access && responseData.refresh) {
          dispatch(
            setTokens({
              accessToken: responseData.access,
              refreshToken: responseData.refresh,
            })
          )
        }

        if (responseData.user) {
          const apiUser = responseData.user
          dispatch(
            updateUser({
              id: String(apiUser.id),
              email: apiUser.email || data.email,
              first_name: apiUser.first_name || data.firstName,
              last_name: apiUser.last_name || data.lastName,
              mobile: apiUser.mobile || data.mobile,
              user_type: apiUser.user_type || "Customers",
            })
          )
        }
      }

      dispatch(
        updateBookingFormData({
          ...data,
          mobileCountryCode,
          mobileWithCountryCode: fullMobile || `+${mobileCountryCode}${data.mobile}`,
        })
      )

      dispatch(nextStep())
    } catch (error: any) {
      console.error("Guest registration API failed:", error)
      
      dispatch(
        updateBookingFormData({
          ...data,
          mobileCountryCode,
          mobileWithCountryCode: fullMobile || `+${mobileCountryCode}${data.mobile}`,
        })
      )
      
      dispatch(nextStep())
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-[#078ED8] to-[#078ED8]/90 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Guest Information</h2>
            <p className="text-xs text-blue-100 font-medium mt-0.5">
              Enter details for the primary guest
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-[#101828] text-sm grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-bold text-gray-700 block">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Enter first name"
                  className={`h-11 pl-10 ${
                    errors.firstName
                      ? "border-red-300 focus-visible:ring-red-300"
                      : isValidField("firstName")
                      ? "border-emerald-500 focus-visible:ring-emerald-500"
                      : "border-gray-200 focus-visible:ring-[#078ED8]"
                  }`}
                />
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {isValidField("firstName") && (
                  <CheckCircle className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-bold text-gray-700 block">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Enter last name"
                  className={`h-11 pl-10 ${
                    errors.lastName
                      ? "border-red-300 focus-visible:ring-red-300"
                      : isValidField("lastName")
                      ? "border-emerald-500 focus-visible:ring-emerald-500"
                      : "border-gray-200 focus-visible:ring-[#078ED8]"
                  }`}
                />
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {isValidField("lastName") && (
                  <CheckCircle className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {errors.lastName && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="email" className="text-sm font-bold text-gray-700 block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  onChange={(e) => {
                    register("email").onChange(e)
                    handleEmailChange(e)
                  }}
                  placeholder="name@example.com"
                  className={`h-11 pl-10 ${
                    errors.email || emailVerification.isValid === false
                      ? "border-red-300 focus-visible:ring-red-300"
                      : emailVerification.isValid === true
                      ? "border-emerald-500 focus-visible:ring-emerald-500"
                      : "border-gray-200 focus-visible:ring-[#078ED8]"
                  }`}
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                
                {emailVerification.isChecking ? (
                  <Loader2 className="w-4 h-4 text-[#078ED8] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
                ) : emailVerification.isValid === true ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                ) : emailVerification.isValid === false ? (
                  <AlertCircle className="w-4 h-4 text-red-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                ) : null}
              </div>
              
              {emailVerification.message && (
                <p className={`text-xs flex items-center gap-1 mt-1 font-medium ${
                  emailVerification.isValid === true ? "text-emerald-600" : "text-red-500"
                }`}>
                  {emailVerification.isValid === true ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  {emailVerification.message}
                </p>
              )}
              {errors.email && !emailVerification.message && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
              <p className="text-[11px] text-gray-400">
                Booking confirmation and invoice will be sent to this email address.
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="mobile" className="text-sm font-bold text-gray-700 block">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <PhoneNumberInput
                value={watch("mobile") || ""}
                onChange={(nationalNumber, fullNumber, countryCode) => {
                  setValue("mobile", nationalNumber, { shouldValidate: true, shouldTouch: true })
                  setMobileCountryCode(countryCode)
                  setFullMobile(fullNumber)
                }}
                error={errors.mobile?.message}
                placeholder="Mobile Number"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="notes" className="text-sm font-bold text-gray-700 block">
                Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Any special requests or instructions for the property..."
                  rows={3}
                  className="pl-10 border-gray-200 focus-visible:ring-[#078ED8]"
                />
                <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-gray-400">
                Special requests are subject to availability upon check-in.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isSubmitting || emailVerification.isChecking}
              className="bg-[#078ED8] hover:bg-[#0679b8] text-white font-bold px-8 h-12 rounded-xl text-base shadow-md transition-all hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Saving Details...
                </>
              ) : (
                "Continue to Review"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default GuestInformationStep
