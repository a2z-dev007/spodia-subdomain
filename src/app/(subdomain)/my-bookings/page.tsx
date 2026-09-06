import { Metadata } from "next"
import Header from "@/components/layout/Header"
import MyBookingsContentNew from "@/components/bookings/MyBookingsContentNew"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

// CSR - Client-Side Rendering for user-specific booking data
// This page requires authentication and shows personalized data
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching for user-specific data

export const metadata: Metadata = {
  title: "My Bookings - Spodia",
  description: "View and manage all your hotel bookings",
  robots: {
    index: false, // Don't index user-specific pages
    follow: false,
  },
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen md:pt-36 pt-20">
        <Header />
        <MyBookingsContentNew />
      </main>
    </ProtectedRoute>
  )
}