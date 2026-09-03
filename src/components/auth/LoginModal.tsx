"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import LoginForm from "./LoginForm"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  defaultEmail?: string
}

const LoginModal = ({ isOpen, onClose, onSuccess, defaultEmail }: LoginModalProps) => {
  const handleSuccess = () => {
    onSuccess?.()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-5 sm:p-6 max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in to Spodia</DialogTitle>
          <DialogDescription>
            Enter your email and password to continue with your booking.
          </DialogDescription>
        </DialogHeader>
        {isOpen && (
          <LoginForm
            key={`login-modal-${defaultEmail || "empty"}`}
            defaultEmail={defaultEmail}
            onSuccess={handleSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
