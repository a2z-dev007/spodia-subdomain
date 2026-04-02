"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  CreditCard,
  Star,
  ArrowLeft,
  Clock,
  CheckCircle,
  Building,
  Bed,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'react-toastify'
import Link from "next/link"
import { getReservationDetails, addReview } from "@/services/api"
import { IMAGE_BASE_URL } from "@/lib/api/apiClient"

interface BookingDetailsContentProps {
  bookingId: string
}

interface BookingDetails {
  status: string
  records: {
    id: number
    booking_number: string
    firstname: string
    lastname: string
    phone: string
    arrival_date: string
    departure_date: string
    no_of_adults: number
    no_of_child: number
    total_rooms: number
    no_of_days: number
    price: string
    tax: string
    service_charge: string
    total_price: string
    status: string
    created: string
    payment_method: string
    payment_type: string
    invoice_number: string
    booking_type: string
    message: string
    room_notes: string
    already_reviewed?: number
    listingdetails: {
      id: number
      name: string
      description: string
      property_type: string
      star_category: string
      address: string
      city_name: string
      state_name: string
      country_name: string
      check_in: string
      check_out: string
      hotel_chain_name: string
      images: Array<{
        id: number
        file: string
        cover_photo: boolean
      }>
      rooms: Array<{
        id: number
        room_name: string
        description: string
        bed_type: string
        dimensions: string
        no_of_beds: number
        maximum_occupancy: number
        images: Array<{
          id: number
          file: string
          cover_photo: boolean
        }>
        facilitiesDetails: Array<{
          id: number
          name: string
          image: string
        }>
      }>
      facilitiesDetails: Array<{
        id: number
        name: string
        image: string
      }>
    }
  }
}

const BookingDetailsContent = ({ bookingId }: BookingDetailsContentProps) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [reviewData, setReviewData] = useState({
    comment: "",
    cleanliness_rate: 0,
    comfort_rate: 0,
    facilities_rate: 0,
    valuesformoney_rate: 0,
    staff_rate: 0,
    communication_rate: 0,
    location_rate: 0,
    recommended: true
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    // Check if user is authenticated before making API call
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("spodia_access_token")
      if (!token) {
        window.location.href = "/login"
        return
      }
      fetchBookingDetails()
    }
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)

      if (typeof window === 'undefined') {
        return
      }

      const token = localStorage.getItem("spodia_access_token")

      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = "/login"
        return
      }

      const response = await getReservationDetails(bookingId)
      setBookingDetails(response.data)
    } catch (err: any) {
      console.error("Error fetching booking details:", err)
      const errorMessage = err?.message || "Failed to load booking details. Please try again."
      setError(errorMessage)
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(parseFloat(price))
  }

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

  const getCoverImage = () => {
    if (!bookingDetails?.records.listingdetails.images) return "/placeholder.svg"
    const coverImage = bookingDetails.records.listingdetails.images.find(img => img.cover_photo)
    return coverImage?.file || bookingDetails.records.listingdetails.images[0]?.file || "/placeholder.svg"
  }

  const handleRatingClick = (category: string, rating: number) => {
    setReviewData(prev => ({
      ...prev,
      [category]: rating
    }))
  }

  const handleSubmitReview = async () => {
    // Validate required fields
    if (reviewData.cleanliness_rate === 0 || reviewData.comfort_rate === 0 || reviewData.facilities_rate === 0) {
      toast.error("Please provide ratings for Cleanliness, Comfort, and Facilities (required)")
      return
    }

    if (reviewData.comment.trim().length < 10) {
      toast.error("Please write a review with at least 10 characters")
      return
    }

    try {
      setSubmittingReview(true)

      const token = localStorage.getItem("spodia_access_token")
      if (!token) {
        toast.error("Please login to submit a review")
        window.location.href = "/login"
        return
      }

      console.log("Submitting review data:", reviewData)
      console.log("Booking ID:", bookingId)

      const response = await addReview(bookingId, reviewData)
      console.log("Response data:", response.data)

      if (response.data.status === "success") {
        toast.success(response.data.message || "Thank you for your feedback. Your rating is accepted and will be displayed soon.")

        // Reset form
        setReviewData({
          comment: "",
          cleanliness_rate: 0,
          comfort_rate: 0,
          facilities_rate: 0,
          valuesformoney_rate: 0,
          staff_rate: 0,
          communication_rate: 0,
          location_rate: 0,
          recommended: true
        })
      } else {
        throw new Error(response.data.message || "Failed to submit review")
      }
    } catch (error: any) {
      console.error("Error submitting review:", error)
      const errorMessage = error?.message || "Failed to submit review. Please try again."
      toast.error(errorMessage)
    } finally {
      setSubmittingReview(false)
    }
  }

  const renderNumberRating = (category: string, currentRating: number) => {
    // For testing purposes, allow reviews for all bookings (remove this in production)
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isDisabled = !isDevelopment && booking?.status?.toLowerCase() !== 'completed'

    return (
      <div className="flex items-center justify-center flex-wrap gap-2 max-w-md mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
          <button
            key={number}
            onClick={() => !isDisabled && handleRatingClick(category, number)}
            className={`w-8 h-8 rounded-full border-2 text-xs font-semibold transition-all duration-200 focus:outline-none ${number <= currentRating
              ? "bg-[#FF9530] border-[#FF9530] text-white shadow-md"
              : "bg-white border-gray-300 text-gray-600 hover:border-[#FF9530] hover:text-[#FF9530]"
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
            disabled={isDisabled}
            type="button"
          >
            {number}
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !bookingDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Booking</h1>
          <p className="text-gray-600 mb-6">{error || "Booking not found"}</p>
          <Link href="/my-bookings">
            <Button className="bg-[#FF9530] hover:bg-[#e8851c] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Bookings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const booking = bookingDetails.records

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex flex-col space-y-3">
          <Link href="/my-bookings">
            <Button variant="ghost" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Bookings
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{booking.listingdetails.name}</h1>
            <p className="text-sm sm:text-base text-gray-600">Booking #{booking.booking_number}</p>
          </div>
        </div>
        <Badge className={`${getStatusColor(booking.status)} w-fit`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Hotel Images */}
          <Card>
            <CardContent className="p-0">
              <div className="relative h-64 md:h-80 rounded-t-2xl overflow-hidden">
                <Image
                  src={getCoverImage()}
                  alt={booking.listingdetails.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{booking.listingdetails.name}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(parseInt(booking.listingdetails.star_category))].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">{booking.listingdetails.property_type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base break-words">{booking.listingdetails.address}</span>
                </div>

                <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {showFullDescription || booking.listingdetails.description.length <= 200 ? (
                    <p>{booking.listingdetails.description}</p>
                  ) : (
                    <p>{booking.listingdetails.description.substring(0, 200)}...</p>
                  )}
                  {booking.listingdetails.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-[#078ED8] hover:text-[#0679b8] font-medium mt-2 text-sm"
                    >
                      {showFullDescription ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Booking Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">Booking Confirmed</p>
                    <p className="text-xs sm:text-sm text-gray-500 break-words">{formatDate(booking.created)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">Check-in</p>
                    <p className="text-xs sm:text-sm text-gray-500 break-words">{formatDate(booking.arrival_date)} at {booking.listingdetails.check_in}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">Check-out</p>
                    <p className="text-xs sm:text-sm text-gray-500 break-words">{formatDate(booking.departure_date)} by {booking.listingdetails.check_out}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Details */}
          {booking.listingdetails.rooms && booking.listingdetails.rooms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Bed className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Room Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {booking.listingdetails.rooms.map((room) => (
                    <div key={room.id} className="border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg break-words">{room.room_name}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm mt-1 break-words">
                            {room.description.length > 100
                              ? `${room.description.substring(0, 100)}...`
                              : room.description}
                          </p>
                        </div>
                        {room.images && room.images.length > 0 && (
                          <div className="relative w-full sm:w-20 h-16 rounded-lg overflow-hidden sm:ml-4 flex-shrink-0">
                            <Image
                              src={room.images[0].file}
                              alt={room.room_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Bed Type</p>
                          <p className="font-medium text-sm sm:text-base break-words">{room.bed_type}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Room Size</p>
                          <p className="font-medium text-sm sm:text-base">{room.dimensions}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Beds</p>
                          <p className="font-medium text-sm sm:text-base">{room.no_of_beds}</p>
                        </div>
                        {/* <div>
                          <p className="text-xs sm:text-sm text-gray-500">Max Occupancy</p>
                          <p className="font-medium text-sm sm:text-base">{room.maximum_occupancy} guests</p>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hotel Amenities */}
          {booking.listingdetails.facilitiesDetails && booking.listingdetails.facilitiesDetails.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Hotel Amenities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {(showAllAmenities
                    ? booking.listingdetails.facilitiesDetails
                    : booking.listingdetails.facilitiesDetails.slice(0, 6)
                  ).map((facility) => (
                    <div key={facility.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {facility.image ? (
                          <div className="w-4 h-4 flex-shrink-0">
                            <Image
                              src={`${IMAGE_BASE_URL}${facility.image}`}
                              alt={facility.name}
                              width={16}
                              height={16}
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                // Fallback to static icon if image fails to load
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                    parent.innerHTML = '<svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>';
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            {facility.name.toLowerCase().includes('wifi') && <Wifi className="w-4 h-4 text-gray-600" />}
                            {facility.name.toLowerCase().includes('parking') && <Car className="w-4 h-4 text-gray-600" />}
                            {facility.name.toLowerCase().includes('coffee') && <Coffee className="w-4 h-4 text-gray-600" />}
                            {facility.name.toLowerCase().includes('restaurant') && <Utensils className="w-4 h-4 text-gray-600" />}
                            {!['wifi', 'parking', 'coffee', 'restaurant'].some(keyword =>
                              facility.name.toLowerCase().includes(keyword)
                            ) && <Building className="w-4 h-4 text-gray-600" />}
                          </>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700 break-words">{facility.name}</span>
                    </div>
                  ))}
                </div>
                {booking.listingdetails.facilitiesDetails.length > 6 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="text-[#078ED8] hover:text-[#0679b8] font-medium mt-4 text-sm w-full text-center"
                  >
                    {showAllAmenities
                      ? "Show Less"
                      : `Show All ${booking.listingdetails.facilitiesDetails.length} Amenities`}
                  </button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Review Section - Show for all bookings but only allow submission for completed */}
          {
            booking?.already_reviewed !== 1 && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-4 sm:p-6 lg:p-10">
                  {/* {booking.status.toLowerCase() !== 'completed' && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-10 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-amber-800 text-sm font-medium">
                        Reviews can only be submitted after your stay is completed. Current status: {booking.status}
                      </p>
                    </div>
                  </div>
                </div>
              )} */}

                  <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Give Us Rate & Review</h2>
                    <p className="text-sm sm:text-base text-gray-600">Help other travelers by sharing your experience</p>
                  </div>

                  {/* Rating Categories Grid */}
                  <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
                    {/* First Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {/* Cleanliness */}
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                          Cleanliness <span className="text-red-500">*</span>
                        </h3>
                        {renderNumberRating('cleanliness_rate', reviewData.cleanliness_rate)}
                        {reviewData.cleanliness_rate > 0 && (
                          <p className="text-sm text-gray-500">Rating: {reviewData.cleanliness_rate}/10</p>
                        )}
                      </div>

                      {/* Location */}
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Location</h3>
                        {renderNumberRating('location_rate', reviewData.location_rate)}
                        {reviewData.location_rate > 0 && (
                          <p className="text-sm text-gray-500">Rating: {reviewData.location_rate}/10</p>
                        )}
                      </div>

                      {/* Comfort */}
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                          Comfort <span className="text-red-500">*</span>
                        </h3>
                        {renderNumberRating('comfort_rate', reviewData.comfort_rate)}
                        {reviewData.comfort_rate > 0 && (
                          <p className="text-sm text-gray-500">Rating: {reviewData.comfort_rate}/10</p>
                        )}
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {/* Facilities */}
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                          Facilities <span className="text-red-500">*</span>
                        </h3>
                        {renderNumberRating('facilities_rate', reviewData.facilities_rate)}
                        {reviewData.facilities_rate > 0 && (
                          <p className="text-sm text-gray-500">Rating: {reviewData.facilities_rate}/10</p>
                        )}
                      </div>

                      {/* Values for Money */}
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Values for Money</h3>
                        {renderNumberRating('valuesformoney_rate', reviewData.valuesformoney_rate)}
                        {reviewData.valuesformoney_rate > 0 && (
                          <p className="text-sm text-gray-500">Rating: {reviewData.valuesformoney_rate}/10</p>
                        )}
                      </div>

                      {/* Staff */}
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Staff</h3>
                        {renderNumberRating('staff_rate', reviewData.staff_rate)}
                        {reviewData.staff_rate > 0 && (
                          <p className="text-sm text-gray-500">Rating: {reviewData.staff_rate}/10</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-10"></div>

                  {/* Write Review */}
                  <div className="mb-8 sm:mb-10">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
                      Write your review <span className="text-red-500">*</span>
                    </h3>
                    <div className="relative">
                      <Textarea
                        placeholder="Share your experience about your stay... Tell us what you loved most about the property, the service, and any suggestions for improvement."
                        value={reviewData.comment}
                        onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                        className="min-h-32 sm:min-h-40 border-2 border-gray-300 rounded-xl p-4 sm:p-6 text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:border-[#FF9530] focus:ring-2 focus:ring-[#FF9530] focus:ring-opacity-20 transition-all duration-200 resize-none"
                        disabled={process.env.NODE_ENV !== 'development' && booking.status.toLowerCase() !== 'completed'}
                      />
                      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs text-gray-400">
                        {reviewData.comment.length} characters
                      </div>
                    </div>
                    {reviewData.comment.length > 0 && reviewData.comment.length < 10 && (
                      <p className="text-red-500 text-xs sm:text-sm mt-2">Please write at least 10 characters</p>
                    )}
                  </div>

                  {/* Recommendation */}
                  <div className="mb-8 sm:mb-10">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-6">Would you recommend this property?</h3>
                    <div className="flex items-center justify-center space-x-6 sm:space-x-8">
                      <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                          <input
                            type="radio"
                            name="recommended"
                            checked={reviewData.recommended === true}
                            onChange={() => setReviewData(prev => ({ ...prev, recommended: true }))}
                            className="sr-only"
                            disabled={process.env.NODE_ENV !== 'development' && booking.status.toLowerCase() !== 'completed'}
                          />
                          <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${reviewData.recommended === true
                            ? 'bg-[#FF9530] border-[#FF9530]'
                            : 'border-gray-300 group-hover:border-[#FF9530]'
                            }`}>
                            {reviewData.recommended === true && (
                              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-lg font-medium text-gray-700 group-hover:text-[#FF9530] transition-colors">Yes</span>
                      </label>

                      <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                          <input
                            type="radio"
                            name="recommended"
                            checked={reviewData.recommended === false}
                            onChange={() => setReviewData(prev => ({ ...prev, recommended: false }))}
                            className="sr-only"
                            disabled={process.env.NODE_ENV !== 'development' && booking.status.toLowerCase() !== 'completed'}
                          />
                          <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${reviewData.recommended === false
                            ? 'bg-[#FF9530] border-[#FF9530]'
                            : 'border-gray-300 group-hover:border-[#FF9530]'
                            }`}>
                            {reviewData.recommended === false && (
                              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-lg font-medium text-gray-700 group-hover:text-[#FF9530] transition-colors">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={
                        submittingReview ||
                        (process.env.NODE_ENV !== 'development' && booking.status.toLowerCase() !== 'completed') ||
                        reviewData.cleanliness_rate === 0 ||
                        reviewData.comfort_rate === 0 ||
                        reviewData.facilities_rate === 0 ||
                        reviewData.comment.trim().length < 10
                      }
                      className="bg-[#FF9530] hover:bg-[#e8851c] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg w-full sm:w-auto"
                    >
                      {submittingReview ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 animate-spin inline" />
                          Submitting Review...
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 inline" />
                          Submit Review
                        </>
                      )}
                    </Button>

                    {/* Validation Summary */}
                    <div className="mt-4 text-xs sm:text-sm text-gray-500 px-4">
                      <p>* Required fields: Cleanliness, Comfort, Facilities ratings and written review (min 10 characters)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }

        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">Check-in</p>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">{formatDate(booking.arrival_date)}</p>
                  <p className="text-xs text-gray-500">{booking.listingdetails.check_in}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">Check-out</p>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">{formatDate(booking.departure_date)}</p>
                  <p className="text-xs text-gray-500">{booking.listingdetails.check_out}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">Guests</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {booking.no_of_adults} Adult{booking.no_of_adults > 1 ? 's' : ''}
                    {booking.no_of_child > 0 && `, ${booking.no_of_child} Child${booking.no_of_child > 1 ? 'ren' : ''}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">Rooms & Duration</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {booking.total_rooms} Room{booking.total_rooms > 1 ? 's' : ''} • {booking.no_of_days} Night{booking.no_of_days > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base break-words">{booking.firstname} {booking.lastname}</p>
                  <p className="text-xs sm:text-sm text-gray-600 break-all">{booking.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Room Price</span>
                  <span className="font-medium">{formatPrice(booking.price)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">{formatPrice(booking.tax)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Service Charge</span>
                  <span className="font-medium">{formatPrice(booking.service_charge)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-base sm:text-lg">
                  <span>Total Paid</span>
                  <span className="text-[#FF9530]">{formatPrice(booking.total_price)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base break-words">{booking.payment_method}</p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{booking.payment_type}</p>
                  </div>
                </div>
              </div>

              {/* <div className="text-xs text-gray-500 space-y-1 break-words">
                <p>Invoice: {booking.invoice_number}</p>
                <p>Booking Type: {booking.booking_type}</p>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookingDetailsContent