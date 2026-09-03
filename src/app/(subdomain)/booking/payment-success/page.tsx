"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ArrowRight, Calendar, MapPin, Building2, User, Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedResponse = sessionStorage.getItem("bookingResponse")
      if (storedResponse) {
        try {
          setBookingData(JSON.parse(storedResponse))
        } catch {
          // Fallback
        }
      }
    }
  }, [])

  const records = bookingData?.records || {}
  const confirmationNumber = records.confirmation_number || records.booking_id || "N/A"

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Booking Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3 tracking-tight">
            Thank you for your booking!
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Confirmation #: <span className="font-extrabold text-gray-800">{confirmationNumber}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-[#078ED8] uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>Reservation Details</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            A confirmation email with complete stay details and receipt has been dispatched to your email.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => router.push("/my-bookings")}
            className="flex-1 h-12 bg-[#078ED8] hover:bg-[#0679b8] text-white font-bold rounded-xl shadow-md transition-all"
          >
            View My Bookings
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="h-12 border-gray-200 font-bold rounded-xl"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
