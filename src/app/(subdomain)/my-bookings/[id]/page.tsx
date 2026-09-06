"use client"

import { useParams } from "next/navigation"
import Header from "@/components/layout/Header"
import BookingDetailsContent from "@/components/bookings/BookingDetailsContent"

export default function BookingDetailsPage() {
  const params = useParams()
  const bookingId = params.id as string

  return (
    <main className="min-h-screen bg-gray-50 md:pt-34 pt-20">
      <Header />
      <div className="pt-4 md:pt-8">
        <BookingDetailsContent bookingId={bookingId} />
      </div>
      
    </main>
  )
}