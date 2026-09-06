import { Metadata } from "next"
import Header from "@/components/layout/Header"
import BookingDetailsContent from "@/components/bookings/BookingDetailsContent"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export const metadata: Metadata = {
  title: "Booking Details - Spodia",
  description: "View detailed information about your booking",
}

interface BookingDetailsPageProps {
  params: {
    id: string
  }
}

export default function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <BookingDetailsContent bookingId={params.id} />
        
      </main>
    </ProtectedRoute>
  )
}