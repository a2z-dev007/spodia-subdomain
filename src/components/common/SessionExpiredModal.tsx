"use client"

import { useEffect, useState } from "react"
import { Clock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SessionExpiredModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SessionExpiredModal({
  isOpen,
  onClose,
}: SessionExpiredModalProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleLogin()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  const handleLogin = () => {
    onClose()
    router.push("/login")
  }

  const handleStay = () => {
    onClose()
    router.push("/")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-[#FF9530]" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Session Expired
          </DialogTitle>
          <DialogDescription className="text-center">
            Your session has expired for security reasons. Please log in again to
            continue.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-orange-50 border-l-4 border-[#FF9530] p-4 rounded-r-lg my-4">
          <p className="text-sm text-gray-700">
            You will be redirected to the login page in{" "}
            <span className="font-bold text-[#FF9530]">{countdown}</span> seconds.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            onClick={handleLogin}
            className="w-full bg-[#FF9530] hover:bg-[#e8851c] text-white"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Log In Now
          </Button>
          <Button onClick={handleStay} variant="outline" className="w-full">
            Continue as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
