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
  Loader2,
  Mail,
  FileText,
  Shield,
  X,
  ChevronDown,
  Tag,
  Sparkles,
  Ticket,
  PartyPopper,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'react-toastify'
import Link from "next/link"
import { getReservationDetails, getManageBooking, getCancellationPreview, addReview } from "@/services/api"
import { IMAGE_BASE_URL } from "@/lib/api/apiClient"
import CancelBookingModal, { type CancellationPreview } from "./CancelBookingModal"

interface BookingDetailsContentProps {
  bookingId?: string
  manageToken?: string
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
    discount?: string
    status: string
    created: string
    payment_method: string | null
    payment_type: string | null
    invoice_number: string
    booking_type: string
    message: string
    room_notes: string
    already_reviewed?: number
    razorpay_payment_id?: string | null
    house_number?: string | null
    street?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    gst?: boolean
    gst_number?: string | null
    gst_company_name?: string | null
    gst_phone_number?: string | null
    gst_address?: string | null
    cancellation_policy_name?: string | null
    cancellation_policy_no_of_days?: number | null
    cancellation_policy_description?: string | null
    traveller_details?: {
      email?: string | null
      first_name?: string | null
      last_name?: string | null
      mobile?: string | null
      full_name?: string | null
    } | null
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
        room_view?: string
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
        plans?: Array<{
          id: number
          plan: number
          plan_name: string
          plan_items?: Array<{
            id: number
            name: string
          }>
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

/** Returns true when a value is meaningful for UI display */
const hasValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === "string") return value.trim().length > 0
  if (typeof value === "number") return !Number.isNaN(value)
  if (typeof value === "boolean") return value
  return true
}

const hasPositiveAmount = (value?: string | null): boolean => {
  if (!hasValue(value)) return false
  const num = parseFloat(String(value))
  return !Number.isNaN(num) && num > 0
}

