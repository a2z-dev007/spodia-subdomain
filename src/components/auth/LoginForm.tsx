"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loginUser, clearError } from "@/lib/features/auth/authSlice"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export interface LoginFormProps {
  /** Called after a successful login (before optional redirect). */
  onSuccess?: () => void
  /** When false, stay on the current page after login (e.g. booking modal). Default true. */
  redirectOnSuccess?: boolean
  /** Prefill email field (e.g. from booking form). */
  defaultEmail?: string
  /** Slightly tighter layout for modal usage. */
  compact?: boolean
  /** Open signup / forgot-password links in a new tab (booking login modal). */
  openLinksInNewTab?: boolean
}

const LoginForm = ({
  onSuccess,
  redirectOnSuccess = true,
  defaultEmail = "",
  compact = false,
  openLinksInNewTab = false,
}: LoginFormProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [rateLimitTimer, setRateLimitTimer] = useState(0)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail,
      password: "",
      rememberMe: false,
    },
  })

  // Keep email in sync when opened from booking with a prefilled value
  useEffect(() => {
    if (defaultEmail) {
      setValue("email", defaultEmail)
    }
  }, [defaultEmail, setValue])

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Rate limiting effect
  useEffect(() => {
    if (rateLimitTimer > 0) {
      const timer = setTimeout(() => {
        setRateLimitTimer(rateLimitTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isRateLimited && rateLimitTimer === 0) {
      setIsRateLimited(false)
      setAttemptCount(0)
    }
  }, [rateLimitTimer, isRateLimited])

  // Handle rate limiting
  const handleRateLimit = () => {
    const newAttemptCount = attemptCount + 1
    setAttemptCount(newAttemptCount)

    if (newAttemptCount >= 3) {
      setIsRateLimited(true)
      setRateLimitTimer(60) 
      toast.error("Too Many Attempts", {
        description: "Please wait 60 seconds before trying again.",
      })
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    if (isRateLimited || isSubmitting) return

    setIsSubmitting(true)
    try {
      dispatch(clearError())
      const sanitizedEmail = data.email.trim().toLowerCase()
      const sanitizedPassword = data.password.trim()

      const result = await dispatch(loginUser({
        email: sanitizedEmail,
        password: sanitizedPassword
      }))

      if (loginUser.fulfilled.match(result)) {
        setAttemptCount(0)
        setIsRateLimited(false)
        toast.success("Signed in successfully!")
        onSuccess?.()
        if (redirectOnSuccess) {
          router.push("/dashboard")
        }
      } else if (loginUser.rejected.match(result)) {
        const errorMsg = (result.payload as string) || "Invalid credentials. Please check your email and password."
        toast.error(errorMsg)
        handleRateLimit()
      }
    } catch (err: any) {
      console.error("Login error:", err)
      toast.error(err?.message || "An error occurred during sign in. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className={`text-center flex flex-col items-center ${compact ? "mb-5" : "mb-8"}`}>
        <Image
          src="/logo.png"
          alt="Spodia Logo"
          width={compact ? 56 : 80}
          height={compact ? 56 : 80}
          className={`${compact ? "mb-3" : "mb-4"} drop-shadow-[0_2px_10px_rgba(0,0,0,0.05)]`}
        />
        <h1 className={`${compact ? "text-2xl" : "text-3xl sm:text-4xl"} font-black text-slate-900 mb-2 tracking-tight`}>
          Welcome Back
        </h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base">
          {compact ? "Sign in to continue your booking" : "Sign in to your Spodia account"}
        </p>
      </div>

      {isRateLimited && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-orange-600 text-sm font-bold">Too Many Attempts</p>
            <p className="text-orange-500 text-xs mt-1">
              Please wait {rateLimitTimer} seconds before trying again.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2 group">
          <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-[#FF9530] transition-colors mt-0.5" />
            <Input
              {...register("email")}
              type="email"
              placeholder="example@email.com"
              className={`pl-11 h-12 bg-slate-50/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#FF9530] focus:ring-[#FF9530]/20 focus:bg-white hover:border-slate-300 transition-all rounded-xl ${
                errors.email ? "border-red-500/50 focus:ring-red-500/20" : ""
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-[11px] font-medium mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2 group">
          <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-[#FF9530] transition-colors" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              maxLength={20}
              autoComplete="current-password"
              className={`pl-11 pr-11 h-12 bg-slate-50/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#FF9530] focus:ring-[#FF9530]/20 focus:bg-white hover:border-slate-300 transition-all rounded-xl ${
                errors.password ? "border-red-500/50 focus:ring-red-500/20" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#FF9530] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-[11px] font-medium mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={watch("rememberMe")}
              onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
              className="border-slate-400 data-[state=checked]:bg-[#FF9530] data-[state=checked]:border-[#FF9530]"
            />
            <label htmlFor="rememberMe" className="text-xs font-semibold text-slate-500 cursor-pointer select-none">
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            {...(openLinksInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-xs font-bold text-[#FF9530] hover:text-orange-600 transition-colors hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isRateLimited}
          className="w-full bg-gradient-to-r from-[#FF9530] to-[#FF7A00] hover:from-[#FF7A00] hover:to-[#E06600] active:scale-[0.98] text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all duration-300 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-5 sm:mt-4 text-center">
        <p className="text-slate-500 text-sm font-medium">
          Don't have an account?{" "}
          <Link
            href="/signup"
            {...(openLinksInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-[#FF9530] font-extrabold hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
