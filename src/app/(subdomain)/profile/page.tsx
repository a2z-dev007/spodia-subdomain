import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import EditProfileContent from "@/components/profile/EditProfileContent"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export const metadata: Metadata = {
  title: "Edit Profile - Spodia",
  description: "Update your personal information and travel preferences on Spodia.",
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 md:pt-36 pt-20">
        <Header />
        <EditProfileContent />
        
      </main>
    </ProtectedRoute>
  )
}
