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

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [rateLimitTimer, setRateLimitTimer] = useState(0)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state?.auth ?? { isLoading: false, error: null })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

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
    if (isRateLimited) return

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
        router.push("/dashboard")
      } else if (loginUser.rejected.match(result)) {
        handleRateLimit()
      }
    } catch (error: any) {
      console.error("Login error:", error)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center flex flex-col items-center mb-8">
        <Image
          src="/logo.png"
          alt="Spodia Logo"
          width={80}
          height={80}
          className="mb-4 brightness-0 invert opacity-90 drop-shadow-md"
        />
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-white/60 font-medium">Sign in to your Spodia account</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-2xl p-4 mb-6 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 text-sm font-bold">Login Error</p>
            <p className="text-red-300 text-xs mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {isRateLimited && (
        <div className="bg-orange-500/10 border border-orange-500/20 backdrop-blur-md rounded-2xl p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-orange-400 text-sm font-bold">Too Many Attempts</p>
            <p className="text-orange-300 text-xs mt-1">
              Please wait {rateLimitTimer} seconds before trying again.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2 group">
          <label className="text-sm font-bold text-white/90 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-white/40 group-focus-within:text-orange-400 transition-colors mt-0.5" />
            <Input
              {...register("email")}
              type="email"
              placeholder="example@email.com"
              className={`pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-orange-400 focus:ring-orange-400/20 transition-all rounded-xl ${
                errors.email ? "border-red-400/50 focus:ring-red-400/20" : ""
              }`}
            />
          </div>
          {errors.email && <p className="text-red-400 text-[11px] font-medium mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2 group">
          <label className="text-sm font-bold text-white/90 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-white/40 group-focus-within:text-orange-400 transition-colors" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`pl-11 pr-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-orange-400 focus:ring-orange-400/20 transition-all rounded-xl ${
                errors.password ? "border-red-400/50 focus:ring-red-400/20" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-white/40 hover:text-orange-400 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-[11px] font-medium mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={watch("rememberMe")}
              onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
              className="border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <label htmlFor="rememberMe" className="text-xs font-semibold text-white/70 cursor-pointer select-none">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password"  className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading || isRateLimited}
          className="w-full gradient-btn transition-all active:scale-95 text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-8 text-center bg-white/5 py-4 rounded-2xl border border-white/10">
        <p className="text-white/60 text-sm font-medium">
          Don't have an account?{" "}
          <Link href="/signup" className="text-orange-400 font-extrabold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
