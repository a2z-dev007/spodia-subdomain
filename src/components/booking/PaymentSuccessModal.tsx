"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Calendar, Mail, MapPin, ExternalLink, Home, LayoutDashboard, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const formatINR = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

function getResponseField(data: unknown, ...keys: string[]) {
  if (!data || typeof data !== "object") return undefined
  const root = data as Record<string, unknown>
  const records =
    root.records && typeof root.records === "object"
      ? (root.records as Record<string, unknown>)
      : null
  for (const key of keys) {
    const value = root[key] ?? records?.[key]
    if (value !== null && value !== undefined && value !== "") return value
  }
  return undefined
}

export interface PaymentSuccessModalProps {
  bookingResponse?: { data?: unknown } | null
  razorpayPaymentData?: any
  hotelName?: string
  hotelLocation?: string
  checkInDate?: string
  checkOutDate?: string
  totalAmount: number
  guestEmail?: string
  isGuest?: boolean
  redirectPath?: string
  redirectDelaySeconds?: number
  isProcessing?: boolean
}

export default function PaymentSuccessModal({
  bookingResponse,
  razorpayPaymentData,
  hotelName,
  hotelLocation,
  checkInDate,
  checkOutDate,
  totalAmount,
  guestEmail,
  isGuest = false,
  redirectPath = "/dashboard",
  redirectDelaySeconds = 6,
  isProcessing = false,
}: PaymentSuccessModalProps) {
  const [countdown, setCountdown] = useState(redirectDelaySeconds)

  const bookingId = getResponseField(bookingResponse?.data, "booking_id", "bookingId")
  const reservationId = getResponseField(bookingResponse?.data, "reservation_id", "reservationId", "id")
  const bookingNumber = getResponseField(bookingResponse?.data, "booking_number", "bookingNumber")
  const manageBookingToken = getResponseField(
    bookingResponse?.data,
    "manage_booking_token",
    "guest_access_token",
    "access_key",
    "booking_access_token",
    "token"
  )
  const confirmationRef = bookingNumber || reservationId || bookingId

  useEffect(() => {
    if (isProcessing) return

    setCountdown(redirectDelaySeconds)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          window.location.href = redirectPath
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isProcessing, redirectPath, redirectDelaySeconds])

  const checkIn = formatDate(checkInDate)
  const checkOut = formatDate(checkOutDate)
  const primaryButtonHref = isGuest ? "/" : "/dashboard"
  const primaryButtonLabel = isGuest ? "Back to Home" : "Go to Dashboard"
  const PrimaryIcon = isGuest ? Home : LayoutDashboard

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-3 sm:p-4">
      <div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[92vh] sm:max-h-[88vh] flex flex-col min-h-0"
        role="dialog"
        aria-labelledby="payment-success-title"
        aria-modal="true"
      >
        {isProcessing ? (
          <div className="bg-gradient-to-br from-[#078ED8] via-sky-600 to-blue-700 px-4 py-4 sm:px-6 sm:py-5 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center shrink-0 ring-2 ring-white/25">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="payment-success-title" className="text-base sm:text-xl font-bold tracking-tight leading-tight">
                  Processing Your Booking...
                </h3>
                <p className="text-sky-100 text-xs sm:text-sm font-medium leading-tight mt-0.5">
                  Payment received! Confirming your reservation...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-4 sm:px-6 sm:py-5 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center shrink-0 ring-2 ring-white/25">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-in zoom-in duration-300" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="payment-success-title" className="text-base sm:text-xl font-bold tracking-tight leading-tight">
                  {isGuest ? "You're All Set!" : "Booking Confirmed!"}
                </h3>
                <p className="text-emerald-50 text-xs sm:text-sm font-medium leading-tight mt-0.5 line-clamp-2">
                  {isGuest
                    ? "Your stay is booked. Save the details below — full access is in your email."
                    : "Your payment was successful and your stay is reserved."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3">
          {isProcessing && (
            <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-3 text-center space-y-1.5 animate-pulse">
              <div className="flex items-center justify-center gap-2 text-sky-800 font-bold text-xs sm:text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-[#078ED8]" />
                Finalizing Reservation
              </div>
              <p className="text-[11px] sm:text-xs text-sky-700 leading-relaxed">
                Please keep this window open while we register your payment and finalize your stay details.
              </p>
            </div>
          )}

          {!isProcessing && confirmationRef && (
            <div className="text-center py-2.5 px-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                Confirmation Number
              </p>
              <p className="text-base sm:text-lg font-black text-gray-900 tracking-wide">{String(confirmationRef)}</p>
            </div>
          )}

          <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden text-xs sm:text-sm bg-white">
            {hotelName && (
              <div className="flex items-start gap-2.5 p-3 sm:p-3.5">
                <MapPin className="w-4 h-4 text-[#078ED8] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-xs sm:text-sm leading-snug">{hotelName}</p>
                  {hotelLocation && (
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-snug">{hotelLocation}</p>
                  )}
                </div>
              </div>
            )}

            {(checkIn || checkOut) && (
              <div className="flex items-start gap-2.5 p-3 sm:p-3.5">
                <Calendar className="w-4 h-4 text-[#078ED8] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {checkIn && (
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check-in</p>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">{checkIn}</p>
                    </div>
                  )}
                  {checkOut && (
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check-out</p>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">{checkOut}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 sm:p-3.5 bg-orange-50/60">
              <span className="font-semibold text-gray-700 text-xs sm:text-sm">Amount Paid</span>
              <span className="text-base sm:text-lg font-black text-orange-600 tabular-nums">
                {formatINR(totalAmount)}
              </span>
            </div>
          </div>

          {!isProcessing && isGuest && guestEmail ? (
            <div className="rounded-xl border-2 border-[#078ED8]/20 bg-gradient-to-br from-blue-50/90 to-sky-50/90 p-3.5 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#078ED8]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#078ED8]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">Check your email to manage this booking</p>
                  <p className="text-[11px] sm:text-xs text-gray-600 mt-1 leading-relaxed">
                    We&apos;ve sent a confirmation to{" "}
                    <span className="font-bold text-gray-800 break-all">{guestEmail}</span>{" "}
                    with a secure link to view your booking, download your voucher, and see stay details anytime.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-white/80 border border-blue-100 p-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-[#078ED8] mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-[10px] sm:text-[11px] text-gray-600 leading-relaxed">
                  Open the email and click your <span className="font-semibold text-gray-800">Manage Booking</span> link. Can&apos;t find it? Check spam folder.
                </p>
              </div>
              {manageBookingToken && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full border-[#078ED8] text-[#078ED8] hover:bg-[#078ED8]/5 font-semibold h-9 text-xs"
                >
                  <Link href={`/manage-booking/${manageBookingToken}`}>View Booking Now</Link>
                </Button>
              )}
            </div>
          ) : !isProcessing && guestEmail ? (
            <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <Mail className="w-4 h-4 text-[#078ED8] mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-xs text-gray-600 leading-relaxed">
                Confirmation and booking details have been sent to{" "}
                <span className="font-semibold text-gray-800 break-all">{guestEmail}</span>.
                You can also view this booking anytime from your dashboard.
              </p>
            </div>
          ) : null}

          {!isProcessing && !isGuest && (bookingId || reservationId || razorpayPaymentData) && (
            <div className="rounded-xl bg-emerald-50/80 border border-emerald-100 p-3 space-y-1.5 text-xs">
              <p className="font-bold text-gray-800 text-xs">Booking Details</p>
              {bookingId && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Booking ID</span>
                  <span className="font-semibold text-gray-900">{String(bookingId)}</span>
                </div>
              )}
              {reservationId && reservationId !== bookingId && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Reservation ID</span>
                  <span className="font-semibold text-gray-900">{String(reservationId)}</span>
                </div>
              )}
              {razorpayPaymentData?.razorpay_payment_id && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="font-mono text-gray-800 text-[10px] break-all text-right">
                    {razorpayPaymentData.razorpay_payment_id}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 bg-gray-50/90 border-t border-gray-100 shrink-0">
          {isProcessing ? (
            <Button
              disabled
              className="w-full bg-[#078ED8]/80 text-white h-10 rounded-full font-bold text-xs sm:text-sm cursor-not-allowed opacity-90"
            >
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Payment Verification...
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                asChild
                className="flex-1 bg-[#078ED8] hover:bg-[#0679b8] text-white h-10 rounded-full font-bold text-xs sm:text-sm"
              >
                <Link href={primaryButtonHref}>
                  <PrimaryIcon className="w-4 h-4 mr-2" />
                  {primaryButtonLabel}
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = redirectPath
                }}
                className="flex-1 h-10 rounded-full font-semibold border-gray-200 text-gray-700 text-xs sm:text-sm"
              >
                Continue ({countdown}s)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
