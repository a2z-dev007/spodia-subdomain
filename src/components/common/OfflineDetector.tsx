"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { WifiOff, Wifi } from "lucide-react"
import { toast } from "react-toastify"

export default function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(true)
  const [showBanner, setShowBanner] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine)

    let offlineTimer: NodeJS.Timeout | null = null

    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(false)
      
      // Clear the offline timer if connection is restored
      if (offlineTimer) {
        clearTimeout(offlineTimer)
        offlineTimer = null
      }
      
      // Don't show toast if we're on the offline page
      // if (pathname !== "/offline") {
      //   toast.success("You're back online!", {
      //     position: "top-center",
      //     autoClose: 3000,
      //     icon: <Wifi className="w-5 h-5 text-green-500" />,
      //   })
      // }
    }

    const handleOffline = () => {
      setIsOnline(false)
      
      // Show banner and toast after 5 seconds
      offlineTimer = setTimeout(() => {
        if (!navigator.onLine) {
          // setShowBanner(true)
          
          // toast.error("No internet connection", {
          //   position: "top-center",
          //   autoClose: false,
          //   icon: <WifiOff className="w-5 h-5 text-red-500" />,
          // })

          // Redirect to offline page after showing the banner
          setTimeout(() => {
            if (!navigator.onLine && pathname !== "/offline") {
              router.push("/offline")
            }
          }, 2000)
        }
      }, 5000) // Wait 5 seconds before showing offline UI
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      if (offlineTimer) {
        clearTimeout(offlineTimer)
      }
    }
  }, [router, pathname])

  // Don't show banner on offline page
  if (pathname === "/offline" || !showBanner) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white py-2 px-4 shadow-lg animate-slide-down">
      <div className="container mx-auto flex items-center justify-center space-x-2">
        <WifiOff className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-medium">
          You're offline. Please check your internet connection.
        </span>
      </div>
    </div>
  )
}
