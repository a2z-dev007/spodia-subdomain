"use client"

import { useEffect, useState } from "react"
import { WifiOff, Wifi, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NetworkStatusModal() {
  const [isOnline, setIsOnline] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [hasBeenOffline, setHasBeenOffline] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    let offlineTimer: NodeJS.Timeout | null = null

    const handleOnline = () => {
      setIsOnline(true)
      
      // Clear the offline timer if connection is restored
      if (offlineTimer) {
        clearTimeout(offlineTimer)
        offlineTimer = null
      }
      
      if (hasBeenOffline) {
        setShowModal(true)
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setShowModal(false)
          setHasBeenOffline(false)
        }, 3000)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      
      // Show modal after 5 seconds
      offlineTimer = setTimeout(() => {
        if (!navigator.onLine) {
          setShowModal(true)
          setHasBeenOffline(true)
        }
      }, 5000) // Wait 5 seconds before showing offline modal
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
  }, [hasBeenOffline])

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 pointer-events-none">
      <div
        className={`w-full max-w-md ${
          isOnline ? "bg-green-600" : "bg-red-600"
        } text-white rounded-lg shadow-2xl p-4 pointer-events-auto animate-slide-up`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <Wifi className="w-6 h-6" />
            ) : (
              <WifiOff className="w-6 h-6 animate-pulse" />
            )}
            <div>
              <p className="font-semibold">
                {isOnline ? "Back Online!" : "No Internet Connection"}
              </p>
              <p className="text-sm opacity-90">
                {isOnline
                  ? "Your connection has been restored"
                  : "Please check your network settings"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowModal(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
