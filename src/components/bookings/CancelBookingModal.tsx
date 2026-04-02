"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cancelReservation } from "@/services/api"
import { toast } from "react-toastify"

interface ReservationDetail {
  cancellation_policy_name?: string
  cancellation_policy_no_of_days?: number
  cancellation_policy_description?: string
}

interface CancellationPreview {
  status: string
  cancellation_type: string
  amount_to_refund: number
  hours: number
  reservation_detail?: ReservationDetail
}

interface CancelBookingModalProps {
  isOpen: boolean
  onClose: () => void
  reservationId: number
  cancellationData: CancellationPreview
  onCancelSuccess: () => void
}

const CancelBookingModal = ({ isOpen, onClose, reservationId, cancellationData, onCancelSuccess }: CancelBookingModalProps) => {
  const [step, setStep] = useState<"preview" | "confirm">("preview")
  const [loading, setLoading] = useState(false)

  const handleCancelBooking = async () => {
    try {
      setLoading(true)
      const response = await cancelReservation(reservationId)
      
     

      const data = response.data
      
      if (data.status === "success") {
        toast.success("Booking cancelled successfully!", {
          position: "top-right",
          autoClose: 3000,
        })
        onCancelSuccess()
        onClose()
      } else {
        toast.error(data.message || "Unable to cancel booking", {
          position: "top-right",
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast.error("Failed to cancel booking. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProceedToConfirm = () => {
    setStep("confirm")
  }

  const handleClose = () => {
    setStep("preview")
    onClose()
  }

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("preview")
    }
  }, [isOpen])

  if (!isOpen) return null

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Extract policy details from API data
  const policyName = cancellationData.reservation_detail?.cancellation_policy_name || "Cancellation Policy"
  const policyDays = cancellationData.reservation_detail?.cancellation_policy_no_of_days || 0
  const policyDescription = cancellationData.reservation_detail?.cancellation_policy_description || ""

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Cancel Reservation</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "preview" ? (
            <>
              {/* Cancellation Policy */}
              <div className="mb-6">
                {/* Policy Name */}
                {policyName && (
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {policyName}
                    </h3>
                    {policyDays > 0 && (
                      <p className="text-sm text-gray-600">
                        Cancellation allowed up to {policyDays} {policyDays === 1 ? 'day' : 'days'} before check-in
                      </p>
                    )}
                  </div>
                )}

                {/* Policy Description */}
                {policyDescription && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div 
                      className="text-sm text-gray-700 leading-relaxed [&_p]:mb-2 [&_strong]:font-semibold [&_strong]:text-gray-900"
                      dangerouslySetInnerHTML={{ __html: policyDescription }}
                    />
                  </div>
                )}

                {/* Additional Policy Info */}
                {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    * Please note the above policies are subject to the following:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• All guests may cancel free of charge up to 2 hours after their booking is confirmed.</li>
                    <li>• If any guest cancels after this cooling-off period, we'll: Deduct your commission and the traveler booking fee, and</li>
                    <li>• Pay you in accordance with your cancellation policy 1-3 working days after their planned check-in date</li>
                  </ul>
                </div> */}
              </div>

              {/* Refund Amount */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total refund</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatAmount(cancellationData.amount_to_refund)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 rounded-full h-12 text-base"
                  disabled={loading}
                >
                  Go Back
                </Button>
                <Button
                  onClick={handleProceedToConfirm}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 text-base"
                  disabled={loading}
                >
                  Cancel Booking
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Confirmation Warning */}
              <div className="mb-6">
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-base text-gray-900 font-medium mb-1">
                      Are you sure you want to cancel this reservation?
                    </p>
                    <p className="text-sm text-gray-600">
                      This action can't be undone.
                    </p>
                  </div>
                </div>

                {/* Refund Amount */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-700">Total refund</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatAmount(cancellationData.amount_to_refund)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirmation Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("preview")}
                  variant="outline"
                  className="flex-1 rounded-full h-12 text-base"
                  disabled={loading}
                >
                  NO
                </Button>
                <Button
                  onClick={handleCancelBooking}
                  disabled={loading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "YES"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CancelBookingModal
