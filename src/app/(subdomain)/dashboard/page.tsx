import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import DashboardContent from "@/components/dashboard/DashboardContent"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export const metadata: Metadata = {
  title: "Dashboard - Spodia",
  description: "Manage your bookings, profile, and travel preferences on Spodia.",
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 md:pt-36 pt-20">
        <Header />
        <DashboardContent />
        
      </main>
    </ProtectedRoute>
  )
}
