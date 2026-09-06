"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, X, Loader2 } from "lucide-react"
import { sendPasswordRecoveryLink } from "@/services/api"
import { toast } from "sonner"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  message: string
}

const SuccessModal = ({ isOpen, onClose, email, message }: SuccessModalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/50 backdrop-blur-md">
      <div className="bg-white border border-slate-100 rounded-xl md:rounded-[40px] shadow-2xl max-w-md w-full p-10 animate-in fade-in zoom-in duration-500 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mb-6 shadow-md">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tighter">
            Check Your Email
          </h2>
          
          <p className="text-slate-600 text-base font-medium leading-relaxed mb-6">
            {message}
          </p>
          
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6 w-full">
            <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-2">Email sent to:</p>
            <p className="text-sm font-bold text-slate-800 break-all">{email}</p>
          </div>
          
          <div className="space-y-4 w-full">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#FF9530] to-[#FF7A00] hover:from-[#FF7A00] hover:to-[#E06600] active:scale-[0.98] text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-orange-500/20 transition-all duration-300"
            >
              Back to Login
            </Button>
            
            <p className="text-xs font-medium text-slate-400 leading-relaxed px-4">
              Didn't receive the email? Check your spam folder or filters.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successData, setSuccessData] = useState({ email: "", message: "" })
  const [attemptCount, setAttemptCount] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [rateLimitTimer, setRateLimitTimer] = useState(0)

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

  const handleRateLimit = () => {
    const newAttemptCount = attemptCount + 1
    setAttemptCount(newAttemptCount)

    if (newAttemptCount >= 3) {
      setIsRateLimited(true)
      setRateLimitTimer(60)
      toast.error("Too Many Attempts", {
        description: "Please wait 60 seconds before requesting another recovery link.",
      })
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (isRateLimited) return
    setIsLoading(true)

    try {
      const sanitizedEmail = data.email.trim().toLowerCase()
      const response = await sendPasswordRecoveryLink(sanitizedEmail)
      
      if (response.status === 201 && response.data?.status === "success") {
        setSuccessData({
          email: response.data.email || sanitizedEmail,
          message: response.data.message || "We have sent you a password recovery email on your registered email. Please click on the email to reset a new password."
        })
        setShowSuccessModal(true)
        setValue("email", "") 
        setAttemptCount(0)
        toast.success("Recovery Email Sent")
      } else {
        handleRateLimit()
        toast.error("Request Failed", {
          description: response.data?.message || "Unable to send recovery email. Please try again.",
        })
      }
    } catch (error: any) {
      console.error("Forgot password error:", error)
      handleRateLimit()
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred"
      toast.error("Request Failed", { description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
  }

  return (
    <>
      <div className="w-full">
        <div className="text-center flex flex-col items-center mb-10">
          <Image
            src="/logo.png"
            alt="Spodia Logo"
            width={80}
            height={80}
            className="mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          />
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">Forgot Password?</h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            Enter your email and we'll send you a recovery link
          </p>
        </div>

        {isRateLimited && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-orange-600 text-sm font-bold">Too Many Attempts</p>
              <p className="text-orange-500 text-xs mt-1">
                Please wait {rateLimitTimer} seconds before requesting a new recovery link.
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
                placeholder="Enter your registered email"
                maxLength={254}
                autoComplete="email"
                autoCapitalize="none"
                spellCheck="false"
                className={`pl-11 h-12 bg-slate-50/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#FF9530] focus:ring-[#FF9530]/20 focus:bg-white hover:border-slate-300 transition-all rounded-xl ${
                  errors.email ? "border-red-500/50 focus:ring-red-500/20" : ""
                }`}
                onBlur={(e) => {
                  const trimmedEmail = e.target.value.trim().toLowerCase()
                  if (trimmedEmail !== e.target.value) {
                    setValue("email", trimmedEmail)
                  }
                }}
              />
            </div>
            {errors.email && <p className="text-red-500 text-[11px] font-medium mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading || isRateLimited}
            className="w-full bg-gradient-to-r from-[#FF9530] to-[#FF7A00] hover:from-[#FF7A00] hover:to-[#E06600] active:scale-[0.98] text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Link...</span>
              </div>
            ) : (
              "Send Recovery Link"
            )}
          </Button>
        </form>

        <div className="mt-5 sm:mt-4 text-center">
          <Link href="/login" className="inline-flex items-center text-sm font-bold text-[#FF9530] hover:text-orange-600 transition-colors gap-2 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>

        {/* <div className="mt-6 text-center bg-slate-50 py-4 rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#FF9530] font-extrabold hover:underline">
              Sign up here
            </Link>
          </p>
        </div> */}
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        email={successData.email}
        message={successData.message}
      />
    </>
  )
}

export default ForgotPasswordForm
