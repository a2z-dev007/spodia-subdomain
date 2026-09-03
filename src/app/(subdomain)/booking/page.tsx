import type { Metadata } from "next"
import BookingFlow from "@/components/booking/BookingFlow"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Complete Your Booking - Spodia",
  description: "Complete your hotel booking with Spodia. Enter your details and confirm your reservation.",
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 py-8">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#078ED8]"></div>
        </div>
      }>
        <BookingFlow />
      </Suspense>
    </main>
  )
}
