"use client"

import { useEffect } from "react"
import { useAppSelector } from "@/lib/hooks"
import { useRouter, usePathname } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

const ProtectedRoute = ({ children, redirectTo = "/login" }: ProtectedRouteProps) => {
  const { user, isLoading } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    // Also avoid redirecting if we're already on the login page
    if (!isLoading && !user && pathname !== redirectTo) {
      console.log("ProtectedRoute: Redirecting unauthenticated user to", redirectTo)
      router.push(redirectTo)
    }
  }, [user, isLoading, router, redirectTo, pathname])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full w-10 h-10 sm:w-12 sm:h-12 border-b-4 border-[#FF9530] mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null // Don't show anything, let the redirect happen
  }

  return <>{children}</>
}

export default ProtectedRoute