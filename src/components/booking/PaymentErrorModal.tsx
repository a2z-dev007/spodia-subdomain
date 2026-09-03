"use client"

import { AlertTriangle, RefreshCw, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const SUPPORT_EMAIL = "support@spodia.in"

export interface PaymentErrorModalProps {
  isBookingOnHold: boolean
  paymentErrorMessage: string
  razorpayPaymentData?: any
  onClose: () => void
  onRetry?: () => void
  isRetrying?: boolean
}

export default function PaymentErrorModal({
  isBookingOnHold,
  paymentErrorMessage,
  razorpayPaymentData,
  onClose,
  onRetry,
  isRetrying = false,
}: PaymentErrorModalProps) {
  const isOnHold = isBookingOnHold

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-3 sm:p-4">
      <div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[92vh] sm:max-h-[88vh] flex flex-col min-h-0"
        role="dialog"
        aria-labelledby="payment-error-title"
        aria-modal="true"
      >
        <div
          className={`px-4 py-4 sm:px-6 sm:py-5 text-white shrink-0 ${
            isOnHold
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : "bg-gradient-to-br from-red-500 to-rose-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center shrink-0 ring-2 ring-white/20">
              {isOnHold ? (
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              ) : (
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 id="payment-error-title" className="text-base sm:text-xl font-bold tracking-tight leading-tight">
                {isOnHold ? "Booking On Hold" : "Payment Not Completed"}
              </h3>
              <p className="text-white/90 text-xs sm:text-sm font-medium leading-tight mt-0.5">
                {isOnHold ? "Payment received — verification needed" : "Payment attempt failed or cancelled"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3">
          <p className="text-gray-600 text-xs sm:text-sm text-center leading-relaxed">
            {paymentErrorMessage ||
              (isOnHold
                ? "Your payment was received but we couldn't confirm your booking immediately."
                : "Your payment was not completed. No amount has been charged.")}
          </p>

          {isOnHold && razorpayPaymentData && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-2 text-xs">
              <p className="text-xs text-amber-900 font-bold">
                Payment received — please save these details and contact support:
              </p>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between gap-2">
                  <span className="text-amber-800 font-medium shrink-0">Payment ID</span>
                  <span className="font-mono text-gray-800 text-right break-all">
                    {razorpayPaymentData.razorpay_payment_id}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-amber-800 font-medium shrink-0">Order ID</span>
                  <span className="font-mono text-gray-800 text-right break-all">
                    {razorpayPaymentData.razorpay_order_id}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!isOnHold && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600">
              <p className="font-bold text-gray-800 mb-1">What you can try:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs">
                <li>Check your payment method and available balance</li>
                <li>Try a different UPI, card, or net banking option</li>
                <li>Ensure you didn&apos;t close the payment window early</li>
              </ul>
            </div>
          )}

          <p className="text-center text-xs text-gray-500 pt-1">
            Need help?{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#078ED8] font-semibold hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>

        <div className="p-3 sm:p-4 bg-gray-50/90 border-t border-gray-100 shrink-0 flex flex-col gap-2">
          {!isOnHold && onRetry && (
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              className="w-full bg-[#078ED8] hover:bg-[#0679b8] text-white h-10 rounded-full font-bold text-xs sm:text-sm"
            >
              {isRetrying ? (
                "Processing…"
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Payment Again
                </>
              )}
            </Button>
          )}
          <Button
            variant={isOnHold || !onRetry ? "default" : "outline"}
            onClick={onClose}
            className={`w-full h-10 rounded-full font-semibold text-xs sm:text-sm ${
              isOnHold || !onRetry
                ? "bg-[#078ED8] hover:bg-[#0679b8] text-white"
                : "border-gray-200"
            }`}
          >
            {isOnHold ? "Close" : "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  )
}
