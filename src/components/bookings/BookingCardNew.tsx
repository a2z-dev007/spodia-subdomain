"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Users, MapPin, Star, Loader2, ChevronRight, Bed, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Booking } from "@/types/booking"
import { sendReservationMail, getCancellationPreview } from "@/services/api"
import { toast } from 'react-toastify'
import CancelBookingModal from "./CancelBookingModal"

interface BookingCardProps {
  booking: Booking
  onBookingUpdate?: () => void
}

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

const BookingCardNew = ({ booking, onBookingUpdate }: BookingCardProps) => {
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isLoadingCancel, setIsLoadingCancel] = useState(false)
  const [cancellationData, setCancellationData] = useState<CancellationPreview | null>(null)

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return {
          color: "bg-green-500",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200",
          label: "Confirmed"
        }
      case "completed":
        return {
          color: "bg-gray-500",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          label: "Completed"
        }
      case "pending":
      case "requested":
        return {
          color: "bg-yellow-500",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
          label: "Pending"
        }
      case "cancelled":
        return {
          color: "bg-red-500",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          label: "Cancelled"
        }
      default:
        return {
          color: "bg-gray-500",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          label: status
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(parseFloat(price))
  }

  const getCoverImage = () => {
    const coverImage = booking.listingdetails.images.find(img => img.cover_photo)
    return coverImage?.file || booking.listingdetails.images[0]?.file || "/placeholder.svg?height=300&width=400"
  }

  const handleGetInvoice = async () => {
    try {
      setIsLoadingInvoice(true)
      const response = await sendReservationMail(booking.id, "user")

      if ((response.status !== 201)) {
        throw new Error("Failed to send invoice")
      }

      const data = response.data

      if (data.status === "success") {
        toast.success("Invoice sent successfully to your email!", {
          position: "top-right",
          autoClose: 3000,
        })
      } else {
        throw new Error(data.message || "Failed to send invoice")
      }
    } catch (error) {
      console.error("Error sending invoice:", error)
      toast.error("Failed to send invoice. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setIsLoadingInvoice(false)
    }
  }

  const statusConfig = getStatusConfig(booking.status)
  const canCancel = booking.status.toLowerCase() === "confirmed"

  const handleCancelClick = async () => {
    try {
      setIsLoadingCancel(true)
      const response = await getCancellationPreview(booking.id)
      const data = response.data
      
      if (data.status === "success") {
        setCancellationData(data)
        setShowCancelModal(true)
      } else {
        toast.error(data.message || "Unable to fetch cancellation details", {
          position: "top-right",
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error("Error fetching cancellation preview:", error)
      toast.error("Failed to load cancellation details. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setIsLoadingCancel(false)
    }
  }

  const handleCancelSuccess = () => {
    if (onBookingUpdate) {
      onBookingUpdate()
    }
  }

  const handleModalClose = () => {
    setShowCancelModal(false)
    setCancellationData(null)
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group my-4 md:my-6">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-80 lg:w-96 relative h-48 sm:h-64 md:h-auto">
            <Image
              src={getCoverImage()}
              alt={booking.listingdetails.name}
              fill
              className="object-cover"
            />
            {/* Status Badge Overlay */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
              <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-1 rounded-full flex items-center gap-1.5 sm:gap-2`}>
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusConfig.color} animate-pulse`}></div>
                <span className={`font-semibold text-xs sm:text-sm ${statusConfig.textColor}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
            {/* Star Rating Overlay */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/30 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-xs sm:text-sm">{booking.listingdetails.star_category}</span>
            </div>
          </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Header with Cancel Button */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-md sm:text-xl font-bold text-gray-900 group-hover:text-[#078ED8] transition-colors break-words flex-1">
                {booking.listingdetails.name}
              </h3>
              {canCancel && (
                <Button
                  onClick={handleCancelClick}
                  disabled={isLoadingCancel}
                  variant="ghost"
                  className="border border-red-600 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full py-1 text-sm font-medium h-7"
                >
                  {isLoadingCancel ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Cancel
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="flex items-start gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm break-words">
                {booking.listingdetails.city_name}, {booking.listingdetails.state_name}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
              <span className="font-medium break-all">ID: {booking.booking_number}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm">Booked {formatDate(booking.created)}</span>
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {/* Check-in */}
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
              <div className="flex items-center gap-1 sm:gap-2 text-blue-600 mb-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium">Check-in</span>
              </div>
              <p className="font-semibold text-gray-900 text-xs sm:text-base">{formatDate(booking.arrival_date)}</p>
              <p className="text-[10px] sm:text-xs text-gray-600">{booking.listingdetails.check_in}</p>
            </div>

            {/* Check-out */}
            <div className="bg-orange-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
              <div className="flex items-center gap-1 sm:gap-2 text-orange-600 mb-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium">Check-out</span>
              </div>
              <p className="font-semibold text-gray-900 text-xs sm:text-base">{formatDate(booking.departure_date)}</p>
              <p className="text-[10px] sm:text-xs text-gray-600">{booking.listingdetails.check_out}</p>
            </div>

            {/* Guests */}
            <div className="bg-purple-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
              <div className="flex items-center gap-1 sm:gap-2 text-purple-600 mb-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium">Guests</span>
              </div>
              <p className="font-semibold text-gray-900 text-xs sm:text-base">
                {booking.no_of_adults + booking.no_of_child} Total
              </p>
              <p className="text-[10px] sm:text-xs text-gray-600">
                {booking.no_of_adults} Adults{booking.no_of_child > 0 && `, ${booking.no_of_child} Kids`}
              </p>
            </div>

            {/* Rooms */}
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
              <div className="flex items-center gap-1 sm:gap-2 text-green-600 mb-1">
                <Bed className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium">Rooms</span>
              </div>
              <p className="font-semibold text-gray-900 text-xs sm:text-base">{booking.total_rooms} Room{booking.total_rooms > 1 ? 's' : ''}</p>
              <p className="text-[10px] sm:text-xs text-gray-600">{booking.no_of_days} Night{booking.no_of_days > 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
            {/* Price */}
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl sm:text-2xl font-bold text-[#078ED8]">
                {formatPrice(booking.total_price)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                onClick={handleGetInvoice}
                disabled={isLoadingInvoice}
                variant="outline"
                className="rounded-full border-[#078ED8] text-[#078ED8] hover:bg-[#078ED8] hover:text-white text-sm h-8 w-full sm:w-auto"
              >
                {isLoadingInvoice ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send
                     className="w-4 h-4" />
                  Send  Invoice
                  </>
                )}
              </Button>

              <Link href={`/my-bookings/${booking.id}`} className="w-full sm:w-auto">
                <Button className="bg-[#078ED8] hover:bg-[#0679b8] text-white rounded-full text-sm h-8 w-full">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Cancel Booking Modal */}
    {cancellationData && (
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={handleModalClose}
        reservationId={booking.id}
        cancellationData={cancellationData}
        onCancelSuccess={handleCancelSuccess}
      />
    )}
  </>
  )
}

export default BookingCardNew
