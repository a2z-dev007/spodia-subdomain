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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/70 backdrop-blur-md">
      <div className="bg-[#111827] border border-white/10 rounded-[40px] shadow-2xl max-w-md w-full p-10 animate-in fade-in zoom-in duration-500 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/5">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-3 tracking-tighter">
            Check Your Email
          </h2>
          
          <p className="text-white/60 text-lg font-medium leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 w-full">
            <p className="text-[11px] uppercase font-bold tracking-widest text-white/30 mb-2">Email sent to:</p>
            <p className="text-sm font-bold text-white break-all">{email}</p>
          </div>
          
          <div className="space-y-4 w-full">
            <Button
              onClick={onClose}
              className="w-full gradient-btn text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-orange-500/20"
            >
              Back to Login
            </Button>
            
            <p className="text-xs font-medium text-white/30 leading-relaxed px-4">
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
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
        toast.success("Recovery Email Sent")
      } else {
        toast.error("Request Failed", {
          description: response.data?.message || "Unable to send recovery email. Please try again.",
        })
      }
    } catch (error: any) {
      console.error("Forgot password error:", error)
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
            className="mb-4 brightness-0 invert opacity-90 drop-shadow-md"
          />
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Forgot Password?</h1>
          <p className="text-white/60 font-medium">
            Enter your email and we'll send you a recovery link
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="space-y-2 group">
            <label className="text-sm font-bold text-white/90 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-white/40 group-focus-within:text-orange-400 transition-colors mt-0.5" />
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your registered email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck="false"
                className={`pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-orange-400 focus:ring-orange-400/20 transition-all rounded-xl ${
                  errors.email ? "border-red-400/50 focus:ring-red-400/20" : ""
                }`}
                onBlur={(e) => {
                  const trimmedEmail = e.target.value.trim().toLowerCase()
                  if (trimmedEmail !== e.target.value) {
                    setValue("email", trimmedEmail)
                  }
                }}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-[11px] font-medium mt-1.5 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-btn transition-all active:scale-95 text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              "Send Recovery Link"
            )}
          </Button>
        </form>

        <div className="mt-8">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold h-14 rounded-2xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </div>

        <div className="mt-10 text-center bg-white/5 py-5 rounded-2xl border border-white/10">
          <p className="text-white/60 text-sm font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-orange-400 font-extrabold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
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
