"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ProfileForm from "./ProfileForm"
import SecuritySettings from "./SecuritySettings"
import PreferencesSettings from "./PreferencesSettings"

const EditProfileContent = () => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-b-4 border-[#FF9530] mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="md:text-3xl text-xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600 text-sm">Manage your account information and preferences.</p>
      </div>

      <div className="space-y-8">
        <ProfileForm />
        <SecuritySettings />
        {/* <PreferencesSettings /> */}
      </div>
    </div>
  )
}

export default EditProfileContent
