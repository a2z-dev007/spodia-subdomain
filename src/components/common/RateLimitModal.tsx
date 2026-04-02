"use client"

import { Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RateLimitModalProps {
  isOpen: boolean
  onClose: () => void
  retryAfter?: number // seconds
}

export default function RateLimitModal({
  isOpen,
  onClose,
  retryAfter = 60,
}: RateLimitModalProps) {
  const minutes = Math.ceil(retryAfter / 60)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Too Many Requests
          </DialogTitle>
          <DialogDescription className="text-center">
            You've made too many requests in a short period. Please wait a moment
            before trying again.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg my-4">
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Please wait approximately {minutes} {minutes === 1 ? "minute" : "minutes"}
              </p>
              <p className="text-xs text-gray-600">
                This helps us maintain service quality for all users.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
