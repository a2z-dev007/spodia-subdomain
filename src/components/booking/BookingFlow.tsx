"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setCurrentStep } from "@/lib/features/booking/bookingSlice"
import SingleStepBookingForm from "./steps/SingleStepBookingForm"
import BookingSummaryCard from "./BookingSummaryCard"

const BookingFlow = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { bookingFormData } = useAppSelector((state) => state?.booking ?? { bookingFormData: {} })

  // Check if booking data exists
  const hasBookingData = bookingFormData && 
                        bookingFormData.hotelId && 
                        bookingFormData.hotelName && 
                        bookingFormData.rooms && 
                        bookingFormData.rooms.length > 0

  useEffect(() => {
    // If user reloaded the page and Redux state is lost, go back to previous page
    if (!hasBookingData) {
      router.back()
    }
  }, [hasBookingData, router])

  // Show loading state while redirecting
  if (!hasBookingData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Redirecting...</h2>
          <p className="text-gray-600">Taking you back to the previous page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Side - Form */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <SingleStepBookingForm />
        </div>

        {/* Right Side - Booking Summary - Show on top on mobile */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <BookingSummaryCard />
        </div>
      </div>
    </div>
  )
}

export default BookingFlow
