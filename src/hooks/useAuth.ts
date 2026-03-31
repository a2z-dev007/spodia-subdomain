"use client"

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import { initializeAuth } from '@/lib/features/auth/authSlice'

interface UseAuthOptions {
  redirectTo?: string
  redirectIfAuthenticated?: string
}

/**
 * @deprecated Use useAuth from @/contexts/AuthContext instead
 * This hook is kept for backward compatibility with redirect logic
 */
export const useAuthRedirect = (options: UseAuthOptions = {}) => {
  const { redirectTo = '/login', redirectIfAuthenticated } = options
  const { user, isLoading } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    // Initialize auth on first load
    dispatch(initializeAuth())
  }, [dispatch])

  useEffect(() => {
    if (isLoading) return

    // Redirect unauthenticated users to login
    if (!user && redirectTo) {
      router.push(redirectTo)
      return
    }

    // Redirect authenticated users away from auth pages
    if (user && redirectIfAuthenticated) {
      router.push(redirectIfAuthenticated)
      return
    }
  }, [user, isLoading, router, redirectTo, redirectIfAuthenticated])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  }
}

export const useRequireAuth = (redirectTo = '/login') => {
  return useAuthRedirect({ redirectTo })
}

export const useRedirectIfAuthenticated = (redirectTo = '/dashboard') => {
  return useAuthRedirect({ redirectIfAuthenticated: redirectTo })
}