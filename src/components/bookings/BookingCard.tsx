"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Users, MapPin, Phone, CreditCard, Star, Download, Loader2, ChevronUp, ChevronDown, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Booking } from "@/types/booking"
import { sendReservationMail } from "@/services/api"
import { toast } from 'react-toastify'

interface BookingCardProps {
  booking: Booking
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false)
  console.log("booking", booking)
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "pending":
      case "requested":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(parseFloat(price))
  }

  const formatAddress = (booking: Booking) => {
    const { address, city_name, state_name, country_name } = booking.listingdetails

    // Build full address from available components
    const addressParts = []

    // Start with the full address if available
    if (address && address.trim()) {
      // Clean up address - remove extra spaces and commas
      const cleanAddress = address.replace(/,+/g, ',').replace(/\s+/g, ' ').trim()
      addressParts.push(cleanAddress)
    }

    // Add city, state, country if not already included in address
    const locationParts = []
    if (city_name && city_name.trim()) {
      locationParts.push(city_name.trim())
    }
    if (state_name && state_name.trim()) {
      locationParts.push(state_name.trim())
    }
    if (country_name && country_name.trim()) {
      locationParts.push(country_name.trim())
    }

    // If we have location parts and they're not already in the address, add them
    if (locationParts.length > 0) {
      const locationString = locationParts.join(', ')

      // Check if location info is already in the address
      if (!address || !address.toLowerCase().includes(city_name?.toLowerCase() || '')) {
        addressParts.push(locationString)
      }
    }

    // Return the full address or fallback
    if (addressParts.length > 0) {
      return addressParts.join(', ')
    }

    // Fallback to just location parts if no address
    if (locationParts.length > 0) {
      return locationParts.join(', ')
    }

    return "Location not specified"
  }

  const getCoverImage = () => {
    const coverImage = booking.listingdetails.images.find(img => img.cover_photo)
    return coverImage?.file || booking.listingdetails.images[0]?.file || "/placeholder.svg?height=200&width=300"
  }

  const handleGetInvoice = async () => {
    try {
      setIsLoadingInvoice(true)

      const response = await sendReservationMail(booking.id, "user")

      if (response.status !==201) {
        throw new Error("Failed to send invoice")
      }

      const data = response.data

      if (data.status === "success") {
        toast.success("Invoice sent successfully to your email!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        throw new Error(data.message || "Failed to send invoice")
      }
    } catch (error) {
      console.error("Error sending invoice:", error)
      toast.error("Failed to send invoice. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsLoadingInvoice(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{booking.listingdetails.name}</h3>
              <div className="flex items-center">
                {[...Array(parseInt(booking.listingdetails.star_category))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="flex items-start text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
              <span className="text-sm leading-tight overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word'
              }}>{formatAddress(booking)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Booking ID: {booking.booking_number}</span>
              <span>•</span>
              <span>Booked on {formatDate(booking.created)}</span>
              {booking.listingdetails.property_type && (
                <>
                  <span>•</span>
                  <span>{booking.listingdetails.property_type}</span>
                </>
              )}
            </div>
            {booking.listingdetails.hotel_chain_name && (
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Hotel Chain:</span> {booking.listingdetails.hotel_chain_name}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <button
                  onClick={handleViewDetails}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  View Details
                </button>
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Download Receipt
                </button>
                {booking.status.toLowerCase() === "confirmed" && (
                  <button
                    onClick={handleCancelBooking}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Cancel Booking
                  </button>
                )}
              </PopoverContent>
            </Popover> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Hotel Image */}
          <div className="lg:col-span-1">
            <div className="relative w-full h-32 lg:h-40 rounded-xl overflow-hidden">
              <Image
                src={getCoverImage()}
                alt={booking.listingdetails.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Check-in</span>
                </div>
                <p className="font-semibold">{formatDate(booking.arrival_date)}</p>
                <p className="text-sm text-gray-500">{booking.listingdetails.check_in}</p>
              </div>
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Check-out</span>
                </div>
                <p className="font-semibold">{formatDate(booking.departure_date)}</p>
                <p className="text-sm text-gray-500">{booking.listingdetails.check_out}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Guests</span>
                </div>
                <p className="font-semibold">
                  {booking.no_of_adults} Adult{booking.no_of_adults > 1 ? 's' : ''}
                  {booking.no_of_child > 0 && `, ${booking.no_of_child} Child${booking.no_of_child > 1 ? 'ren' : ''}`}
                </p>
              </div>
              <div>
                <div className="text-gray-600 mb-1">
                  <span className="text-sm font-medium">Rooms</span>
                </div>
                <p className="font-semibold">{booking.total_rooms} Room{booking.total_rooms > 1 ? 's' : ''}</p>
              </div>
              <div>
                <div className="text-gray-600 mb-1">
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <p className="font-semibold">{booking.no_of_days} Night{booking.no_of_days > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Contact</span>
                </div>
                <p className="font-semibold">{booking.firstname} {booking.lastname}</p>
                <p className="text-sm text-gray-500">{booking.phone}</p>
              </div>
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Payment</span>
                </div>
                <p className="font-semibold">{booking.payment_method}</p>
                <p className="text-sm text-gray-500">{booking.payment_type}</p>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Price Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Price</span>
                  <span>{formatPrice(booking.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span>{formatPrice(booking.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Charge</span>
                  <span>{formatPrice(booking.service_charge)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-[#FF9530]">{formatPrice(booking.total_price)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                <Button
                  onClick={handleGetInvoice}
                  disabled={isLoadingInvoice}
                 className="rounded-full border-[#078ED8] text-[#078ED8] hover:bg-[#078ED8] hover:text-white text-sm h-8 w-full sm:w-auto"
                  size="sm"
                >
                  {isLoadingInvoice ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send
                       className="w-4 h-4" />
                      <span>Send Invoice</span>
                    </>
                  )}
                </Button>

                {/* View Details Button - show for all bookings */}
                <Link href={`/my-bookings/${booking.id}`}>
                  <Button
                    variant="outline"
                    className="w-full mt-2 border-[#FF9530] text-[#FF9530] hover:bg-[#FF9530] hover:text-white flex items-center justify-center space-x-2"
                    size="sm"
                  >
                    <span>
                      {booking.status.toLowerCase() === 'completed' && booking.already_reviewed !== 1
                        ? 'Leave Review'
                        : 'View Details'}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Details Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[#FF9530]  hover:text-[#e8851c] hover:bg-orange-50"
          >
            {showDetails ? <span className="flex items-center gap-1">Hide Details <ChevronUp size={25} color="orange" /></span> : <span className="flex items-center gap-1">
              Show More Details <ChevronDown size={25} color="orange" />

            </span>
            }
          </Button>
        </div>

        {/* Additional Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Property Details</h5>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Property Type:</span> {booking.listingdetails.property_type}</p>
                  {booking.listingdetails.hotel_chain_name && (
                    <p><span className="font-medium">Hotel Chain:</span> {booking.listingdetails.hotel_chain_name}</p>
                  )}
                  <p><span className="font-medium">Star Rating:</span> {booking.listingdetails.star_category} Star</p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Invoice Details</h5>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Invoice Number:</span> {booking.invoice_number}</p>
                  <p><span className="font-medium">Booking Type:</span> {booking.booking_type}</p>
                  <p><span className="font-medium">Payment Method:</span> {booking.payment_method}</p>
                </div>
              </div>
            </div>

            {booking.message && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Special Requests</h5>
                <p className="text-gray-600 text-sm">{booking.message}</p>
              </div>
            )}

            {booking.room_notes && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Room Notes</h5>
                <div className="text-gray-600 text-sm">
                  {(() => {
                    try {
                      // Try to parse as JSON
                      const roomNotesData = JSON.parse(booking.room_notes)

                      if (Array.isArray(roomNotesData)) {
                        return (
                          <div className="space-y-4">
                            {roomNotesData.map((plan: any, index: number) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h6 className="font-medium text-gray-800 mb-2">
                                  Plan {plan.plan_name || index + 1}
                                  {plan.room_type && ` - ${plan.room_type}`}
                                </h6>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                  {plan.no_of_adults && (
                                    <div>
                                      <span className="font-medium">Adults:</span> {plan.no_of_adults}
                                    </div>
                                  )}
                                  {plan.no_of_child && (
                                    <div>
                                      <span className="font-medium">Children:</span> {plan.no_of_child}
                                    </div>
                                  )}
                                  {plan.child_age && (
                                    <div>
                                      <span className="font-medium">Child Age:</span> {plan.child_age}
                                    </div>
                                  )}
                                  {plan.no_of_room && (
                                    <div>
                                      <span className="font-medium">Rooms:</span> {plan.no_of_room}
                                    </div>
                                  )}
                                  {plan.selectedBedType && (
                                    <div>
                                      <span className="font-medium">Bed Type:</span> {plan.selectedBedType}
                                    </div>
                                  )}
                                  {plan.selectedRoomCount && (
                                    <div>
                                      <span className="font-medium">Room Count:</span> {plan.selectedRoomCount}
                                    </div>
                                  )}
                                </div>

                                {plan.includes && (
                                  <div className="mt-3">
                                    <span className="font-medium text-green-700">Includes:</span>
                                    <p className="text-green-600 mt-1">{plan.includes}</p>
                                  </div>
                                )}

                                {plan.price_info && (
                                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                    {plan.price_info.dates && (
                                      <div>
                                        <span className="font-medium">Dates:</span> {plan.price_info.dates}
                                      </div>
                                    )}
                                    {plan.price_info.price_per_qty && (
                                      <div>
                                        <span className="font-medium">Price per qty:</span> ₹{plan.price_info.price_per_qty}
                                      </div>
                                    )}
                                    {plan.price_info.total_price && (
                                      <div>
                                        <span className="font-medium">Total:</span> ₹{plan.price_info.total_price}
                                      </div>
                                    )}
                                    {plan.price_info.gst_percentage && (
                                      <div>
                                        <span className="font-medium">GST:</span> {plan.price_info.gst_percentage}%
                                      </div>
                                    )}
                                  </div>
                                )}

                                {plan.service_charge && (
                                  <div className="mt-2 text-xs">
                                    <span className="font-medium">Service Charge:</span> ₹{plan.service_charge}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      } else if (typeof roomNotesData === 'object') {
                        // Handle single object
                        return (
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <pre className="whitespace-pre-wrap text-xs text-gray-700">
                              {JSON.stringify(roomNotesData, null, 2)}
                            </pre>
                          </div>
                        )
                      } else {
                        return <p>{String(roomNotesData)}</p>
                      }
                    } catch (error) {
                      // If not valid JSON, display as plain text
                      return <p>{booking.room_notes}</p>
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingCard