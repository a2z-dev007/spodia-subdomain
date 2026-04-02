"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { loadBookings } from "@/lib/features/booking/bookingSlice"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Download, Loader2, MapPin, Star, Search, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { sendReservationMail, getRecentReservations } from "@/services/api"
import { toast } from 'react-toastify'
import Link from "next/link"

interface ApiBooking {
  id: number
  booking_number: string
  firstname: string
  lastname: string
  arrival_date: string
  departure_date: string
  no_of_adults: number
  no_of_child: number
  total_rooms: number
  total_price: string
  status: string
  created: string
  no_of_days: number
  listingdetails: {
    name: string
    address: string
    city_name: string
    state_name: string
    country_name: string
    star_category: string
    property_type: string
    hotel_chain_name?: string
    images: Array<{
      file: string
      cover_photo: boolean
    }>
  }
}

const RecentBookings = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })
  const router = useRouter()
  const [apiBookings, setApiBookings] = useState<ApiBooking[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingInvoice, setLoadingInvoice] = useState<{ [key: number]: boolean }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    dispatch(loadBookings())
    if (user) {
      fetchRecentBookings()
    }
  }, [dispatch, user])

  const fetchRecentBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("spodia_access_token")

      if (!token) return

      const response = await getRecentReservations({ page_number: 1, number_of_records: 6 })

      if (response.data.status === "success") {
        setApiBookings(response.data.records)
      } else {
        toast.error(response.data.message || "Failed to fetch bookings", {
          position: "top-right",
          autoClose: 3000,
        })
      }
    } catch (error: any) {
      console.error("Error fetching recent bookings:", error)
      const errorMessage = error?.message || "Failed to load bookings. Please try again."
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleGetInvoice = async (bookingId: number) => {
    try {
      setLoadingInvoice(prev => ({ ...prev, [bookingId]: true }))

      const response = await sendReservationMail(bookingId, "user")

      if (response.data.status === "success") {
        toast.success("Invoice sent successfully to your email!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        throw new Error(response.data.message || "Failed to send invoice")
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
      setLoadingInvoice(prev => ({ ...prev, [bookingId]: false }))
    }
  }

  // Filter bookings based on search query
  const filteredBookings = apiBookings.filter((booking) => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    const hotelName = booking.listingdetails.name.toLowerCase()
    const bookingNumber = booking.booking_number.toLowerCase()
    const address = formatAddress(booking).toLowerCase()
    const city = booking.listingdetails.city_name?.toLowerCase() || ""
    const state = booking.listingdetails.state_name?.toLowerCase() || ""
    
    return (
      hotelName.includes(query) ||
      bookingNumber.includes(query) ||
      address.includes(query) ||
      city.includes(query) ||
      state.includes(query)
    )
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayBookings = filteredBookings.slice(startIndex, endIndex)

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])



  const formatDateRange = (arrivalDate: string, departureDate: string) => {
    const arrival = new Date(arrivalDate)
    const departure = new Date(departureDate)

    const arrivalMonth = arrival.toLocaleDateString("en-US", { month: "short" })
    const departureMonth = departure.toLocaleDateString("en-US", { month: "short" })

    const arrivalDay = arrival.getDate()
    const departureDay = departure.getDate()

    // Same month
    if (arrivalMonth === departureMonth) {
      return `${arrivalMonth} ${arrivalDay}-${departureDay}`
    }

    // Different months
    return `${arrivalMonth} ${arrivalDay} - ${departureMonth} ${departureDay}`
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(parseFloat(price))
  }

  const formatAddress = (booking: ApiBooking) => {
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

  const getStarRating = (starCategory: string) => {
    const stars = parseInt(starCategory) || 0
    return stars > 0 ? stars : null
  }

  const getCoverImage = (images: Array<{ file: string; cover_photo: boolean }>) => {
    const coverImage = images.find(img => img.cover_photo)
    return coverImage?.file || images[0]?.file || "/placeholder.svg?height=64&width=80"
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Bookings</h2>
        <Button
          variant="outline"
          className="text-[#FF9530] border-[#FF9530] hover:bg-[#FF9530] hover:text-white w-full sm:w-auto"
          onClick={() => router.push("/my-bookings")}
        >
          View All
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by hotel name, booking number, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9530] focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-12 md:w-20 md:h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full hidden md:block"></div>
                    <div className="h-3 bg-gray-200 rounded w-full hidden md:block"></div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayBookings.length > 0 ? (
        <div className="space-y-4">
          {displayBookings?.map((booking) => (
            <Link href={`/my-bookings/${booking.id}`} > <div key={booking.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow my-4">
              {/* Mobile Layout */}
              <div className="block lg:hidden">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={getCoverImage(booking.listingdetails.images)}
                      alt={booking.listingdetails.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate pr-2">
                        {booking.listingdetails.name}
                      </h3>
                      {getStarRating(booking.listingdetails.star_category) && (
                        <div className="flex items-center text-yellow-500 flex-shrink-0">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs ml-1">{getStarRating(booking.listingdetails.star_category)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start text-xs text-gray-600 mb-1">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5" />
                      <span className="text-xs leading-tight overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word'
                      }}>{formatAddress(booking)}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      Booking #{booking.booking_number}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{formatDateRange(booking.arrival_date, booking.departure_date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{booking.no_of_adults + booking.no_of_child} guests, {booking.total_rooms} room{booking.total_rooms > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  {booking.no_of_days && (
                    <span className="font-medium">{booking.no_of_days} night{booking.no_of_days > 1 ? 's' : ''}</span>
                  )}
                  {booking.listingdetails.property_type && (
                    <span className={booking.no_of_days ? "ml-2" : ""}>
                      {booking.no_of_days ? "• " : ""}{booking.listingdetails.property_type}
                    </span>
                  )}
                  {booking.listingdetails.hotel_chain_name && (
                    <span className="block text-gray-500 mt-1">{booking.listingdetails.hotel_chain_name}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-sm">
                    {formatPrice(booking.total_price)}
                  </span>
                  <Button
                    onClick={() => handleGetInvoice(booking.id)}
                    disabled={loadingInvoice[booking.id]}
                    size="sm"
                    variant="outline"
                    className="rounded-full border-[#078ED8] text-[#078ED8] hover:bg-[#078ED8] hover:text-white text-sm h-8 w-full sm:w-auto"
                  >
                    {loadingInvoice[booking.id] ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-xs">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send
                     className="w-4 h-4" />
                  Send  Invoice
                      </>
                    )}
                  </Button>

                  
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={getCoverImage(booking.listingdetails.images)}
                    alt={booking.listingdetails.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {booking.listingdetails.name}
                        </h3>
                        {getStarRating(booking.listingdetails.star_category) && (
                          <div className="flex items-center text-yellow-500 flex-shrink-0">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm ml-1">{getStarRating(booking.listingdetails.star_category)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-start text-sm text-gray-600 mb-1">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-tight overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-word'
                        }}>{formatAddress(booking)}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Booking #{booking.booking_number}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <Button
                        onClick={() => handleGetInvoice(booking.id)}
                        disabled={loadingInvoice[booking.id]}
                        size="sm"
                        variant="outline"
                       className="rounded-full border-[#078ED8] text-[#078ED8] hover:bg-[#078ED8] hover:text-white text-sm h-8 "
                      >
                        {loadingInvoice[booking.id] ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span className="text-xs">Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            <span className="text-xs">Send Invoice</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                      <div className="truncate">
                        <span className="block text-xs">{formatDateRange(booking.arrival_date, booking.departure_date)}</span>
                        {booking.no_of_days && (
                          <span className="text-xs text-gray-500">{booking.no_of_days} night{booking.no_of_days > 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                      <div className="truncate">
                        <span className="block text-xs">{booking.no_of_adults + booking.no_of_child} guests</span>
                        <span className="text-xs text-gray-500">{booking.total_rooms} room{booking.total_rooms > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="truncate">
                      {booking.listingdetails.property_type && (
                        <span className="text-xs text-gray-600 block">{booking.listingdetails.property_type}</span>
                      )}
                      {booking.listingdetails.hotel_chain_name && (
                        <span className="text-xs text-gray-500">{booking.listingdetails.hotel_chain_name}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 block">
                        {formatPrice(booking.total_price)}
                      </span>
                      <span className="text-xs text-gray-500">Total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </Link>

           
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No bookings found" : "No bookings yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Start planning your next trip!"}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => router.push("/")}
              className="bg-[#FF9530] hover:bg-[#e8851c] text-white"
            >
              Browse Hotels
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredBookings.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} bookings
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-[#FF9530] hover:bg-[#e8851c] text-white" : ""}
                    >
                      {page}
                    </Button>
                  )
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2 text-gray-400">...</span>
                }
                return null
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentBookings