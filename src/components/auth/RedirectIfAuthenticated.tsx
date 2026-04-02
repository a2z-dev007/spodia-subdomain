"use client"

import { useEffect } from "react"
import { useAppSelector } from "@/lib/hooks"
import { useRouter, usePathname } from "next/navigation"

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode
  redirectTo?: string
}

const RedirectIfAuthenticated = ({ children, redirectTo = "/dashboard" }: RedirectIfAuthenticatedProps) => {
  const { user, isLoading } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Redirect authenticated users away from auth pages
    if (!isLoading && user && pathname !== redirectTo) {
      console.log("RedirectIfAuthenticated: Redirecting authenticated user to", redirectTo)
      router.push(redirectTo)
    }
  }, [user, isLoading, router, redirectTo, pathname])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-b-4 border-[#FF9530] mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user is authenticated (will redirect)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default RedirectIfAuthenticated