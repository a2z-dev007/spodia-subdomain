"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import PhoneNumberInput from "@/components/ui/PhoneNumberInput"
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  X
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import { LINKS } from "@/utils/const"
import { verifyEmail as verifyEmailApi, signupApi } from "@/services/api"
import { toast } from "sonner"
import { createPortal } from "react-dom"

const signupSchema = z.object({
  firstName: z.string().min(2, "First name is required").max(50, "First name cannot exceed 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address").max(254, "Email is too long"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number can enter only max 15 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string().min(6, "Confirm password is required").max(20, "Password cannot exceed 20 characters"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  if (!isOpen || !mounted) return null
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/55 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border border-slate-100 rounded-xl md:rounded-[40px] shadow-2xl max-w-md w-full p-10 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/15 transition-all duration-700" />
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-6 h-6" /></button>
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-orange-50 border border-orange-100 rounded-full flex items-center justify-center mb-6 shadow-md"><CheckCircle className="w-10 h-10 text-[#FF9530]" /></div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Account Created!</h2>
          <p className="text-slate-600 text-base font-medium leading-relaxed mb-8">Welcome to Spodia! Your account has been successfully set up. You can now log in and start exploring.</p>
          <Link href="/login" className="w-full bg-gradient-to-r from-[#FF9530] to-[#FF7A00] hover:from-[#FF7A00] hover:to-[#E06600] text-white h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all duration-300">Go to Login</Link>
        </div>
      </div>
    </div>,
    document.body
  )
}

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [emailVerification, setEmailVerification] = useState<{ isChecking: boolean; isValid: boolean | null; message: string }>({ isChecking: false, isValid: null, message: "" })
  const [countryCode, setCountryCode] = useState("91")
  
  const router = useRouter()
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const emailCheckTimeout = useRef<NodeJS.Timeout | null>(null)

  const isCaptchaEnabled = useMemo(() => {
    const isProduction = process.env.NODE_ENV === "production"
    const enableOnLocal = process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA_LOCAL === "true"
    return isProduction || enableOnLocal
  }, [])

  const { register, handleSubmit, formState: { errors }, watch, trigger, reset, setValue } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange"
  })

  const passwordValue = watch("password") || ""

  useEffect(() => {
    register("phone")
  }, [register])

  // Email verification logic
  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim().toLowerCase()
    setValue("email", email)
    if (!email || errors.email) return

    setEmailVerification({ isChecking: true, isValid: null, message: "" })
    try {
      const response = await verifyEmailApi(email)
      if (response.status === 200 || response.data?.status === "success") {
        setEmailVerification({ isChecking: false, isValid: true, message: "Email is available" })
      } else {
        setEmailVerification({ isChecking: false, isValid: false, message: response.data?.message || "Email is already taken" })
      }
    } catch (error: any) {
      setEmailVerification({ isChecking: false, isValid: false, message: error?.response?.data?.message || "Verification failed" })
    }
  }

  const passwordValidation = {
    hasMin: passwordValue.length >= 6 && passwordValue.length <= 20,
    hasUpper: /[A-Z]/.test(passwordValue),
    hasLower: /[a-z]/.test(passwordValue),
    hasNumber: /[0-9]/.test(passwordValue),
    match: passwordValue === watch("confirmPassword"),
  }

  // Captcha management
  useEffect(() => {
    if (isCaptchaEnabled && currentStep === 2) {
      const initRecaptcha = () => {
        if (!(window as any).grecaptcha || !(window as any).grecaptcha.render) {
          setTimeout(initRecaptcha, 100); return
        }
        ;(window as any).grecaptcha.ready(() => {
          const container = document.getElementById("recaptcha-signup")
          if (!container || container.children.length > 0) return
          try {
            ;(window as any).grecaptcha.render("recaptcha-signup", {
              sitekey: "6LemmzYqAAAAALr8V77DYbKH3z8RJosQDILW7pQO",
              callback: (token: string) => { setRecaptchaToken(token); setRecaptchaVerified(true) },
              "expired-callback": () => { setRecaptchaVerified(false) },
              "error-callback": () => { setRecaptchaVerified(false) }
            })
          } catch (e) { console.error(e) }
        })
      }
      initRecaptcha()
    }
  }, [isCaptchaEnabled, currentStep])

  const nextStep = async () => {
    const isStep1Valid = await trigger(["firstName", "lastName", "email", "phone"])
    if (isStep1Valid && emailVerification.isValid !== false) {
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevStep = () => {
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const onSubmit = useCallback(async (data: SignupFormData) => {
    if (isCaptchaEnabled && !recaptchaVerified) return
    setIsLoading(true)
    try {
      const payload = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        mobile: data.phone.trim(),
        password: data.password,
        cPassword: data.confirmPassword,
        country_code: countryCode,
        user_type: "Customers",
        "g-recaptcha-response": recaptchaToken
      }
      
      const response = await signupApi(payload)
      setIsLoading(false)

      if (response.status === 201 || (response.data?.status === "success")) {
        toast.success("Account created successfully!")
        setShowSuccessModal(true)
        reset()
        setEmailVerification({ isChecking: false, isValid: null, message: "" })
        setCurrentStep(1)
      } else {
        const status = response.status
        const data = response.data
        if (status === 409 || data?.message?.toLowerCase().includes("exists")) {
          toast.error("Account Already Exists", { description: "This email is already registered." })
        } else if (status === 429) {
          toast.error("Too Many Requests", { description: "Please try again in a few minutes." })
        } else {
          toast.error(data?.message || "Registration failed. Please try again.")
        }
      }
    } catch (error: any) {
      setIsLoading(false)
      const apiError = error as any;
      const responseData = apiError?.response?.data;
      const statusCode = apiError?.response?.status;
      
      let errorMessage = "";
      
      if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else {
        // Fallback to status codes
        switch (statusCode) {
          case 409:
            errorMessage = "Account Already Exists. This email is already registered.";
            break;
          case 429:
            errorMessage = "Too Many Requests. Please try again in a few minutes.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = apiError?.message || "Registration failed. Please try again.";
        }
      }
      
      toast.error(errorMessage);
    }
  }, [isCaptchaEnabled, recaptchaVerified, recaptchaToken, reset, countryCode])

  return (
    <div className="w-full mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="backdrop-blur-2xl bg-white/85 border border-white/40 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.12)] rounded-xl md:rounded-[40px] p-5 sm:p-10 text-slate-800">
        <div className="text-center flex flex-col items-center mb-6 sm:mb-8">
          <Image src="/logo.png" alt="Spodia Logo" width={80} height={80} className="mb-3 sm:mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.05)] sm:w-[80px] sm:h-[80px]" />
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mb-1 sm:mb-2 tracking-tight">Create Account</h1>
          <p className="text-slate-500 text-xs sm:text-base font-medium">Join Spodia and start your journey</p>
        </div>

        {/* Minimal Step Indicator - Mobile Optimized */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 bg-slate-50 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-100">
          <h2 className="text-sm sm:text-lg font-bold text-slate-800 whitespace-nowrap">
            {currentStep === 1 ? "Basic Details" : "Security & Privacy"}
          </h2>
          
          <div className="flex items-center gap-1.5 sm:gap-2 ml-4">
            <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${currentStep >= 1 ? "bg-[#FF9530] text-white shadow-lg shadow-orange-500/20" : "bg-slate-200 text-slate-400"}`}>1</div>
            <div className={`h-[1px] w-4 sm:w-6 rounded-full ${currentStep >= 2 ? "bg-[#FF9530]" : "bg-slate-200"}`}></div>
            <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${currentStep >= 2 ? "bg-[#FF9530] text-white shadow-lg shadow-orange-500/20" : "bg-slate-200 text-slate-400"}`}>2</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6" autoComplete="off">
          {currentStep === 1 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:space-y-2 group">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-[#FF9530] transition-colors" />
                    <Input {...register("firstName")} placeholder="Enter First Name" maxLength={50} className={`pl-10 sm:pl-11 h-11 sm:h-12 bg-slate-50/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#FF9530] focus:ring-[#FF9530]/20 focus:bg-white hover:border-slate-300 transition-all text-sm sm:text-base ${errors.firstName ? 'border-red-500/50' : ''}`} />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-[10px] sm:text-[11px] font-medium ml-1">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5 sm:space-y-2 group">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-[#FF9530] transition-colors" />
                    <Input {...register("lastName")} placeholder="Enter Last Name" maxLength={50} className={`pl-10 sm:pl-11 h-11 sm:h-12 bg-slate-50/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#FF9530] focus:ring-[#FF9530]/20 focus:bg-white hover:border-slate-300 transition-all text-sm sm:text-base ${errors.lastName ? 'border-red-500/50' : ''}`} />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-[10px] sm:text-[11px] font-medium ml-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2 group">
                <label className="text-xs sm:text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-[#FF9530] transition-colors" />
                  <Input {...register("email")} type="email" onBlur={handleEmailBlur} placeholder="example@email.com" maxLength={254} className={`pl-10 sm:pl-11 h-11 sm:h-12 bg-slate-50/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#FF9530] focus:ring-[#FF9530]/20 focus:bg-white hover:border-slate-300 transition-all text-sm sm:text-base ${errors.email || emailVerification.isValid === false ? 'border-red-500/50' : ''}`} />
                  {emailVerification.isChecking && <div className="absolute right-4 top-3.5"><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#FF9530]" /></div>}
                  {emailVerification.isValid === true && <div className="absolute right-4 top-3.5"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" /></div>}
                </div>
                {errors.email && <p className="text-red-500 text-[10px] sm:text-[11px] font-medium ml-1">{errors.email.message}</p>}
                {emailVerification.message && (
                  <p className={`text-[10px] sm:text-[11px] font-medium ml-1 flex items-center gap-1 ${emailVerification.isValid ? 'text-green-600' : 'text-red-500'}`}>
                    {emailVerification.isValid === false ? <AlertCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> : <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5" />}
                    {emailVerification.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2 group">
                <label className="text-xs sm:text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                <PhoneNumberInput
                  value={watch("phone") || ""}
                  countryCode={countryCode}
                  onChange={(phone, meta) => {
                    setCountryCode(meta.dialCode)
                    setValue("phone", phone, { shouldValidate: true })
                  }}
                  error={!!errors.phone}
                  placeholder="10-15 digit mobile number"
                  name="phone"
                />
                {errors.phone && <p className="text-red-500 text-[10px] sm:text-[11px] font-medium ml-1">{errors.phone.message}</p>}
              </div>

              <Button type="button" onClick={nextStep} className="w-full bg-gradient-to-r from-[#FF9530] to-[#FF7A00] hover:from-[#FF7A00] hover:to-[#E06600] active:scale-[0.98] h-12 sm:h-14 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2">Continue <ChevronRight className="w-5 h-5" /></Button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2 group">
                <label className="text-xs sm:text-sm font-bold text-slate-700 ml-1">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-[#FF9530] transition-colors" />
                  <Input {...register("password")} type={showPassword ? "text" : "password"} placeholder="6-20 characters" maxLength={20} autoComplete="new-password" className={`pl-10 sm:pl-11 pr-11 h-11 sm:h-12 bg-slate-50/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#FF9530] focus:ring-[#FF9530]/20 focus:bg-white hover:border-slate-300 transition-all text-sm sm:text-base ${errors.password ? 'border-red-500/50' : ''}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors">{showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}</button>
                </div>
                {/* Requirements display */}
                <div className="grid grid-cols-2 gap-2 p-1 pt-2">
                  <Requirement label="6-20 chars" met={passwordValidation.hasMin} />
                  <Requirement label="Uppercase" met={passwordValidation.hasUpper} />
                  <Requirement label="Lowercase" met={passwordValidation.hasLower} />
                  <Requirement label="Number" met={passwordValidation.hasNumber} />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2 group">
                <label className="text-xs sm:text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-[#FF9530] transition-colors" />
                  <Input {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} placeholder="Repeat your password" maxLength={20} autoComplete="new-password" className={`pl-10 sm:pl-11 pr-11 h-11 sm:h-12 bg-slate-50/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#FF9530] focus:ring-[#FF9530]/20 focus:bg-white hover:border-slate-300 transition-all text-sm sm:text-base ${errors.confirmPassword ? 'border-red-500/50' : ''}`} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors">{showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}</button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] sm:text-[11px] font-medium ml-1">{errors.confirmPassword.message}</p>}
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center space-x-3 transition-colors hover:bg-slate-100/50">
                <Checkbox id="terms" checked={watch("terms")} onCheckedChange={(val) => setValue("terms", val as boolean)} className="border-slate-300 data-[state=checked]:bg-[#FF9530] data-[state=checked]:border-[#FF9530]" />
                <label htmlFor="terms" className="text-[10px] sm:text-xs font-semibold text-slate-600 leading-relaxed cursor-pointer select-none">I agree to the <Link href={LINKS.TERMS_CONDITIONS} target="_blank" className="text-[#FF9530] hover:text-orange-600 font-semibold">Terms</Link> & <Link href={LINKS.PRIVACY_POLICY} target="_blank" className="text-[#FF9530] hover:text-orange-600 font-semibold">Privacy Policy</Link></label>
              </div>
              {errors.terms && <p className="text-red-500 text-[10px] sm:text-[11px] font-bold ml-1">{errors.terms.message}</p>}

              {isCaptchaEnabled && <div id="recaptcha-signup" className="flex justify-center my-4 sm:my-6 scale-[0.8] sm:scale-100 origin-center"></div>}

              <div className="flex gap-3 sm:gap-4">
                <Button type="button" onClick={prevStep} className="flex-1 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm sm:text-base"><ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back</Button>
                <Button type="submit" disabled={isLoading || (isCaptchaEnabled && !recaptchaVerified)} className="flex-[2] bg-gradient-to-r from-[#FF9530] to-[#FF7A00] hover:from-[#FF7A00] hover:to-[#E06600] active:scale-[0.98] h-12 sm:h-14 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">{isLoading ? <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> Signing up...</> : "Create Account"}</Button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-5 sm:mt-4 text-center">
          <p className="text-slate-500 text-[11px] sm:text-sm font-medium px-2">
            Already have an account? <Link href="/login" className="text-[#FF9530] font-extrabold hover:underline inline-block sm:inline whitespace-nowrap">Sign in here</Link>
          </p>
        </div>
      </div>
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </div>
  )
}

const Requirement = ({ met, label }: { met: boolean; label: string }) => (
  <div className={`flex items-center gap-1.5 transition-all duration-300 ${met ? "text-green-600" : "text-slate-400"}`}>
    {met ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <div className="w-3 h-3 rounded-full border border-slate-200" />}
    <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
  </div>
)

export default SignupForm
