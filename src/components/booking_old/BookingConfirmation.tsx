"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { clearCurrentBooking, setCurrentStep } from "@/lib/features/booking/bookingSlice"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, MapPin, Users, Download, Mail, Phone } from "lucide-react"
import Image from "next/image"

const BookingConfirmation = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { bookings } = useAppSelector((state) => state?.booking ?? { bookings: [] })

  // Get the most recent booking (just created)
  const latestBooking = bookings[bookings.length - 1]

  useEffect(() => {
    // Clear current booking after confirmation
    const timer = setTimeout(() => {
      dispatch(clearCurrentBooking())
    }, 1000)

    return () => clearTimeout(timer)
  }, [dispatch])

  const handleViewBookings = () => {
    router.push("/dashboard")
  }

  const handleBookAnother = () => {
    dispatch(setCurrentStep(1))
    router.push("/hotels")
  }

  if (!latestBooking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
        <Button onClick={() => router.push("/hotels")} className="bg-[#FF9530] hover:bg-[#e8851c] text-white">
          Browse Hotels
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your reservation has been successfully created</p>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="text-lg font-bold text-[#FF9530]">{latestBooking.bookingReference}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hotel Information */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  alt={latestBooking.hotelDetails.hotelName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{latestBooking.hotelDetails.hotelName}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Manhattan, New York</span>
                </div>
                <p className="text-gray-600">{latestBooking.hotelDetails.roomName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">Check-in</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {new Date(latestBooking.hotelDetails.checkIn).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600">After 3:00 PM</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">Check-out</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {new Date(latestBooking.hotelDetails.checkOut).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600">Before 11:00 AM</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-gray-600 mb-1">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">Guests</span>
              </div>
              <p className="font-semibold text-gray-900">
                {latestBooking.hotelDetails.guests} guests • {latestBooking.hotelDetails.nights} nights
              </p>
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Guest Information</h4>
              <div className="space-y-3">
                {latestBooking.guestDetails.map((guest, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">
                      {guest.firstName} {guest.lastName}
                      {guest.isMainGuest && <span className="text-[#FF9530] text-sm ml-2">(Main Guest)</span>}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        <span>{guest.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        <span>{guest.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            {latestBooking.specialRequests && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Special Requests</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{latestBooking.specialRequests}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t pt-6 mt-6">
          <h4 className="font-semibold text-gray-900 mb-4">Payment Summary</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  ${latestBooking.hotelDetails.basePrice} × {latestBooking.hotelDetails.nights} nights
                </span>
                <span className="font-medium">
                  ${latestBooking.hotelDetails.basePrice * latestBooking.hotelDetails.nights}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes & fees</span>
                <span className="font-medium">
                  ${latestBooking.hotelDetails.taxes + latestBooking.hotelDetails.fees}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Paid</span>
                  <span className="text-lg font-bold text-gray-900">${latestBooking.hotelDetails.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-blue-900 mb-4">What's Next?</h3>
        <div className="space-y-3 text-blue-800">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium">Check your email</p>
              <p className="text-sm">We've sent a confirmation email with your booking details and e-ticket.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium">Prepare for your trip</p>
              <p className="text-sm">Review the hotel's check-in policies and prepare any required documents.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium">Manage your booking</p>
              <p className="text-sm">View, modify, or cancel your booking anytime from your dashboard.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleViewBookings}
          className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-8 py-3 rounded-full"
        >
          View My Bookings
        </Button>
        <Button
          onClick={handleBookAnother}
          variant="outline"
          className="border-[#FF9530] text-[#FF9530] hover:bg-[#FF9530] hover:text-white px-8 py-3 rounded-full"
        >
          Book Another Stay
        </Button>
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-full">
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>
      </div>
    </div>
  )
}

export default BookingConfirmation
