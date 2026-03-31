"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loginUser, logout as logoutAction, initializeAuth } from "@/lib/features/auth/authSlice"
import type { User } from "@/lib/features/auth/authSlice"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updatedUser: User) => void
  isLoading: boolean
}

/* -------------------------------------------------------------------------- */
/* Context & Provider                                                         */
/* -------------------------------------------------------------------------- */
// Create a default context value to prevent undefined errors
const defaultAuthContext: AuthContextType = {
  user: null,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
  isLoading: true,
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const [isMounted, setIsMounted] = useState(false)
  const [initStarted, setInitStarted] = useState(false)

  // Safely get auth state with fallback
  const authState = useAppSelector((state) => {
    try {
      // Ensure state and state.auth exist
      if (!state || !state.auth) {
        return { user: null, isLoading: true }
      }
      return state.auth
    } catch (error) {
      console.error("Error accessing auth state:", error)
      return { user: null, isLoading: true }
    }
  })

  // Safely destructure with fallbacks
  const user = authState?.user ?? null
  const isLoading = !isMounted || !initStarted || (authState?.isLoading ?? true)

  // ✅ Mark as mounted on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // ✅ Initialize auth state (localStorage, JWT, etc.)
  useEffect(() => {
    if (isMounted && !initStarted && typeof window !== "undefined") {
      setInitStarted(true)
      dispatch(initializeAuth())
    }
  }, [dispatch, isMounted, initStarted])

  const login = async (email: string, password: string) => {
    try {
      const action = await dispatch(loginUser({ email, password }))
      return loginUser.fulfilled.match(action)
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    try {
      dispatch(logoutAction())
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUser = (updatedUser: User) => {
    try {
      dispatch({ type: "auth/updateUser", payload: updatedUser })
    } catch (error) {
      console.error("Update user error:", error)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    updateUser,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  
  // Context will always have a value now (either from provider or default)
  return ctx
}