const BookingDetailsContent = ({ bookingId, manageToken }: BookingDetailsContentProps) => {
  const isGuestAccess = Boolean(manageToken)
  const backHref = isGuestAccess ? "/" : "/my-bookings"
  const backLabel = isGuestAccess ? "Back to Home" : "Back to My Bookings"
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
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isLoadingCancel, setIsLoadingCancel] = useState(false)
  const [cancellationData, setCancellationData] = useState<CancellationPreview | null>(null)
  const [showDiscounts, setShowDiscounts] = useState(true)

  useEffect(() => {
    if (manageToken) {
      fetchBookingDetails()
      return
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("spodia_access_token")
      if (!token) {
        window.location.href = "/login"
        return
      }
      fetchBookingDetails()
    }
  }, [bookingId, manageToken])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)

      if (manageToken) {
        const response = await getManageBooking(manageToken)
        setBookingDetails(response.data)
        return
      }

      if (!bookingId) {
        setError("Booking not found.")
        return
      }

      if (typeof window === "undefined") {
        return
      }

      const token = localStorage.getItem("spodia_access_token")
      if (!token) {
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

  const getBookingRecord = (data: any) => {
    if (!data) return null
    if (data.records) return data.records
    if (data.data) return data.data
    if (data.id) return data
    return null
  }

  const handleCancelClick = async () => {
    const booking = getBookingRecord(bookingDetails)
    if (!booking) return

    if (manageToken) {
      setCancellationData({
        status: "success",
        cancellation_type: "",
        amount_to_refund: 0,
        hours: 0,
        reservation_detail: {
          cancellation_policy_name: booking.cancellation_policy_name,
          cancellation_policy_description: booking.cancellation_policy_description,
          cancellation_policy_no_of_days: booking.cancellation_policy_no_of_days,
        },
      })
      setShowCancelModal(true)
      return
    }

    if (!booking.id) return

    try {
      setIsLoadingCancel(true)
      const response = await getCancellationPreview(booking.id)

      const data = response.data
      if (data.status === "success" || data.status === true) {
        setCancellationData(data)
        setShowCancelModal(true)
      } else {
        toast.error(data.message || "Unable to fetch cancellation details", {
          position: "top-right",
          autoClose: 4000,
        })
      }
    } catch (err: any) {
      console.error("Error fetching cancellation preview:", err)
      const apiErrorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.data?.message ||
        err?.message

      toast.error(apiErrorMessage || "Failed to load cancellation details. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      })
    } finally {
      setIsLoadingCancel(false)
    }
  }

  const handleCancelSuccess = () => {
    fetchBookingDetails()
  }

  const handleCancelModalClose = () => {
    setShowCancelModal(false)
    setCancellationData(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatPrice = (price: string | number) => {
    const amount = Math.round(typeof price === "number" ? price : parseFloat(price) || 0)
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status?: string) => {
    switch ((status || "").toLowerCase()) {
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
    const booking = getBookingRecord(bookingDetails)
    const images = booking?.listingdetails?.images
    if (!images || !Array.isArray(images) || images.length === 0) return "/placeholder.svg"
    const coverImage = images.find((img: any) => img.cover_photo)
    return coverImage?.file || images[0]?.file || "/placeholder.svg"
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

      const response = await addReview(bookingId!, reviewData)
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

  const booking = getBookingRecord(bookingDetails)

  if (error || !bookingDetails || !booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isGuestAccess ? "Unable to Access Booking" : "Error Loading Booking"}
          </h1>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {error ||
              (isGuestAccess
                ? "This link may be invalid or expired. Please open the latest manage-booking link from your confirmation email."
                : "Booking not found")}
          </p>
          <Link href={backHref}>
            <Button className="bg-[#FF9530] hover:bg-[#e8851c] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const canCancel = booking.status ? booking.status.toLowerCase() === "confirmed" : false

  // Parse room_notes JSON string to display the actual booked room types, quantities, and plans
  let bookedRooms: any[] = []
  let hasParsedRoomNotes = false

  if (booking && booking.room_notes) {
    try {
      const parsed = JSON.parse(booking.room_notes)
      if (Array.isArray(parsed) && parsed.length > 0) {
        bookedRooms = parsed
        hasParsedRoomNotes = true
      }
    } catch (err) {
      console.error("Failed to parse room_notes:", err)
    }
  }

  const findRoomMeta = (bookedRoom: any) => {
    const rooms = booking.listingdetails?.rooms || []
    if (bookedRoom?.id != null) {
      const byId = rooms.find((r) => Number(r.id) === Number(bookedRoom.id))
      if (byId) return byId
    }
    if (hasValue(bookedRoom?.room_name)) {
      const name = String(bookedRoom.room_name).trim().toLowerCase()
      return rooms.find((r) => r.room_name?.trim().toLowerCase() === name) || null
    }
    return null
  }

  const promotionDiscount = Number(booking.booking_summary?.promotion_discount || booking.discount || 0)
  const memberDiscount = Number(booking.booking_summary?.member_only_promotion || 0)
  const couponDiscount = Number(booking.booking_summary?.coupon_promotion || 0)
  const totalDiscount = promotionDiscount + memberDiscount + couponDiscount

  const basePrice = Number(booking.booking_summary?.original_hotel_price || booking.price || 0)
  const priceAfterDiscount = Number(booking.booking_summary?.total_base_price || (basePrice > 0 && totalDiscount > 0 ? basePrice - totalDiscount : 0))
  const totalTax = Number(booking.booking_summary?.total_tax || booking.tax || 0)
  const platformFee = Number(booking.booking_summary?.platform_fee || booking.service_charge || 0)
  const grandTotal = Number(booking.booking_summary?.grand_total || booking.total_price || 0)

  const getPlanIncludesLabel = (plan: any, roomMeta: any): string | null => {
    if (Array.isArray(plan?.includes) && plan.includes.length > 0) {
      const labels = plan.includes
        .map((item: any) => (typeof item === "string" ? item : item?.name))
        .filter(hasValue)
      if (labels.length > 0) return labels.join(", ")
    }
    if (typeof plan?.includes === "string" && plan.includes.trim()) {
      return plan.includes.trim()
    }

    const listingPlan = roomMeta?.plans?.find(
      (p: any) => p.plan_name?.toUpperCase() === plan?.plan_name?.toUpperCase()
    )
    const planItems = listingPlan?.plan_items
      ?.map((item: any) => item?.name)
      .filter(hasValue)
    if (planItems?.length) return planItems.join(", ")

    return null
  }

  const getPlanPriceInfo = (plan: any) => {
    const priceInfo = plan?.adults_info?.[0]?.price_info?.[0]
    if (!priceInfo) return null

    const ratePerNight =
      Number(priceInfo.price_per_day ?? priceInfo.price_per_qty ?? priceInfo.gross_price) || null
    const discountValue = Number(priceInfo.discount_value) || 0
    const gstPerDay = Number(priceInfo.gst_per_day) || 0
    const totalPrice = Number(priceInfo.total_price) || null
    const grossPrice = Number(priceInfo.gross_price) || null

    return { ratePerNight, discountValue, gstPerDay, totalPrice, grossPrice, date: priceInfo.date }
  }

  const getPlanGuestCounts = (plan: any, bookedRoom: any) => {
    const adultInfo = plan?.adults_info?.[0]
    const adults = Number(adultInfo?.no_of_adults ?? adultInfo?.no_adults ?? bookedRoom?.room_for_adult ?? booking.no_of_adults) || 0
    const children = Number(adultInfo?.no_of_child ?? booking.no_of_child) || 0
    return { adults, children }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  sm:py-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex flex-col space-y-3">
          <Link href={backHref}>
            <Button variant="ghost" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{booking.listingdetails.name}</h1>
            <p className="text-sm sm:text-base text-gray-600">Booking #{booking.booking_number}</p>
            {/* {isGuestAccess && (
              <p className="text-xs text-[#078ED8] font-semibold mt-1">Guest booking access</p>
            )} */}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {canCancel && (
            <Button
              onClick={handleCancelClick}
              disabled={isLoadingCancel}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full h-10 px-5 font-semibold"
            >
              {isLoadingCancel ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel Booking
                </>
              )}
            </Button>
          )}
          <Badge className={`${getStatusColor(booking.status)} w-fit`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Hotel details — first on mobile, top-left on desktop */}
        <div className="order-1 lg:col-span-2">
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

                {([
                  booking.listingdetails.address,
                  booking.listingdetails.city_name,
                  booking.listingdetails.state_name,
                  booking.listingdetails.country_name,
                ].some(hasValue)) && (
                    <div className="flex items-start text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base break-words">
                        {[
                          booking.listingdetails.address,
                          booking.listingdetails.city_name,
                          booking.listingdetails.state_name,
                          booking.listingdetails.country_name,
                        ].filter(hasValue).join(", ")}
                      </span>
                    </div>
                  )}

                {hasValue(booking.listingdetails.description) && (
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
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline + rooms + amenities + review — third on mobile (after summary), left column below hotel on desktop */}
        <div className="order-3 lg:order-2 lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Booking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Booking Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-start gap-3 min-w-[160px] flex-1 basis-[160px]">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">Booking Confirmed</p>
                    <p className="text-xs sm:text-sm text-gray-500 break-words">{formatDate(booking.created)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 min-w-[160px] flex-1 basis-[160px]">
                  <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">Check-in</p>
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      {formatDate(booking.arrival_date)}
                      {hasValue(booking.listingdetails?.check_in) && ` at ${booking.listingdetails.check_in}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 min-w-[160px] flex-1 basis-[160px]">
                  <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">Check-out</p>
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      {formatDate(booking.departure_date)}
                      {hasValue(booking.listingdetails?.check_out) && ` by ${booking.listingdetails.check_out}`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Details — only booked rooms from room_notes */}
          {hasParsedRoomNotes && bookedRooms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Bed className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Room Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {bookedRooms.map((bookedRoom, idx) => {
                    const roomMeta = findRoomMeta(bookedRoom)
                    const roomImage = roomMeta?.images?.[0]?.file || getCoverImage()
                    const roomCount = Number(bookedRoom.opted_count || bookedRoom.selectedRoomCount || 1)
                    const activePlans = (bookedRoom.plans || []).filter(
                      (plan: any) => Number(plan.selectedRoomCount) > 0 || hasValue(plan.plan_name)
                    )
                    const primaryPlan = activePlans[0]
                    const guestCounts = getPlanGuestCounts(primaryPlan, bookedRoom)
                    const bedType = roomMeta?.bed_type
                    const roomSize = roomMeta?.dimensions
                    const bedsCount = roomMeta?.no_of_beds ?? bookedRoom.no_of_beds
                    const roomView = roomMeta?.room_view
                    const hasSpecs = hasValue(bedType) || hasValue(roomSize) || hasValue(bedsCount) || guestCounts.adults > 0 || hasValue(roomView)

                    return (
                      <div key={bookedRoom.id || bookedRoom.room_name || idx} className="border rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-base sm:text-lg break-words">
                                {bookedRoom.room_name || roomMeta?.room_name}
                              </h3>
                              {roomCount > 0 && (
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {roomCount} Room{roomCount > 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                            {hasValue(roomMeta?.description) && (
                              <p className="text-gray-600 text-xs sm:text-sm mt-1 break-words">
                                {roomMeta!.description!.length > 100
                                  ? `${roomMeta!.description!.substring(0, 100)}...`
                                  : roomMeta!.description}
                              </p>
                            )}
                          </div>
                          {roomImage && (
                            <div className="relative w-full sm:w-20 h-16 rounded-lg overflow-hidden sm:ml-4 flex-shrink-0">
                              <Image
                                src={roomImage}
                                alt={bookedRoom.room_name || "Room Image"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {hasSpecs && (
                          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 ${activePlans.length > 0 ? "border-b pb-4 mb-4" : ""}`}>
                            {hasValue(bedType) && (
                              <div>
                                <p className="text-xs text-gray-500">Bed Type</p>
                                <p className="font-medium text-xs sm:text-sm break-words">{bedType}</p>
                              </div>
                            )}
                            {hasValue(roomSize) && (
                              <div>
                                <p className="text-xs text-gray-500">Room Size</p>
                                <p className="font-medium text-xs sm:text-sm">{roomSize}</p>
                              </div>
                            )}
                            {hasValue(bedsCount) && (
                              <div>
                                <p className="text-xs text-gray-500">Beds</p>
                                <p className="font-medium text-xs sm:text-sm">{bedsCount}</p>
                              </div>
                            )}
                            {hasValue(roomView) && (
                              <div>
                                <p className="text-xs text-gray-500">View</p>
                                <p className="font-medium text-xs sm:text-sm break-words">{roomView}</p>
                              </div>
                            )}
                            {(guestCounts.adults > 0 || guestCounts.children > 0) && (
                              <div>
                                <p className="text-xs text-gray-500">Guests</p>
                                <p className="font-medium text-xs sm:text-sm">
                                  {[
                                    guestCounts.adults > 0 ? `${guestCounts.adults} Adult${guestCounts.adults > 1 ? "s" : ""}` : null,
                                    guestCounts.children > 0 ? `${guestCounts.children} Child${guestCounts.children > 1 ? "ren" : ""}` : null,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {activePlans.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700">Booked Plans & Meals</p>
                            {activePlans.map((plan: any, pIdx: number) => {
                              const includesLabel = getPlanIncludesLabel(plan, roomMeta)
                              const priceInfo = getPlanPriceInfo(plan)
                              const planRoomCount = Number(plan.selectedRoomCount) || roomCount || 1

                              return (
                                <div
                                  key={plan.plan || plan.plan_name || pIdx}
                                  className="bg-green-50/50 border border-green-100 rounded-lg p-2.5 flex items-start justify-between gap-4"
                                >
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      {hasValue(plan.plan_name) && (
                                        <span className="font-bold text-xs text-green-800">{plan.plan_name}</span>
                                      )}
                                      {includesLabel && (
                                        <span className="text-xs text-green-700">({includesLabel})</span>
                                      )}
                                    </div>
                                    {/* {priceInfo && (
                                      <div className="mt-1 space-y-0.5">
                                        {priceInfo.ratePerNight != null && (
                                          <p className="text-[11px] text-gray-600">
                                            Rate per night: {formatPrice(priceInfo.ratePerNight)}
                                            {priceInfo.discountValue > 0 && (
                                              <span className="text-green-600 font-medium ml-2">
                                                (Saved {formatPrice(priceInfo.discountValue)})
                                              </span>
                                            )}
                                          </p>
                                        )}
                                        {priceInfo.grossPrice != null && priceInfo.grossPrice !== priceInfo.ratePerNight && (
                                          <p className="text-[11px] text-gray-500">
                                            Original: {formatPrice(priceInfo.grossPrice)}
                                          </p>
                                        )}
                                        {priceInfo.gstPerDay > 0 && (
                                          <p className="text-[11px] text-gray-500">
                                            GST: {formatPrice(priceInfo.gstPerDay)}
                                          </p>
                                        )}
                                      </div>
                                    )} */}
                                  </div>
                                  {planRoomCount > 0 && (
                                    <span className="text-xs font-medium text-gray-600 bg-white px-2 py-0.5 rounded border flex-shrink-0">
                                      {planRoomCount} Room{planRoomCount > 1 ? "s" : ""}
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {hasValue(bookedRoom.extra_bed_type) && (
                          <div className="mt-3 text-xs bg-yellow-50 border border-yellow-100 text-yellow-800 rounded px-2.5 py-1.5 w-fit">
                            <strong>Extra Bed:</strong> {bookedRoom.extra_bed_type}
                          </div>
                        )}
                      </div>
                    )
                  })}
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

          {/* Review Section — authenticated users only */}
          {
            !isGuestAccess && booking?.already_reviewed !== 1 && (
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

        {/* Sidebar — second on mobile (below hotel, above timeline); sticky right column on desktop */}
        <div className="order-2 lg:order-3 lg:col-start-3 lg:row-start-1 lg:row-span-2 space-y-4 sm:space-y-6 lg:sticky lg:top-8 h-fit self-start">
          {/* Payment & Pricing Summary */}
          <Card className="overflow-hidden border border-gray-200/80 shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center justify-between">
                <span>Payment &amp; Pricing Summary</span>
                <CreditCard className="w-5 h-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              {/* Room Price Breakdown */}
              {booking.booking_summary?.rooms && booking.booking_summary.rooms.length > 0 && (
                <div className="bg-gray-50/80 rounded-xl p-3 sm:p-4 space-y-2 border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Room Price Breakdown
                  </p>
                  <div className="space-y-1.5">
                    {booking.booking_summary.rooms.map((r: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs sm:text-sm text-gray-700">
                        <span className="truncate max-w-[220px] font-medium">
                          {(r.quantity || 1) > 1 ? `${r.quantity}x ` : ""}{r.room || "Room"}{r.plan ? ` (${r.plan})` : ""}
                          {r.adults ? ` • ${r.adults} Guest${r.adults > 1 ? "s" : ""}` : ""}
                        </span>
                        <span className="font-bold text-gray-900 tabular-nums">
                          {formatPrice(r.original_hotel_price || r.total || r.base_price || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-1">
                {/* Room Base Price */}
                {basePrice > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-semibold text-gray-700 block">Room Base Price</span>
                      {booking.total_rooms > 0 && booking.no_of_days > 0 && (
                        <span className="text-[11px] text-gray-400 font-medium block">
                          {booking.total_rooms} Room{booking.total_rooms > 1 ? "s" : ""} × {booking.no_of_days} Night{booking.no_of_days > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-gray-900 tabular-nums">
                      {formatPrice(basePrice)}
                    </span>
                  </div>
                )}

                {/* Total Discount Row */}
                {totalDiscount > 0 && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowDiscounts((s) => !s)}
                      className="w-full flex justify-between items-center text-sm font-semibold focus:outline-none cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        Total Discount
                        <ChevronDown
                          className={`w-4 h-4 text-emerald-600 transition-transform duration-300 ${
                            showDiscounts ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                      <span className="font-extrabold text-emerald-600 tabular-nums">
                        -{formatPrice(totalDiscount)}
                      </span>
                    </button>

                    {showDiscounts && (
                      <div className="space-y-2 pl-5">
                        {promotionDiscount > 0 && (
                          <div className="flex justify-between items-center text-sm text-emerald-600">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Tag className="w-3.5 h-3.5 text-emerald-500" />
                              Promotion Discount
                            </span>
                            <span className="font-semibold tabular-nums">-{formatPrice(promotionDiscount)}</span>
                          </div>
                        )}
                        {memberDiscount > 0 && (
                          <div className="flex justify-between items-center text-sm text-emerald-600">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              Member Discount
                            </span>
                            <span className="font-semibold tabular-nums">-{formatPrice(memberDiscount)}</span>
                          </div>
                        )}
                        {couponDiscount > 0 && (
                          <div className="flex justify-between items-center text-sm text-emerald-600">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Ticket className="w-3.5 h-3.5 text-purple-500" />
                              Coupon Discount
                            </span>
                            <span className="font-semibold tabular-nums">-{formatPrice(couponDiscount)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Price after Discount */}
                {totalDiscount > 0 && priceAfterDiscount > 0 && (
                  <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 pt-1">
                    <span className="font-medium">Price after Discount</span>
                    <span className="font-bold text-gray-700 tabular-nums">{formatPrice(priceAfterDiscount)}</span>
                  </div>
                )}

                {/* Taxes & Fees */}
                {totalTax > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600">Taxes &amp; Fees (GST)</span>
                    <span className="font-bold text-gray-900 tabular-nums">{formatPrice(totalTax)}</span>
                  </div>
                )}

                {/* Service Charge / Platform Fee */}
                {platformFee > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600">Platform &amp; Service Fee</span>
                    <span className="font-bold text-gray-900 tabular-nums">{formatPrice(platformFee)}</span>
                  </div>
                )}

                <hr className="my-3 border-gray-200" />

                {/* Grand Total */}
                {grandTotal > 0 && (
                  <div className="flex justify-between items-start pt-1">
                    <div>
                      <span className="text-base sm:text-lg font-extrabold text-gray-900 block">Total Paid</span>
                      <span className="text-[11px] text-gray-400 font-medium block">Includes all taxes &amp; fees</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-[#FF9530] tracking-tight tabular-nums">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                )}
              </div>

              {/* Savings Celebration Banner */}
              {totalDiscount > 0 && (
                <div className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 shadow-sm text-white mt-2">
                  <PartyPopper className="w-4 h-4 shrink-0" />
                  <p className="text-xs font-bold">
                    You saved {formatPrice(totalDiscount)} on this booking!
                  </p>
                </div>
              )}

              {/* Payment Details Footer */}
              {(hasValue(booking.payment_method) || hasValue(booking.payment_type) || hasValue(booking.razorpay_payment_id)) && (
                <div className="pt-3 border-t border-gray-100 space-y-2 bg-gray-50/70 p-3 rounded-xl">
                  {(hasValue(booking.payment_method) || hasValue(booking.payment_type)) && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                      <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-medium">{[booking.payment_method, booking.payment_type].filter(hasValue).join(" • ")}</span>
                    </div>
                  )}
                  {hasValue(booking.razorpay_payment_id) && (
                    <div className="text-[11px] text-gray-500 font-medium break-all flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                      Payment ID: {booking.razorpay_payment_id}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-4">
                {hasValue(booking.invoice_number) && (
                  <div className="flex items-start space-x-3 min-w-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">Invoice</p>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{booking.invoice_number}</p>
                    </div>
                  </div>
                )}

                {hasValue(booking.arrival_date) && (
                  <div className="flex items-start space-x-3 min-w-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">Check-in</p>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{formatDate(booking.arrival_date)}</p>
                      {hasValue(booking.listingdetails?.check_in) && (
                        <p className="text-xs text-gray-500">{booking.listingdetails.check_in}</p>
                      )}
                    </div>
                  </div>
                )}

                {hasValue(booking.departure_date) && (
                  <div className="flex items-start space-x-3 min-w-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">Check-out</p>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{formatDate(booking.departure_date)}</p>
                      {hasValue(booking.listingdetails?.check_out) && (
                        <p className="text-xs text-gray-500">{booking.listingdetails.check_out}</p>
                      )}
                    </div>
                  </div>
                )}

                {(booking.no_of_adults > 0 || booking.no_of_child > 0) && (
                  <div className="flex items-start space-x-3 min-w-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">Guests</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {booking.no_of_adults > 0 && `${booking.no_of_adults} Adult${booking.no_of_adults > 1 ? "s" : ""}`}
                        {booking.no_of_child > 0 && `${booking.no_of_adults > 0 ? ", " : ""}${booking.no_of_child} Child${booking.no_of_child > 1 ? "ren" : ""}`}
                      </p>
                    </div>
                  </div>
                )}

                {(booking.total_rooms > 0 || booking.no_of_days > 0) && (
                  <div className="flex items-start space-x-3 min-w-0">
                    <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">Rooms & Duration</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {[
                          booking.total_rooms > 0 ? `${booking.total_rooms} Room${booking.total_rooms > 1 ? "s" : ""}` : null,
                          booking.no_of_days > 0 ? `${booking.no_of_days} Night${booking.no_of_days > 1 ? "s" : ""}` : null,
                        ].filter(Boolean).join(" • ")}
                      </p>
                    </div>
                  </div>
                )}


              </div>
            </CardContent>
          </Card>

          {/* Guest Information */}
          {(hasValue(booking.firstname) || hasValue(booking.lastname) || hasValue(booking.phone) || hasValue(booking.traveller_details?.email) || hasValue(booking.street) || hasValue(booking.house_number) || hasValue(booking.city)) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(hasValue(booking.firstname) || hasValue(booking.lastname)) && (
                  <div className="flex items-start space-x-3">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base break-words">
                        {[booking.firstname, booking.lastname].filter(hasValue).join(" ")}
                      </p>
                    </div>
                  </div>
                )}

                {hasValue(booking.phone) && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 break-all">{booking.phone}</p>
                    </div>
                  </div>
                )}

                {hasValue(booking.traveller_details?.email) && (
                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 break-all">{booking.traveller_details?.email}</p>
                    </div>
                  </div>
                )}

                {(hasValue(booking.street) || hasValue(booking.house_number) || hasValue(booking.city) || hasValue(booking.state) || hasValue(booking.country)) && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">Billing Address</p>
                      <div className="text-xs sm:text-sm text-gray-600 break-words space-y-0.5">
                        {hasValue(booking.street) && <p>{booking.street}</p>}
                        {(hasValue(booking.house_number) || hasValue(booking.city) || hasValue(booking.state)) && (
                          <p>
                            {[booking.house_number, booking.city, booking.state].filter(hasValue).join(", ")}
                          </p>
                        )}
                        {hasValue(booking.country) && <p>{booking.country}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* GST Details — only when GST data exists */}
          {(booking.gst || hasValue(booking.gst_number) || hasValue(booking.gst_company_name)) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">GST Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {hasValue(booking.gst_number) && (
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">GST Number</span>
                    <span className="font-medium break-all text-right">{booking.gst_number}</span>
                  </div>
                )}
                {hasValue(booking.gst_company_name) && (
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">Company</span>
                    <span className="font-medium break-words text-right">{booking.gst_company_name}</span>
                  </div>
                )}
                {hasValue(booking.gst_phone_number) && (
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium break-all text-right">{booking.gst_phone_number}</span>
                  </div>
                )}
                {hasValue(booking.gst_address) && (
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600 shrink-0">Address</span>
                    <span className="font-medium break-words text-right">{booking.gst_address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Cancellation Policy */}
          {(hasValue(booking.cancellation_policy_name) || hasValue(booking.cancellation_policy_description)) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-500" />
                  Cancellation Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {hasValue(booking.cancellation_policy_name) && (
                  <p className="font-semibold text-sm sm:text-base text-gray-900">
                    {booking.cancellation_policy_name}
                    {booking.cancellation_policy_no_of_days != null && booking.cancellation_policy_no_of_days > 0 && (
                      <span className="font-normal text-gray-500 text-xs sm:text-sm"> ({booking.cancellation_policy_no_of_days} days)</span>
                    )}
                  </p>
                )}
                {hasValue(booking.cancellation_policy_description) && (
                  <div
                    className="text-xs sm:text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: booking.cancellation_policy_description || "" }}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {cancellationData && (
        <CancelBookingModal
          isOpen={showCancelModal}
          onClose={handleCancelModalClose}
          reservationId={!isGuestAccess ? booking.id : undefined}
          manageToken={isGuestAccess ? manageToken : undefined}
          cancellationData={cancellationData}
          onCancelSuccess={handleCancelSuccess}
        />
      )}
    </div>
  )
}

export default BookingDetailsContent