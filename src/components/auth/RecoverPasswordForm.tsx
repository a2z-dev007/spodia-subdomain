"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, X } from "lucide-react"
import { setNewPassword } from "@/services/api"
import { toast } from "sonner"
import { useAppDispatch } from "@/lib/hooks"
import { setTokens, updateUser } from "@/lib/features/auth/authSlice"

const recoverPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_new_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  })

type RecoverPasswordFormData = z.infer<typeof recoverPasswordSchema>

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  isAutoLogin: boolean
}

const SuccessModal = ({ isOpen, onClose, message, isAutoLogin }: SuccessModalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Password Updated Successfully!
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <div className="space-y-3 w-full">
            <Button
              onClick={onClose}
              className="w-full gradient-btn text-white h-12 rounded-full"
            >
              {isAutoLogin ? "Continue to Dashboard" : "Go to Login"}
            </Button>
            
            <p className="text-xs text-gray-500">
              {isAutoLogin 
                ? "You will be redirected to your dashboard automatically..." 
                : "You can now log in with your new password"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

const RecoverPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successData, setSuccessData] = useState({ message: "", isAutoLogin: false })
  const [passwordValue, setPasswordValue] = useState("")
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("")

  // Real-time password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RecoverPasswordFormData>({
    resolver: zodResolver(recoverPasswordSchema),
  })

  // Watch password fields for real-time validation
  const newPassword = watch("new_password")
  const confirmPassword = watch("confirm_new_password")

  // Update password validation in real-time
  useEffect(() => {
    if (newPassword) {
      setPasswordValue(newPassword)
      setPasswordValidation({
        minLength: newPassword.length >= 6,
        hasUppercase: /[A-Z]/.test(newPassword),
        hasLowercase: /[a-z]/.test(newPassword),
        hasNumber: /[0-9]/.test(newPassword),
      })
    } else {
      setPasswordValue("")
      setPasswordValidation({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
      })
    }
  }, [newPassword])

  // Update confirm password value
  useEffect(() => {
    if (confirmPassword) {
      setConfirmPasswordValue(confirmPassword)
    } else {
      setConfirmPasswordValue("")
    }
  }, [confirmPassword])

  useEffect(() => {
    // Get the recovery key from URL query params
    const key = searchParams.get("key")
    
    if (!key) {
      toast.error("Invalid Recovery Link", {
        description: "No recovery key found. Please use the link from your email.",
        duration: 4000,
      })
      // Redirect to forgot password page after a delay
      setTimeout(() => {
        router.push("/forgot-password")
      }, 2000)
    } else {
      setRecoveryKey(key)
    }
  }, [searchParams, router])

  const onSubmit = async (data: RecoverPasswordFormData) => {
    if (!recoveryKey) {
      toast.error("Invalid Recovery Link", {
        description: "Recovery key is missing. Please try again.",
        duration: 4000,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await setNewPassword({
        recovery_key: recoveryKey,
        new_password: data.new_password,
        confirm_new_password: data.confirm_new_password,
      })

      // Check if password was updated successfully
      if (response.status === 200 || response.data?.status === "success") {
        // If user details and token are returned, log them in
        if (response.data?.userdetail && response.data?.access) {
          const user = response.data.userdetail
          const accessToken = response.data.access
          const refreshToken = response.data.refresh || ""

          // Store user data and tokens using Redux and localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("spodia_access_token", accessToken)
            localStorage.setItem("spodia_refresh_token", refreshToken)
            localStorage.setItem("spodia_user", JSON.stringify(user))
          }

          // Update Redux state
          dispatch(updateUser(user))
          dispatch(setTokens({ accessToken, refreshToken }))

          // Show success modal with auto-login message
          setSuccessData({
            message: response.data?.message || "Your password has been changed successfully. You are now logged in!",
            isAutoLogin: true
          })
          setShowSuccessModal(true)
          // reset  the form
          setPasswordValue("")
          setConfirmPasswordValue("")
          
          toast.success("Password Updated Successfully", {
            description: "Logging you in...",
            duration: 3000,
          })
        } else {
          // Show success modal without auto-login
          setSuccessData({
            message: response.data?.message || "Your password has been changed successfully. Please log in with your new password.",
            isAutoLogin: false
          })
          setShowSuccessModal(true)

          toast.success("Password Updated Successfully", {
            description: "Please log in with your new password.",
            duration: 3000,
          })
        }
      } else {
        // Handle error response
        const errorMessage = response.data?.message || "Failed to update password"
        toast.error("Update Failed", {
          description: errorMessage,
          duration: 4000,
        })
      }
    } catch (error: any) {
      console.error("Password recovery error:", error)

      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "An error occurred while updating your password"

      if (errorMessage.toLowerCase().includes("expired") || 
          errorMessage.toLowerCase().includes("invalid")) {
        toast.error("Invalid or Expired Link", {
          description: "This recovery link has expired or is invalid. Please request a new one.",
          duration: 5000,
        })
        setTimeout(() => {
          router.push("/forgot-password")
        }, 2000)
      } else if (errorMessage.toLowerCase().includes("network") || !navigator.onLine) {
        toast.error("Network Error", {
          description: "Please check your internet connection and try again.",
          duration: 4000,
        })
      } else {
        toast.error("Update Failed", {
          description: errorMessage,
          duration: 4000,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    if (successData.isAutoLogin) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  // Show loading state while checking for recovery key
  if (recoveryKey === null) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Verifying recovery link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center flex flex-col items-center mb-8">
        <Image
          src="/logo.png"
          alt="Spodia Logo"
          width={70}
          height={40}
          className="mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h1>
        <p className="text-gray-600">
          Create a strong password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* New Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 mt-0.5" />
            <Input
              {...register("new_password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              autoComplete="new-password"
              className={`pl-10 pr-12 h-12 bg-gray-50/60 ${
                errors.new_password
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-2 focus:ring-[#FF9530]"
              } focus:outline-none transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.new_password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.new_password.message}
            </p>
          )}
          
          {/* Real-time Password Validation */}
          {passwordValue && (
            <div className="text-xs space-y-1.5 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-700 mb-2">Password must contain:</p>
              <div className="space-y-1.5">
                <div className={`flex items-center gap-2 transition-colors ${
                  passwordValidation.minLength ? "text-green-600" : "text-gray-500"
                }`}>
                  {passwordValidation.minLength ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-current" />
                  )}
                  <span>At least 6 characters</span>
                </div>
                <div className={`flex items-center gap-2 transition-colors ${
                  passwordValidation.hasUppercase ? "text-green-600" : "text-gray-500"
                }`}>
                  {passwordValidation.hasUppercase ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-current" />
                  )}
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center gap-2 transition-colors ${
                  passwordValidation.hasLowercase ? "text-green-600" : "text-gray-500"
                }`}>
                  {passwordValidation.hasLowercase ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-current" />
                  )}
                  <span>One lowercase letter</span>
                </div>
                <div className={`flex items-center gap-2 transition-colors ${
                  passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"
                }`}>
                  {passwordValidation.hasNumber ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-current" />
                  )}
                  <span>One number</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 mt-0.5" />
            <Input
              {...register("confirm_new_password")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className={`pl-10 pr-12 h-12 bg-gray-50/60 ${
                errors.confirm_new_password
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-2 focus:ring-[#FF9530]"
              } focus:outline-none transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirm_new_password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.confirm_new_password.message}
            </p>
          )}
          
          {/* Password Match Indicator */}
          {confirmPasswordValue && passwordValue && (
            <div className={`text-xs mt-2 flex items-center gap-2 ${
              confirmPasswordValue === passwordValue ? "text-green-600" : "text-red-500"
            }`}>
              {confirmPasswordValue === passwordValue ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Passwords match</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full gradient-btn transition-all hover:scale-105 text-white h-12 rounded-full text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Updating Password...</span>
            </div>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-orange-500 font-bold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        message={successData.message}
        isAutoLogin={successData.isAutoLogin}
      />
    </div>
  )
}

export default RecoverPasswordForm
